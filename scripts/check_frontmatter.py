#!/usr/bin/env python3
"""Check that the YAML header of each SKILL.md parses, so a skill never fails to load with a YAML error.

Usage: check_frontmatter.py SKILL.md [SKILL.md ...]

A plain (unquoted) value that holds ": " breaks the header ("mapping values are not allowed in this context"), so
write long descriptions as a folded block (`description: >-` and the text on indented lines) or quote them.
Uses PyYAML when it is installed; otherwise it looks for the usual mistake: an unquoted value with ": " in it.
"""
import re
import sys

try:
    import yaml
except ImportError:
    yaml = None


def frontmatter(text):
    parts = text.split('---\n', 2)
    if len(parts) < 3 or parts[0] != '':
        raise ValueError('no YAML header between two lines of ---')
    return parts[1]


def check(path):
    header = frontmatter(open(path, encoding='utf-8').read())
    if yaml is not None:
        data = yaml.safe_load(header)
        for key in ('name', 'description'):
            if not isinstance(data, dict) or not data.get(key):
                raise ValueError(f'the header has no "{key}"')
        return
    for number, line in enumerate(header.split('\n'), start=1):
        match = re.match(r'^[A-Za-z_-]+:\s+(\S.*)$', line)
        if match:
            value = match.group(1)
            if value[0] not in '"\'>|[{' and ': ' in value:
                raise ValueError(f'line {number}: an unquoted value holds ": "; quote it or use a folded block')


def main(paths):
    failed = False
    for path in paths:
        try:
            check(path)
        except Exception as err:  # a YAML error is the point
            print(f'{path}: {err}', file=sys.stderr)
            failed = True
    return 1 if failed else 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]) if len(sys.argv) > 1 else 2)
