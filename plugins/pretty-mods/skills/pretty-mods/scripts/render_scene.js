#!/usr/bin/env node
// Render a theme's moving scene to PNG files, so it can be looked at before it is shown to the user.
//
// Usage: node render_scene.js <hooks/register.tsx> <output folder>
//
// The module must hold its scene in a constant called SCENE (an SVG string). The script reads it with bun,
// then screenshots it in Chromium at a wide frame (1280x720) and a phone frame (390x844), at 0, 20 and 45
// seconds into the animation. It shows the scene only: the app's own glass tint, blur and panels are not
// drawn, so this checks cropping, position, size, colour and where things are when a session opens.
// Needs `bun` and Playwright's Chromium (both are in a cloud session).
const { spawnSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const [file, out] = process.argv.slice(2)

if (file === undefined || out === undefined) {
  console.error('Usage: node render_scene.js <hooks/register.tsx> <output folder>')
  process.exit(2)
}

const source = path.resolve(file)
const text = fs.readFileSync(source, 'utf8')

if (!/\bconst SCENE\b/.test(text)) {
  console.error('Refused: the module has no `const SCENE` to render. Keep the scene in a constant called SCENE.')
  process.exit(1)
}

// A temporary copy beside the original, so its relative imports still resolve. It is always removed.
const temp = path.join(path.dirname(source), `.render-${process.pid}.tsx`)
fs.writeFileSync(temp, `${text}\nexport const _SCENE = SCENE\n`)

let svg
try {
  const ran = spawnSync('bun', ['-e', `import { _SCENE } from ${JSON.stringify(temp)}; process.stdout.write(_SCENE)`], {
    encoding: 'utf8',
    maxBuffer: 16 * 1024 * 1024,
  })

  if (ran.status !== 0) {
    console.error(`Refused: could not read the scene (${(ran.stderr || ran.error || '').toString().trim()}).`)
    process.exit(1)
  }
  svg = ran.stdout
} finally {
  fs.rmSync(temp, { force: true })
}

fs.mkdirSync(out, { recursive: true })

const { chromium } = require('playwright')

;(async () => {
  const browser = await chromium.launch()
  const body = svg.replace('<svg ', '<svg width="100%" height="100%" ')

  for (const [name, width, height] of [['wide', 1280, 720], ['phone', 390, 844]]) {
    for (const seconds of [0, 20, 45]) {
      const page = await browser.newPage({ viewport: { width, height } })

      await page.setContent(`<body style="margin:0;background:#000">${body}</body>`)
      await page.evaluate(ms => {
        document.getAnimations().forEach(a => {
          a.pause()
          a.currentTime = ms
        })
      }, seconds * 1000)
      await page.screenshot({ path: path.join(out, `${name}-${seconds}s.png`) })
      await page.close()
    }
  }
  await browser.close()
  console.log(`Wrote ${out}/wide-{0,20,45}s.png and phone-{0,20,45}s.png (${svg.length} characters of SVG)`)
})()
