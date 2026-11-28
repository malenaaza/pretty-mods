import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'

// Misty green greys with a terracotta accent. Both modes are given and none is forced: a bright morning in light
// mode, a starry night in dark mode.
const { theme, problems } = makeColors({
  label: 'Machu Picchu',
  roles: { danger: '#b3392f', success: '#2f7d4f', warning: '#a86f14', pro: '#6d4f94', accent: '#a8532a' },
  light: {
    gray: {
      anchors: {
        'surface-0': '#e3ece3',
        'surface-1': '#ecf3ea',
        'surface-2': '#f6faf4',
        'text-primary': '#16251c',
        'text-secondary': '#35493c',
        'text-muted': '#4d6354',
      },
    },
  },
  dark: {
    roles: { accent: '#e08a52', danger: '#d9695e', success: '#5fb07a', warning: '#d9a441', pro: '#a58bd0' },
    gray: {
      anchors: {
        'surface-0': '#0b1713',
        'surface-1': '#11211b',
        'surface-2': '#172b23',
        'surface-3': '#1b3228',
        'text-primary': '#e8f1ea',
        'text-secondary': '#c0d2c6',
        'text-muted': '#9db3a4',
      },
    },
  },
})

// The scene is drawn on a tall 400 x 800 picture. A wide window shows only its middle band (about y 290 to 510), so
// the ground line is at y 505 and everything stands in that band; a phone shows all of it. The ruins stand at the
// left edge and the llamas at the right, outside the middle where the chat panel usually is.
const G = 505

// An Inca stone house standing on a terrace, drawn front-on around its foot at (x, y): fitted stone in courses with
// staggered joints, a trapezoid doorway and two window niches, and either a steep thatched roof or no roof, as in
// the houses that are only walls today.
const house = (x: number, y: number, width: number, height: number, roof: number): string => {
  const top = y - height
  const courses = [0.25, 0.5, 0.75]
  const joints = courses
    .map((c, i) => {
      const jy = top + height * c
      const step = width / 4

      return Array.from({ length: 3 }, (_, k) => `M${x + step * (k + 1) - (i % 2) * (step / 2)} ${jy - height * 0.25} V${jy}`).join('')
    })
    .join('')
  const door = `M${x + width * 0.4} ${y} L${x + width * 0.43} ${y - height * 0.55} H${x + width * 0.57} L${x + width * 0.6} ${y} Z`
  const niche = (cx: number): string =>
    `M${cx - width * 0.05} ${top + height * 0.35} L${cx - width * 0.035} ${top + height * 0.15} H${cx + width * 0.035} L${cx + width * 0.05} ${top + height * 0.35} Z`

  return [
    `<rect class="st" x="${x}" y="${top}" width="${width}" height="${height}"/>`,
    `<path class="sc" d="M${x} ${top + height * 0.25} H${x + width} M${x} ${top + height * 0.5} H${x + width} M${x} ${top + height * 0.75} H${x + width}${joints}"/>`,
    `<path class="dr" d="${door}"/>`,
    `<path class="dr" d="${niche(x + width * 0.18)}${niche(x + width * 0.82)}"/>`,
    roof > 0
      ? `<path class="rf" d="M${x - 3} ${top} L${x + width / 2} ${top - roof} L${x + width + 3} ${top} Z"/><path class="rl" d="M${x + width * 0.2} ${top - roof * 0.4} L${x + width * 0.05} ${top} M${x + width * 0.5} ${top - roof * 0.9} V${top} M${x + width * 0.8} ${top - roof * 0.4} L${x + width * 0.95} ${top}"/>`
      : `<path class="st" d="M${x} ${top} L${x + width * 0.5} ${top - height * 0.28} L${x + width} ${top} Z"/>`,
  ].join('')
}

// A stepped terrace: a green band with its stone retaining wall under it, from the left edge to x + width.
const terrace = (y: number, width: number): string =>
  `<rect class="tg" x="0" y="${y}" width="${width}" height="8"/><rect class="st" x="0" y="${y + 8}" width="${width}" height="12"/><path class="sc" d="M0 ${y + 14} H${width} M0 ${y + 18} H${width}"/>`

