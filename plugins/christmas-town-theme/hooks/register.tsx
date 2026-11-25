import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'

// A midnight blue night with warm cream text, cranberry accents and gold. Dark only.
const { theme, problems } = makeColors({
  label: 'Christmas Town',
  roles: { accent: '#c23a52', danger: '#c0392b', success: '#3f8a5c', warning: '#b8860b', pro: '#8a6d2b' },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#0d1424',
        'surface-1': '#141d33',
        'surface-2': '#1b2641',
        'surface-3': '#212d4a',
        'text-primary': '#f6ecd9',
        'text-secondary': '#d6cdbb',
        'text-muted': '#b6b0a6',
      },
    },
  },
  only: 'dark',
})

// The scene is drawn on a tall 400 x 800 picture. A wide window shows only its middle band (about y 290 to 510),
// so the town stands on a ground line at y 505 and rises into that band; a phone shows all of it.
const GROUND = 505

type House = { x: number; w: number; h: number; roof: number; windows: number[] }

const HOUSES: House[] = [
  { x: 6, w: 54, h: 52, roof: 26, windows: [0.3, 0.7] },
  { x: 66, w: 46, h: 66, roof: 24, windows: [0.5] },
  { x: 118, w: 60, h: 46, roof: 28, windows: [0.25, 0.75] },
  { x: 232, w: 50, h: 58, roof: 26, windows: [0.5] },
  { x: 288, w: 56, h: 48, roof: 24, windows: [0.3, 0.7] },
  { x: 346, w: 50, h: 60, roof: 26, windows: [0.5] },
]

let windowIndex = 0

const windowsOf = (x: number, w: number, top: number, h: number, offsets: number[]): string =>
  offsets
    .map(offset => {
      const index = (windowIndex += 1)
      const delay = -((index * 7) % 11)

      return `<rect class="w" x="${x + w * offset - 4}" y="${top + h * 0.35}" width="8" height="10" rx="1" style="animation-delay:${delay}s"/>`
    })
    .join('')

const G_TOP = (item: House): number => GROUND - item.h

const house = (item: House, index: number): string => {
  const top = G_TOP(item)
  const mid = item.x + item.w / 2
  // The chimney stands on the right slope of the roof: its base is hidden behind the roof, its top shows above it.
  const cx = item.x + item.w * 0.76
  const slope = top - item.roof * (1 - Math.abs(cx - mid) / (item.w / 2 + 4))
  const chimneyTop = slope - 16

  return [
    `<rect x="${cx - 5}" y="${chimneyTop}" width="10" height="26" fill="#6b3d36"/>`,
    `<rect x="${cx - 6.5}" y="${chimneyTop - 3}" width="13" height="4" fill="#e6edf7" opacity=".92"/>`,
    `<rect x="${item.x}" y="${top}" width="${item.w}" height="${item.h}" fill="#101a31"/>`,
    `<path d="M${item.x - 4} ${top} L${mid} ${top - item.roof} L${item.x + item.w + 4} ${top} Z" fill="#1a2744"/>`,
    // The snow on the roof.
    `<path d="M${item.x - 4} ${top} L${mid} ${top - item.roof} L${item.x + item.w + 4} ${top} L${item.x + item.w + 4} ${top - 3} L${mid} ${top - item.roof - 3} L${item.x - 4} ${top - 3} Z" fill="#dfe8f4" opacity=".85"/>`,
    `<circle class="sm" cx="${cx}" cy="${chimneyTop - 8}" r="5" style="animation-delay:${-((index * 3) % 8)}s"/>`,
    `<circle class="sm" cx="${cx + 1}" cy="${chimneyTop - 8}" r="4" style="animation-delay:${-((index * 3 + 4) % 8)}s"/>`,
    windowsOf(item.x, item.w, top, item.h, item.windows),
  ].join('')
}

// The church, with a steeple, at the middle-left.
const CHURCH = [
  `<rect x="184" y="${GROUND - 60}" width="42" height="60" fill="#101a31"/>`,
  `<path d="M180 ${GROUND - 60} L205 ${GROUND - 92} L230 ${GROUND - 60} Z" fill="#1a2744"/>`,
  `<rect x="199" y="${GROUND - 112}" width="12" height="26" fill="#101a31"/>`,
  `<path d="M196 ${GROUND - 112} L205 ${GROUND - 134} L214 ${GROUND - 112} Z" fill="#1a2744"/>`,
  `<rect x="204" y="${GROUND - 140}" width="2" height="8" fill="#e8c76a"/>`,
  `<rect x="200" y="${GROUND - 137}" width="10" height="2" fill="#e8c76a"/>`,
  `<rect class="w" x="200" y="${GROUND - 46}" width="10" height="16" rx="5" style="animation-delay:-3s"/>`,
].join('')

