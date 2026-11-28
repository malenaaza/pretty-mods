import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'

// Cool pale stone with a Gaudi-tile teal accent by day, deep blue night with a warm gold glow by night. Both modes
// are given and none is forced.
const { theme, problems } = makeColors({
  label: 'Sagrada Familia',
  roles: { danger: '#b3392f', success: '#2f7d4f', warning: '#a86f14', pro: '#6d4f94', accent: '#237a86' },
  light: {
    gray: {
      anchors: {
        'surface-0': '#e6e8e2',
        'surface-1': '#eef0ea',
        'surface-2': '#f7f8f4',
        'text-primary': '#1a2325',
        'text-secondary': '#394649',
        'text-muted': '#506063',
      },
    },
  },
  dark: {
    roles: { accent: '#5cc0c8', danger: '#d9695e', success: '#5fb07a', warning: '#d9a441', pro: '#a58bd0' },
    gray: {
      anchors: {
        'surface-0': '#0c1119',
        'surface-1': '#131a25',
        'surface-2': '#1a2230',
        'surface-3': '#1f2837',
        'text-primary': '#ebeff2',
        'text-secondary': '#c4cdd4',
        'text-muted': '#9eaab4',
      },
    },
  },
})

// The scene is drawn on a tall 400 x 800 picture. A wide window shows only its middle band (about y 290 to 510), so
// the street line is at y 505 and everything stands in that band. One group of spires rises at the left edge and a
// smaller one at the right, with a building crane between them and the plane trees of the street at the foot.
const G = 505

// The colours of the mosaic fruit on top of each spire.
const FRUIT = ['#e8782f', '#d9412f', '#f2c14e', '#7bbf4a', '#e8782f']

// A spire: a tall tapering tower with a curved profile, rows of narrow windows, a lighter band at each stage and a
// cluster of coloured fruit at its tip. Its right side is a darker face.
const spire = (cx: number, height: number, width: number, seed: number): string => {
  const base = G - 60
  const top = base - height
  const half = width / 2
  const tip = width * 0.16
  const body = `M${cx - half} ${base} C${cx - half} ${top + height * 0.5} ${cx - tip} ${top + height * 0.2} ${cx - tip} ${top} L${cx + tip} ${top} C${cx + tip} ${top + height * 0.2} ${cx + half} ${top + height * 0.5} ${cx + half} ${base} Z`
  const shade = `M${cx + half * 0.15} ${base} C${cx + half * 0.15} ${top + height * 0.5} ${cx} ${top + height * 0.2} ${cx} ${top} L${cx + tip} ${top} C${cx + tip} ${top + height * 0.2} ${cx + half} ${top + height * 0.5} ${cx + half} ${base} Z`
  const windows = Array.from({ length: Math.floor(height / 24) }, (_, i) => {
    const y = base - 16 - i * 24
    const w = half * (1 - i / Math.floor(height / 24)) * 0.3 + 0.8

    return `M${cx - w - 1.5} ${y} v-7 q${w + 1.5} -4 ${(w + 1.5) * 2} 0 v7 Z`
  }).join('')
  const bands = Array.from({ length: Math.floor(height / 48) }, (_, i) => `M${cx - half} ${base - 30 - i * 48} H${cx + half}`).join('')
  const fruit = [
    [0, -6, 6],
    [-5, -2, 4.5],
    [5, -2, 4.5],
    [0, 3, 4],
  ]
    .map(([dx = 0, dy = 0, r = 4], i) => `<circle cx="${cx + dx}" cy="${top + dy}" r="${r}" fill="${FRUIT[(i + seed) % FRUIT.length]}"/>`)
    .join('')

  return [
    `<path class="sf" d="${body}"/>`,
    `<path class="sfs" d="${shade}"/>`,
    `<path class="sb" d="${bands}"/>`,
    `<path class="wn" d="${windows}"/>`,
    fruit,
  ].join('')
}

// A plane tree of the street: a slim trunk and a round crown.
const tree = (x: number, size: number): string =>
  `<rect class="tk" x="${x - 1.6}" y="${G - size}" width="3.2" height="${size}"/><circle class="lf" cx="${x}" cy="${G - size - size * 0.35}" r="${size * 0.5}"/><circle class="lf" cx="${x - size * 0.32}" cy="${G - size - size * 0.12}" r="${size * 0.34}"/><circle class="lf" cx="${x + size * 0.32}" cy="${G - size - size * 0.12}" r="${size * 0.34}"/>`

