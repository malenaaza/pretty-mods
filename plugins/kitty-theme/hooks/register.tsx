import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'

// Plum night, warm cream text, rose as the accent.
const { theme, problems } = makeColors({
  label: 'Kitty',
  roles: { accent: '#d9779b', danger: '#c0392b', success: '#4f8a63', warning: '#b8832b', pro: '#8f72c4' },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#1b1524',
        'surface-1': '#231c2e',
        'surface-2': '#2b2338',
        'surface-3': '#31283e',
        'text-primary': '#f6ecdf',
        'text-secondary': '#d8cdc4',
        'text-muted': '#b8aebb',
      },
    },
  },
  only: 'dark',
})

// A window at night: moon, a few stars, and a cat sitting on a ledge. Only the tail and the stars move, slowly.
// A wide window shows only the middle band of this tall picture (about y 290 to 510), and a phone shows nearly all
// of it, so the moon and the cat sit in that band, the cat at the right edge where the words aren't.
const STARS = Array.from({ length: 30 }, (_, i) => {
  const x = (i * 59 + 23) % 400
  const y = (i * 97 + 11) % 800
  const r = 2.4 + ((i * 3) % 4) * 1.1
  const duration = 5 + ((i * 3) % 5)
  const delay = -((i * 5) % 9)
  // A four-pointed sparkle: four curves that bend in towards the middle.
  const d = `M${x} ${y - r}Q${x} ${y} ${x + r} ${y}Q${x} ${y} ${x} ${y + r}Q${x} ${y} ${x - r} ${y}Q${x} ${y} ${x} ${y - r}Z`

  return `<path class="s" d="${d}" style="animation-duration:${duration}s;animation-delay:${delay}s"/>`
}).join('')

const SCENE = [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice">',
  '<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">',
  '<stop offset="0" stop-color="#151021"/><stop offset="1" stop-color="#2d2140"/>',
  '</linearGradient></defs>',
  '<style>',
  '.s{fill:#f6ecdf;animation-name:tw;animation-timing-function:ease-in-out;animation-iteration-count:infinite}',
  '@keyframes tw{0%,100%{opacity:.15}50%{opacity:1}}',
  '.t{transform-origin:26px -2px;animation:sway 4.5s ease-in-out infinite}',
  '@keyframes sway{0%,100%{transform:rotate(-8deg)}50%{transform:rotate(10deg)}}',
  // Asked to reduce motion, the stars and the tail stay still.
  '@media (prefers-reduced-motion:reduce){.s,.t{animation:none}}',
  '</style>',
  '<rect width="400" height="800" fill="url(#sky)"/>',
  STARS,
  '<circle cx="80" cy="350" r="30" fill="#f3e6c8" opacity=".92"/>',
  '<circle cx="70" cy="342" r="6" fill="#d9c9a4" opacity=".5"/>',
  '<circle cx="92" cy="362" r="4" fill="#d9c9a4" opacity=".5"/>',
  // The cat is drawn around (0, 0) at the ledge, then placed and made smaller: a wide window magnifies the scene.
  '<g transform="translate(300 455) scale(0.7)">',
  '<rect x="-95" y="0" width="215" height="9" rx="2" fill="#4a3b68"/>',
  '<g fill="#6a5791">',
  '<path class="t" d="M26 -2 C57 -4 61 -34 45 -50 C53 -28 41 -12 25 -12 Z"/>',
  '<ellipse cx="0" cy="-24" rx="28" ry="24"/>',
  '<circle cx="-29" cy="-54" r="18"/>',
  '<path d="M-44 -67 L-41 -90 L-28 -73 Z M-28 -73 L-15 -90 L-12 -65 Z"/>',
  '</g>',
  '<circle cx="-35" cy="-55" r="2.2" fill="#f3e6c8"/>',
  '<circle cx="-23" cy="-55" r="2.2" fill="#f3e6c8"/>',
  '</g>',
  '</svg>',
].join('')

const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'kitty-window', glass: { blur: 0, tint: '#1b1524', opacity: 0.35 } },
  overrideColorScheme: 'dark',
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
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

    return <Svg source={SCENE} alt="A cat sitting on a window ledge on a moonlit night" isInteractive />
  })
}
