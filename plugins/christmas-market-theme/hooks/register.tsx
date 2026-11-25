import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'

// A warm, dark brown night with cream text, a market red accent and gold. Dark only.
const { theme, problems } = makeColors({
  label: 'Christmas Market',
  roles: { accent: '#d65a3f', danger: '#c0392b', success: '#4a8a58', warning: '#b8860b', pro: '#8a6d2b' },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#1a110e',
        'surface-1': '#241914',
        'surface-2': '#2e211b',
        'surface-3': '#352620',
        'text-primary': '#f8ecd8',
        'text-secondary': '#d9ccb8',
        'text-muted': '#b9ae9f',
      },
    },
  },
  only: 'dark',
})

// Three stalls, with a standing table between each pair and a tree behind the middle one. The scene is drawn on a tall 400 x 800 picture. A wide window shows only its middle band (about y 290 to 510),
// so the market stands on a ground line at y 505 and rises into that band; a phone shows all of it.
const G = 505

type Item = 'mug' | 'sausage' | 'pretzel' | 'crepe'

let bulb = 0

const bulbAt = (x: number, y: number, colour: string): string => {
  bulb += 1

  return `<circle class="lt" cx="${x}" cy="${y}" r="1.8" fill="${colour}" style="animation-delay:${-((bulb * 5) % 9)}s"/>`
}

const BULBS = ['#f6c95a', '#e8564a', '#8fd0ff', '#f6c95a', '#7fcf8a']

// A wooden stall with a snowy pitched roof, a striped awning, goods on the counter and a string of lights.
const stall = (x: number, w: number, stripe: string): string => {
  const top = G - 92
  const stripes = Array.from({ length: Math.round(w / 10) }, (_, i) => {
    const sw = w / Math.round(w / 10)

    return `<rect x="${x + i * sw}" y="${top}" width="${sw}" height="12" fill="${i % 2 === 0 ? stripe : '#efe3cd'}"/>`
  }).join('')
  const goods = Array.from({ length: Math.floor(w / 14) }, (_, i) => {
    const colour = ['#e8564a', '#f6c95a', '#5fae6e', '#e8564a', '#c9d6e8'][i % 5]

    return `<circle cx="${x + 9 + i * 14}" cy="${G - 38}" r="4" fill="${colour}"/>`
  }).join('')
  const lights = Array.from({ length: Math.floor(w / 14) }, (_, i) => bulbAt(x + 7 + i * 14, top + 17, BULBS[i % BULBS.length] ?? '#f6c95a')).join('')

  return [
    `<rect x="${x}" y="${top}" width="${w}" height="${G - 32 - top}" fill="#2d1b13"/>`,
    `<rect x="${x + 4}" y="${top + 14}" width="${w - 8}" height="${G - 32 - top - 14}" fill="#5a3418" opacity=".7"/>`,
    `<rect x="${x + 4}" y="${G - 62}" width="${w - 8}" height="3" fill="#3b2415"/>`,
    `<path d="M${x - 7} ${top} L${x + w / 2} ${top - 32} L${x + w + 7} ${top} Z" fill="#5b2d1f"/>`,
    `<path d="M${x - 7} ${top} L${x + w / 2} ${top - 32} L${x + w + 7} ${top} L${x + w + 7} ${top - 4} L${x + w / 2} ${top - 36} L${x - 7} ${top - 4} Z" fill="#e6edf7" opacity=".88"/>`,
    stripes,
    `<rect x="${x - 2}" y="${top}" width="5" height="${G - top}" fill="#3a2316"/>`,
    `<rect x="${x + w - 3}" y="${top}" width="5" height="${G - top}" fill="#3a2316"/>`,
    `<rect x="${x - 3}" y="${G - 32}" width="${w + 6}" height="32" fill="#583722"/>`,
    `<rect x="${x - 3}" y="${G - 34}" width="${w + 6}" height="4" fill="#7b5236"/>`,
    goods,
    lights,
  ].join('')
}

