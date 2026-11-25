# pretty-mods

Pretty mods for Claude: changes to how Claude looks and what it shows, for the desktop and mobile apps. They start with Christmas, and now kitties.

## Christmas mods

| Mod | What it does |
|---|---|
| `christmas-theme` | A Christmas look: deep pine green with warm cream text, cranberry accents and gold, a slow snowfall, and Santa with his sleigh and a reindeer crossing the sky once every 70 seconds. Dark, in the app's desktop and mobile versions. |
| `christmas-countdown` | Shows "🎄 N days to Christmas" in the status line, and "🎄 Merry Christmas!" on the day. It stays correct if a session is left open past midnight. |

## Kitty mods

| Mod | What it does |
|---|---|
| `kitty-theme` | A cosy kitty look: soft plum night, cream text and rose accents, with a sleepy cat on a moonlit window ledge. Only the tail and the stars move, slowly. Dark, in the app's desktop and mobile versions. |
| `kitty-status` | A little cat in the status line whose mood follows the time of day ("😴 kitty is asleep", "😺 kitty wants breakfast", "😸 kitty is purring"...). |

## Music

| Mod | What it does |
|---|---|
| `now-playing` | Shows "🎵 title - artist" in the status line for the song that's playing. On a Mac it asks the Music app; on Windows it reads the system media controls, so YouTube Music in a browser works, and so do Spotify and most players. It asks your own computer, so it needs no account connection, token or sign-in. Terminal only: not the desktop or phone apps, and nothing shows when nothing is playing. Updates every 15 seconds. |

## The skill that makes mods

`pretty-mods` is a skill: ask Claude for a mod ("make Claude look like a cosy cabin", "a status line with the weather") and it builds one in your own style. The first time it asks a few questions (colours, dark or light, motion, sound) and saves them in `~/.pretty-mods/style.md`, outside the skill, so it never asks twice. It uses Claude's built-in mod-writing skill for the mechanics and adds the checks for desktop and mobile: readable contrast, slow vector-only motion, no flashing, layouts that fit a phone, no sound unless you ask, and an honest note on what could not be checked.

The Christmas and kitty scenes stop moving when your system's "reduce motion" setting is on (tested in a browser render; not yet confirmed in the app). Before showing a moving scene, the skill renders it in a browser at a wide and a phone size (`scripts/render_scene.js`) so cropping and off-screen starts are caught early; the app's own blur and panels are not part of that render. It also carries a template for a theme in a company's own colours with its own logo as a faint backdrop (`plugins/pretty-mods/skills/pretty-mods/brand-theme-template/`). Attach your logo (an SVG works best) and Claude converts it to the plain shapes a theme can draw, refusing anything it can't, such as pictures, text or gradients. Use it only for a logo you have the right to use, and keep that theme in your own repository.

```
/plugin install pretty-mods --marketplace malenaaza/pretty-mods
```

## Plus (coming)

Everything in this repository is free and MIT-licensed, and stays free, including `kitty-theme`. Later, a separate paid set of themes with richer scenes may appear under the name Plus. It would live in its own private repository, not here. Nothing is for sale yet, and no price or date is set.

## Install

**What you need: Claude Code.** These mods work only in Claude Code. The owner tried them with a Claude Free account and they did not work there, so they are not for Free. The themes also need a Claude Code session shown in the desktop app (see below), and `now-playing` needs the Claude Code terminal. Why they fail on Free was not investigated.

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

**In the desktop app, the safest place is a session on your own computer.** `christmas-theme`, installed from a terminal, did not show in a cloud session and did show in a session started with "my own computer" selected (see Status). A copy of `kitty-theme` loaded in a cloud session's own mods folder did show its colours there, so cloud sessions can draw a theme; why the installed one didn't is not known. If you installed from a terminal, install at user scope, then start a new local session in the app.

## How it works

**A mod is a small folder.** Each one lives in `plugins/<name>/` and holds three things:

- `.claude-plugin/plugin.json`: its name, a one-line description and a version.
- `hooks/hooks.json`: points at the mod's code.
- `hooks/register.ts` (or `.tsx`): the code. It says "when this happens in Claude, do that", for example "when a session starts, set the colours" or "every hour, update the status line".

