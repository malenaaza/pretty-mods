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

  return `<circle class="f" cx="${x}" cy="-10" r="${r}" style="--d:${drift}px;animation-duration:${duration}s;animation-delay:${delay}s"/>`
}).join('')

const SCENE = [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice">',
  '<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">',
  '<stop offset="0" stop-color="#0a1812"/><stop offset="1" stop-color="#173626"/>',
  '</linearGradient></defs>',
  '<style>',
  '.f{fill:#fffaf0;opacity:.85;animation-name:fall;animation-timing-function:linear;animation-iteration-count:infinite}',
  '@keyframes fall{from{transform:translate(0,0)}to{transform:translate(var(--d),830px)}}',
  '</style>',
  '<rect width="400" height="800" fill="url(#sky)"/>',
  FLAKES,
  '</svg>',
].join('')

const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'snowfall', glass: { blur: 18, tint: '#0f1f17', opacity: 0.72 } },
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