// A llama standing in profile, facing left, around (0, 0) at its feet.
const llama = (x: number, scale: number): string =>
  [
    `<g transform="translate(${x} ${G}) scale(${scale})">`,
    '<ellipse class="ss" cx="2" cy="0" rx="24" ry="3.4"/>',
    // Legs, body, long neck, head and ears.
    '<path d="M-13 -22 V0 M-6 -22 V0 M9 -22 V0 M16 -22 V0" class="lw" stroke-width="3.2" stroke-linecap="round" fill="none"/>',
    '<ellipse class="lw" cx="2" cy="-28" rx="21" ry="12"/>',
    '<path class="lw" d="M-14 -32 Q-22 -46 -22 -58 L-14 -58 Q-14 -44 -6 -34 Z"/>',
    '<ellipse class="lw" cx="-19" cy="-60" rx="8" ry="5.4"/>',
    '<path class="lw" d="M-22 -64 L-24 -73 L-19 -66 M-17 -65 L-16 -74 L-13 -65"/>',
    '<circle cx="-22" cy="-61" r="1.2" fill="#2a1d14"/>',
    // A woven blanket on its back.
    '<path d="M-8 -37 Q2 -41 14 -37 L13 -24 Q2 -21 -7 -24 Z" fill="#c2503a"/><path d="M-7 -31 Q3 -34 13 -31" stroke="#f2c14e" stroke-width="2" fill="none"/>',
    '</g>',
  ].join('')

const STARS = Array.from({ length: 24 }, (_, i) => {
  const x = (i * 59 + 23) % 400
  const y = (i * 97 + 11) % 560
  const r = 2 + ((i * 3) % 4) * 0.9
  const duration = 5 + ((i * 3) % 5)
  const delay = -((i * 5) % 9)
  const d = `M${x} ${y - r}Q${x} ${y} ${x + r} ${y}Q${x} ${y} ${x} ${y + r}Q${x} ${y} ${x - r} ${y}Q${x} ${y} ${x} ${y - r}Z`

  return `<path class="s" d="${d}" style="animation-duration:${duration}s;animation-delay:${delay}s"/>`
}).join('')

// Mist drifting slowly across the ridges: soft stacked ovals that slide sideways and back.
const mist = (x: number, y: number, rx: number, ry: number, delay: number, duration: number): string =>
  [
    `<g class="m" style="animation-duration:${duration}s;animation-delay:${delay}s">`,
    `<ellipse class="mi" cx="${x}" cy="${y}" rx="${rx}" ry="${ry}"/>`,
    `<ellipse class="mi" cx="${x + rx * 0.4}" cy="${y - ry * 0.7}" rx="${rx * 0.6}" ry="${ry * 0.8}"/>`,
    '</g>',
  ].join('')

const MIST = [mist(60, 462, 120, 11, 0, 60), mist(310, 438, 100, 9, -20, 75), mist(270, 486, 130, 8, -35, 90), mist(350, 396, 80, 7, -10, 70)].join('')

