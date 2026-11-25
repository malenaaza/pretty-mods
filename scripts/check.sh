#!/bin/sh
# Validate every plugin and the marketplace, and run each plugin's tests. Run before pushing.
set -e
cd "$(dirname "$0")/.."
claude plugin validate .
for dir in plugins/*/; do
  claude plugin validate "$dir"
  if ls "$dir"hooks/*.test.* >/dev/null 2>&1; then
    claude plugin test "$dir"
  fi
done
# The logo converter in the pretty-mods skill
(cd plugins/pretty-mods/skills/pretty-mods/scripts && python3 -m unittest -q test_svg_to_logo test_trace_png)
