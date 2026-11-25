---
name: pretty-mods
description: Makes mods for Claude in the user's own style: a theme, a panel beside the chat, a band above the prompt, a status line entry, a toast, a slash command, a sound or a seasonal look (Christmas, Halloween...), for the desktop and mobile apps as well as the terminal. Use whenever the user asks for a mod, a theme or a look for Claude, "make Claude look like...", a panel or status line, or to change or share a mod they made. It adds their saved style and the desktop and mobile checks to Claude's built-in mod-writing skill (plugin-authoring).
---

# Pretty mods

You make mods for the user: changes to how Claude looks and what it shows. They are the designer; you build what they ask, in their style, and say plainly what you could not check.

In this file, `<skill>` is the folder this SKILL.md is in. Examples of finished mods are in the repository this skill came from (`plugins/christmas-theme`, `plugins/christmas-countdown`).

## What this skill adds

Claude already has a built-in skill, **plugin-authoring**, that knows how a mod is written: the files, the hooks, the types, `claude plugin validate` and `claude plugin test`. **Load it with the Skill tool first, every time, and follow it for the mechanics.** If it isn't available in this session, say so and stop: don't write a mod from memory, because a wrong colour or hook name paints nothing and says nothing.

This skill adds three things on top: the user's own style, checks for desktop and mobile, and a way to keep and share what you made.

## Step 1: Know the style

Read `~/.pretty-mods/style.md`. If it doesn't exist, ask once, in one message (offer to skip any question; "no preference" is a fine answer), then save the answers by copying `<skill>/style-template.md` there and filling it in:

- Colours they like, or a mood ("cosy", "clean", "playful"), and any colour to avoid.
- Dark, light or both: the person's own mode, or one the mod forces.
- Motion: none, very slow, or lively. Sound: never, or only when asked.
- How they want Claude to speak or sign off in any text a mod shows (a greeting, a toast), if at all.
- Language of the text a mod shows.

A request overrides the saved style for that mod only. When the user corrects something ("less red", "no animation"), make the change and add a dated one-line note under Notes in `style.md`, recording only what they said. Never ask the same thing twice.

## Step 2: Choose the shape

Match the request to the smallest mod that does it. The built-in skill's table lists the shapes; in short: a look is a theme (colours, a backdrop, optionally the message style); a panel is a pane; a row above the prompt is a band; one line of text is the status line; a short message is a toast; anything on or under a tool call is a `ToolUse` render; a command is a slash command. If the user asks for something a mod can't do, say so and offer the closest thing.

One mod, one idea. A theme and a countdown are two mods, so someone can install one without the other.

## Step 3: Make it right on desktop and mobile

Mods draw differently by surface: `terminal`, `desktop`, `vscode` and `mobile`. The terminal and editors draw no theme, so a look reaches only the desktop and mobile apps; say that when the user asks for a look. Then:

- **Colours:** build them with the built-in skill's `makeColors` and don't write token names by hand. Work until no line starts `Desktop won't paint this theme`, because then the desktop ignores the whole theme. Check both light and dark unless the mod forces one.
- **Text must stay readable.** Give text colours enough contrast over the backdrop, and use the backdrop's `glass` setting so panels stay legible over a busy scene.
- **A moving scene is a risk.** Keep it slow, pure vector and small. No flashing: nothing that swings between light and dark more than three times a second. Give every moving part a resting place so it looks finished for someone who asked for reduced motion.
- **Fit any screen.** On a phone the scene is tall and narrow, and on its side there is little room. Use `preserveAspectRatio="xMidYMid slice"` for loose art and keep the subject away from the middle, where the words sit, and the foot, where the message box sits.
- **Mobile draws a tool row as one quiet line.** For anything a person should see without a tap, such as a chart or a short report, put it in a card, as the built-in skill says.
- **Sound is opt-in.** Don't add sound unless the style file or the request says so. You can't hear it, so ask the user to listen and tell you.
- **Never put a secret, a personal name, a token or a path with a name in a mod.** Mods get shared.

## Step 4: Check it, honestly

1. `claude plugin validate <mod folder>` must pass.
2. Where the mod has logic (a date, a counter), write a `*.test.ts` and run `claude plugin test <mod folder>`.
3. Say what you could not check. In a cloud session there is no desktop or phone screen: the colours, contrast and motion are **validated, not seen**. Tell the user that, ask them to look at it on their own device, and ask for a screenshot description or what looked wrong. Never say it looks good when you haven't seen it.

## Step 5: Keep it and share it

A mod written in a session lives in that session's mods folder and ends with it. To keep it:

- If the user has a mods repository, put it in `plugins/<mod-name>/` there (one folder per mod, with its `.claude-plugin/plugin.json` and `hooks/`), add it to `.claude-plugin/marketplace.json` and a row in the README, and run the validate and test commands on it.
- If not, offer to create the layout in a folder they choose, or to hand the files over as they are.
- Install line to give for a shared mod: `/plugin install <mod> --marketplace <owner>/<repo>`.
- Before putting a mod in a public repository, ask whether the repository is public or private, and look for anything personal in it.

Never push to a branch another session owns, and never open a pull request unless asked.

## Seasonal and themed looks

For a season or a theme (Christmas, Halloween, spring, a favourite film), write one theme mod and, if wanted, small extras as separate mods (a countdown, a greeting). Say when it is meant to be switched off: a Christmas look in July is a surprise. The user decides whether a mod should switch itself on and off by date; if they want that, do it in the mod, and test the dates.
