import type { Register } from 'claude-code'

// The cat's mood by the hour of the day.
export const mood = (hour: number): string => {
  if (hour < 6) {
    return '😴 kitty is asleep'
  }
  if (hour < 10) {
    return '😺 kitty wants breakfast'
  }
  if (hour < 17) {
    return '😸 kitty is purring'
  }
  if (hour < 21) {
    return '🐱 kitty is playing'
  }

  return '😽 kitty is sleepy'
}

export const register: Register = on => {
  on('session.start', ($, e, next) => {
    $.ui.status(mood(new Date().getHours()))

    // Hourly, so a session left open follows the day.
    $.clock.every(60 * 60 * 1000, () => {
      $.ui.status(mood(new Date().getHours()))
    })

    return next(e)
  })
}
