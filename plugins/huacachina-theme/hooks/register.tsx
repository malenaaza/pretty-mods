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

const SCENE = [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice">',
  '<defs>',
  '<linearGradient id="hc-day" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7fc3e0"/><stop offset="0.7" stop-color="#f6e7c2"/><stop offset="1" stop-color="#f9edcf"/></linearGradient>',
  '<linearGradient id="hc-night" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#050a18"/><stop offset="0.7" stop-color="#16213a"/><stop offset="1" stop-color="#2a2a3a"/></linearGradient>',
  '</defs>',
  '<style>',
  '.night{display:none}',
  '.d1{fill:#e9c98a}.d2{fill:#dcb270}.d3{fill:#cc9a58}.sh{fill:#b9843f;opacity:.5}',
  '.gnd{fill:#d9b36f}',
  '.lg{fill:#3fb3b0}.lh{fill:#9be0dc;opacity:.55}.rf{fill:#1f7f7d}',
  '.tk{fill:#6b4a2b}.fr{fill:#2f8a4a}.co{fill:#5a3b22}',
  '.sw{animation:sway 7s ease-in-out infinite}',
  '@keyframes sway{0%,100%{transform:rotate(-2.5deg)}50%{transform:rotate(3deg)}}',
  '.rp{fill:none;stroke:#ffffff;stroke-width:.8;opacity:.5;animation:rip 6s ease-in-out infinite}',
  '@keyframes rip{0%,100%{opacity:.15}50%{opacity:.6}}',
  '.s{fill:#f6ecdf;animation-name:tw;animation-timing-function:ease-in-out;animation-iteration-count:infinite}',
  '@keyframes tw{0%,100%{opacity:.15}50%{opacity:1}}',
  // At night the sand is cool and dark, the lagoon is deep and carries the stars' light, and the palms are near black.
  '@media (prefers-color-scheme:dark){.day{display:none}.night{display:inline}.d1{fill:#3b3a4a}.d2{fill:#2d2c3c}.d3{fill:#22212f}.sh{fill:#000;opacity:.35}.gnd{fill:#26242f}.lg{fill:#123e4d}.lh{fill:#9bd7e6;opacity:.3}.rf{fill:#0c2b36}.tk{fill:#1b1410}.fr{fill:#12301f}.co{fill:#0f0a07}.rp{stroke:#bfe6f2;opacity:.35}}',
  // Asked to reduce motion, the palms and the ripples rest and the stars stay still.
  '@media (prefers-reduced-motion:reduce){.sw,.rp,.s{animation:none}}',
  '</style>',
  '<rect class="day" width="400" height="800" fill="url(#hc-day)"/>',
  '<rect class="night" width="400" height="800" fill="url(#hc-night)"/>',
  `<g class="night">${STARS}<circle cx="300" cy="332" r="18" fill="#f3e6c8" opacity=".92"/></g>`,
  '<circle class="day" cx="300" cy="336" r="24" fill="#fff3c4" opacity=".95"/>',
  // Three rows of dunes, the far ones paler. A thin shaded side gives each ridge its edge.
  `<path class="d1" d="M0 ${G - 110} Q70 ${G - 150} 150 ${G - 104} T290 ${G - 118} T400 ${G - 96} L400 ${G} L0 ${G} Z"/>`,
  `<path class="d2" d="M0 ${G - 72} Q90 ${G - 120} 190 ${G - 70} T400 ${G - 80} L400 ${G} L0 ${G} Z"/>`,
  `<path class="sh" d="M190 ${G - 70} Q290 ${G - 110} 400 ${G - 80} L400 ${G - 60} Q300 ${G - 88} 210 ${G - 54} Z"/>`,
  `<path class="d3" d="M0 ${G - 40} Q110 ${G - 72} 220 ${G - 36} T400 ${G - 44} L400 ${G} L0 ${G} Z"/>`,
  // The lagoon, with a reed edge and a few ripples.
  `<ellipse class="rf" cx="200" cy="${G - 6}" rx="150" ry="15"/>`,
  `<ellipse class="lg" cx="200" cy="${G - 8}" rx="140" ry="11"/>`,
  `<path class="lh" d="M90 ${G - 10} Q130 ${G - 14} 170 ${G - 10} Q130 ${G - 7} 90 ${G - 10} Z"/>`,
  `<path class="rp" d="M200 ${G - 8} Q230 ${G - 12} 262 ${G - 8} M150 ${G - 4} Q180 ${G - 7} 212 ${G - 4}"/>`,
  palm(42, 96, 16, 0),
  palm(72, 70, -12, -2),
  palm(354, 104, -18, -1),
  palm(330, 64, 10, -3),
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
