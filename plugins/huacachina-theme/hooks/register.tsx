import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'

// Warm sand greys with a lagoon-teal accent. Both modes are given and none is forced: a bright desert day in light
// mode, a starry night over the oasis in dark mode.
const { theme, problems } = makeColors({
  label: 'Huacachina',
  roles: { danger: '#b3392f', success: '#2f7d4f', warning: '#a86f14', pro: '#6d4f94', accent: '#1f7a78' },
  light: {
    gray: {
      anchors: {
        'surface-0': '#efe3cb',
        'surface-1': '#f5ebd6',
        'surface-2': '#faf3e3',
        'text-primary': '#2a2216',
        'text-secondary': '#51452d',
        'text-muted': '#665839',
      },
    },
  },
  dark: {
    roles: { accent: '#3bb8b0', danger: '#d9695e', success: '#5fb07a', warning: '#d9a441', pro: '#a58bd0' },
    gray: {
      anchors: {
        'surface-0': '#15110d',
        'surface-1': '#1e1914',
        'surface-2': '#27211a',
        'surface-3': '#2d261e',
        'text-primary': '#f1e8d6',
        'text-secondary': '#d0c5ae',
        'text-muted': '#aa9f88',
      },
    },
  },
})

// The scene is drawn on a tall 400 x 800 picture. A wide window shows only its middle band (about y 290 to 510), so
// the sand line is at y 505 and everything stands in that band; a phone shows all of it. The palms stand at both
// edges and the lagoon lies low in the middle, outside the area the chat panel usually covers.
const G = 505
// The far shore, where the town stands, is just above the lagoon.
const BASE = G - 22

// A palm: a leaning trunk and a crown of fronds. The crown sways a little, around the top of the trunk.
const palm = (x: number, height: number, lean: number, delay: number): string => {
  const topX = x + lean
  const topY = G - height
  const frond = (angle: number, length: number): string => {
    const rad = (angle * Math.PI) / 180
    const endX = topX + Math.cos(rad) * length
    const endY = topY + Math.sin(rad) * length
    const bendX = topX + Math.cos(rad) * length * 0.55
    const bendY = topY + Math.sin(rad) * length * 0.55 - length * 0.22

    return `<path class="fr" d="M${topX} ${topY} Q${bendX} ${bendY} ${endX} ${endY} Q${bendX} ${bendY + 6} ${topX} ${topY + 2} Z"/>`
  }

  return [
    `<path class="tk" d="M${x - 3} ${G} Q${x + lean * 0.2} ${G - height * 0.5} ${topX - 1.5} ${topY} L${topX + 1.5} ${topY} Q${x + lean * 0.2 + 4} ${G - height * 0.5} ${x + 3} ${G} Z"/>`,
    `<g class="sw" style="transform-origin:${topX}px ${topY}px;animation-delay:${delay}s">`,
    frond(-160, height * 0.52),
    frond(-130, height * 0.5),
    frond(-100, height * 0.42),
    frond(-60, height * 0.5),
    frond(-25, height * 0.52),
    frond(-10, height * 0.4),
    frond(-170, height * 0.38),
    `<circle class="co" cx="${topX}" cy="${topY + 2}" r="3"/>`,
    '</g>',
  ].join('')
}

const STARS = Array.from({ length: 26 }, (_, i) => {
  const x = (i * 59 + 23) % 400
  const y = (i * 97 + 11) % 520
  const r = 2 + ((i * 3) % 4) * 0.9
  const duration = 5 + ((i * 3) % 5)
  const delay = -((i * 5) % 9)
  const d = `M${x} ${y - r}Q${x} ${y} ${x + r} ${y}Q${x} ${y} ${x} ${y + r}Q${x} ${y} ${x - r} ${y}Q${x} ${y} ${x} ${y - r}Z`

  return `<path class="s" d="${d}" style="animation-duration:${duration}s;animation-delay:${delay}s"/>`
}).join('')

