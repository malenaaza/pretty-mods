export const SCENE_PLAIN = 'new-year'
export const SCENE_COUNTDOWN_PREFIX = 'new-year-count-'
export const SCENE_MIDNIGHT_PREFIX = 'new-year-midnight-'
export const COUNTDOWN_MINUTES = 10

const MINUTE = 60 * 1000

// The scene for a moment, from the last ten minutes of the year to the first hour of the new one:
//   new-year-count-<minutes left>   the countdown, 10 down to 1
//   new-year-midnight-<year>        the new year, from midnight to 01:00
//   new-year                        the plain scene otherwise
export const sceneAt = (now: Date): string => {
  const year = now.getFullYear()
  const midnight = new Date(year + 1, 0, 1, 0).getTime()
  const endOfNewYearsDay = new Date(year, 0, 1, 1).getTime()
  const t = now.getTime()

  if (t >= midnight - COUNTDOWN_MINUTES * MINUTE && t < midnight) {
    return `${SCENE_COUNTDOWN_PREFIX}${Math.ceil((midnight - t) / MINUTE)}`
  }
  if (t >= midnight || t < endOfNewYearsDay) {
    return `${SCENE_MIDNIGHT_PREFIX}${year}`
  }

  return SCENE_PLAIN
}