// A person in a winter coat, hat and scarf, standing and eating or drinking. The forearm lifts to the mouth
// and lowers again, slowly. `dir` is which side the arm is on.
const person = (x: number, dir: 1 | -1, coat: string, hat: string, scarf: string, skin: string, item: Item, seed: number): string => {
  // The arm is 13 long. At rest the hand is out at chest height; turned about 85 degrees about the shoulder it
  // reaches the mouth, with a mug tilted as in drinking.
  const sx = x + dir * 8
  const sy = G - 33
  const hx = sx + dir * 12
  const hy = sy - 5
  const held = {
    mug: `<rect x="${hx - 4}" y="${hy - 7}" width="8" height="9" rx="1.5" fill="#f1e6d0"/><rect x="${hx - 4}" y="${hy - 4}" width="8" height="2" fill="#c8453a"/><path d="M${hx + 4} ${hy - 5} q4 0 4 3 q0 3 -4 3" stroke="#f1e6d0" stroke-width="1.6" fill="none"/>`,
    sausage: `<rect x="${hx - 8}" y="${hy - 3}" width="16" height="6" rx="3" fill="#d9a066"/><rect x="${hx - 9}" y="${hy - 1.5}" width="18" height="3" rx="1.5" fill="#a8432b"/>`,
    pretzel: `<circle cx="${hx}" cy="${hy - 2}" r="5" fill="none" stroke="#b9742e" stroke-width="2.4"/><path d="M${hx - 3} ${hy - 4} L${hx + 3} ${hy + 1} M${hx + 3} ${hy - 4} L${hx - 3} ${hy + 1}" stroke="#b9742e" stroke-width="2"/>`,
    crepe: `<path d="M${hx - 6} ${hy - 9} L${hx + 6} ${hy - 9} L${hx} ${hy + 4} Z" fill="#f0d89c"/><path d="M${hx - 4} ${hy - 9} Q${hx} ${hy - 6} ${hx + 4} ${hy - 9}" stroke="#5a3418" stroke-width="2" fill="none"/>`,
  }[item]

  return [
    `<rect x="${x - 10}" y="${G - 40}" width="20" height="40" rx="7" fill="${coat}"/>`,
    `<rect x="${x - 10}" y="${G - 8}" width="20" height="8" fill="#241713"/>`,
    `<rect x="${x - 9}" y="${G - 44}" width="18" height="6" rx="3" fill="${scarf}"/>`,
    `<circle cx="${x}" cy="${G - 51}" r="7" fill="${skin}"/>`,
    `<path d="M${x - 7.5} ${G - 53} a7.5 7.5 0 0 1 15 0 Z" fill="${hat}"/>`,
    `<circle cx="${x}" cy="${G - 61}" r="2.6" fill="#f4ead6"/>`,
    `<g class="arm" style="transform-origin:${sx}px ${sy}px;--r:${-85 * dir}deg;animation-delay:${-((seed * 3) % 7)}s">`,
    `<path d="M${sx} ${sy} L${hx} ${hy}" stroke="${coat}" stroke-width="5" stroke-linecap="round"/>`,
    `<circle cx="${hx}" cy="${hy}" r="2.4" fill="${skin}"/>`,
    held,
    '</g>',
  ].join('')
}

// A standing table with a candle, a mug and rising steam.
const table = (x: number): string => {
  const flame = bulbAt(x, G - 52, '#ffd36b')

  return [
    `<rect x="${x - 2}" y="${G - 40}" width="4" height="40" fill="#4a2f1f"/>`,
    `<ellipse cx="${x}" cy="${G - 40}" rx="20" ry="4" fill="#7a5236"/>`,
    `<rect x="${x - 1.5}" y="${G - 49}" width="3" height="7" fill="#efe3cd"/>`,
    flame,
    `<rect x="${x + 9}" y="${G - 50}" width="7" height="8" rx="1.5" fill="#f1e6d0"/>`,
    `<rect x="${x + 9}" y="${G - 46}" width="7" height="2" fill="#c8453a"/>`,
    `<path d="M${x + 16} ${G - 48} q3.5 0 3.5 2.5 q0 2.5 -3.5 2.5" stroke="#f1e6d0" stroke-width="1.5" fill="none"/>`,
    `<circle class="st" cx="${x + 12}" cy="${G - 54}" r="2.6" style="animation-delay:-1s"/>`,
    `<circle class="st" cx="${x + 13}" cy="${G - 54}" r="2.2" style="animation-delay:-3.5s"/>`,
  ].join('')
}

// The far town: a row of narrow gabled houses with dim windows.
const TOWN = [
  [-4, 36, 108],
  [34, 30, 84],
  [66, 38, 124],
  [112, 30, 96],
  [282, 34, 90],
  [318, 40, 118],
  [362, 42, 94],
]
  .map(([x, w, h], i) => {
    const px = x ?? 0
    const pw = w ?? 30
    const ph = h ?? 90
    const top = G - ph

    return [
      `<rect x="${px}" y="${top}" width="${pw}" height="${ph}" fill="#3b2331"/>`,
      `<path d="M${px - 2} ${top} L${px + pw / 2} ${top - 20} L${px + pw + 2} ${top} Z" fill="#4c2f3d"/>`,
      `<rect class="w" x="${px + pw / 2 - 3}" y="${top + 16}" width="6" height="8" fill="#f2bf55" opacity=".9" style="animation-delay:${-((i * 4) % 9)}s"/>`,
    ].join('')
  })
  .join('')

