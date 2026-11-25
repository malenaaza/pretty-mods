# Working on this repository

Pretty mods for Claude: one folder per mod in `plugins/`, listed in `.claude-plugin/marketplace.json`, plus the `pretty-mods` plugin, a skill that makes mods in the user's style.

## Rules

1. **Each session has its own branch.** A cloud session pushes only to its own `claude/...` branch, and never to a branch another session owns. Changes meet in a pull request.
2. **Before pushing, run `scripts/check.sh`.** It validates the marketplace and every plugin and runs each plugin's tests. All must pass.
3. **One mod, one idea.** A theme and a countdown are two mods. Each mod has its own `plugin.json` with a `version`; raise it when its behaviour changes, so installed copies update.
4. **A new mod** goes in `plugins/<name>/`, gets an entry in `.claude-plugin/marketplace.json` and a row in the README table, and a test when it has logic (dates, counters).
5. **Say what was seen and what wasn't.** A cloud session has no desktop or phone screen: a look is validated, not seen. Don't describe one as checked on a device unless the owner has said so. Say it in the pull request and in your reply. The README's Status is short: add to it only what a reader needs to know, such as a real limit or something that doesn't work somewhere, not every "looks good" or fix.
6. **Personal data stays out:** no names, tokens, personal paths or screenshots of the owner's screen. The owner's style lives in `~/.pretty-mods/style.md`, never in the repository.
7. **Pull requests** only when asked. Before opening one, fetch `main` and merge it into the branch.
8. **Update the README only when something readers need changes:** a mod added or removed, what a mod does, how to install it, or a real limit. Don't update it for each test result, tweak to a look, or owner report.
9. **Free mods only.** Everything in this repository is free and MIT-licensed. A paid mod would go in a separate private repository, never here.
