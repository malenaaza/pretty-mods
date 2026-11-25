# pretty-mods

Pretty mods for Claude: changes to how Claude looks and what it shows, for the desktop and mobile apps. They start with Christmas.

## Christmas mods

| Mod | What it does |
|---|---|
| `christmas-theme` | A Christmas look: deep pine green with warm cream text, cranberry accents and gold, and a slow snowfall behind the conversation. Dark, in the app's desktop and mobile versions. |
| `christmas-countdown` | Shows "🎄 N days to Christmas" in the status line, and "🎄 Merry Christmas!" on the day. It stays correct if a session is left open past midnight. |

## Install

In Claude Code, type these (for each mod you want):

```
/plugin install christmas-theme --marketplace malenaaza/pretty-mods
```

```
/plugin install christmas-countdown --marketplace malenaaza/pretty-mods
```

It asks once to add the marketplace (`y`), then for a scope. Start a new session afterwards.

The theme is drawn by the desktop and mobile apps. The terminal and editors don't draw themes, so there only the countdown shows.

## Checking and testing

```
claude plugin validate plugins/christmas-theme
claude plugin validate plugins/christmas-countdown
claude plugin test plugins/christmas-countdown
```

## Status

New. Written in a cloud session, so the look has been validated but not yet seen on a real desktop or phone screen. If the snow, the colours or the contrast look wrong on your device, please open an issue and say which device.

MIT licence.