// A low building on the far shore: a flat-roofed block with a darker roof edge, two windows that glow at night, and
// an arcade of arches along the foot when `arches` is set. Its colour class says which wash of the three it is.
const building = (x: number, width: number, height: number, tone: 'ba' | 'bb' | 'bc', arches: boolean): string => {
  const top = BASE - height
  const arch = (cx: number): string => `M${cx - 3} ${BASE} V${BASE - 6} Q${cx} ${BASE - 10} ${cx + 3} ${BASE - 6} V${BASE} Z`

  return [
    `<rect class="${tone}" x="${x}" y="${top}" width="${width}" height="${height}"/>`,
    `<rect class="br" x="${x - 1}" y="${top - 2}" width="${width + 2}" height="3"/>`,
    `<rect class="wn" x="${x + width * 0.2}" y="${top + 6}" width="4" height="6"/>`,
    `<rect class="wn" x="${x + width * 0.62}" y="${top + 6}" width="4" height="6"/>`,
    arches ? `<path class="ar" d="${arch(x + width * 0.2)}${arch(x + width * 0.5)}${arch(x + width * 0.8)}"/>` : '',
  ].join('')
}

// A rowing boat on the lagoon, bobbing a little, with its oar.
const boat = (x: number, y: number, delay: number): string =>
  `<g class="bob" style="animation-delay:${delay}s"><path class="bt" d="M${x - 10} ${y} Q${x} ${y + 5} ${x + 10} ${y} L${x + 8} ${y - 3} H${x - 8} Z"/><path class="fg" d="M${x - 3} ${y - 3} L${x + 7} ${y - 9}" stroke-width="1"/></g>`

// A dune buggy on a crest: a squat body, a roll cage and two chunky wheels.
const buggy = (x: number, y: number): string =>
  [
    `<g transform="translate(${x} ${y}) rotate(36) scale(0.95)">`,
    '<path class="bg" d="M-11 -4 H11 L9 -9 H1 L-3 -14 H-9 L-10 -9 Z"/>',
    '<path class="bg" d="M-8 -9 L-6 -16 H0 L2 -9" fill="none" stroke="#2f3a45" stroke-width="1.2"/>',
    '<circle class="bg" cx="-8" cy="-1" r="4.2"/><circle class="bg" cx="8" cy="-1" r="4.2"/>',
    '</g>',
  ].join('')

// A sandboarder standing on a slope: a head, a body and a board under the feet.
const boarder = (x: number, y: number): string =>
  `<g transform="translate(${x} ${y}) rotate(38)"><circle class="fg2" cx="0" cy="-13" r="2.2"/><path class="fg" d="M0 -11 V-4 M0 -9 L-4 -6 M0 -9 L4 -6 M0 -4 L-2 0 M0 -4 L2 0" stroke-width="1.3" stroke-linecap="round" fill="none"/><path class="fg" d="M-7 1 H7" stroke-width="1.8" stroke-linecap="round"/></g>`

// Slow wind ripples combed across a dune, as short curved strokes.
const ripples = (x: number, y: number, count: number): string =>
  Array.from({ length: count }, (_, i) => {
    const rx = x + i * 14
    const ry = y + ((i * 7) % 5) * 5 - i * 2

    return `M${rx} ${ry} q9 -4 18 0`
  }).join('')

