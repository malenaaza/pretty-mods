import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { sceneAt, SCENE_COUNTDOWN_PREFIX, SCENE_MIDNIGHT_PREFIX } from './midnight.js'


// Midnight navy with gold and rose accents in dark mode; a pale lavender day with the same accents in light mode.
// Neither mode is forced, so the look follows the mode the person has chosen.
const { theme, problems } = makeColors({
  label: 'New Year',
  roles: { danger: '#b3392f', success: '#2f7d4f', warning: '#a86f14', pro: '#6d4f94', accent: '#b8862b' },
  light: {
    roles: { accent: '#9a6d1a' },
    gray: {
      anchors: {
        'surface-0': '#ebe8f4',
        'surface-1': '#f2f0f9',
        'surface-2': '#f9f8fc',
        'text-primary': '#1c1830',
        'text-secondary': '#3d3857',
        'text-muted': '#56507a',
      },
    },
  },
  dark: {
    roles: { accent: '#e8c060', danger: '#d9695e', success: '#5fb07a', warning: '#d9a441', pro: '#b59be0' },
    gray: {
      anchors: {
        'surface-0': '#0d0f22',
        'surface-1': '#14172e',
        'surface-2': '#1b2039',
        'surface-3': '#21274a',
        'text-primary': '#f6f2ff',
        'text-secondary': '#d3cde6',
        'text-muted': '#aaa3c4',
      },
    },
  },
})

// The scene is drawn on a tall 400 x 800 picture. A wide window shows only its middle band (about y 290 to 510),
// so the skyline stands on the band's bottom edge (y 508), its tallest roofs about 70 units up, and the fireworks sit
// at the left and right edges of the band, where the words are not. A phone shows all of it.
const G = 508

// The year, "2027", drawn as seven-segment digits from plain rectangles, since a theme can't use a font. Each digit is
// `w` wide and `h` tall, with segments `t` thick; the segments are named a (top), b and c (right), d (bottom),
// e and f (left) and g (middle).
const SEGMENTS: Record<string, string> = {
  '0': 'abcdef',
  '1': 'bc',
  '2': 'abged',
  '3': 'abgcd',
  '4': 'fgbc',
  '5': 'afgcd',
  '6': 'afgedc',
  '7': 'abc',
  '8': 'abcdefg',
  '9': 'abcdfg',
}

const digit = (x: number, y: number, w: number, h: number, t: number, value: string): string => {
  const parts: Record<string, [number, number, number, number]> = {
    a: [x + t, y, w - 2 * t, t],
    d: [x + t, y + h - t, w - 2 * t, t],
    g: [x + t, y + h / 2 - t / 2, w - 2 * t, t],
    f: [x, y + t, t, h / 2 - t],
    b: [x + w - t, y + t, t, h / 2 - t],
    e: [x, y + h / 2, t, h / 2 - t],
    c: [x + w - t, y + h / 2, t, h / 2 - t],
  }

  return [...(SEGMENTS[value] ?? '')]
    .map(seg => {
      const [rx, ry, rw, rh] = parts[seg] ?? [0, 0, 0, 0]

      return `<rect x="${rx}" y="${ry}" width="${rw}" height="${rh}" rx="0.6" fill="#f2c14e"/>`
    })
    .join('')
}

// A label (the year, or the minutes left).
// The chat panel covers most of a wide window, so the label stands in the free strip at the right, one digit under
// another, from the band's middle down.
const labelDigits = (label: string): string =>
  [...label].map((value, i) => digit(352, 304 + i * 26, 18, 24, 3.5, value)).join('')

// The label for a scene name: the year at midnight, the minutes in the countdown, nothing otherwise.
const labelFor = (scene: string): string | undefined => {
  if (scene.startsWith(SCENE_MIDNIGHT_PREFIX)) {
    return scene.slice(SCENE_MIDNIGHT_PREFIX.length)
  }
  if (scene.startsWith(SCENE_COUNTDOWN_PREFIX)) {
    return scene.slice(SCENE_COUNTDOWN_PREFIX.length)
  }

  return undefined
}

