# pretty-mods

Pretty mods for Claude: changes to how Claude looks and what it shows, for the desktop and mobile apps. They start with Christmas, and now kitties.

## Christmas mods

| Mod | What it does |
|---|---|
| `christmas-theme` | A Christmas look: deep pine green with warm cream text, cranberry accents and gold, and a slow snowfall behind the conversation. Dark, in the app's desktop and mobile versions. |
| `christmas-countdown` | Shows "🎄 N days to Christmas" in the status line, and "🎄 Merry Christmas!" on the day. It stays correct if a session is left open past midnight. |

## Kitty mods

| Mod | What it does |
|---|---|
| `kitty-theme` | A cosy kitty look: soft plum night, cream text and rose accents, with a sleepy cat on a moonlit window ledge. Only the tail and the stars move, slowly. Dark, in the app's desktop and mobile versions. |
| `kitty-status` | A little cat in the status line whose mood follows the time of day ("😴 kitty is asleep", "😺 kitty wants breakfast", "😸 kitty is purring"...). |

## Music

| Mod | What it does |
|---|---|
| `now-playing` | Shows "🎵 title - artist" in the status line for the song playing in the Music app (Apple Music) on your Mac. It asks the app on your own Mac, so it needs no account connection, token or sign-in. Terminal on a Mac only: not the desktop or phone apps, and nothing shows when the app is closed or paused. Updates every 15 seconds. |

## The skill that makes mods

`pretty-mods` is a skill: ask Claude for a mod ("make Claude look like a cosy cabin", "a status line with the weather") and it builds one in your own style. The first time it asks a few questions (colours, dark or light, motion, sound) and saves them in `~/.pretty-mods/style.md`, outside the skill, so it never asks twice. It uses Claude's built-in mod-writing skill for the mechanics and adds the checks for desktop and mobile: readable contrast, slow vector-only motion, no flashing, layouts that fit a phone, no sound unless you ask, and an honest note on what could not be checked.

It also carries a template for a theme in a company's own colours with its own logo as a faint backdrop (`plugins/pretty-mods/skills/pretty-mods/brand-theme-template/`). Attach your logo (an SVG works best) and Claude converts it to the plain shapes a theme can draw, refusing anything it can't, such as pictures, text or gradients. Use it only for a logo you have the right to use, and keep that theme in your own repository.

```
/plugin install pretty-mods --marketplace malenaaza/pretty-mods
```

## Plus (coming)

Everything in this repository is free and MIT-licensed, and stays free, including `kitty-theme`. Later, a separate paid set of themes with richer scenes may appear under the name Plus. It would live in its own private repository, not here. Nothing is for sale yet, and no price or date is set.

## Install

In Claude Code, type these (for each mod you want):

```
/plugin install christmas-theme --marketplace malenaaza/pretty-mods
```

```
/plugin install christmas-countdown --marketplace malenaaza/pretty-mods
```

```
/plugin install kitty-theme --marketplace malenaaza/pretty-mods
```

```
/plugin install kitty-status --marketplace malenaaza/pretty-mods
```

```
/plugin install now-playing --marketplace malenaaza/pretty-mods
```

It asks once to add the marketplace (`y`), then for a scope. Start a new session afterwards.

The theme is drawn by the desktop and mobile apps. The terminal and editors don't draw themes, so there only the countdown shows.

## Checking and testing

```
scripts/check.sh
```

It validates the marketplace and every plugin and runs each plugin's tests.

## Status

New. Written in a cloud session, so the looks (Christmas and kitty) have been validated but not yet seen on a real desktop or phone screen. If the snow, the colours or the contrast look wrong on your device, please open an issue and say which device.

`now-playing` is tested only on sample text, not on a real Mac with the Music app. The first time it runs, macOS may ask to let the terminal control Music; allow it. If it shows nothing while a song plays, please open an issue.

MIT licence.
