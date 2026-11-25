# pretty-mods

Pretty mods for Claude Code: changes to how it looks and what it shows. A Christmas look with Santa, a kitty look with a cat on a moonlit ledge, a few status-line extras, and a skill that makes mods in your own style. Everything here is free.

[Español](README.es.md)

## Before you start

- **You need Claude Code.** These mods work only in Claude Code. They did not work on a Claude Free account when the owner tried.
- **Looks (themes) show only in the Claude desktop app**, in a Claude Code session. The terminal and editors don't draw themes. Use a session **on your own computer**: a session that runs in the cloud may show an older copy of a theme, or none.
- **Only one theme at a time.** If two are on, the later one wins.
- Not for everyone yet: it has been tried on one Windows PC. Mac and phone are untested.

## What works where

"Seen" means the owner reported seeing it. Everything else was checked only by tools, not by eye.

| Mod | Where it shows | Seen? |
|---|---|---|
| `christmas-theme` | Claude desktop app, in a Claude Code session on your own computer | Yes, on Windows (version 0.2.4 "looks good", and Santa is sharp). Phone: not tested |
| `kitty-theme` | Same as above | Colours seen; the cat has been reworked since and is not yet reported |
| `christmas-countdown`, `kitty-status` | The status line, wherever Claude Code shows one | Not individually reported |
| `now-playing` | The status line in the Claude Code terminal (Mac: Music app; Windows: any player that reports to the system media controls, such as YouTube Music in a browser) | No. Never run on a real Mac or Windows PC |

## The mods

### Christmas