const SCENE = [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice">',
  '<defs>',
  '<linearGradient id="mp-day" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9fcbe0"/><stop offset="0.7" stop-color="#e2eedf"/><stop offset="1" stop-color="#f3f4dd"/></linearGradient>',
  '<linearGradient id="mp-night" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#060d1a"/><stop offset="0.7" stop-color="#13263a"/><stop offset="1" stop-color="#1d3340"/></linearGradient>',
  '</defs>',
  '<style>',
  '.night{display:none}',
  '.far{fill:#9dbcc2}.mid{fill:#6fa282}.near{fill:#4b8661}.peak{fill:#4f8a62}.pk-shade{fill:#376b4a}.gr{stroke:#2c5a3d;stroke-width:1.6;fill:none;opacity:.55}.rk{fill:#8f9a8f}.rf{fill:#c9a45c}.rl{stroke:#a8823f;stroke-width:1;fill:none}',
  '.gnd{fill:#5b9a55}',
  '.st{fill:#bdb5a2}.sc{stroke:#9a927e;stroke-width:.9;fill:none}.dr{fill:#4a4437}',
  '.tg{fill:#86b85e}',
  '.lw{fill:#d8c7a4;stroke:#d8c7a4}.ss{fill:#2f5a3a;opacity:.35}',
  '.mi{fill:#ffffff;opacity:.62}',
  '.m{animation-name:drift;animation-timing-function:ease-in-out;animation-iteration-count:infinite;animation-direction:alternate}',
  '@keyframes drift{from{transform:translateX(-26px)}to{transform:translateX(26px)}}',
  '.s{fill:#f6ecdf;animation-name:tw;animation-timing-function:ease-in-out;animation-iteration-count:infinite}',
  '@keyframes tw{0%,100%{opacity:.15}50%{opacity:1}}',
  // At night the ridges are deep blue-green, the stone is cool, and the mist is thin and pale.
  '@media (prefers-color-scheme:dark){.day{display:none}.night{display:inline}.far{fill:#1b3340}.mid{fill:#163429}.near{fill:#10261e}.peak{fill:#12291f}.pk-shade{fill:#0a1b14}.gr{stroke:#071510}.rk{fill:#38433d}.rf{fill:#4a4128}.rl{stroke:#332c1b}.gnd{fill:#0f2a1f}.st{fill:#5d675f}.sc{stroke:#454e48}.dr{fill:#0b1511}.tg{fill:#1c4a31}.lw{fill:#8d8672;stroke:#8d8672}.ss{fill:#000;opacity:.4}.mi{fill:#b9d0d8;opacity:.22}}',
  // Asked to reduce motion, the mist rests and the stars stay still.
  '@media (prefers-reduced-motion:reduce){.m,.s{animation:none}}',
  '</style>',
  '<rect class="day" width="400" height="800" fill="url(#mp-day)"/>',
  '<rect class="night" width="400" height="800" fill="url(#mp-night)"/>',
  `<g class="night">${STARS}<circle cx="318" cy="338" r="18" fill="#f3e6c8" opacity=".92"/></g>`,
  '<circle class="day" cx="318" cy="340" r="22" fill="#fff0b8" opacity=".95"/>',
  // The far ridges, the forested ridge, and the great peak behind the ruins (Huayna Picchu stands at the right).
  `<path class="far" d="M0 ${G - 104} L30 ${G - 134} L52 ${G - 120} L92 ${G - 156} L130 ${G - 128} L172 ${G - 164} L212 ${G - 134} L256 ${G - 150} L330 ${G - 118} L400 ${G - 126} L400 ${G} L0 ${G} Z"/>`,
  // The peak is drawn tall and squeezed to fit the visible band, with its foot kept on the ground line.
  `<g transform="translate(0 ${G}) scale(1 0.84) translate(0 ${-G})">`,
  `<path class="peak" d="M214 ${G} L238 ${G - 70} Q250 ${G - 128} 264 ${G - 168} Q274 ${G - 206} 300 ${G - 214} Q322 ${G - 212} 332 ${G - 170} Q344 ${G - 120} 352 ${G - 80} Q366 ${G - 38} 400 ${G} Z"/>`,
  `<path class="pk-shade" d="M300 ${G - 214} Q322 ${G - 212} 332 ${G - 170} Q344 ${G - 120} 352 ${G - 80} Q366 ${G - 38} 400 ${G} L338 ${G} Q332 ${G - 92} 318 ${G - 150} Q310 ${G - 188} 300 ${G - 214} Z"/>`,
  // Steep grooves down the slopes, a few bare rock outcrops and the little ruin on the summit.
  `<path class="gr" d="M292 ${G - 206} Q282 ${G - 150} 272 ${G - 90} M304 ${G - 210} Q300 ${G - 140} 296 ${G - 70} M318 ${G - 196} Q322 ${G - 130} 330 ${G - 60} M262 ${G - 150} Q252 ${G - 100} 244 ${G - 50}"/>`,
  `<path class="rk" d="M276 ${G - 184} l10 -6 l8 4 l-4 8 Z M322 ${G - 150} l8 -5 l6 6 l-6 5 Z M262 ${G - 120} l9 -5 l6 6 l-8 5 Z"/>`,
  `<rect class="st" x="294" y="${G - 220}" width="9" height="6"/><rect class="st" x="305" y="${G - 218}" width="6" height="5"/>`,
  '</g>',
  `<path class="mid" d="M0 ${G - 64} Q70 ${G - 104} 140 ${G - 86} Q210 ${G - 70} 262 ${G - 42} L400 ${G - 34} L400 ${G} L0 ${G} Z"/>`,
  MIST,
  // The city climbs the left hillside on four terraces: houses with thatched roofs among others left as walls.
  terrace(G - 112, 124),
  house(8, G - 112, 34, 22, 13),
  house(50, G - 112, 28, 18, 0),
  terrace(G - 88, 168),
  house(6, G - 88, 40, 24, 15),
  house(58, G - 88, 30, 20, 0),
  house(100, G - 88, 36, 22, 13),
  terrace(G - 64, 212),
  house(14, G - 64, 44, 26, 16),
  house(72, G - 64, 36, 22, 0),
  house(122, G - 64, 44, 24, 14),
  terrace(G - 40, 256),
  house(8, G - 40, 36, 20, 0),
  house(58, G - 40, 50, 24, 15),
  house(150, G - 40, 40, 20, 12),
  `<path class="near" d="M0 ${G - 18} Q120 ${G - 34} 230 ${G - 18} T400 ${G - 22} L400 ${G} L0 ${G} Z"/>`,
  llama(360, 0.9),
  llama(318, 0.7),
  '<rect class="gnd" x="0" y="' + G + '" width="400" height="295"/>',
  '</svg>',
].join('')

// The glass frosts the panels over the scene: the desktop app blurs what is behind a panel by `blur` points and
// lays a veil over it. The scene shows sharp outside the panels and softened behind them.
const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'machu-picchu', glass: { blur: 14, opacity: 0.55 } },
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

    return <Svg source={SCENE} alt="Stone terraces and ruins on a green ridge in mist, with a high peak and two llamas" isInteractive />
  })
}
