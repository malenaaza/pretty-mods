import type { Register } from 'claude-code'

const DAY = 24 * 60 * 60 * 1000

// Whole days from today to the next 25 December, by the calendar and not by 24-hour blocks.
const daysToChristmas = (now: Date): number => {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  let christmas = new Date(now.getFullYear(), 11, 25)

  if (christmas.getTime() < today.getTime()) {
    christmas = new Date(now.getFullYear() + 1, 11, 25)
  }

  return Math.round((christmas.getTime() - today.getTime()) / DAY)
}

const line = (days: number): string => {
  if (days === 0) {
    return '🎄 Merry Christmas!'
  }

  return days === 1 ? '🎄 1 day to Christmas' : `🎄 ${days} days to Christmas`
}

export const register: Register = on => {
  on('session.start', ($, e, next) => {
    $.ui.status(line(daysToChristmas(new Date())))

    // Redraw the line once an hour, so a session left open past midnight stays right.
    $.clock.every(60 * 60 * 1000, () => {
      $.ui.status(line(daysToChristmas(new Date())))
    })

    return next(e)
  })
}
