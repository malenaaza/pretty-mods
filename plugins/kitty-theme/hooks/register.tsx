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

// A window at night: moon, a few stars, and a cat sitting on the ledge. Only the tail and the stars move, slowly.
const STARS = Array.from({ length: 24 }, (_, i) => {
  const x = (i * 59 + 23) % 400
  const y = (i * 37 + 11) % 420
  const r = 0.8 + ((i * 3) % 4) * 0.4
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
  '@keyframes tw{0%,100%{opacity:.25}50%{opacity:.8}}',
  '.t{transform-origin:292px 700px;animation:sway 7s ease-in-out infinite}',
  '@keyframes sway{0%,100%{transform:rotate(-5deg)}50%{transform:rotate(6deg)}}',
  '</style>',
  '<rect width="400" height="800" fill="url(#sky)"/>',
  STARS,
  '<circle cx="300" cy="150" r="42" fill="#f3e6c8" opacity=".9"/>',
  '<circle cx="286" cy="140" r="38" fill="#1c1529" opacity=".18"/>',
  '<rect x="0" y="716" width="400" height="84" fill="#120d1a"/>',
  '<rect x="0" y="710" width="400" height="8" fill="#241b31"/>',
  '<g fill="#0c0812">',
  '<path class="t" d="M290 704 C340 700 352 650 330 626 C348 656 322 690 288 692 Z"/>',
  '<ellipse cx="250" cy="680" rx="46" ry="34"/>',
  '<circle cx="214" cy="636" r="26"/>',
  '<path d="M194 620 L198 592 L214 612 Z M214 612 L230 592 L234 620 Z"/>',
  '</g>',
  '</svg>',
].join('')

const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'kitty-window', glass: { blur: 18, tint: '#1b1524', opacity: 0.74 } },
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
