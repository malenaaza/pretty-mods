# pretty-mods

Pretty mods for Claude Code: changes to how it looks and what it shows. A Christmas look with Santa, a kitty look with a cat on a moonlit ledge, a few status-line extras, and a skill that makes mods in your own style. Everything here is free.

[Español](README.es.md)

## Before you start

- **You need Claude Code.** These mods work only in Claude Code. They did not work on a Claude Free account when the owner tried.
- **Looks (themes) show only in the Claude desktop app**, in a Claude Code session. The terminal and editors don't draw themes. Use a session **on your own computer**: a session that runs in the cloud may show an older copy of a theme, or none.
- **The status-line mods** (`kitty-status`, `christmas-countdown`, `now-playing`) show in the Claude Code terminal. In the Windows desktop app `now-playing` showed, and the other two were not reliable: see "What works where".
- **Only one theme at a time.** If two are on, the later one wins.
- Not for everyone yet: it has been tried on one Windows PC. A Mac is untested, and on an iPhone no theme showed.

## What works where

"Seen" means the owner reported seeing it. Everything else was checked only by tools, not by eye.

| Mod | Where it shows | Seen? |
|---|---|---|
| `christmas-theme` | Claude desktop app, in a Claude Code session on your own computer | Yes, on Windows (version 0.2.4 "looks good", and Santa is sharp; the owner later reported that the presents added in 0.2.6 look good). iPhone: tried once, in a Remote Control session running on the computer with the theme switched on, and no theme showed |
| `christmas-town-theme` | Same as above | Yes, on Windows: the first version had chimneys that could not be seen; after 0.1.1 (brick chimneys with snow caps) the owner reported that it looks good |
| `christmas-market-theme` | Same as above | Yes, on Windows: after the owner asked for three stalls (0.2.0), the owner reported "it is ok", though the stalls still look big to the owner, who chose to leave them. After 0.2.1 (visible background houses, mugs with handles) the owner reported that it looks good. The first version showed only two stalls, one cut off at the edge |
| `new-year-theme` | Same as above | Not yet reported. Only checked in a browser render, in light and dark |
| `snowman-theme` | Same as above | Not yet reported. Only checked in a browser render, in light and dark |
| `kitty-theme` | Same as above | Yes, on Windows (the owner reported it "looks good", and later that the cat's tail and the stars show and move in 0.1.6). iPhone: tried once, in a Remote Control session running on the computer with the theme switched on, and no theme showed |
| `kitty-status`, `christmas-countdown` | The status line in the Claude Code terminal | Yes, both work in the Claude Code terminal (owner's report). **In the Windows desktop app the reports were mixed:** `kitty-status` was seen once under the text box, was not seen later, and `christmas-countdown` was never seen there. A test line that updated every 5 seconds did not show in a cloud session in that app. So do not count on status lines in the desktop app; the cause is not known |
| `now-playing` | The status line, under the text box (Mac: Music app; Windows: any player that reports to the system media controls, such as YouTube Music in a browser) | **Yes, on Windows, in the desktop app** (owner's screenshot, version 0.2.0: title and artist showed with the mod's name in front) **and in the Claude Code terminal** (owner's report, version not stated). A Mac: never run. Accented letters showed broken in 0.2.0; the owner confirmed they show correctly (é and ñ) in 0.2.1 |

## The mods

### Christmas

![Preview of christmas-theme: a pine-green night with snow, Santa's sleigh and a reindeer](docs/previews/christmas-theme.png)

*Preview of the scene alone, drawn in a browser. The app adds its own blur and panels on top, so it looks different there. It is not a screenshot of anyone's screen.*

![Preview of christmas-town-theme: a midnight-blue night town with lit windows, a church and trees with lights](docs/previews/christmas-town-theme.png)

*Preview of `christmas-town-theme`, drawn the same way.*

![Preview of christmas-market-theme: a night Christmas market with stalls, string lights, a tree and people eating and drinking](docs/previews/christmas-market-theme.png)

*Preview of `christmas-market-theme`, drawn the same way, at a moment when the arms are raised.*

| Mod | What it does |
|---|---|
| `christmas-theme` | Deep pine green with warm cream text, cranberry accents and gold, a slow snowfall, and Santa with his sleigh full of wrapped presents, pulled by a team of three reindeer led by Rudolph, climbing across the sky once every 70 seconds. Dark. |
| `christmas-town-theme` | Another Christmas look, with a town: a midnight-blue night with snow-roofed houses with brick chimneys and their lit windows, a church with a steeple, pine trees with coloured lights, a moon, drifting chimney smoke and slow snowfall. Dark. Install it instead of `christmas-theme`, not with it. |
| `christmas-market-theme` | A Christmas market at night: three wooden stalls (red, mustard and green) with snowy roofs and striped awnings, strings of coloured lights between them, a tall lit tree behind the middle one, two standing tables with a candle and a steaming mug, and six people in winter coats eating and drinking (a sausage in a bun, a pretzel, a crepe, mugs of something hot). Their arms lift slowly to their mouths and steam rises from the mugs. Dark. Install it instead of the other Christmas themes, not with them. |
| `christmas-countdown` | Shows "🎄 N days to Christmas" in the status line, and "🎄 Merry Christmas!" on the day. It stays correct if a session is left open past midnight. |

### Kitty

![Preview of kitty-theme: a plum night with a moon and a cat on a ledge](docs/previews/kitty-theme.png)

*Preview of the scene alone, drawn in a browser, without the app's blur and panels.*

| Mod | What it does |
|---|---|
| `kitty-theme` | Soft plum night, cream text and rose accents, with a moon and a sleepy cat on a ledge. Only the tail and the stars move, slowly. Dark. |
| `kitty-status` | A little cat in the status line whose mood follows the time of day ("😴 kitty is asleep", "😺 kitty wants breakfast", "😸 kitty is purring"...). |

### Snowman

![Preview of snowman-theme: a snowman and a small snowman on a snowy hill with fir trees, by day on the left and by night on the right](docs/previews/snowman-theme.png)

*Preview of the scene alone, by day (left) and by night (right), drawn in a browser, without the app's blur and panels.*

| Mod | What it does |
|---|---|
| `snowman-theme` | A snowman with a top hat, a red scarf and a carrot nose, on a snowy hill with decorated fir trees (baubles, lights and a gold star) with fir trees, in slow snowfall. It follows your light or dark mode: a bright snowy day with the sun, or a snowy night with stars and the moon. The scarves flutter a little and the stars twinkle. The panels behind the text are frosted glass, so the scene is softened behind them; the snowman and the trees stand at the edges, outside the middle where the chat panel usually is. |

### New Year

![Preview of new-year-theme: fireworks over a city skyline, by day on the left and by night on the right](docs/previews/new-year-theme.png)

*Preview of the scene alone, by day (left) and by night (right), drawn in a browser, without the app's blur and panels.*

| Mod | What it does |
|---|---|
| `new-year-theme` | A city skyline with lit windows and slow confetti. In the last ten minutes of the year a countdown in gold (10 down to 1, changing each minute). From midnight, the year 2027 in gold and fireworks bursting at the left and right edges, until 01:00 on 1 January. It follows your light or dark mode, and the panels behind the text are frosted glass. The notification at midnight goes to the desktop app, when a session is open on your computer. The phone is not supported for now: no theme has shown on an iPhone so far | Fireworks bursting at the left and right edges over a city skyline with lit windows, in the last ten minutes of the year a countdown in gold (10, 9 ... 1, changing each minute), then the new year, 2027, from midnight to 01:00 on 1 January, and slow confetti. It follows your light or dark mode: a pale lavender day, or a midnight-blue night. The fireworks fade in and out slowly, and the panels behind the text are frosted glass. At midnight on New Year's Eve, a notification says Happy New Year. It is sent to the desktop app, when a session is open on your computer, and it makes the sound your system uses for its notifications; the mod cannot choose that sound. The phone is not supported for now: no theme has shown on an iPhone so far: no theme has shown on a phone so far. |

### Music

| Mod | What it does |
|---|---|
| `now-playing` | Shows "🎵 title - artist" in the status line for the song that's playing. Updates every 15 seconds. Nothing shows when nothing is playing. It needs no account connection, token or sign-in, because it asks your own computer. |

## Install

In a terminal, start Claude Code (`claude`) and type, for each mod you want:

```
/plugin install christmas-theme --marketplace malenaaza/pretty-mods
```

```
/plugin install christmas-countdown --marketplace malenaaza/pretty-mods
```

```
/plugin install christmas-town-theme --marketplace malenaaza/pretty-mods
```

```
/plugin install christmas-market-theme --marketplace malenaaza/pretty-mods
```

```
/plugin install kitty-theme --marketplace malenaaza/pretty-mods
```

```
/plugin install snowman-theme --marketplace malenaaza/pretty-mods
```

```
/plugin install new-year-theme --marketplace malenaaza/pretty-mods
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

If `enable`, `disable` or `update` says it worked from a terminal but nothing changes in your sessions, add the scope you installed it at, for example `claude plugin enable christmas-theme --scope user`. Those commands pick a scope by themselves when it isn't given, and it may not be the one your sessions read. Inside a Claude Code session, `/plugin` works on the scope you are in. (One user saw `enable` report success from PowerShell without effect, and `/plugin` work; the cause was not confirmed.)

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

The Christmas and kitty scenes move slowly, with nothing flashing. They stop when your system's "reduce motion" setting is on. The owner confirmed on Windows that this works in the app (the owner did not say which of the two themes was checked).

## The skill that makes mods

`pretty-mods` is a skill: ask Claude for a mod ("make Claude look like a cosy cabin", "a status line with the weather") and it builds one in your own style. The first time it asks a few questions (colours, dark or light, motion, sound) and saves them in `~/.pretty-mods/style.md`, outside the skill, so it never asks twice. It uses Claude's built-in mod-writing skill for the mechanics and adds the checks for desktop and mobile: readable contrast, slow vector-only motion, no flashing, layouts that fit a phone, no sound unless you ask, and an honest note on what could not be checked.

Before showing a moving scene, the skill renders it in a browser at a wide and a phone size (`scripts/render_scene.js`) so cropping and off-screen starts are caught early; the app's own blur and panels are not part of that render. It also carries a template for a theme in a company's own colours with its own logo as a faint backdrop (`plugins/pretty-mods/skills/pretty-mods/brand-theme-template/`). Attach your logo (an SVG works best; a simple one-colour PNG can be traced to one) and Claude converts it to the plain shapes a theme can draw, refusing anything it can't, such as pictures, text or gradients. The template can follow your system's light or dark mode. Use it only for a logo you have the right to use, and keep that theme in your own repository.

```
/plugin install pretty-mods --marketplace malenaaza/pretty-mods
```

## How it works

**A mod is a small folder.** Each one lives in `plugins/<name>/` and holds three things:

- `.claude-plugin/plugin.json`: its name, a one-line description and a version.
- `hooks/hooks.json`: points at the mod's code.
- `hooks/register.ts` (or `.tsx`): the code. It says "when this happens in Claude, do that", for example "when a session starts, set the colours" or "every hour, update the status line".

**The marketplace is the list.** `.claude-plugin/marketplace.json` names every mod and where its folder is. When you run `/plugin install <mod> --marketplace malenaaza/pretty-mods`, Claude Code reads that list, finds the folder and installs it. A mod that isn't in the list can't be installed.

**What a mod can change.** There are three kinds here:

- **A look (theme):** colours and a moving scene behind the conversation, for the desktop and mobile apps. The terminal and editors don't draw themes. `christmas-theme` and `kitty-theme` are looks.
- **A status line:** one line of text, which the mod updates itself. `christmas-countdown`, `kitty-status` and `now-playing` are status lines.
- **Running something on your computer:** `now-playing` asks your Music app (Mac) or Windows media controls what's playing.

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

Owner's report, Windows desktop app (app version 6.28899.6, Pro plan): `christmas-theme` installed from a terminal showed nothing in a cloud Code session, and showed once the session was started on the owner's own computer. In a terminal-only session it reports that no client draws themes yet, which is expected. The owner's screenshot of `christmas-theme` 0.2.1 showed Santa, the reindeer and the sleigh on screen but as a blurred blob, because the backdrop glass blurred the whole scene (blur 18). `christmas-theme` 0.2.2 and `kitty-theme` 0.1.3 lower the blur to 2 and the veil to 45%, and Santa is a little more transparent so he doesn't compete with long answers; not yet reported back. With `christmas-theme` 0.2.3 (blur 2, veil 45%) the owner saw Santa less blurred but still not sharp, while the reindeer outside the chat panel was sharp. 0.2.4 and `kitty-theme` 0.1.5 set the blur to 0 and the veil to 35%. The owner then reported that the Christmas theme (0.2.4) looks good on their Windows desktop session. The owner then reported that Santa is sharp in 0.2.4. The owner also reported that "reduce motion" works in the app. The owner also reported that the text is easy to read in both themes. The owner also reported that `christmas-countdown` and `kitty-status` both work in the Claude Code terminal. The owner's reports on status lines in the Windows desktop app were mixed: `kitty-status` ("kitty is playing") was seen once under the text box, and later neither it nor `christmas-countdown` was seen, with both active. `christmas-countdown` also did not show after being reinstalled from the marketplace, and a test line that updated every 5 seconds did not show in a cloud session. Both mods work in the terminal. The cause is not known. On an iPhone the owner saw no theme at all, in a Remote Control session running on the computer. The theme was already switched on in that session, so it was not a case of the theme being off. The cause is not known, and themes should not be counted on for the phone. The owner saw the first `christmas-market-theme` with only two stalls, one cut off at the left edge, and asked for three; `christmas-market-theme` 0.2.0 has three, and the owner then reported that it is ok. The owner also said the stalls still look big, and chose to leave them as they are. After 0.2.1 (the background houses made visible and the mugs given handles) the owner reported that it looks good.

`kitty-theme` 0.1.0, same setup: the plum colours showed but the cat did not, because the cat was drawn off screen on a wide window and too dark. 0.1.1 moved it to the right edge, in the visible band, and lightened it. The owner then saw a big cat with half of it in another colour (cause not confirmed: the moon was drawn half grey and the cat was about 320 px wide on a wide window, or a panel of the app may cover part of it). 0.1.2 makes the moon one colour and the cat smaller. The owner later reported that `kitty-theme` looks good (the version was not stated; 0.1.5 was current). The owner then said the stars were plain circles and nothing moved. 0.1.6 draws four-pointed sparkles that twinkle more clearly and a tail that sways more (about 4.5 seconds per sway). With 0.1.6 the owner then reported seeing the cat's tail and the stars, and that they move.

`now-playing` 0.2.0, Windows: the owner's screenshot showed "🎵 title - artist" for a song playing in a browser, in the status line under the text box in the Windows desktop app. The owner also reported seeing it in the Claude Code terminal (version not stated). An accented letter in the title showed as a broken character (a codepage problem in the PowerShell reply); 0.2.1 makes the script answer in UTF-8 and the parser ignore a byte-order mark, and the owner then confirmed that é and ñ show correctly in 0.2.1. A Mac has never been tried; on a Mac, the first time it runs macOS may ask to let the terminal control Music; allow it. On Windows it needs Windows PowerShell (`powershell.exe`, built in). If it shows nothing while a song plays, please open an issue and say which system and player.

MIT licence.
