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

// A stone wall, drawn as a long low block with a few darker courses, and a trapezoid doorway like the Inca ones.
const wall = (x: number, y: number, width: number, height: number, door: boolean): string =>
  [
    `<rect class="st" x="${x}" y="${y}" width="${width}" height="${height}"/>`,
    `<path class="sc" d="M${x} ${y + height * 0.34} H${x + width} M${x} ${y + height * 0.67} H${x + width}" />`,
    door
      ? `<path class="dr" d="M${x + width * 0.4} ${y + height} L${x + width * 0.44} ${y + height * 0.3} H${x + width * 0.56} L${x + width * 0.6} ${y + height} Z"/>`
      : '',
  ].join('')

// A stepped terrace: a green band with a stone face under it.
const terrace = (x: number, y: number, width: number): string =>
  `<rect class="tg" x="${x}" y="${y}" width="${width}" height="7"/><rect class="st" x="${x}" y="${y + 7}" width="${width}" height="9"/>`

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
  '.far{fill:#9dbcc2}.mid{fill:#6fa282}.near{fill:#4b8661}.peak{fill:#5d9470}.pk-shade{fill:#437a58}',
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
  '@media (prefers-color-scheme:dark){.day{display:none}.night{display:inline}.far{fill:#1b3340}.mid{fill:#163429}.near{fill:#10261e}.peak{fill:#143027}.pk-shade{fill:#0e231b}.gnd{fill:#0f2a1f}.st{fill:#5d675f}.sc{stroke:#454e48}.dr{fill:#0b1511}.tg{fill:#1c4a31}.lw{fill:#8d8672;stroke:#8d8672}.ss{fill:#000;opacity:.4}.mi{fill:#b9d0d8;opacity:.22}}',
  // Asked to reduce motion, the mist rests and the stars stay still.
  '@media (prefers-reduced-motion:reduce){.m,.s{animation:none}}',
  '</style>',
  '<rect class="day" width="400" height="800" fill="url(#mp-day)"/>',
  '<rect class="night" width="400" height="800" fill="url(#mp-night)"/>',
  `<g class="night">${STARS}<circle cx="318" cy="338" r="18" fill="#f3e6c8" opacity=".92"/></g>`,
  '<circle class="day" cx="318" cy="340" r="22" fill="#fff0b8" opacity=".95"/>',
  // The far ridges and the great peak behind the ruins (Huayna Picchu stands at the right).
  `<path class="far" d="M0 ${G - 90} L60 ${G - 122} L120 ${G - 96} L190 ${G - 128} L260 ${G - 100} L400 ${G - 118} L400 ${G} L0 ${G} Z"/>`,
  `<path class="peak" d="M226 ${G} Q252 ${G - 58} 262 ${G - 108} Q272 ${G - 172} 302 ${G - 170} Q328 ${G - 162} 334 ${G - 104} Q350 ${G - 52} 382 ${G} Z"/>`,
  `<path class="pk-shade" d="M302 ${G - 170} Q328 ${G - 162} 334 ${G - 104} Q350 ${G - 52} 382 ${G} L336 ${G} Q326 ${G - 80} 302 ${G - 170} Z"/>`,
  `<path class="mid" d="M0 ${G - 56} Q90 ${G - 96} 170 ${G - 62} T330 ${G - 52} L400 ${G - 40} L400 ${G} L0 ${G} Z"/>`,
  MIST,
  // The ruins climb the left hillside on terraces.
  terrace(0, G - 74, 150),
  terrace(0, G - 54, 170),
  terrace(0, G - 34, 190),
  wall(14, G - 94, 52, 20, true),
  wall(76, G - 90, 40, 16, false),
  wall(10, G - 70, 40, 16, false),
  wall(60, G - 52, 56, 18, true),
  wall(22, G - 30, 70, 20, true),
  wall(110, G - 34, 50, 18, false),
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
