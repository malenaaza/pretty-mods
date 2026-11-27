// The notification for the New Year's midnight. A client can only be asked for a moment up to 7 days ahead, so this
// gives the moment of the coming 1 January, midnight local time, once it is within a week, and nothing before.
export const WEEK = 7 * 24 * 60 * 60 * 1000

export const nextNewYear = (now: Date): number | undefined => {
  const target = new Date(now.getFullYear() + 1, 0, 1).getTime()
  const ahead = target - now.getTime()

  return ahead > 0 && ahead <= WEEK ? target : undefined
}

export const SCENE_PLAIN = 'new-year'
export const SCENE_MIDNIGHT = 'new-year-midnight'

// The year is shown from 23:00 on 31 December to 01:00 on 1 January, local time, and the scene is plain otherwise.
export const sceneAt = (now: Date): string => {
  const year = now.getFullYear()
  const eve = new Date(year + 1, 0, 1, 0).getTime() - 60 * 60 * 1000
  const endOfNewYearsDay = new Date(year, 0, 1, 1).getTime()
  const t = now.getTime()

  return t >= eve || t < endOfNewYearsDay ? SCENE_MIDNIGHT : SCENE_PLAIN
}
