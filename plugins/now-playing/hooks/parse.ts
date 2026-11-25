// The Music app's answer is "state||title||artist", or "off" when the app isn't running.
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
  const [state, title, ...rest] = stdout.trim().split('||')

  if (state !== 'playing' || title === undefined || title.trim() === '') {
    return undefined
  }

  const artist = rest.join('||').trim()

  return shorten(artist === '' ? `🎵 ${title.trim()}` : `🎵 ${title.trim()} - ${artist}`)
}
