import { expect, test } from 'claude-code/testing'

import { sceneAt, SCENE_PLAIN } from './midnight.js'

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
