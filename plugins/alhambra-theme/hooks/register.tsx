import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'

// Warm cream stone with a terracotta accent by day, deep indigo night with gold by night. Both modes are given and
// none is forced.
const { theme, problems } = makeColors({
  label: 'Alhambra',
  roles: { danger: '#b3392f', success: '#2f7d4f', warning: '#a86f14', pro: '#6d4f94', accent: '#a4472f' },
  light: {
    gray: {
      anchors: {
        'surface-0': '#efe5d1',
        'surface-1': '#f5edde',
        'surface-2': '#faf5ea',
        'text-primary': '#2a2016',
        'text-secondary': '#51422e',
        'text-muted': '#675640',
      },
    },
  },
  dark: {
    roles: { accent: '#e0b45a', danger: '#d9695e', success: '#5fb07a', warning: '#d9a441', pro: '#a58bd0' },
    gray: {
      anchors: {
        'surface-0': '#10131f',
        'surface-1': '#171b2a',
        'surface-2': '#1f2336',
        'surface-3': '#242940',
        'text-primary': '#f1e9d8',
        'text-secondary': '#cfc6b3',
        'text-muted': '#a8a08e',
      },
    },
  },
})

// The scene is drawn on a tall 400 x 800 picture. A wide window shows only its middle band (about y 290 to 510), so
// the ground line is at y 505 and everything stands in that band. The red fortress stands on its hill at the left
// edge, the white houses of the Albaicin and the cypresses at the right, and the snowy Sierra Nevada rises behind.
const G = 505

// A tower of the fortress: a block of warm stone with a crenellated top, a row of small horseshoe-arched windows,
// and a darker side that gives it volume.
const tower = (x: number, top: number, width: number, windows: number): string => {
  const base = G - 78
  const merlon = width / 5
  const crenels = Array.from({ length: 3 }, (_, i) => `M${x + merlon * (i * 2)} ${top} v-5 h${merlon} v5 Z`).join('')
  const arch = (cx: number, cy: number): string => `M${cx - 2.5} ${cy + 7} V${cy + 2.5} Q${cx} ${cy - 2} ${cx + 2.5} ${cy + 2.5} V${cy + 7} Z`

  return [
    `<rect class="al" x="${x}" y="${top}" width="${width}" height="${base - top}"/>`,
    `<rect class="als" x="${x + width * 0.72}" y="${top}" width="${width * 0.28}" height="${base - top}"/>`,
    `<path class="al" d="${crenels}"/>`,
    `<path class="wn" d="${Array.from({ length: windows }, (_, i) => arch(x + width * 0.36, top + 12 + i * 22)).join('')}"/>`,
  ].join('')
}

// A cypress: a tall, narrow, dark-green flame.
const cypress = (x: number, height: number): string =>
  `<path class="cy" d="M${x} ${G} C${x - 9} ${G - height * 0.3} ${x - 6} ${G - height * 0.8} ${x} ${G - height} C${x + 6} ${G - height * 0.8} ${x + 9} ${G - height * 0.3} ${x} ${G} Z"/>`

// A white house of the Albaicin: a cube with a terracotta roof and a small dark window.
const house = (x: number, y: number, width: number, height: number): string =>
  `<rect class="wh" x="${x}" y="${y - height}" width="${width}" height="${height}"/><path class="rt" d="M${x - 1.5} ${y - height} H${x + width + 1.5} L${x + width - 2} ${y - height - 5} H${x + 2} Z"/><rect class="wn" x="${x + width * 0.4}" y="${y - height * 0.62}" width="3" height="${Math.min(6, height * 0.4)}"/>`

const STARS = Array.from({ length: 26 }, (_, i) => {
  const x = (i * 59 + 23) % 400
  const y = (i * 97 + 11) % 520
  const r = 2 + ((i * 3) % 4) * 0.9
  const duration = 5 + ((i * 3) % 5)
  const delay = -((i * 5) % 9)
  const d = `M${x} ${y - r}Q${x} ${y} ${x + r} ${y}Q${x} ${y} ${x} ${y + r}Q${x} ${y} ${x - r} ${y}Q${x} ${y} ${x} ${y - r}Z`

  return `<path class="s" d="${d}" style="animation-duration:${duration}s;animation-delay:${delay}s"/>`
}).join('')

