import { expect, test } from 'claude-code/testing'

test('the status line counts down to Christmas', async ($, on) => {
  const lines: Array<string | undefined> = []

  on('session.start', (_, e) => ({ cwd: e.cwd }))
  on('clock.every', () => ({ value: undefined }))
  on('ui.status', (_, e) => {
    lines.push(e.text)

    return { value: undefined }
  })

  await $.session.start({ cwd: '/', surface: 'desktop', isInteractive: true })

  expect(lines.length).toBeGreaterThan(0)
  expect(lines[0]).toMatch(/^🎄 (Merry Christmas!|\d+ days? to Christmas)$/)
})
