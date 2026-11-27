import type { Register } from 'claude-code'

import { describe } from './controls.js'

const TIMEOUT_MS = 8000

// Each command is terminal-only: it works on this computer, which a desktop or phone client does not share.
const SPEC = { isTerminalOnly: true } as const

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({ name: 'next-song', description: 'Skip to the next song', ...SPEC })
    await $.command.register({ name: 'previous-song', description: 'Go back to the previous song', ...SPEC })
    await $.command.register({ name: 'play-pause', description: 'Play or pause the song', ...SPEC })

    return next(e)
  })

  on('command.run', { command: 'next-song' }, async $ => ({
    text: await describe('next', argv => $.process.run(argv, { timeoutMs: TIMEOUT_MS })),
  }))

  on('command.run', { command: 'previous-song' }, async $ => ({
    text: await describe('previous', argv => $.process.run(argv, { timeoutMs: TIMEOUT_MS })),
  }))

  on('command.run', { command: 'play-pause' }, async $ => ({
    text: await describe('playpause', argv => $.process.run(argv, { timeoutMs: TIMEOUT_MS })),
  }))
}
