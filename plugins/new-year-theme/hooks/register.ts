import type { Register } from 'claude-code'

import { nextNewYear } from './midnight.js'

const HOUR = 60 * 60 * 1000

// Only a client that can show a notification gets one. In a terminal a notification with a moment set is raised at
// once, which would announce Happy New Year in December, so a terminal-only session gets none.
export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const isInApp = (await $.session.surfaces()).some(surface => surface !== 'terminal')

    const arm = async (): Promise<void> => {
      const at = nextNewYear(new Date())

      if (!isInApp || at === undefined) {
        return
      }

      try {
        // The same key replaces the one already held, so arming it again each hour does not add a second.
        await $.ui.notify('Happy New Year!', { title: 'New Year', key: 'new-year-midnight', at, untilBack: false })
      } catch {
        // A client that cannot take the notification: nothing to do.
      }
    }

    await arm()
    $.clock.every(HOUR, arm)

    return next(e)
  })
}
