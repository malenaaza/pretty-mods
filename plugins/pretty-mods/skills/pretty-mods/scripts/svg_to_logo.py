#!/usr/bin/env python3
"""Turn an uploaded SVG logo into the plain shapes a theme can draw.

Usage: svg_to_logo.py LOGO.svg [--mono]

Prints one <g> element that fits the logo into a 100 x 100 grid, ready to paste
into LOGO in the brand theme template. Anything a theme can't draw, or that could
be unsafe, is refused with a one-line reason and a non-zero exit code. With --mono
the logo's own colours are dropped, so the template's LOGO_COLOR paints it.
"""
import re
import sys
import xml.etree.ElementTree as ET

MAX_IN = 500_000
MAX_OUT = 100_000
SHAPES = {'g', 'path', 'circle', 'ellipse', 'rect', 'polygon', 'polyline', 'line'}
GEOMETRY = {'d', 'points', 'cx', 'cy', 'r', 'rx', 'ry', 'x', 'y', 'x1', 'y1', 'x2', 'y2', 'width', 'height', 'transform'}
PAINT = {'fill', 'stroke'}
OTHER = {'stroke-width', 'opacity', 'fill-opacity', 'stroke-opacity', 'fill-rule', 'clip-rule', 'stroke-linecap', 'stroke-linejoin'}
HEX = re.compile(r'^#[0-9a-fA-F]{3}$|^#[0-9a-fA-F]{6}$')
SAFE = re.compile(r'^[0-9a-zA-Z\s.,+\-()#%]*$')


class Refused(Exception):
    pass


def local(tag):
    return tag.rsplit('}', 1)[-1]


def clean(el, mono):
    name = local(el.tag)
    if name not in SHAPES:
        raise Refused(f'<{name}> can\'t be drawn in a theme (pictures, text, gradients, filters and scripts are refused). '
                      'Convert text to outlines and flatten gradients in a vector editor, then upload again.')
    attrs = []
    for key, value in el.attrib.items():
        key = local(key)
        if key in GEOMETRY or key in OTHER:
            pass
        elif key in PAINT:
            if mono or value in ('none',):
                if mono and value != 'none':
                    continue
            elif not HEX.match(value):
                raise Refused(f'{key}="{value}": only #hex colours or none are accepted (no gradients, urls or named colours).')
        elif key in ('id', 'class', 'version', 'xmlns'):
            continue
        else:
            raise Refused(f'attribute "{key}" is not accepted.')
        if not SAFE.match(value):
            raise Refused(f'{key} holds characters a theme can\'t take.')
        attrs.append(f'{key}="{value}"')
    kids = ''.join(clean(c, mono) for c in el)
    attr = (' ' + ' '.join(attrs)) if attrs else ''
    return f'<{name}{attr}>{kids}</{name}>' if kids else f'<{name}{attr}/>'


def viewbox(root):
    vb = root.attrib.get('viewBox')
    if vb:
        nums = [float(n) for n in re.split(r'[\s,]+', vb.strip())]
        if len(nums) == 4 and nums[2] > 0 and nums[3] > 0:
            return nums
    w = re.match(r'^[0-9.]+', root.attrib.get('width', ''))
    h = re.match(r'^[0-9.]+', root.attrib.get('height', ''))
    if w and h and float(w.group()) > 0 and float(h.group()) > 0:
        return [0.0, 0.0, float(w.group()), float(h.group())]
    raise Refused('the SVG has no viewBox or width and height, so it can\'t be sized.')


def convert(text, mono=False):
    if len(text) > MAX_IN:
        raise Refused('the file is too large; simplify the logo first.')
    if re.search(r'<!DOCTYPE|<!ENTITY|<!\[CDATA\[', text, re.I):
        raise Refused('DOCTYPE, entities and CDATA are not accepted.')
    try:
        root = ET.fromstring(text)
    except ET.ParseError as err:
        raise Refused(f'this is not a valid SVG ({err}). A PNG or JPEG must first be traced to vector shapes.')
    if local(root.tag) != 'svg':
        raise Refused('this is not an SVG.')
    x, y, w, h = viewbox(root)
    scale = 100 / max(w, h)
    tx = (100 - w * scale) / 2 - x * scale
    ty = (100 - h * scale) / 2 - y * scale
    body = ''.join(clean(c, mono) for c in root)
    if not body:
        raise Refused('the SVG holds no shapes.')
    out = f'<g transform="translate({tx:.2f} {ty:.2f}) scale({scale:.4f})">{body}</g>'
    if len(out) > MAX_OUT:
        raise Refused('the logo is too detailed; simplify it so the scene stays small.')
    return out


def main(argv):
    args = [a for a in argv[1:] if not a.startswith('--')]
    if len(args) != 1:
        print(__doc__)
        return 2
    try:
        with open(args[0], encoding='utf-8') as f:
            print(convert(f.read(), mono='--mono' in argv))
    except Refused as err:
        print(f'Refused: {err}', file=sys.stderr)
        return 1
    except (OSError, UnicodeDecodeError) as err:
        print(f'Refused: can\'t read the file ({err}).', file=sys.stderr)
        return 1
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv))