![Preview of christmas-theme: a pine-green night with snow, Santa's sleigh and a reindeer](docs/previews/christmas-theme.png)

*Preview of the scene alone, drawn in a browser. The app adds its own blur and panels on top, so it looks different there. It is not a screenshot of anyone's screen.*

| Mod | What it does |
|---|---|
| `christmas-theme` | Deep pine green with warm cream text, cranberry accents and gold, a slow snowfall, and Santa with his sleigh and a reindeer crossing the sky once every 70 seconds. Dark. |
| `christmas-countdown` | Shows "🎄 N days to Christmas" in the status line, and "🎄 Merry Christmas!" on the day. It stays correct if a session is left open past midnight. |

### Kitty

![Preview of kitty-theme: a plum night with a moon and a cat on a ledge](docs/previews/kitty-theme.png)

*Preview of the scene alone, drawn in a browser, without the app's blur and panels.*

| Mod | What it does |
|---|---|
| `kitty-theme` | Soft plum night, cream text and rose accents, with a moon and a sleepy cat on a ledge. Only the tail and the stars move, slowly. Dark. |
| `kitty-status` | A little cat in the status line whose mood follows the time of day ("😴 kitty is asleep", "😺 kitty wants breakfast", "😸 kitty is purring"...). |

### Music

| Mod | What it does |
|---|---|
| `now-playing` | Shows "🎵 title - artist" in the status line for the song that's playing. Updates every 15 seconds. Nothing shows when nothing is playing. Terminal only. It needs no account connection, token or sign-in, because it asks your own computer. |

## Install

In a terminal, start Claude Code (`claude`) and type, for each mod you want:

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

It asks once to add the marketplace (`y`), then for a scope. Choose **user** to have the mod in every session on that computer, or **project** for one folder only. Then open a **new** session: a theme is set when a session starts.

The desktop app's own **+** then **Plugins** menu may also work, but on the owner's version it had no "Add marketplace" button, so the terminal is the route that has been tried.

To update after a new version: `claude plugin marketplace update pretty-mods`, then `claude plugin update <mod>`. To switch one off: `claude plugin disable <mod>`.

## If you see nothing

1. **Run `claude plugin list`** in a terminal. Is the mod there, at the version you expect, and enabled?
2. **Open a new session.** Themes are set at the start.
3. **Use a session on your own computer** in the desktop app, not a cloud one.
4. **Turn off other themes** so only one is on.
5. **A terminal session only prints a note** such as "no attached desktop or mobile client draws themes yet". That is expected: the terminal doesn't draw themes.
6. **On a Free account** the mods did not work, and the cause was not investigated.
7. **Still nothing?** Open an issue with your system, app version, `claude plugin list` output, and what you see.

## What the mods do on your computer

- **Themes** only set colours and a picture behind the conversation. They run no commands and use no network.
- **`christmas-countdown` and `kitty-status`** read the clock and show a line of text. They use no network.
- **`now-playing`** runs a small command on your computer to ask what is playing: `osascript` on a Mac, or Windows PowerShell on Windows. It reads the title and artist only and sends them nowhere. On a Mac, the first time it runs macOS may ask to let the terminal control Music; allow it if you want it to work.
- No mod collects or sends your data. The code is in `plugins/`, and you can read it.

## Motion

The Christmas and kitty scenes move slowly, with nothing flashing. They are meant to stop when your system's "reduce motion" setting is on (tested in a browser render; not yet confirmed in the app).

## The skill that makes mods

`pretty-mods` is a skill: ask Claude for a mod ("make Claude look like a cosy cabin", "a status line with the weather") and it builds one in your own style. The first time it asks a few questions (colours, dark or light, motion, sound) and saves them in `~/.pretty-mods/style.md`, outside the skill, so it never asks twice. It uses Claude's built-in mod-writing skill for the mechanics and adds the checks for desktop and mobile: readable contrast, slow vector-only motion, no flashing, layouts that fit a phone, no sound unless you ask, and an honest note on what could not be checked.

Before showing a moving scene, the skill renders it in a browser at a wide and a phone size (`scripts/render_scene.js`) so cropping and off-screen starts are caught early; the app's own blur and panels are not part of that render. It also carries a template for a theme in a company's own colours with its own logo as a faint backdrop (`plugins/pretty-mods/skills/pretty-mods/brand-theme-template/`). Attach your logo (an SVG works best) and Claude converts it to the plain shapes a theme can draw, refusing anything it can't, such as pictures, text or gradients. Use it only for a logo you have the right to use, and keep that theme in your own repository.

```
/plugin install pretty-mods --marketplace malenaaza/pretty-mods
```

## Plus (coming)

Everything in this repository is free and MIT-licensed, and stays free, including `kitty-theme`. Later, a separate paid set of themes with richer scenes may appear under the name Plus. It would live in its own private repository, not here. Nothing is for sale yet, and no price or date is set.

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

**Where each works:** see "What works where" at the top.

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

New. Written in cloud sessions, so most of what is here was validated, not seen. What has been seen is what the owner reported below, on one Windows PC. If something looks wrong on your device, please open an issue and say which device and which app version.

Owner's report, Free account: the mods do not work on Claude Free; they work only in Claude Code. Nothing more was tested there, and the cause is not known.

Owner's report, Windows desktop app (app version 6.28899.6, Pro plan): `christmas-theme` installed from a terminal showed nothing in a cloud Code session, and showed once the session was started on the owner's own computer. In a terminal-only session it reports that no client draws themes yet, which is expected. The owner's screenshot of `christmas-theme` 0.2.1 showed Santa, the reindeer and the sleigh on screen but as a blurred blob, because the backdrop glass blurred the whole scene (blur 18). `christmas-theme` 0.2.2 and `kitty-theme` 0.1.3 lower the blur to 2 and the veil to 45%, and Santa is a little more transparent so he doesn't compete with long answers; not yet reported back. With `christmas-theme` 0.2.3 (blur 2, veil 45%) the owner saw Santa less blurred but still not sharp, while the reindeer outside the chat panel was sharp. 0.2.4 and `kitty-theme` 0.1.5 set the blur to 0 and the veil to 35%. The owner then reported that the Christmas theme (0.2.4) looks good on their Windows desktop session. The owner then reported that Santa is sharp in 0.2.4. Not yet reported: whether text stays readable as he passes, and whether motion stops with "reduce motion" on. Not yet reported: `kitty-theme`, the phone app, and `christmas-countdown`/`kitty-status` in the desktop app.

`kitty-theme` 0.1.0, same setup: the plum colours showed but the cat did not, because the cat was drawn off screen on a wide window and too dark. 0.1.1 moved it to the right edge, in the visible band, and lightened it. The owner then saw a big cat with half of it in another colour (cause not confirmed: the moon was drawn half grey and the cat was about 320 px wide on a wide window, or a panel of the app may cover part of it). 0.1.2 makes the moon one colour and the cat smaller; not yet reported back.

`now-playing` is tested only on sample text, not on a real Mac or Windows PC; the Windows media-controls script in particular has never been run. On a Mac, the first time it runs macOS may ask to let the terminal control Music; allow it. On Windows it needs Windows PowerShell (`powershell.exe`, built in). If it shows nothing while a song plays, please open an issue and say which system and player.

MIT licence.
