// Windows: whatever is playing in the system's media controls (YouTube Music in a browser, Spotify...).
// Needs Windows PowerShell 5.1 (powershell.exe), which can reach the Windows media session.
export const WINDOWS_SCRIPT = [
  // Answer in UTF-8 without a byte-order mark, or accented letters in a title arrive broken.
  '[Console]::OutputEncoding = New-Object System.Text.UTF8Encoding $false',
  "$ErrorActionPreference = 'Stop'",
  'Add-Type -AssemblyName System.Runtime.WindowsRuntime',
  "$asTask = ([System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object { $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncOperation`1' })[0]",
  'function Await($op, $type) { $t = $asTask.MakeGenericMethod($type).Invoke($null, @($op)); $t.Wait(-1) | Out-Null; $t.Result }',
  '$m = [Windows.Media.Control.GlobalSystemMediaTransportControlsSessionManager, Windows.Media.Control, ContentType = WindowsRuntime]',
  '$mgr = Await ($m::RequestAsync()) $m',
  '$s = $mgr.GetCurrentSession()',
  "if ($null -eq $s) { Write-Output 'off'; exit 0 }",
  "$st = [string]$s.GetPlaybackInfo().PlaybackStatus",
  "if ($st -ne 'Playing') { Write-Output $st.ToLower(); exit 0 }",
  '$pt = [Windows.Media.Control.GlobalSystemMediaTransportControlsSessionMediaProperties, Windows.Media.Control, ContentType = WindowsRuntime]',
  '$p = Await ($s.TryGetMediaPropertiesAsync()) $pt',
  "Write-Output ('playing||' + $p.Title + '||' + $p.Artist)",
].join('\n')

// The Music app's answer is "state||title||artist", or "off" when the app isn't running. The Windows script answers the same way.
export const SCRIPT = [
  'if application "Music" is running then',
  'tell application "Music"',
  'set s to (player state as text)',
  'if s is "playing" then return s & "||" & (name of current track) & "||" & (artist of current track)',
  'return s',
  'end tell',
  'end if',
  'return "off"',
].join('\n')

const MAX = 60

const shorten = (text: string): string => (text.length > MAX ? `${text.slice(0, MAX - 1)}…` : text)

// The status line text for what the Music app said, or undefined for nothing to show.
export const parseNowPlaying = (stdout: string): string | undefined => {
  // A byte-order mark at the start would make the state read "\uFEFFplaying".
  const [state, title, ...rest] = stdout.replace(/^\uFEFF/, '').trim().split('||')

  if (state !== 'playing' || title === undefined || title.trim() === '') {
    return undefined
  }

  const artist = rest.join('||').trim()

  return shorten(artist === '' ? `🎵 ${title.trim()}` : `🎵 ${title.trim()} - ${artist}`)
}
