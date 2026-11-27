export type Action = 'next' | 'previous' | 'playpause'

// The outcome of one attempt: 'ok' did it, 'off' means nothing was there to control,
// 'failed' means the system refused, 'unavailable' means no command could run here.
export type Result = 'ok' | 'off' | 'failed' | 'unavailable'

export type Ran = { exitCode: number; stdout: string }

export type Run = (argv: string[]) => Promise<Ran>

const MAC_LINE: Record<Action, string> = {
  next: 'next track',
  previous: 'previous track',
  playpause: 'playpause',
}

// Windows' media session method for each action; each returns whether the system took it.
const WINDOWS_CALL: Record<Action, string> = {
  next: 'TrySkipNextAsync',
  previous: 'TrySkipPreviousAsync',
  playpause: 'TryTogglePlayPauseAsync',
}

// The Music app: act only if it is running, so a control never starts it.
const macScript = (line: string): string =>
  [
    'if application "Music" is running then',
    `tell application "Music" to ${line}`,
    'return "ok"',
    'end if',
    'return "off"',
  ].join('\n')

// Windows PowerShell 5.1 reaches the system media session, the same one the now-playing mod reads.
const windowsPreamble = [
  '[Console]::OutputEncoding = New-Object System.Text.UTF8Encoding $false',
  "$ErrorActionPreference = 'Stop'",
  'Add-Type -AssemblyName System.Runtime.WindowsRuntime',
  "$asTask = ([System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object { $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncOperation`1' })[0]",
  'function Await($op, $type) { $t = $asTask.MakeGenericMethod($type).Invoke($null, @($op)); $t.Wait(-1) | Out-Null; $t.Result }',
  '$m = [Windows.Media.Control.GlobalSystemMediaTransportControlsSessionManager, Windows.Media.Control, ContentType = WindowsRuntime]',
  '$mgr = Await ($m::RequestAsync()) $m',
  '$s = $mgr.GetCurrentSession()',
]

const windowsScript = (call: string): string =>
  [
    ...windowsPreamble,
    "if ($null -eq $s) { Write-Output 'off'; exit 0 }",
    `$ok = Await ($s.${call}()) ([bool])`,
    "if ($ok) { Write-Output 'ok' } else { Write-Output 'failed' }",
  ].join('\n')

// Asks what is playing: 'playing||title||artist', or 'off'.
const MAC_PLAYING = [
  'if application "Music" is running then',
  'tell application "Music"',
  'if player state is playing then return "playing||" & (name of current track) & "||" & (artist of current track)',
  'end tell',
  'end if',
  'return "off"',
].join('\n')

const WINDOWS_PLAYING = [
  ...windowsPreamble,
  "if ($null -eq $s) { Write-Output 'off'; exit 0 }",
  '$st = [string]$s.GetPlaybackInfo().PlaybackStatus',
  "if ($st -ne 'Playing') { Write-Output 'off'; exit 0 }",
  '$pt = [Windows.Media.Control.GlobalSystemMediaTransportControlsSessionMediaProperties, Windows.Media.Control, ContentType = WindowsRuntime]',
  '$p = Await ($s.TryGetMediaPropertiesAsync()) $pt',
  "Write-Output ('playing||' + $p.Title + '||' + $p.Artist)",
].join('\n')

// Tries the Mac's Music app, then Windows' media controls. The first one that can run gives the answer.
const ask = async (plans: string[][], run: Run): Promise<string | undefined> => {
  for (const argv of plans) {
    let ran: Ran

    try {
      ran = await run(argv)
    } catch {
      // This command can't run here: try the next one.
      continue
    }

    return ran.exitCode === 0 ? ran.stdout.replace(/^\uFEFF/, '').trim() : 'failed'
  }

  return undefined
}

export const attempt = async (action: Action, run: Run): Promise<Result> => {
  const answer = await ask(
    [
      ['osascript', '-e', macScript(MAC_LINE[action])],
      ['powershell.exe', '-NoProfile', '-NonInteractive', '-Command', windowsScript(WINDOWS_CALL[action])],
    ],
    run,
  )

  if (answer === undefined) {
    return 'unavailable'
  }

  if (answer === 'ok' || answer === 'off') {
    return answer
  }

  return 'failed'
}

const MAX = 60

const shorten = (text: string): string => (text.length > MAX ? `${text.slice(0, MAX - 1)}…` : text)

// What is playing now, as "Title - Artist", or undefined when nothing is. Anything that can't be asked counts as nothing.
export const nowPlaying = async (run: Run): Promise<string | undefined> => {
  const answer = await ask(
    [
      ['osascript', '-e', MAC_PLAYING],
      ['powershell.exe', '-NoProfile', '-NonInteractive', '-Command', WINDOWS_PLAYING],
    ],
    run,
  )

  const [state, title, ...rest] = (answer ?? '').split('||')

  if (state !== 'playing' || title === undefined || title.trim() === '') {
    return undefined
  }

  const artist = rest.join('||').trim()

  return shorten(artist === '' ? title.trim() : `${title.trim()} - ${artist}`)
}

const DONE: Record<Action, string> = {
  next: 'Skipped to the next song.',
  previous: 'Went back to the previous song.',
  playpause: 'Played or paused the song.',
}

const MESSAGE: Record<Result, (action: Action) => string> = {
  ok: action => DONE[action],
  off: () => 'Nothing is playing to control.',
  failed: () => "Couldn't control the music.",
  unavailable: () => 'No music app here that can be controlled.',
}

// The line the command shows for an attempt's result.
export const describe = async (action: Action, run: Run): Promise<string> =>
  MESSAGE[await attempt(action, run)](action)
