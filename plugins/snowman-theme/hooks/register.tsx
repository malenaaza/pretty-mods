import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'

// Icy blue-greys with a carrot-orange accent. Both modes are given and none is forced, so the look follows the mode
// the person has chosen: a bright snowy day in light mode, a snowy night in dark mode.
const { theme, problems } = makeColors({
  label: 'Snowman',
  roles: { danger: '#b3392f', success: '#2f7d4f', warning: '#a86f14', pro: '#6d4f94', accent: '#c2512d' },
  light: {
    roles: { accent: '#b8481f' },
    gray: {
      anchors: {
        'surface-0': '#e2ebf3',
        'surface-1': '#ecf2f8',
        'surface-2': '#f6f9fc',
        'text-primary': '#10222f',
        'text-secondary': '#34495a',
        'text-muted': '#4c6073',
      },
    },
  },
  dark: {
    roles: { accent: '#f0925a', danger: '#d9695e', success: '#5fb07a', warning: '#d9a441', pro: '#a58bd0' },
    gray: {
      anchors: {
        'surface-0': '#0b1620',
        'surface-1': '#101f2c',
        'surface-2': '#162a3a',
        'surface-3': '#1a3042',
        'text-primary': '#eaf3f8',
        'text-secondary': '#c2d1dc',
        'text-muted': '#9fb3c2',
      },
    },
  },
})

// The scene is drawn on a tall 400 x 800 picture. A wide window shows only its middle band (about y 290 to 510), so
// the hill's snow line is at y 505 and everything stands in that band; a phone shows all of it. The snowmen stand at
// the right edge and the trees at the left, as far out as they can go, so a chat panel in the middle of a wide window
// (which is blurred) leaves them outside the frosted glass.
const G = 505

// A snowman drawn around (0, 0) at its feet, then placed and scaled. Its colours come from CSS classes, so the
// scene can change them with the mode. The scarf's tail flutters a little.
const snowman = (x: number, scale: number, hasHat: boolean, scarf: string, delay: number): string =>
  [
    `<g transform="translate(${x} ${G}) scale(${scale})">`,
    '<ellipse class="ss" cx="7" cy="0" rx="27" ry="4"/>',
    '<circle class="sb so" cx="0" cy="-19" r="19"/>',
    '<circle class="sb so" cx="0" cy="-46" r="14"/>',
    '<circle class="sb so" cx="0" cy="-67" r="10"/>',
    // The arms are twigs.
    '<path d="M-12 -49 L-31 -59 M-24 -55 L-28 -48 M12 -49 L31 -57 M24 -53 L29 -46" stroke="#5a3b22" stroke-width="1.5" stroke-linecap="round" fill="none"/>',
    // Coal eyes, buttons and a smile.
    '<circle cx="-3.6" cy="-69" r="1.3" fill="#1b1b1f"/><circle cx="3.6" cy="-69" r="1.3" fill="#1b1b1f"/>',
    '<circle cx="-4" cy="-62.8" r="0.9" fill="#1b1b1f"/><circle cx="-1.4" cy="-61.6" r="0.9" fill="#1b1b1f"/><circle cx="1.4" cy="-61.6" r="0.9" fill="#1b1b1f"/><circle cx="4" cy="-62.8" r="0.9" fill="#1b1b1f"/>',
    '<circle cx="0" cy="-52" r="1.6" fill="#1b1b1f"/><circle cx="0" cy="-46" r="1.6" fill="#1b1b1f"/><circle cx="0" cy="-40" r="1.6" fill="#1b1b1f"/>',
    // The carrot nose.
    '<path d="M0.5 -66.4 L12 -64.8 L0.5 -63.2 Z" fill="#e8833a"/>',
    // The scarf, and its tail that flutters.
    `<path d="M-9.5 -58 Q0 -54.5 9.5 -58 L9.5 -54.6 Q0 -51 -9.5 -54.6 Z" fill="${scarf}"/>`,
    `<path class="fl" style="transform-origin:6px -55px;animation-delay:${delay}s" d="M4 -55 L8 -45 L13 -46.5 L10 -55.5 Z" fill="${scarf}"/>`,
    hasHat
      ? '<ellipse cx="0" cy="-76" rx="11" ry="2.3" fill="#23242c"/><rect x="-6.6" y="-91" width="13.2" height="15" rx="1.2" fill="#23242c"/><rect x="-6.6" y="-80.5" width="13.2" height="3.4" fill="#c23a4a"/>'
      : `<path d="M-9 -72 Q0 -86 9 -72 Z" fill="${scarf}"/><circle cx="0" cy="-83" r="2.6" fill="#f4ead6"/>`,
    '</g>',
  ].join('')

