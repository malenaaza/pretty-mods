import { expect, test } from 'claude-code/testing'

import { attempt, describe, isPlaying, type Ran, type Run } from './controls.js'

// A fake command runner: records each argv and answers with the given result or error.
const fake = (answer: Ran | Error) => {
  const calls: string[][] = []
  const run: Run = async argv => {
    calls.push(argv)

    if (answer instanceof Error) {
      throw answer
    }

    return answer
  }

  return { calls, run }
}

test('the Mac command runs first and its answer is used', async () => {
  const { calls, run } = fake({ exitCode: 0, stdout: 'ok\n' })

  expect(await attempt('next', run)).toBe('ok')
  expect(calls).toHaveLength(1)
  expect(calls[0]?.[0]).toBe('osascript')
  expect(calls[0]?.[2]).toContain('tell application "Music" to next track')
})

test('each action names its own Music command', async () => {
  const { calls, run } = fake({ exitCode: 0, stdout: 'ok' })

  await attempt('previous', run)
  await attempt('playpause', run)

  expect(calls[0]?.[2]).toContain('to previous track')
  expect(calls[1]?.[2]).toContain('to playpause')
})

test('Windows is tried when the Mac command cannot run', async () => {
  const calls: string[][] = []
  const run: Run = async argv => {
    calls.push(argv)

    if (argv[0] === 'osascript') {
      throw new Error('spawn osascript ENOENT')
    }

    return { exitCode: 0, stdout: 'ok\r\n' }
  }

  expect(await attempt('next', run)).toBe('ok')
  expect(calls.map(argv => argv[0])).toEqual(['osascript', 'powershell.exe'])
  expect(calls[1]?.at(-1)).toContain('TrySkipNextAsync')
})

test('each action calls its own Windows media method', async () => {
  // Mac is unavailable in every case, so the Windows script is the one that runs.
  const windowsScriptFor = async (action: 'next' | 'previous' | 'playpause') => {
    const calls: string[][] = []
    const run: Run = async argv => {
      calls.push(argv)

      if (argv[0] === 'osascript') {
        throw new Error('no osascript')
      }

      return { exitCode: 0, stdout: 'ok' }
    }

    await attempt(action, run)

    return calls[1]?.at(-1) ?? ''
  }

  expect(await windowsScriptFor('next')).toContain('TrySkipNextAsync')
  expect(await windowsScriptFor('previous')).toContain('TrySkipPreviousAsync')
  expect(await windowsScriptFor('playpause')).toContain('TryTogglePlayPauseAsync')
})

test('nothing is controlled when the app is off, and Windows is not asked', async () => {
  const { calls, run } = fake({ exitCode: 0, stdout: 'off\n' })

  expect(await attempt('next', run)).toBe('off')
  expect(calls).toHaveLength(1)
})

test('a non-zero exit is a failure, with no retry on the other command', async () => {
  const { calls, run } = fake({ exitCode: 1, stdout: '' })

  expect(await attempt('next', run)).toBe('failed')
  expect(calls).toHaveLength(1)
})

test('a leading byte-order mark is ignored', async () => {
  const { run } = fake({ exitCode: 0, stdout: '﻿ok\r\n' })

  expect(await attempt('next', run)).toBe('ok')
})

test('unavailable when no command can run here', async () => {
  const { calls, run } = fake(new Error('not found'))

  expect(await attempt('next', run)).toBe('unavailable')
  expect(calls).toHaveLength(2)
})

test('the line the command shows says what happened', async () => {
  const ok = fake({ exitCode: 0, stdout: 'ok' })
  const off = fake({ exitCode: 0, stdout: 'off' })
  const none = fake(new Error('not found'))

  expect(await describe('next', ok.run)).toBe('Skipped to the next song.')
  expect(await describe('next', off.run)).toBe('Nothing is playing to control.')
  expect(await describe('next', none.run)).toBe('No music app here that can be controlled.')
})

test('isPlaying is true only when the answer says playing', async () => {
  const playing: Run = async () => ({ exitCode: 0, stdout: 'playing\n' })
  const paused: Run = async () => ({ exitCode: 0, stdout: 'off\n' })
  const none: Run = async () => {
    throw new Error('not found')
  }

  expect(await isPlaying(playing)).toBe(true)
  expect(await isPlaying(paused)).toBe(false)
  expect(await isPlaying(none)).toBe(false)
})