const SCENE = [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice">',
  '<defs>',
  '<linearGradient id="hc-day" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7fc3e0"/><stop offset="0.7" stop-color="#f6e7c2"/><stop offset="1" stop-color="#f9edcf"/></linearGradient>',
  '<linearGradient id="hc-night" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#050a18"/><stop offset="0.7" stop-color="#16213a"/><stop offset="1" stop-color="#2a2a3a"/></linearGradient>',
  '</defs>',
  '<style>',
  '.night{display:none}',
  '.d0{fill:#f0d9a6}.d1{fill:#e9c98a}.d2{fill:#e2bd78}.d3{fill:#d3a562}.dsh{fill:#b9843f;opacity:.55}.wr{stroke:#b9843f;stroke-width:1;fill:none;opacity:.5}',
  '.gnd{fill:#d9b36f}',
  '.lg{fill:#3fb3b0}.lh{fill:#9be0dc;opacity:.55}.rf{fill:#1f7f7d}.rl{fill:#ffd37a;opacity:0}',
  '.ba{fill:#f3e6cf}.bb{fill:#e2a679}.bc{fill:#d98c6a}.br{fill:#a8643f}.wn{fill:#4a3a2a}.ar{fill:#5a3f2c}',
  '.wd{fill:#7a5532}.bt{fill:#8a5a34}.fg{stroke:#3b2a1c}.fg2{fill:#3b2a1c}.bg{fill:#2f3a45}',
  '.tk{fill:#6b4a2b}.fr{fill:#2f8a4a}.co{fill:#5a3b22}',
  '.sw{animation:sway 7s ease-in-out infinite}',
  '@keyframes sway{0%,100%{transform:rotate(-2.5deg)}50%{transform:rotate(3deg)}}',
  '.bob{animation:bob 5s ease-in-out infinite}',
  '@keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(1.6px)}}',
  '.rp{fill:none;stroke:#ffffff;stroke-width:.8;opacity:.5;animation:rip 6s ease-in-out infinite}',
  '@keyframes rip{0%,100%{opacity:.15}50%{opacity:.6}}',
  '.s{fill:#f6ecdf;animation-name:tw;animation-timing-function:ease-in-out;animation-iteration-count:infinite}',
  '@keyframes tw{0%,100%{opacity:.15}50%{opacity:1}}',
  // At night the sand is cool and dark, the shore town is lit and mirrored in the lagoon, and the palms are near black.
  '@media (prefers-color-scheme:dark){.day{display:none}.night{display:inline}.d0{fill:#46455a}.d1{fill:#3b3a4a}.d2{fill:#32313f}.d3{fill:#262533}.dsh{fill:#000;opacity:.4}.wr{stroke:#14131c;opacity:.5}.gnd{fill:#26242f}.lg{fill:#123e4d}.lh{fill:#9bd7e6;opacity:.3}.rf{fill:#0c2b36}.rl{opacity:.35}.ba{fill:#55536a}.bb{fill:#65505a}.bc{fill:#55435a}.br{fill:#2c2230}.wn{fill:#ffd37a}.ar{fill:#1a1420}.wd{fill:#2b1f16}.bt{fill:#2d1d14}.fg{stroke:#0b0a10}.fg2{fill:#0b0a10}.bg{fill:#0b0a10}.tk{fill:#1b1410}.fr{fill:#12301f}.co{fill:#0f0a07}.rp{stroke:#bfe6f2;opacity:.35}}',
  // Asked to reduce motion, the palms, boats and ripples rest and the stars stay still.
  '@media (prefers-reduced-motion:reduce){.sw,.bob,.rp,.s{animation:none}}',
  '</style>',
  '<rect class="day" width="400" height="800" fill="url(#hc-day)"/>',
  '<rect class="night" width="400" height="800" fill="url(#hc-night)"/>',
  `<g class="night">${STARS}<circle cx="300" cy="332" r="18" fill="#f3e6c8" opacity=".92"/></g>`,
  '<circle class="day" cx="300" cy="336" r="24" fill="#fff3c4" opacity=".95"/>',
  // Far dunes, then two tall dunes with sharp crests, sunlit on one side and shaded on the lee side.
  `<path class="d0" d="M0 ${G - 118} Q70 ${G - 146} 140 ${G - 112} T270 ${G - 122} T400 ${G - 106} L400 ${G} L0 ${G} Z"/>`,
  `<path class="d1" d="M-10 ${G - 56} C40 ${G - 70} 70 ${G - 170} 98 ${G - 172} C126 ${G - 174} 150 ${G - 90} 240 ${G - 58} L240 ${G} L-10 ${G} Z"/>`,
  `<path class="dsh" d="M98 ${G - 172} C126 ${G - 174} 150 ${G - 90} 240 ${G - 58} L160 ${G - 58} C130 ${G - 100} 112 ${G - 148} 98 ${G - 172} Z"/>`,
  `<path class="d2" d="M160 ${G - 50} C250 ${G - 60} 290 ${G - 158} 318 ${G - 158} C346 ${G - 158} 340 ${G - 80} 420 ${G - 66} L420 ${G} L160 ${G} Z"/>`,
  `<path class="dsh" d="M318 ${G - 158} C290 ${G - 158} 250 ${G - 60} 160 ${G - 50} L240 ${G - 50} C280 ${G - 80} 300 ${G - 130} 318 ${G - 158} Z"/>`,
  `<path class="wr" d="${ripples(24, G - 96, 5)}${ripples(30, G - 70, 6)}${ripples(246, G - 70, 5)}${ripples(270, G - 100, 4)}"/>`,
  buggy(182, G - 93),
  boarder(125, G - 153),
  boarder(140, G - 135),
  `<path class="d3" d="M0 ${G - 48} Q120 ${G - 82} 220 ${G - 44} T400 ${G - 50} L400 ${G} L0 ${G} Z"/>`,
  // The town on the far shore, with its arcades, and the lagoon in front of it.
  building(92, 34, 26, 'ba', false),
  building(128, 30, 34, 'bb', true),
  building(160, 36, 24, 'bc', false),
  building(198, 28, 40, 'ba', false),
  `<path class="br" d="M198 ${BASE - 40} L212 ${BASE - 52} L226 ${BASE - 40} Z"/>`,
  building(228, 34, 28, 'bb', true),
  building(264, 30, 22, 'bc', false),
  `<ellipse class="rf" cx="200" cy="${G - 6}" rx="150" ry="15"/>`,
  `<ellipse class="lg" cx="200" cy="${G - 8}" rx="140" ry="11"/>`,
  `<path class="lh" d="M90 ${G - 10} Q130 ${G - 14} 170 ${G - 10} Q130 ${G - 7} 90 ${G - 10} Z"/>`,
  `<path class="rp" d="M200 ${G - 8} Q230 ${G - 12} 262 ${G - 8} M150 ${G - 4} Q180 ${G - 7} 212 ${G - 4}"/>`,
  // Lights of the town mirrored in the water, at night only.
  `<path class="rl" d="M108 ${G - 18} v10 h3 v-10 Z M142 ${G - 18} v9 h3 v-9 Z M176 ${G - 18} v10 h3 v-10 Z M212 ${G - 18} v9 h3 v-9 Z M246 ${G - 18} v10 h3 v-10 Z M280 ${G - 18} v9 h3 v-9 Z"/>`,
  // A short wooden pier with its posts, and two rowing boats.
  `<rect class="wd" x="40" y="${G - 12}" width="64" height="3"/><path class="wd" d="M46 ${G - 12} v10 h2 v-10 Z M66 ${G - 12} v10 h2 v-10 Z M86 ${G - 12} v10 h2 v-10 Z M100 ${G - 12} v10 h2 v-10 Z"/>`,
  boat(124, G - 5, 0),
  boat(268, G - 3, -2),
  palm(42, 96, 16, 0),
  palm(72, 70, -12, -2),
  palm(354, 104, -18, -1),
  palm(330, 64, 10, -3),
  palm(88, 40, 6, -4),
  palm(312, 44, -6, -5),
  '<rect class="gnd" x="0" y="' + G + '" width="400" height="295"/>',
  '</svg>',
].join('')

// The glass frosts the panels over the scene: the desktop app blurs what is behind a panel by `blur` points and
// lays a veil over it. The scene shows sharp outside the panels and softened behind them.
const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'huacachina', glass: { blur: 14, opacity: 0.55 } },
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

    return <Svg source={SCENE} alt="Sand dunes around a small lagoon with palm trees, by day or by night" isInteractive />
  })
}