// A decorated fir: three tiers, a cap of snow, baubles, a few lights and a gold star on top. Its decorations are
// placed on the tiers by their own fractions of the height, so they follow the size of the tree.
const fir = (x: number, size: number, seed: number): string => {
  const tier = (offset: number, width: number, height: number): string =>
    `<path class="tr" d="M${x - width / 2} ${G - offset} L${x} ${G - offset - height} L${x + width / 2} ${G - offset} Z"/>`
  const top = G - size
  const bauble = (fx: number, fy: number, colour: string): string => {
    const cx = x + fx * size * 0.3
    const cy = G - fy * size

    return `<circle cx="${cx}" cy="${cy}" r="${Math.max(1.6, size * 0.035)}" fill="${colour}"/>`
  }
  const lights = [
    [-0.18, 0.3, '#f2c14e'],
    [0.16, 0.44, '#ff8a7a'],
    [-0.12, 0.58, '#9fd3ff'],
    [0.18, 0.7, '#f2c14e'],
  ] as const
  const baubles = [
    [-0.3, 0.2, '#c23a4a'],
    [0.26, 0.26, '#2f6fb0'],
    [-0.22, 0.4, '#f2c14e'],
    [0.2, 0.54, '#c23a4a'],
    [-0.25, 0.64, '#2f6fb0'],
    [0.08, 0.78, '#f2c14e'],
  ] as const

  return [
    `<rect x="${x - 2}" y="${G - 6}" width="4" height="7" fill="#3a2718"/>`,
    tier(4, size * 0.6, size * 0.42),
    tier(size * 0.27, size * 0.48, size * 0.4),
    tier(size * 0.5, size * 0.34, size * 0.38),
    `<path d="M${x - size * 0.1} ${G - size * 0.86} L${x} ${G - size} L${x + size * 0.1} ${G - size * 0.86} Z" fill="#ffffff" opacity=".92"/>`,
    ...baubles.map(([fx, fy, c]) => bauble(fx, fy, c)),
    ...lights.map(([fx, fy, c], i) =>
      `<circle class="tl" cx="${x + fx * size * 0.3}" cy="${G - fy * size}" r="1.3" fill="${c}" style="animation-delay:${-((i + seed) % 3)}s"/>`),
    `<path d="M${x} ${top - 6} L${x + 2} ${top - 2} L${x + 6} ${top - 2} L${x + 3} ${top + 1} L${x + 4} ${top + 5} L${x} ${top + 2.5} L${x - 4} ${top + 5} L${x - 3} ${top + 1} L${x - 6} ${top - 2} L${x - 2} ${top - 2} Z" fill="#f2c14e"/>`,
  ].join('')
}

