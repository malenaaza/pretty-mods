import { expect, test } from 'claude-code/testing'

import { nextNewYear, WEEK } from './midnight.js'

test('nothing is set until a week before the New Year', () => {
  expect(nextNewYear(new Date(2026, 10, 27))).toBeUndefined()
  expect(nextNewYear(new Date(2026, 11, 24, 23, 59))).toBeUndefined()
})

test('the midnight of 1 January is set within the last week of December', () => {
  const midnight = new Date(2027, 0, 1).getTime()

  expect(nextNewYear(new Date(2026, 11, 25))).toBe(midnight)
  expect(nextNewYear(new Date(2026, 11, 31, 23, 59, 30))).toBe(midnight)
})

test('a moment exactly a week ahead is still within reach', () => {
  expect(nextNewYear(new Date(2027, 0, 1 - 7))).toBe(new Date(2027, 0, 1).getTime())
  expect(WEEK).toBe(7 * 24 * 60 * 60 * 1000)
})

test('after the New Year nothing is set until the next week before it', () => {
  expect(nextNewYear(new Date(2027, 0, 2))).toBeUndefined()
})
