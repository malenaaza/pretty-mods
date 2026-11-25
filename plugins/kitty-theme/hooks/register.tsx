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
const STARS = Array.from({ length: 36 }, (_, i) => {
  const x = (i * 59 + 23) % 400
  const y = (i * 97 + 11) % 800
  const r = 0.9 + ((i * 3) % 4) * 0.45
  const delay = -((i * 5) % 9)

  return `<circle class="s" cx="${x}" cy="${y}" r="${r}" style="animation-delay:${delay}s"/>`
}).join('')

const SCENE = [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice">',
  '<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">',
  '<stop offset="0" stop-color="#151021"/><stop offset="1" stop-color="#2d2140"/>',
  '</linearGradient></defs>',
  '<style>',
  '.s{fill:#f6ecdf;animation:tw 9s ease-in-out infinite}',
  '@keyframes tw{0%,100%{opacity:.35}50%{opacity:.9}}',
  '.t{transform-origin:357px 470px;animation:sway 7s ease-in-out infinite}',
  '@keyframes sway{0%,100%{transform:rotate(-5deg)}50%{transform:rotate(6deg)}}',
  '</style>',
  '<rect width="400" height="800" fill="url(#sky)"/>',
  STARS,
  '<circle cx="85" cy="350" r="34" fill="#f3e6c8" opacity=".92"/>',
  '<circle cx="73" cy="341" r="30" fill="#1c1529" opacity=".16"/>',
  '<rect x="236" y="470" width="164" height="9" rx="2" fill="#4a3b68"/>',
  '<g fill="#6a5791">',
  '<path class="t" d="M357 468 C388 466 392 436 376 420 C384 442 372 458 356 458 Z"/>',
  '<ellipse cx="331" cy="446" rx="28" ry="24"/>',
  '<circle cx="302" cy="416" r="18"/>',
  '<path d="M287 403 L290 380 L303 397 Z M303 397 L316 380 L319 405 Z"/>',
  '</g>',
  '<circle cx="296" cy="415" r="2.2" fill="#f3e6c8"/>',
  '<circle cx="308" cy="415" r="2.2" fill="#f3e6c8"/>',
  '</svg>',
].join('')

const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'kitty-window', glass: { blur: 18, tint: '#1b1524', opacity: 0.5 } },
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
