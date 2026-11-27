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

// Santa, his sleigh and a team of three reindeer, drawn small around (0, 0). The reindeer are on the left and face left, so
// the flight goes from right to left and the reindeer pulls the sleigh. The whole group is tilted 12 degrees, nose up,
// and the flight runs along that tilt, so they climb into the sky as they cross. They rest at the spot given by the outer
// transform, and the slow flight across the sky only moves them sideways. The sky band a wide window shows is
// about y 290 to 510, so they fly through the middle of it. The animation starts partway across (the negative
// delay), so they are on screen when a session opens.
// One reindeer, drawn facing left around (-50, -8) and shifted by `dx`. The first one leads, with the red nose.
// It bobs a little as it flies, each at its own moment. The shift is on the outer group, the bob on the inner one,
// since a CSS animation would replace a transform attribute.
const reindeer = (dx: number, isLead: boolean, index: number): string => {
  const coat = ['#7a5230', '#6b4528', '#84583a'][index % 3]
  const nose = isLead ? '#e03a3a' : '#3d2616'

  return [
    `<g transform="translate(${dx} 0)"><g class="bob" style="animation-delay:${-index * 0.5}s">`,
    `<ellipse cx="-50" cy="-8" rx="14" ry="7" fill="${coat}"/>`,
    `<circle cx="-66" cy="-18" r="5" fill="${coat}"/>`,
    `<circle cx="-71" cy="-17" r="${isLead ? 1.9 : 1.4}" fill="${nose}"/>`,
    `<path d="M-67 -23 L-70 -33 M-67 -23 L-62 -32" stroke="${coat}" stroke-width="1.4" fill="none"/>`,
    `<path d="M-58 -2 L-60 8 M-44 -2 L-42 8" stroke="${coat}" stroke-width="1.6" fill="none"/>`,
    '</g></g>',
  ].join('')
}

const SANTA = [
  // The harness: one line from the lead reindeer back to the sleigh, behind the team.
  '<path d="M-122 -9 L-12 -4" stroke="#d9b45a" stroke-width="1" fill="none"/>',
  reindeer(-84, true, 0),
  reindeer(-42, false, 1),
  reindeer(0, false, 2),
  '<path d="M-14 -2 C-12 8 6 10 24 6 L26 -8 L-6 -8 Z" fill="#b3263b"/>',
  // The runner is flat along the bottom and curls up at the front, on the left, the way the sleigh is going. Two
  // struts join it to the body.
  '<path d="M-4 7 L-4 13 M18 7 L18 12" stroke="#d9b45a" stroke-width="1.3" fill="none"/>',
  '<path d="M30 11 C14 14.5 -4 14.5 -16 12 C-22 10.6 -25 6 -22 2" stroke="#d9b45a" stroke-width="2" stroke-linecap="round" fill="none"/>',
  // Three wrapped presents with ribbons and bows, stacked at the back of the sleigh.
  '<rect x="13" y="-18" width="11" height="10" fill="#2f7d4f"/>',
  '<rect x="17.5" y="-18" width="2.4" height="10" fill="#e8c76a"/>',
  '<rect x="13" y="-14" width="11" height="2.4" fill="#e8c76a"/>',
  '<rect x="22" y="-15" width="9" height="7" fill="#3a5a8a"/>',
  '<rect x="25.4" y="-15" width="2.2" height="7" fill="#f4ead6"/>',
  '<rect x="22" y="-12.4" width="9" height="2" fill="#f4ead6"/>',
  '<rect x="15" y="-23" width="7" height="5" fill="#d23a4d"/>',
  '<rect x="17.7" y="-23" width="1.8" height="5" fill="#e8c76a"/>',
  '<circle cx="16.8" cy="-24.4" r="1.8" fill="#e8c76a"/>',
  '<circle cx="20.4" cy="-24.4" r="1.8" fill="#e8c76a"/>',
  '<circle cx="8" cy="-14" r="7" fill="#b3263b"/>',
  // Santa holds the reins: three thin lines from his hand to the collars of the three reindeer, and an arm
  // stretched forward to the hand, so he is the one pulling on them.
  '<path d="M-9 -10 L-59 -15 M-9 -10 L-101 -15 M-9 -10 L-143 -15" stroke="#e8d9b0" stroke-width="0.9" fill="none"/>',
  '<path d="M3 -15 L-8 -10.5" stroke="#b3263b" stroke-width="4.4" stroke-linecap="round" fill="none"/>',
  '<circle cx="-9.2" cy="-10" r="2.6" fill="#f4dcc4"/>',
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
  '@media (prefers-reduced-motion:reduce){.f{animation:none;transform:translate(0,var(--y))}.sl{animation:none}.bob{animation:none}}',
  '@keyframes fly{from{transform:translate(260px,0)}to{transform:translate(-205px,0)}}',
  '.bob{animation:bob 1.8s ease-in-out infinite}',
  '@keyframes bob{0%,100%{transform:translate(0,0)}50%{transform:translate(0,-2px)}}',
  '</style>',
  '<rect width="400" height="800" fill="url(#sky)"/>',
  FLAKES,
  `<g transform="translate(250 400) rotate(12) scale(1.5)" opacity=".85"><g class="sl">${SANTA}</g></g>`,
  '</svg>',
].join('')

const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'snowfall', glass: { blur: 0, tint: '#0f1f17', opacity: 0.35 } },
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
