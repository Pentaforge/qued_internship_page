"""
Regenerate assets/logo.png and assets/favicon.png from assets/quedlogo.jpeg.

The source is a JPEG of the logo on solid black. Used as-is it shows a black
box wherever the page behind it isn't black (the hero's violet glow). This
script keys the black out to real transparency.

The artwork is additive light on black, so alpha = max(r,g,b) and the colour
is un-premultiplied by that alpha. The result composites correctly on any
background, not just dark ones.

    pip install Pillow
    python tools/build-logo.py
"""
from PIL import Image, ImageDraw
import os

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(HERE, 'assets', 'quedlogo.jpeg')
OUT = os.path.join(HERE, 'assets')

# Content regions measured from the 1536x1024 source.
MARK = (129, 319, 455, 694)    # octopus mark, full height
WORD = (584, 372, 1423, 589)   # QUED + METRICS
GAP_L, DIV_W, GAP_R = 53, 5, 71
VIOLET = (124, 77, 255, 255)
FLOOR = 12                     # discards JPEG mosquito noise in the black

src = Image.open(SRC).convert('RGB')


def keyed(box):
    im = src.crop(box)
    w, h = im.size
    out = Image.new('RGBA', (w, h))
    sp, op = im.load(), out.load()
    for y in range(h):
        for x in range(w):
            r, g, b = sp[x, y]
            m = max(r, g, b)
            if m <= FLOOR:
                op[x, y] = (0, 0, 0, 0)
                continue
            a = max(0, min(255, round((m - FLOOR) * 255 / (255 - FLOOR))))
            if a == 0:
                op[x, y] = (0, 0, 0, 0)
                continue
            s = 255.0 / m
            op[x, y] = (min(255, int(r * s)), min(255, int(g * s)),
                        min(255, int(b * s)), a)
    return out


mark, word = keyed(MARK), keyed(WORD)

# Lockup: mark | divider | wordmark. The strapline is NOT baked in here -- in the
# source art it is ~1/6 the height of the QUED letters, so at any sane web size it
# renders as an unreadable smudge. The page sets it as live text instead.
cw = mark.width + GAP_L + DIV_W + GAP_R + word.width
ch = mark.height
canvas = Image.new('RGBA', (cw, ch), (0, 0, 0, 0))
canvas.alpha_composite(mark, (0, 0))
canvas.alpha_composite(word, (mark.width + GAP_L + DIV_W + GAP_R,
                              (ch - word.height) // 2))
dx = mark.width + GAP_L
ImageDraw.Draw(canvas).rectangle([dx, 17, dx + DIV_W - 1, 352], fill=VIOLET)

TARGET = 900
canvas.resize((TARGET, round(ch * TARGET / cw)), Image.LANCZOS)       .save(os.path.join(OUT, 'logo.png'), optimize=True)

# Favicon: mark alone, centred on a padded transparent square.
S, PAD = 256, 22
inner = S - PAD * 2
sc = min(inner / mark.width, inner / mark.height)
mk = mark.resize((round(mark.width * sc), round(mark.height * sc)), Image.LANCZOS)
fav = Image.new('RGBA', (S, S), (0, 0, 0, 0))
fav.alpha_composite(mk, ((S - mk.width) // 2, (S - mk.height) // 2))
fav.save(os.path.join(OUT, 'favicon.png'), optimize=True)

print('wrote assets/logo.png and assets/favicon.png')
