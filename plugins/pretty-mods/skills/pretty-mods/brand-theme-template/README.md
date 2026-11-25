# Brand theme template

A starting point for a theme in a company's own colours, with the company's own logo as a faint backdrop. Use it only for a logo the person has the right to use.

Everything to change is marked `CHANGE:` in `register.tsx.template`.

## How to use it

1. Make a new mod folder, for example `plugins/<company>-theme/`, in the person's **own** repository (private if the brand isn't public). Don't put it in the public pretty-mods repository.
2. Copy this folder's files in: `plugin.json` to `.claude-plugin/`, `hooks.json` and `register.tsx.template` (renamed `register.tsx`) to `hooks/`.
3. Copy `make-colors.js` and `make-colors.d.ts` from the plugin-authoring skill into `hooks/`.
4. Replace the colours, the logo paths and the mod name.
5. Run `claude plugin validate` on the folder, and `tsc -p` if types are laid.

## The logo

- From an uploaded SVG, run `python3 ../scripts/svg_to_logo.py logo.svg` (from the skill folder; add `--mono` for one colour). It prints the shapes to paste into `LOGO` and refuses what can't be drawn.
- It must be pure SVG shapes. A PNG or JPEG can't be embedded, and neither can fonts: turn any wordmark text into outlines first.
- Paste only the `<path>`, `<circle>` and `<rect>` elements into `LOGO`, drawn on a 100 x 100 grid, and leave out the outer `<svg>` tag. `LOGO_COLOR` sets the fill.
- Keep the whole scene under about 131,000 characters, so simplify a detailed logo.
- Keep it small and faint (the template uses 8% opacity, in the upper corner), so the words stay readable. The subject stays off the middle and the foot, where the text and message box sit.
- The template does not move, which is the safest choice.

## Checks that still apply

Validated is not seen. Ask the person to look at it on desktop and phone, with a long code block and a larger text size, and to read the contrast warnings from `makeColors` rather than ignore them.
