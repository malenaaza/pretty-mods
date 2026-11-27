// The notification for the New Year's midnight. A client can only be asked for a moment up to 7 days ahead, so this
// gives the moment of the coming 1 January, midnight local time, once it is within a week, and nothing before.
export const WEEK = 7 * 24 * 60 * 60 * 1000

export const nextNewYear = (now: Date): number | undefined => {
  const target = new Date(now.getFullYear() + 1, 0, 1).getTime()
  const ahead = target - now.getTime()

  return ahead > 0 && ahead <= WEEK ? target : undefined
}