const BURST_COLOURS = ['#f2c14e', '#ff7a8a', '#7fd1ff', '#c59bff', '#ffffff']

// One firework: a ring of rays and a few sparks, drawn around (0, 0) and placed by the caller. It fades slowly in and
// out on its own beat, so nothing flashes.
const burst = (x: number, y: number, size: number, colour: string, delay: number, rays: number): string => {
  const lines: string[] = []
  for (let i = 0; i < rays; i += 1) {
    const angle = (i / rays) * Math.PI * 2
    const x2 = (Math.cos(angle) * size).toFixed(2)
    const y2 = (Math.sin(angle) * size).toFixed(2)
    lines.push(`<line x1="0" y1="0" x2="${x2}" y2="${y2}" stroke="${colour}" stroke-width="1.3" stroke-linecap="round"/>`)
    lines.push(`<circle cx="${(Math.cos(angle) * size * 1.08).toFixed(2)}" cy="${(Math.sin(angle) * size * 1.08).toFixed(2)}" r="1.4" fill="${colour}"/>`)
  }

  // The position is on the outer group: the CSS animation below scales the inner one, and would replace a transform here.
  return `<g transform="translate(${x} ${y})"><g class="bu" style="animation-delay:${delay}s">${lines.join('')}</g></g>`
}

// A skyline of houses and towers along the bottom. The middle, under the words, stays low and dark.
const SKYLINE = (() => {
  const blocks: Array<[number, number, number]> = [
    [0, 52, 66],
    [48, 36, 92],
    [84, 40, 52],
    [300, 46, 78],
    [342, 40, 60],
    [378, 30, 96],
  ]

  return blocks
    .map(([x, w, h], i) => {
      const top = G - h
      const windows = Array.from({ length: Math.max(1, Math.floor(h / 26)) }, (_, row) =>
        [0.3, 0.7].map(f => `<rect class="wn" x="${x + w * f - 2}" y="${top + 12 + row * 22}" width="4" height="6" fill="#f6d27a" style="animation-delay:${-((i + row) % 7)}s"/>`).join(''),
      ).join('')

      return `<rect x="${x}" y="${top}" width="${w}" height="${h}" fill="#0a0c1c"/>${windows}`
    })
    .join('')
})()

// Confetti: small bits falling slowly, in the same way as the snow.
const CONFETTI = Array.from({ length: 34 }, (_, i) => {
  const x = (i * 83 + 17) % 400
  const colour = BURST_COLOURS[i % BURST_COLOURS.length] ?? '#f2c14e'
  const duration = 16 + ((i * 5) % 11)
  const delay = -((i * 3) % 17)
  const drift = ((i * 11) % 30) - 15
  const rest = (i * 131 + 40) % 800

  return `<rect class="f" x="${x}" y="-10" width="3" height="5" fill="${colour}" style="--d:${drift}px;--y:${rest}px;animation-duration:${duration}s;animation-delay:${delay}s"/>`
}).join('')

// The fireworks: shown only from midnight on, in the scene of the new year.
const FIREWORKS = [
  burst(56, 360, 46, BURST_COLOURS[0] ?? '#f2c14e', 0, 14),
  burst(344, 468, 46, BURST_COLOURS[1] ?? '#ff7a8a', -3.5, 16),
  burst(48, 548, 30, BURST_COLOURS[2] ?? '#7fd1ff', -5, 12),
].join('')

