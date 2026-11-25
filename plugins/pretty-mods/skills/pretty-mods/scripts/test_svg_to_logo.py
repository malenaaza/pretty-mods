import unittest
from svg_to_logo import convert, Refused

OK = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100"><circle cx="50" cy="50" r="40" fill="#3b6fd4"/></svg>'


class T(unittest.TestCase):
    def test_fits_the_grid(self):
        out = convert(OK)
        self.assertIn('scale(0.5000)', out)
        self.assertIn('translate(0.00 25.00)', out)
        self.assertIn('fill="#3b6fd4"', out)

    def test_mono_drops_colour(self):
        self.assertNotIn('fill=', convert(OK, mono=True))

    def refused(self, svg):
        with self.assertRaises(Refused):
            convert(svg)

    def test_refuses_pictures_text_scripts(self):
        for el in ('<image href="data:image/png;base64,AA"/>', '<text>Acme</text>', '<script>x()</script>',
                   '<linearGradient id="g"/>'):
            self.refused(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10">{el}</svg>')

    def test_refuses_urls_and_event_attributes(self):
        self.refused('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><rect width="5" height="5" fill="url(#g)"/></svg>')
        self.refused('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><rect width="5" height="5" onclick="x()"/></svg>')

    def test_refuses_entities_and_non_svg(self):
        self.refused('<!DOCTYPE svg [<!ENTITY a "b">]><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"><g/></svg>')
        self.refused('\x89PNG not xml')
        self.refused('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"></svg>')


if __name__ == '__main__':
    unittest.main()
