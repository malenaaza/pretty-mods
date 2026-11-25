import os
import tempfile
import unittest

try:
    from PIL import Image, ImageDraw
    import potrace  # noqa: F401
    import trace_png
    HAVE = True
except ImportError:
    HAVE = False

from svg_to_logo import convert


@unittest.skipUnless(HAVE, 'potracer and pillow are not installed')
class T(unittest.TestCase):
    def png(self, background, ink, name='logo.png'):
        image = Image.new('RGBA', (200, 200), background)
        draw = ImageDraw.Draw(image)
        draw.ellipse((40, 40, 160, 160), fill=ink)
        draw.ellipse((85, 85, 115, 115), fill=background)  # a hole
        path = os.path.join(tempfile.mkdtemp(), name)
        image.save(path)
        return path

    def test_traces_a_logo_on_white_the_right_way_round(self):
        svg = trace_png.trace(self.png((255, 255, 255, 255), (0, 32, 74, 255)))
        self.assertIn('<path', svg)
        self.assertIn('fill="#00204a"', svg)
        group = convert(svg)  # the converter must accept it
        self.assertIn('<path', group)

    def test_traces_a_logo_on_a_transparent_ground(self):
        svg = trace_png.trace(self.png((0, 0, 0, 0), (200, 40, 40, 255)))
        self.assertIn('fill="#c82828"', svg)

    def test_the_ink_is_not_inverted(self):
        # A filled ring on white: the traced shapes must cover the ring, not the ground around it.
        path = self.png((255, 255, 255, 255), (0, 0, 0, 255))
        svg = trace_png.trace(path)
        # The ring's outline starts well inside the picture; an inverted trace would start at the border.
        self.assertNotIn('M0.0 0.0', svg)

    def test_refuses_an_empty_image(self):
        image = Image.new('RGBA', (50, 50), (255, 255, 255, 255))
        path = os.path.join(tempfile.mkdtemp(), 'empty.png')
        image.save(path)
        with self.assertRaises(ValueError):
            trace_png.trace(path)


if __name__ == '__main__':
    unittest.main()