const SCENE = [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice">',
  '<defs>',
  '<linearGradient id="al-day" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#86bfe0"/><stop offset="0.7" stop-color="#f4e6c6"/><stop offset="1" stop-color="#f8ecd0"/></linearGradient>',
  '<linearGradient id="al-night" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#060914"/><stop offset="0.7" stop-color="#161c36"/><stop offset="1" stop-color="#2a2740"/></linearGradient>',
  '</defs>',
  '<style>',
  '.night{display:none}',
  '.sn{fill:#9fb7cc}.cap{fill:#ffffff}.fh{fill:#c9a37a}.hl{fill:#b9704a}.gnd{fill:#9a6a44}',
  '.al{fill:#d9a86a}.als{fill:#bf8c52}.wn{fill:#5a3b25}.cy{fill:#2f5a3a}',
  '.wh{fill:#f7f1e6}.rt{fill:#c2603a}',
  '.arc{fill:#7a4a2c}.lit{fill:#ffd37a;opacity:0}',
  '.cl{fill:#ffffff;opacity:.7;animation:drift 80s ease-in-out infinite alternate}',
  '@keyframes drift{from{transform:translateX(-22px)}to{transform:translateX(22px)}}',
  '.s{fill:#f6ecdf;animation-name:tw;animation-timing-function:ease-in-out;animation-iteration-count:infinite}',
  '@keyframes tw{0%,100%{opacity:.15}50%{opacity:1}}',
  '.lt{animation:glow 6s ease-in-out infinite}',
  '@keyframes glow{0%,100%{opacity:.6}50%{opacity:1}}',
  // At night the mountains are deep blue under a pale snow, the fortress is floodlit gold, and the windows glow.
  '@media (prefers-color-scheme:dark){.day{display:none}.night{display:inline}.sn{fill:#2c3a5a}.cap{fill:#aab8d6}.fh{fill:#3b3350}.hl{fill:#3a2a30}.gnd{fill:#251d28}.al{fill:#8a6a48}.als{fill:#5e4630}.wn{fill:#ffd37a}.cy{fill:#10261a}.wh{fill:#8e8aa0}.rt{fill:#5a3a3a}.cl{opacity:.12}.lit{opacity:.9}}',
  // Asked to reduce motion, the clouds and lights rest and the stars stay still.
  '@media (prefers-reduced-motion:reduce){.cl,.lt,.s{animation:none}}',
  '</style>',
  '<rect class="day" width="400" height="800" fill="url(#al-day)"/>',
  '<rect class="night" width="400" height="800" fill="url(#al-night)"/>',
  `<g class="night">${STARS}<circle cx="292" cy="330" r="17" fill="#f3e6c8" opacity=".92"/></g>`,
  '<circle class="day" cx="292" cy="334" r="22" fill="#fff3c4" opacity=".95"/>',
  // The Sierra Nevada, with snow on its peaks.
  `<path class="sn" d="M120 ${G - 70} L168 ${G - 150} L196 ${G - 128} L246 ${G - 186} L286 ${G - 140} L330 ${G - 170} L372 ${G - 132} L400 ${G - 150} L400 ${G - 40} L120 ${G - 40} Z"/>`,
  `<path class="cap" d="M168 ${G - 150} L182 ${G - 128} L174 ${G - 134} L164 ${G - 126} Z M246 ${G - 186} L264 ${G - 160} L254 ${G - 166} L246 ${G - 156} L236 ${G - 164} L228 ${G - 160} Z M330 ${G - 170} L346 ${G - 148} L338 ${G - 152} L330 ${G - 144} L322 ${G - 150} L314 ${G - 146} Z"/>`,
  `<path class="cl" d="M250 ${G - 120} q10 -6 22 0 q12 -6 24 0 q-8 6 -22 5 q-14 3 -24 -5 Z"/>`,
  // The hill of the fortress and the old town below it.
  `<path class="fh" d="M150 ${G - 30} Q230 ${G - 70} 300 ${G - 44} T400 ${G - 50} L400 ${G} L150 ${G} Z"/>`,
  house(262, G - 34, 20, 16),
  house(286, G - 40, 18, 14),
  house(308, G - 34, 22, 18),
  house(334, G - 42, 18, 14),
  house(356, G - 36, 24, 18),
  house(300, G - 24, 16, 12),
  house(342, G - 26, 20, 14),
  `<path class="hl" d="M0 ${G - 60} L40 ${G - 100} L186 ${G - 96} Q214 ${G - 70} 240 ${G - 30} L260 ${G} L0 ${G} Z"/>`,
  // The walls, the tall tower of Comares, the Alcazaba towers, a palace block with its tiled roof and the great gate.
  `<rect class="al" x="0" y="${G - 112}" width="216" height="34"/><path class="als" d="M0 ${G - 80} H216 V${G - 78} H0 Z"/>`,
  `<path class="al" d="${Array.from({ length: 21 }, (_, i) => `M${i * 10.3} ${G - 112} v-5 h5 v5 Z`).join('')}"/>`,
  tower(112, G - 196, 40, 3),
  tower(30, G - 150, 32, 2),
  tower(174, G - 146, 30, 2),
  `<rect class="al" x="68" y="${G - 138}" width="38" height="28"/><path class="rt" d="M64 ${G - 138} H110 L102 ${G - 150} H72 Z"/><path class="wn" d="M76 ${G - 118} v-8 q3 -4 6 0 v8 Z M90 ${G - 118} v-8 q3 -4 6 0 v8 Z"/>`,
  `<path class="arc" d="M150 ${G - 78} V${G - 104} Q166 ${G - 126} 182 ${G - 104} V${G - 78} Z"/>`,
  // Lights in the windows at night.
  `<g class="lt"><path class="lit" d="M131 ${G - 172} h3 v6 h-3 Z M131 ${G - 150} h3 v6 h-3 Z M48 ${G - 130} h3 v6 h-3 Z M188 ${G - 128} h3 v6 h-3 Z M78 ${G - 126} h3 v6 h-3 Z M92 ${G - 126} h3 v6 h-3 Z"/></g>`,
  // Cypresses in front.
  cypress(10, 64),
  cypress(22, 48),
  cypress(206, 58),
  cypress(220, 74),
  cypress(372, 56),
  cypress(386, 72),
  '<rect class="gnd" x="0" y="' + G + '" width="400" height="295"/>',
  '</svg>',
].join('')

// The glass frosts the panels over the scene: the desktop app blurs what is behind a panel by `blur` points and
// lays a veil over it. The scene shows sharp outside the panels and softened behind them.
const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'alhambra', glass: { blur: 14, opacity: 0.55 } },
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

    return <Svg source={SCENE} alt="The red fortress of the Alhambra on its hill, with the snowy Sierra Nevada behind and white houses below" isInteractive />
  })
}
