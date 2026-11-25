import type { Register } from 'claude-code'

import { parseNowPlaying, SCRIPT } from './parse.js'

const EVERY = 15 * 1000

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    let isStopped = false

    const check = async (): Promise<void> => {
      if (isStopped) {
        return
      }

      try {
        const ran = await $.process.run(['osascript', '-e', SCRIPT], { timeoutMs: 5000 })

        $.ui.status(ran.exitCode === 0 ? parseNowPlaying(ran.stdout) : undefined)
      } catch {
        // Not a Mac, or the command can't run here: show nothing and stop asking.
        isStopped = true
        $.ui.status(undefined)
      }
    }

    await check()
    $.clock.every(EVERY, check)

    return next(e)
  })
}