**The marketplace is the list.** `.claude-plugin/marketplace.json` names every mod and where its folder is. When you run `/plugin install <mod> --marketplace malenaaza/pretty-mods`, Claude Code reads that list, finds the folder and installs it. A mod that isn't in the list can't be installed.

**What a mod can change.** There are three kinds here:

- **A look (theme):** colours and a moving scene behind the conversation, for the desktop and mobile apps. The terminal and editors don't draw themes. `christmas-theme` and `kitty-theme` are looks.
- **A status line:** one line of text, which the mod updates itself. `christmas-countdown`, `kitty-status` and `now-playing` are status lines.
- **Running something on your computer:** `now-playing` asks your Music app (Mac) or Windows media controls what's playing. That works in the terminal only.

**Where each works** (what the design says, not yet all confirmed on real devices):

| Mod | Terminal | Desktop app | Phone |
|---|---|---|---|
| `christmas-theme`, `kitty-theme` | no | yes | yes |
| `christmas-countdown`, `kitty-status` | yes | where the app shows a status line | not confirmed |
| `now-playing` | yes | no | no |

**Making or changing one yourself.**

1. Ask Claude, with the `pretty-mods` skill installed: "make Claude look like a cosy cabin". It builds the folder for you in your own style.
2. Or copy a folder in `plugins/` and change it. `kitty-status` is the smallest example.
3. Add it to `.claude-plugin/marketplace.json` and to the tables above.
4. Run `scripts/check.sh`. It validates everything and runs the tests.
5. Raise the `version` in its `plugin.json` when its behaviour changes, so installed copies update.

**For a company theme with a logo,** use the template in `plugins/pretty-mods/skills/pretty-mods/brand-theme-template/`. A theme can only draw plain vector shapes, so a logo has to be an SVG, not a picture.

**Honest limits.** Everything was written in a cloud session with no real screen, so the looks are validated, not seen. See Status below.

## Checking and testing

```
scripts/check.sh
```

It validates the marketplace and every plugin and runs each plugin's tests.

## Status

New. Written in a cloud session, so the looks (Christmas and kitty) have been validated but not yet seen on a real desktop or phone screen. If the snow, the colours or the contrast look wrong on your device, please open an issue and say which device.

Owner's report, Free account: the mods do not work on Claude Free; they work only in Claude Code. Nothing more was tested there, and the cause is not known.

Owner's report, Windows desktop app (app version 6.28899.6, Pro plan): `christmas-theme` installed from a terminal showed nothing in a cloud Code session, and showed once the session was started on the owner's own computer. In a terminal-only session it reports that no client draws themes yet, which is expected. The owner's screenshot of `christmas-theme` 0.2.1 showed Santa, the reindeer and the sleigh on screen but as a blurred blob, because the backdrop glass blurred the whole scene (blur 18). `christmas-theme` 0.2.2 and `kitty-theme` 0.1.3 lower the blur to 2 and the veil to 45%, and Santa is a little more transparent so he doesn't compete with long answers; not yet reported back. With `christmas-theme` 0.2.3 (blur 2, veil 45%) the owner saw Santa less blurred but still not sharp, while the reindeer outside the chat panel was sharp. 0.2.4 and `kitty-theme` 0.1.5 set the blur to 0 and the veil to 35%; not yet reported back. Not yet reported: `kitty-theme`, the phone app, and `christmas-countdown`/`kitty-status` in the desktop app.

`kitty-theme` 0.1.0, same setup: the plum colours showed but the cat did not, because the cat was drawn off screen on a wide window and too dark. 0.1.1 moved it to the right edge, in the visible band, and lightened it. The owner then saw a big cat with half of it in another colour (cause not confirmed: the moon was drawn half grey and the cat was about 320 px wide on a wide window, or a panel of the app may cover part of it). 0.1.2 makes the moon one colour and the cat smaller; not yet reported back.

`now-playing` is tested only on sample text, not on a real Mac or Windows PC; the Windows media-controls script in particular has never been run. On a Mac, the first time it runs macOS may ask to let the terminal control Music; allow it. On Windows it needs Windows PowerShell (`powershell.exe`, built in). If it shows nothing while a song plays, please open an issue and say which system and player.

MIT licence.
