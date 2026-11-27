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
const windowsScript = (call: string): string =>
  [
    '[Console]::OutputEncoding = New-Object System.Text.UTF8Encoding $false',
    "$ErrorActionPreference = 'Stop'",
    'Add-Type -AssemblyName System.Runtime.WindowsRuntime',
    "$asTask = ([System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object { $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncOperation`1' })[0]",
    'function Await($op, $type) { $t = $asTask.MakeGenericMethod($type).Invoke($null, @($op)); $t.Wait(-1) | Out-Null; $t.Result }',
    '$m = [Windows.Media.Control.GlobalSystemMediaTransportControlsSessionManager, Windows.Media.Control, ContentType = WindowsRuntime]',
    '$mgr = Await ($m::RequestAsync()) $m',
    '$s = $mgr.GetCurrentSession()',
    "if ($null -eq $s) { Write-Output 'off'; exit 0 }",
    `$ok = Await ($s.${call}()) ([bool])`,
    "if ($ok) { Write-Output 'ok' } else { Write-Output 'failed' }",
  ].join('\n')

// Tries the Mac's Music app, then Windows' media controls. The first one that can run gives the answer.
export const attempt = async (action: Action, run: Run): Promise<Result> => {
  const plans: string[][] = [
    ['osascript', '-e', macScript(MAC_LINE[action])],
    ['powershell.exe', '-NoProfile', '-NonInteractive', '-Command', windowsScript(WINDOWS_CALL[action])],
  ]

  for (const argv of plans) {
    let ran: Ran

    try {
      ran = await run(argv)
    } catch {
      // This command can't run here: try the next one.
      continue
    }

    if (ran.exitCode !== 0) {
      return 'failed'
    }

    const word = ran.stdout.replace(/^﻿/, '').trim()

    if (word === 'ok') {
      return 'ok'
    }

    return word === 'off' ? 'off' : 'failed'
  }

  return 'unavailable'
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
