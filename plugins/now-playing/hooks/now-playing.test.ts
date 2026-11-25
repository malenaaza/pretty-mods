import { expect, test } from 'claude-code/testing'

import { parseNowPlaying } from './parse.js'

test('a playing track shows title and artist', () => {
  expect(parseNowPlaying('playing||Song||Band\n')).toBe('🎵 Song - Band')
})

test('nothing shows when paused, stopped or the app is off', () => {
  expect(parseNowPlaying('paused')).toBeUndefined()
  expect(parseNowPlaying('stopped')).toBeUndefined()
  expect(parseNowPlaying('off')).toBeUndefined()
  expect(parseNowPlaying('')).toBeUndefined()
})

test('a missing artist and "||" inside a name are kept', () => {
  expect(parseNowPlaying('playing||Solo||')).toBe('🎵 Solo')
  expect(parseNowPlaying('playing||A||B||C')).toBe('🎵 A - B||C')
})

test('a long line is cut', () => {
  const out = parseNowPlaying(`playing||${'x'.repeat(100)}||Band`)

  expect(out?.length).toBe(60)
  expect(out?.endsWith('…')).toBe(true)
})

test('a failing command shows nothing and stops asking', async ($, on) => {
  const lines: Array<string | undefined> = []
  let runs = 0

  on('session.start', (_, e) => ({ cwd: e.cwd }))
  on('clock.every', () => ({ value: undefined }))
  on('process.run', () => {
    runs += 1

    return { deny: 'no osascript here' }
  })
  on('ui.status', (_, e) => {
    lines.push(e.text)

    return { value: undefined }
  })

  await $.session.start({ cwd: '/', surface: 'terminal', isInteractive: true })

  expect(runs).toBe(1)
  expect(lines.at(-1)).toBeUndefined()
})