// A tower crane beside the building site: a lattice mast, a jib with its counterweight and a hanging hook.
const crane = (x: number, height: number): string => {
  const top = G - height

  return [
    `<path class="cr" d="M${x - 3} ${G} V${top} M${x + 3} ${G} V${top} M${x - 3} ${G - height * 0.25} L${x + 3} ${G - height * 0.4} M${x - 3} ${G - height * 0.4} L${x + 3} ${G - height * 0.55} M${x - 3} ${G - height * 0.55} L${x + 3} ${G - height * 0.7} M${x - 3} ${G - height * 0.7} L${x + 3} ${G - height * 0.85}" stroke-width="1.1" fill="none"/>`,
    `<path class="crj" d="M${x - 26} ${top} H${x + 64} L${x} ${top - 12} Z"/>`,
    `<rect class="crj" x="${x - 26}" y="${top}" width="10" height="7"/>`,
    `<path class="cr" d="M${x + 48} ${top} V${top + 30}" stroke-width=".9" fill="none"/><rect class="crj" x="${x + 45}" y="${top + 30}" width="6" height="5"/>`,
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

const SCENE = [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice">',
  '<defs>',
  '<linearGradient id="sf-day" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6fb4e0"/><stop offset="0.7" stop-color="#d9ecf5"/><stop offset="1" stop-color="#eef4f0"/></linearGradient>',
  '<linearGradient id="sf-night" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#050a16"/><stop offset="0.7" stop-color="#122038"/><stop offset="1" stop-color="#1f2c44"/></linearGradient>',
  '</defs>',
  '<style>',
  '.night{display:none}',
  '.sf{fill:#d6bf94}.sfs{fill:#b79c6c}.sb{stroke:#a38a5c;stroke-width:1.2;fill:none}.wn{fill:#4a3d2a}',
  '.bl{fill:#c9b48c}.bls{fill:#a8905f}.gnd{fill:#b9ad94}.tk{fill:#5a4630}.lf{fill:#5b9a55}',
  '.cr{stroke:#c9402f}.crj{fill:#e2b43a}',
  '.cl{fill:#ffffff;opacity:.75;animation:drift 90s ease-in-out infinite alternate}',
  '@keyframes drift{from{transform:translateX(-24px)}to{transform:translateX(24px)}}',
  '.s{fill:#f6ecdf;animation-name:tw;animation-timing-function:ease-in-out;animation-iteration-count:infinite}',
  '@keyframes tw{0%,100%{opacity:.15}50%{opacity:1}}',
  '.lit{fill:#ffd37a;opacity:0;animation:glow 7s ease-in-out infinite}',
  '@keyframes glow{0%,100%{opacity:.6}50%{opacity:1}}',
  // At night the stone is floodlit warm gold against a deep blue sky, the windows glow and the crane is dark.
  '@media (prefers-color-scheme:dark){.day{display:none}.night{display:inline}.sf{fill:#b08a55}.sfs{fill:#6e5535}.sb{stroke:#4a3922}.wn{fill:#ffd37a}.bl{fill:#7a6644}.bls{fill:#54442c}.gnd{fill:#262a36}.tk{fill:#1c1710}.lf{fill:#16301f}.cr{stroke:#2a3340}.crj{fill:#3a4658}.cl{opacity:.1}.lit{opacity:.9}}',
  // Asked to reduce motion, the clouds and lights rest and the stars stay still.
  '@media (prefers-reduced-motion:reduce){.cl,.lit,.s{animation:none}}',
  '</style>',
  '<rect class="day" width="400" height="800" fill="url(#sf-day)"/>',
  '<rect class="night" width="400" height="800" fill="url(#sf-night)"/>',
  `<g class="night">${STARS}<circle cx="236" cy="330" r="17" fill="#f3e6c8" opacity=".92"/></g>`,
  '<circle class="day" cx="236" cy="334" r="22" fill="#fff6d0" opacity=".95"/>',
  `<path class="cl" d="M150 ${G - 150} q10 -7 24 0 q12 -7 26 0 q-8 7 -24 6 q-16 3 -26 -6 Z"/>`,
  // The great mass of the church at the left, with its portals, and the spires rising from it.
  `<rect class="bl" x="0" y="${G - 70}" width="188" height="70"/><rect class="bls" x="0" y="${G - 70}" width="188" height="6"/>`,
  `<path class="wn" d="M18 ${G} V${G - 30} q10 -16 20 0 V${G} Z M74 ${G} V${G - 36} q12 -18 24 0 V${G} Z M134 ${G} V${G - 30} q10 -16 20 0 V${G} Z"/>`,
  spire(24, 112, 32, 0),
  spire(62, 144, 36, 1),
  spire(106, 132, 34, 2),
  spire(150, 108, 32, 3),
  // The smaller group at the right.
  `<rect class="bl" x="284" y="${G - 62}" width="116" height="62"/><rect class="bls" x="284" y="${G - 62}" width="116" height="5"/>`,
  `<path class="wn" d="M300 ${G} V${G - 26} q9 -14 18 0 V${G} Z M352 ${G} V${G - 26} q9 -14 18 0 V${G} Z"/>`,
  spire(310, 96, 28, 2),
  spire(348, 118, 30, 0),
  spire(384, 88, 26, 1),
  crane(240, 140),
  `<path class="lit" d="M60 ${G - 120} h3 v7 h-3 Z M104 ${G - 100} h3 v7 h-3 Z M346 ${G - 110} h3 v7 h-3 Z"/>`,
  tree(196, 30),
  tree(214, 40),
  tree(270, 34),
  '<rect class="gnd" x="0" y="' + G + '" width="400" height="295"/>',
  '</svg>',
].join('')

// The glass frosts the panels over the scene: the desktop app blurs what is behind a panel by `blur` points and
// lays a veil over it. The scene shows sharp outside the panels and softened behind them.
const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'sagrada-familia', glass: { blur: 14, opacity: 0.55 } },
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

    return <Svg source={SCENE} alt="The spires of the Sagrada Familia with coloured fruit on top, a building crane and plane trees in the street" isInteractive />
  })
}