// A pine with snow on its branches and a few lights.
const tree = (x: number, size: number, seed: number): string => {
  const tier = (offset: number, width: number, height: number): string =>
    `<path d="M${x - width / 2} ${GROUND - offset} L${x} ${GROUND - offset - height} L${x + width / 2} ${GROUND - offset} Z" fill="#123222"/>`
  const lights = [
    [-0.18, 0.3],
    [0.2, 0.46],
    [-0.1, 0.62],
    [0.12, 0.78],
  ]
    .map(([dx, dy], i) => {
      const colour = ['#f4c95d', '#e0475b', '#7fc4ff', '#f4c95d'][(i + seed) % 4]

      return `<circle class="l" cx="${x + (dx ?? 0) * size}" cy="${GROUND - (dy ?? 0) * size}" r="1.7" fill="${colour}" style="animation-delay:${-((i + seed) * 2)}s"/>`
    })
    .join('')

  return [
    `<rect x="${x - 2}" y="${GROUND - 6}" width="4" height="6" fill="#2a1d14"/>`,
    tier(4, size * 0.62, size * 0.42),
    tier(size * 0.28, size * 0.5, size * 0.4),
    tier(size * 0.52, size * 0.36, size * 0.38),
    `<path d="M${x - size * 0.09} ${GROUND - size * 0.84} L${x} ${GROUND - size} L${x + size * 0.09} ${GROUND - size * 0.84} Z" fill="#dfe8f4" opacity=".85"/>`,
    lights,
  ].join('')
}

// Flakes: built once, so the scene stays plain vector. `rest` is where each rests when motion is reduced.
const FLAKES = Array.from({ length: 44 }, (_, i) => {
  const x = (i * 83 + 17) % 400
  const r = 1.2 + ((i * 7) % 5) * 0.55
  const duration = 15 + ((i * 5) % 11)
  const delay = -((i * 3) % 17)
  const drift = ((i * 11) % 30) - 15
  const rest = (i * 131 + 40) % 800

  return `<circle class="f" cx="${x}" cy="-10" r="${r}" style="--d:${drift}px;--y:${rest}px;animation-duration:${duration}s;animation-delay:${delay}s"/>`
}).join('')

const SCENE = [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice">',
  '<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">',
  '<stop offset="0" stop-color="#080d1b"/><stop offset="0.6" stop-color="#16233f"/><stop offset="1" stop-color="#0d1424"/>',
  '</linearGradient></defs>',
  '<style>',
  '.f{fill:#fffaf0;opacity:.85;animation-name:fall;animation-timing-function:linear;animation-iteration-count:infinite}',
  '@keyframes fall{from{transform:translate(0,0)}to{transform:translate(var(--d),830px)}}',
  '.w{fill:#f4c35a;animation:glow 9s ease-in-out infinite}',
  '@keyframes glow{0%,100%{opacity:.7}50%{opacity:1}}',
  '.l{animation:glow 6s ease-in-out infinite}',
  '.sm{fill:#d6deec;opacity:0;animation:rise 9s ease-out infinite}',
  '@keyframes rise{0%{opacity:0;transform:translate(0,0)}20%{opacity:.6}100%{opacity:0;transform:translate(12px,-42px)}}',
  // Asked to reduce motion, the snow rests at set heights and the windows, lights and smoke stay still.
  '@media (prefers-reduced-motion:reduce){.f{animation:none;transform:translate(0,var(--y))}.w,.l{animation:none}.sm{animation:none;opacity:.3}}',
  '</style>',
  '<rect width="400" height="800" fill="url(#sky)"/>',
  '<circle cx="330" cy="318" r="17" fill="#f3e6c8" opacity=".9"/>',
  `<path d="M0 ${GROUND - 30} Q90 ${GROUND - 62} 180 ${GROUND - 34} T400 ${GROUND - 40} L400 ${GROUND} L0 ${GROUND} Z" fill="#15213b"/>`,
  tree(40, 78, 0),
  HOUSES.map(house).join(''),
  CHURCH,
  tree(150, 66, 1),
  tree(262, 84, 2),
  tree(376, 70, 3),
  `<rect x="0" y="${GROUND}" width="400" height="295" fill="#1a2742"/>`,
  `<rect x="0" y="${GROUND}" width="400" height="6" fill="#dfe8f4" opacity=".55"/>`,
  FLAKES,
  '</svg>',
].join('')

const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'christmas-town', glass: { blur: 0, tint: '#0d1424', opacity: 0.35 } },
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

    return <Svg source={SCENE} alt="A snowy Christmas town at night, with lit windows, a church, trees with lights and snow falling" isInteractive />
  })
}