// Four-pointed stars, for the night only.
const STARS = Array.from({ length: 22 }, (_, i) => {
  const x = (i * 59 + 23) % 400
  const y = (i * 97 + 11) % 800
  const r = 2 + ((i * 3) % 4) * 0.9
  const duration = 5 + ((i * 3) % 5)
  const delay = -((i * 5) % 9)
  const d = `M${x} ${y - r}Q${x} ${y} ${x + r} ${y}Q${x} ${y} ${x} ${y + r}Q${x} ${y} ${x - r} ${y}Q${x} ${y} ${x} ${y - r}Z`

  return `<path class="s" d="${d}" style="animation-duration:${duration}s;animation-delay:${delay}s"/>`
}).join('')

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
  '<defs>',
  '<linearGradient id="dayg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bcd8ec"/><stop offset="0.7" stop-color="#e3eff8"/><stop offset="1" stop-color="#f4f9fd"/></linearGradient>',
  '<linearGradient id="nightg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070f1b"/><stop offset="0.7" stop-color="#14263d"/><stop offset="1" stop-color="#1c3048"/></linearGradient>',
  '</defs>',
  '<style>',
  '.night{display:none}',
  '.f{fill:#ffffff;stroke:#a9c0d3;stroke-width:.6;opacity:.95;animation-name:fall;animation-timing-function:linear;animation-iteration-count:infinite}',
  '@keyframes fall{from{transform:translate(0,0)}to{transform:translate(var(--d),830px)}}',
  '.sb{fill:#ffffff}',
  '.so{stroke:#9db6c8;stroke-width:.8}',
  '.ss{fill:#a9c0d3;opacity:.7}',
  '.gnd{fill:#f4f9fd}',
  '.hill{fill:#dbe9f4}',
  '.tr{fill:#2f6b4a}',
  '.tl{animation:glow 4s ease-in-out infinite}',
  '@keyframes glow{0%,100%{opacity:.55}50%{opacity:1}}',
  '.s{fill:#f6ecdf;animation-name:tw;animation-timing-function:ease-in-out;animation-iteration-count:infinite}',
  '@keyframes tw{0%,100%{opacity:.15}50%{opacity:1}}',
  '.fl{animation:flutter 5s ease-in-out infinite}',
  '@keyframes flutter{0%,100%{transform:rotate(-5deg)}50%{transform:rotate(9deg)}}',
  // At night: a dark sky, the stars and the moon, a bluer snow, and flakes without an outline.
  '@media (prefers-color-scheme:dark){.day{display:none}.night{display:inline}.f{fill:#fffaf0;stroke:none;opacity:.85}.sb{fill:#dce8f1}.so{stroke:#8da3b6}.ss{fill:#050b14;opacity:.5}.gnd{fill:#26384f}.hill{fill:#1a2b41}.tr{fill:#10301f}}',
  // Asked to reduce motion, the snow rests at set heights and the stars and the scarves stay still.
  '@media (prefers-reduced-motion:reduce){.f{animation:none;transform:translate(0,var(--y))}.s,.fl,.tl{animation:none}}',
  '</style>',
  '<rect class="day" width="400" height="800" fill="url(#dayg)"/>',
  '<rect class="night" width="400" height="800" fill="url(#nightg)"/>',
  `<g class="night">${STARS}<circle cx="86" cy="338" r="19" fill="#f3e6c8" opacity=".92"/></g>`,
  '<circle class="day" cx="86" cy="338" r="22" fill="#fff4c9" opacity=".95"/>',
  `<path class="hill" d="M0 ${G - 34} Q100 ${G - 64} 200 ${G - 36} T400 ${G - 42} L400 ${G} L0 ${G} Z"/>`,
  fir(70, 56, 0),
  fir(104, 40, 1),
  snowman(370, 0.76, true, '#c23a4a', 0),
  '<rect class="gnd" x="0" y="' + G + '" width="400" height="295"/>',
  FLAKES,
  '</svg>',
].join('')

// The glass frosts the panels over the scene: the desktop app blurs what is behind a panel by `blur` points and
// lays a veil over it. It has no tint of its own, so the veil takes each mode's own panel colour. The scene shows
// sharp outside the panels and softened behind them, which keeps the words easy to read over the snow.
const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'snowman', glass: { blur: 14, opacity: 0.55 } },
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
    if (e.surface !== 'desktop') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="A snowman and a small snowman on a snowy hill with fir trees, in snowfall" isInteractive />
  })
}
