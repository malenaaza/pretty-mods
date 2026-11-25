#!/usr/bin/env python3
"""Trace a one-colour PNG logo into an SVG of plain shapes, ready for svg_to_logo.py.

Usage: trace_png.py LOGO.png OUT.svg

A theme can't hold a picture, so a PNG logo has to become vector shapes first. This suits a simple logo of one
colour on a plain or transparent ground, and loses detail on anything photographic or with gradients. Look at the
result (render it, or draw it in a browser) before using it, and compare it with the original: a logo whose edge is
cut off in the image stays cut off in the trace.

Needs potracer, pillow and numpy, which are best installed in a virtual environment of their own:
    python3 -m venv .venv && .venv/bin/pip install potracer pillow numpy
    .venv/bin/python trace_png.py logo.png logo.svg
"""
import sys

try:
    import numpy as np
    import potrace
    from PIL import Image
except ImportError as err:  # pragma: no cover - the message is the point
    print(f'Refused: {err}. Install the helpers in a virtual environment:\n'
          '  python3 -m venv .venv && .venv/bin/pip install potracer pillow numpy', file=sys.stderr)
    sys.exit(1)

MAX_SIDE = 2048


def ink_mask(rgba):
    """Pixels that are the logo: opaque ones on a transparent ground, else the ones unlike the corner colour."""
    alpha = rgba[:, :, 3]
    if (alpha < 128).mean() > 0.02:
        return alpha >= 128
    corners = [tuple(rgba[y, x, :3]) for y in (0, -1) for x in (0, -1)]
    ground = max(set(corners), key=corners.count)
    distance = np.abs(rgba[:, :, :3].astype(int) - np.array(ground, dtype=int)).sum(axis=2)
    return distance > 96


def fill_colour(rgba, ink):
    """The logo's colour: the exact colour most ink pixels have, as #rrggbb (edge pixels are blends, so rarer)."""
    pixels = rgba[ink][:, :3].astype(np.uint32)
    if len(pixels) == 0:
        return '#000000'
    packed = (pixels[:, 0] << 16) | (pixels[:, 1] << 8) | pixels[:, 2]
    values, counts = np.unique(packed, return_counts=True)
    value = int(values[counts.argmax()])
    return f'#{value:06x}'


def trace(path):
    image = Image.open(path).convert('RGBA')
    if max(image.size) > MAX_SIDE:
        raise ValueError(f'the image is larger than {MAX_SIDE} pixels on a side; shrink it first.')
    width, height = image.size
    rgba = np.array(image)
    ink = ink_mask(rgba)
    if not ink.any():
        raise ValueError('no logo found: the image is empty or all one colour.')
    # potracer fills the cells that are False, so the ink is passed inverted.
    curves = potrace.Bitmap(~ink).trace(turdsize=20, alphamax=1.0, opticurve=True, opttolerance=0.4)

    def point(p):
        return f'{p.x:.1f} {p.y:.1f}'

    parts = []
    for curve in curves:
        parts.append(f'M{point(curve.start_point)}')
        for segment in curve.segments:
            if segment.is_corner:
                parts.append(f'L{point(segment.c)}L{point(segment.end_point)}')
            else:
                parts.append(f'C{point(segment.c1)} {point(segment.c2)} {point(segment.end_point)}')
        parts.append('Z')
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}">'
            f'<path d="{"".join(parts)}" fill="{fill_colour(rgba, ink)}" fill-rule="evenodd"/></svg>')


def main(argv):
    if len(argv) != 3:
        print(__doc__)
        return 2
    try:
        svg = trace(argv[1])
    except (OSError, ValueError) as err:
        print(f'Refused: {err}', file=sys.stderr)
        return 1
    with open(argv[2], 'w', encoding='utf-8') as out:
        out.write(svg)
    print(f'Wrote {argv[2]} ({len(svg)} characters). Check it against the original, then run svg_to_logo.py on it.')
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv))
