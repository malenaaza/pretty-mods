import type { Register } from 'claude-code'

import { parseNowPlaying, SCRIPT, WINDOWS_SCRIPT } from './parse.js'

const EVERY = 15 * 1000

type Player = { argv: string[] }

// Tried in order, once: the Mac's Music app, then Windows' media controls.
const PLAYERS: Player[] = [
  { argv: ['osascript', '-e', SCRIPT] },
  { argv: ['powershell.exe', '-NoProfile', '-NonInteractive', '-Command', WINDOWS_SCRIPT] },
]

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    let player: Player | undefined
    let isStopped = false

    const check = async (): Promise<void> => {
      if (isStopped) {
        return
      }

      for (const candidate of player === undefined ? PLAYERS : [player]) {
        try {
          const ran = await $.process.run(candidate.argv, { timeoutMs: 8000 })

          player = candidate
          $.ui.status(ran.exitCode === 0 ? parseNowPlaying(ran.stdout) : undefined)

          return
        } catch {
          // This command can't run here: try the next one.
        }
      }

      // Neither could run: show nothing and stop asking.
      isStopped = true
      $.ui.status(undefined)
    }

    await check()
    $.clock.every(EVERY, check)

    return next(e)
  })
}