// A tall tree behind the middle stall, so its top and star show above the stall's roof.
const TREE_X = 200
const TREE = (() => {
  const tier = (base: number, width: number, height: number): string =>
    `<path d="M${TREE_X - width / 2} ${G - base} L${TREE_X} ${G - base - height} L${TREE_X + width / 2} ${G - base} Z" fill="#0f2c1d"/>`
  const lights = [
    [-0.16, 0.5],
    [0.14, 0.6],
    [-0.1, 0.7],
    [0.1, 0.8],
    [-0.04, 0.9],
    [0.05, 0.97],
  ]
    .map(([dx, dy], i) => bulbAt(TREE_X + (dx ?? 0) * 190, G - (dy ?? 0) * 190, BULBS[i % BULBS.length] ?? '#f6c95a'))
    .join('')

  return [
    tier(60, 100, 74),
    tier(100, 82, 68),
    tier(138, 62, 62),
    `<path d="M${TREE_X - 6} ${G - 184} L${TREE_X} ${G - 204} L${TREE_X + 6} ${G - 184} Z" fill="#e6edf7" opacity=".88"/>`,
    `<circle cx="${TREE_X}" cy="${G - 208}" r="3.4" fill="#ffd36b"/>`,
    lights,
  ].join('')
})()

// A string of lights between the roofs of two neighbouring stalls.
const garland = (x0: number, x1: number): string => {
  const y = G - 110
  const dip = 16
  const point = (t: number): [number, number] => [
    (1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * ((x0 + x1) / 2) + t * t * x1,
    (1 - t) * (1 - t) * y + 2 * (1 - t) * t * (y + dip * 2) + t * t * y,
  ]
  const bulbs = [0.2, 0.4, 0.6, 0.8]
    .map((t, i) => {
      const [bx, by] = point(t)

      return bulbAt(bx, by, BULBS[i % BULBS.length] ?? '#f6c95a')
    })
    .join('')

  return `<path d="M${x0} ${y} Q${(x0 + x1) / 2} ${y + dip * 2} ${x1} ${y}" stroke="#3a2a22" stroke-width="1" fill="none"/>${bulbs}`
}

const FLAKES = Array.from({ length: 40 }, (_, i) => {
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
  '<stop offset="0" stop-color="#0e0809"/><stop offset="0.6" stop-color="#2b1720"/><stop offset="1" stop-color="#1a110e"/>',
  '</linearGradient></defs>',
  '<style>',
  '.f{fill:#fffaf0;opacity:.85;animation-name:fall;animation-timing-function:linear;animation-iteration-count:infinite}',
  '@keyframes fall{from{transform:translate(0,0)}to{transform:translate(var(--d),830px)}}',
  '.lt,.w{animation:glow 6s ease-in-out infinite}',
  '@keyframes glow{0%,100%{opacity:.6}50%{opacity:1}}',
  '.st{fill:#e4d7c4;opacity:0;animation:rise 6s ease-out infinite}',
  '@keyframes rise{0%{opacity:0;transform:translate(0,0)}25%{opacity:.4}100%{opacity:0;transform:translate(3px,-16px)}}',
  '.arm{animation:eat 7s ease-in-out infinite}',
  '@keyframes eat{0%,100%{transform:rotate(0deg)}40%,55%{transform:rotate(var(--r))}}',
  // Asked to reduce motion, the snow rests at set heights and the lights, steam and arms stay still.
  '@media (prefers-reduced-motion:reduce){.f{animation:none;transform:translate(0,var(--y))}.lt,.w,.arm{animation:none}.st{animation:none;opacity:.25}}',
  '</style>',
  '<rect width="400" height="800" fill="url(#sky)"/>',
  TOWN,
  TREE,
  stall(10, 92, '#c23a3a'),
  stall(154, 92, '#c8902f'),
  stall(298, 92, '#2f7d4f'),
  garland(104, 152),
  garland(248, 296),
  table(128),
  table(272),
  person(34, 1, '#b3263b', '#2f6f4e', '#e8c76a', '#e8c4a0', 'mug', 1),
  person(62, -1, '#2f5d8c', '#c23a3a', '#efe3cd', '#8d5a3b', 'sausage', 2),
  person(182, 1, '#c68a2e', '#3a3a4a', '#c23a3a', '#c68e65', 'pretzel', 3),
  person(216, -1, '#4a7a52', '#efe3cd', '#b3263b', '#e8c4a0', 'mug', 4),
  person(326, 1, '#7a3b6a', '#e8c76a', '#2f6f4e', '#c68e65', 'crepe', 5),
  person(356, -1, '#3a5a8a', '#b3263b', '#e8c76a', '#8d5a3b', 'mug', 6),
  `<rect x="0" y="${G}" width="400" height="295" fill="#241a1c"/>`,
  `<rect x="0" y="${G}" width="400" height="6" fill="#e6edf7" opacity=".5"/>`,
  FLAKES,
  '</svg>',
].join('')

const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'christmas-market', glass: { blur: 0, tint: '#1a110e', opacity: 0.35 } },
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

    return <Svg source={SCENE} alt="A night Christmas market with wooden stalls, string lights, steaming mugs and people eating and drinking, with snow falling" isInteractive />
  })
}
