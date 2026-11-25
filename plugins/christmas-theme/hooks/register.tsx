import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'

// Pine green and warm cream, with cranberry as the accent and gold for warnings.
const { theme, problems } = makeColors({
  label: 'Christmas',
  roles: { accent: '#b3263b', danger: '#c0392b', success: '#2f7d4f', warning: '#b8860b', pro: '#8a6d2b' },
  light: {
    gray: {
      anchors: {
        'surface-0': '#f3ecdc',
        'surface-1': '#f8f2e4',
        'surface-2': '#fcf8ee',
        'text-primary': '#1d2a20',
        'text-secondary': '#3e4d41',
        'text-muted': '#56655a',
      },
    },
  },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#0f1f17',
        'surface-1': '#16281d',
        'surface-2': '#1d3324',
        'surface-3': '#243c2c',
        'text-primary': '#f4ecd8',
        'text-secondary': '#d3cbb5',
        'text-muted': '#b3ac98',
      },
    },
  },
})

// A night sky with snow. The flakes are built once, so the scene is plain vector.
const FLAKES = Array.from({ length: 48 }, (_, i) => {
  const x = (i * 83 + 17) % 400
  const r = 1.2 + ((i * 7) % 5) * 0.55
  const duration = 14 + ((i * 5) % 11)
  const delay = -((i * 3) % 17)
  const drift = ((i * 11) % 30) - 15
  const rest = (i * 131 + 40) % 800

  return `<circle class="f" cx="${x}" cy="-10" r="${r}" style="--d:${drift}px;--y:${rest}px;animation-duration:${duration}s;animation-delay:${delay}s"/>`
}).join('')

// Santa, his sleigh and one reindeer, drawn small around (0, 0). They rest at the spot given by the outer
// transform, and the slow flight across the sky only moves them sideways. The sky band a wide window shows
// is about y 290 to 510, so they fly through the middle of it. The animation starts partway across (the
// negative delay), so they are on screen when a session opens.
const SANTA = [
  '<path d="M-38 -8 L-12 -4" stroke="#d9b45a" stroke-width="1" fill="none"/>',
  '<ellipse cx="-50" cy="-8" rx="14" ry="7" fill="#7a5230"/>',
  '<circle cx="-66" cy="-18" r="5" fill="#7a5230"/>',
  '<circle cx="-71" cy="-17" r="1.8" fill="#e03a3a"/>',
  '<path d="M-67 -23 L-70 -33 M-67 -23 L-62 -32" stroke="#7a5230" stroke-width="1.4" fill="none"/>',
  '<path d="M-58 -2 L-60 8 M-44 -2 L-42 8" stroke="#7a5230" stroke-width="1.6" fill="none"/>',
  '<path d="M-14 -2 C-12 8 6 10 24 6 L26 -8 L-6 -8 Z" fill="#b3263b"/>',
  '<path d="M-18 12 C0 16 26 14 32 4" stroke="#d9b45a" stroke-width="2" fill="none"/>',
  '<circle cx="22" cy="-12" r="7" fill="#8a6d2b"/>',
  '<circle cx="8" cy="-14" r="7" fill="#b3263b"/>',
  '<circle cx="8" cy="-24" r="4.5" fill="#f4dcc4"/>',
  '<path d="M3 -26 L8 -37 L13 -26 Z" fill="#b3263b"/>',
  '<circle cx="8" cy="-38" r="1.8" fill="#fffaf0"/>',
  '<path d="M4 -23 Q8 -14 12 -23 Z" fill="#fffaf0"/>',
].join('')

const SCENE = [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice">',
  '<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">',
  '<stop offset="0" stop-color="#0a1812"/><stop offset="1" stop-color="#173626"/>',
  '</linearGradient></defs>',
  '<style>',
  '.f{fill:#fffaf0;opacity:.85;animation-name:fall;animation-timing-function:linear;animation-iteration-count:infinite}',
  '@keyframes fall{from{transform:translate(0,0)}to{transform:translate(var(--d),830px)}}',
  '.sl{animation:fly 70s linear -34s infinite}',
  // Asked to reduce motion, the flakes rest at set heights and Santa rests where he is drawn.
  '@media (prefers-reduced-motion:reduce){.f{animation:none;transform:translate(0,var(--y))}.sl{animation:none}}',
  '@keyframes fly{from{transform:translate(-250px,0)}to{transform:translate(215px,0)}}',
  '</style>',
  '<rect width="400" height="800" fill="url(#sky)"/>',
  FLAKES,
  `<g transform="translate(200 400) scale(1.5)" opacity=".85"><g class="sl">${SANTA}</g></g>`,
  '</svg>',
].join('')

const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'snowfall', glass: { blur: 2, tint: '#0f1f17', opacity: 0.45 } },
  overrideColorScheme: 'dark',
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    // While you build: the line that would stop Desktop painting this look.
    const unpainted = problems.find(line => line.startsWith("Desktop won't paint"))

    if (unpainted !== undefined) {
      $.ui.toast(unpainted)
    }
    const set = await $.theme.set(LOOK)

    if (!set.isDrawn) {
      $.ui.status(set.reason)
    }

    return next(e)
  })

  on('ui.render', { component: 'Backdrop' }, ($, e, next) => {
    if (e.surface !== 'desktop' && e.surface !== 'mobile') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="Snow falling slowly on a winter night" isInteractive />
  })
}
