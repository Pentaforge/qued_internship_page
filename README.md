# QUED Metrics — Academic Intelligence Internship

Single-page recruitment site. Static HTML/CSS/JS, no build step, no dependencies.

## Preview

Open `index.html` in any browser. That's it.

For a local server (optional, closer to production):

```bash
python -m http.server 8000
# → http://localhost:8000
```

## Structure

```
index.html            all page content
css/tokens.css        color, type, spacing variables — edit here to restyle
css/style.css         layout and components
js/main.js            nav, mobile menu, FAQ accordion, scroll reveals
assets/quedlogo.jpeg  the official logo — source of truth, not used by the page
assets/logo.png       lockup used in the nav and footer (generated)
assets/favicon.png    mark only, for the browser tab (generated)
assets/node-graph.svg hero ornament
assets/qr-apply.svg   QR to the application form
assets/QUED-Metrics-Internship-Brochure.pdf   the downloadable brochure (2.3 MB)
tools/build-logo.py   regenerates logo.png + favicon.png from the JPEG
```

## The logo

`assets/quedlogo.jpeg` is the official artwork and the source of truth. The page
does not use it directly: it is a JPEG on solid black, so it would show a black
box wherever the background behind it isn't black — most visibly over the hero's
violet glow.

`tools/build-logo.py` keys that black out to real transparency and writes the two
files the page actually loads:

```bash
pip install Pillow
python tools/build-logo.py
```

- **`logo.png`** — mark + divider + QUED/METRICS. The strapline is deliberately
  not baked in: in the source art it is ~1/6 the height of the QUED letters, so at
  any web size it renders as an unreadable smudge. The footer prints it as real
  text beside the copyright instead.
- **`favicon.png`** — the mark alone, centred on a padded transparent square.

If you ever get a proper **vector** of the logo (`.svg`, `.ai`, `.eps`), use it
instead — it will be sharper at every size and a fraction of the file size. Drop
it in `assets/`, point the two `<img>` tags in `index.html` at it, and delete the
generated PNGs.

## Before publishing — CONFIRM the FAQ

Every answer in the FAQ section is a **placeholder**. Search `index.html` for
`CONFIRM` and verify each one against reality:

| Question | Needs a real answer for |
| --- | --- |
| Is this a paid internship? | stipend / unpaid |
| How many hours a week? | actual expected commitment |
| Which branches and semesters? | any semester restriction |
| Is the certificate genuine? | how certificates are issued |
| How do I apply, what next? | selection process and timeline |

Publishing a wrong answer here costs more trust than having no FAQ at all.

## Changing things

**Colors and type** — `css/tokens.css` only. The violet is `--violet`; everything
derives from it.

**The brochure** — `assets/QUED-Metrics-Internship-Brochure.pdf`, offered in three
places: the closing CTA, under the "At a glance" table, and in the mobile menu. If
you replace it, keep the filename or update all three `href`s, and update the
"2.3 MB" size labels next to them.

**The application link** — `https://forms.gle/FZE1u6SCtA6q9dEq7` appears in four
places in `index.html` (nav, mobile menu, hero, CTA). If it changes, also
regenerate the QR:

```bash
pip install segno
python -c "import segno; segno.make('NEW_URL', error='m').save('assets/qr-apply.svg', scale=10, border=2, dark='#0B0B0F', light=None, omitsize=True)"
```

**Adding a section** — copy the pattern: `<p class="eyebrow">` → `<h2 class="h2">`
→ one `<p class="lede">`, wrapped in `<section class="section"><div class="wrap">`.
Add `class="reveal"` to anything that should fade in on scroll.

## Deploying

Any static host. Drag the folder into Netlify, or:

```bash
git init && git add . && git commit -m "Initial site"
# push to GitHub, then enable Pages on the main branch
```

Point `quedmetrics.com` at the host once it's live.

## Notes

- Fonts load from Google Fonts with system fallbacks; the page renders fine offline.
- All animation is disabled under `prefers-reduced-motion`.
- No analytics or trackers are included.
