import { expect, test } from 'claude-code/testing'

import { nextNewYear, sceneAt, SCENE_PLAIN, WEEK } from './midnight.js'

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

test('the last ten minutes count down by minute, then the new year shows for an hour', () => {
  expect(sceneAt(new Date(2026, 11, 31, 23, 49, 59))).toBe(SCENE_PLAIN)
  expect(sceneAt(new Date(2026, 11, 31, 23, 50, 0))).toBe('new-year-count-10')
  expect(sceneAt(new Date(2026, 11, 31, 23, 55, 10))).toBe('new-year-count-5')
  expect(sceneAt(new Date(2026, 11, 31, 23, 59, 30))).toBe('new-year-count-1')
  expect(sceneAt(new Date(2027, 0, 1, 0, 0, 0))).toBe('new-year-midnight-2027')
  expect(sceneAt(new Date(2027, 0, 1, 0, 59))).toBe('new-year-midnight-2027')
  expect(sceneAt(new Date(2027, 0, 1, 1, 0))).toBe(SCENE_PLAIN)
  expect(sceneAt(new Date(2026, 11, 27))).toBe(SCENE_PLAIN)
})