const buildScene = (label: string | undefined, fireworks: boolean): string => [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice">',
  '<defs>',
  '<linearGradient id="dayg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d9d3ef"/><stop offset="0.75" stop-color="#efeaf8"/><stop offset="1" stop-color="#f8f6fc"/></linearGradient>',
  '<linearGradient id="nightg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#05061a"/><stop offset="0.75" stop-color="#14183a"/><stop offset="1" stop-color="#1d2249"/></linearGradient>',
  '</defs>',
  '<style>',
  '.night{display:none}',
  '.f{animation-name:fall;animation-timing-function:linear;animation-iteration-count:infinite}',
  '@keyframes fall{from{transform:translate(0,0)}to{transform:translate(var(--d),830px)}}',
  '.bu{opacity:0;animation:pop 7s ease-in-out infinite}',
  '@keyframes pop{0%,100%{opacity:0;transform:scale(.6)}40%,60%{opacity:.95;transform:scale(1)}}',
  '.wn{animation:glow 6s ease-in-out infinite}',
  '@keyframes glow{0%,100%{opacity:.45}50%{opacity:1}}',
  // At night the sky and the windows are as above; by day the skyline is a soft blue-grey and the windows are off.
  '@media (prefers-color-scheme:dark){.day{display:none}.night{display:inline}.f{opacity:.9}}',
  // Asked to reduce motion, the fireworks stay as bright bursts, the confetti rests at set heights and the windows stay lit.
  '@media (prefers-reduced-motion:reduce){.f{animation:none;transform:translate(0,var(--y))}.bu{animation:none;opacity:.85}.wn{animation:none;opacity:.8}}',
  '</style>',
  '<rect class="day" width="400" height="800" fill="url(#dayg)"/>',
  '<rect class="night" width="400" height="800" fill="url(#nightg)"/>',
  '<g class="night">' +
    Array.from({ length: 26 }, (_, i) => {
      const x = (i * 59 + 23) % 400
      const y = (i * 97 + 11) % 560
      const r = 0.9 + ((i * 3) % 4) * 0.45

      return `<circle cx="${x}" cy="${y}" r="${r}" fill="#f6ecdf" opacity=".7"/>`
    }).join('') +
    '</g>',
  fireworks ? FIREWORKS : '',
  label === undefined ? '' : `<g class="night">${labelDigits(label)}</g>`,
  `<g class="day" opacity=".55">${SKYLINE.replace(/fill="#0a0c1c"/g, 'fill="#b7b0d6"')}</g>`,
  `<g class="night">${SKYLINE}</g>`,
  `<rect x="0" y="${G}" width="400" height="95" fill="#1a1a33" class="night"/>`,
  `<rect x="0" y="${G}" width="400" height="95" fill="#c9c2e6" class="day"/>`,
  CONFETTI,
  '</svg>',
].join('')

// The glass frosts the panels over the scene. The fireworks are at the edges, so the frosted middle leaves them sharp.
const lookFor = (scene: string): ThemeSetArgs => ({
  colors: theme,
  backdrop: { scene, glass: { blur: 14, opacity: 0.55 } },
})

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    // While you build: the line that would stop Desktop painting this look.
    const unpainted = problems.find(line => line.startsWith("Desktop won't paint"))

    if (unpainted !== undefined) {
      $.ui.toast(unpainted)
    }
    let current = sceneAt(new Date())
    const set = await $.theme.set(lookFor(current))

    if (!set.isDrawn) {
      $.ui.status(set.reason)
    }

    // The year appears and goes with the clock: the scene is set again only when the moment changes.
    $.clock.every(60 * 1000, async () => {
      const wanted = sceneAt(new Date())

      if (wanted !== current) {
        current = wanted
        await $.theme.set(lookFor(wanted))
      }
    })


    return next(e)
  })

  on('ui.render', { component: 'Backdrop' }, ($, e, next) => {
    if (e.surface !== 'desktop' && e.surface !== 'mobile') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)
    const label = labelFor(e.props.scene)

    const fireworks = e.props.scene.startsWith(SCENE_MIDNIGHT_PREFIX)

    return <Svg source={buildScene(label, fireworks)} alt="Fireworks over a city skyline at night, with falling confetti" isInteractive />
  })
}
