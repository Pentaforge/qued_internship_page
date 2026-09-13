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
index.html          all page content
css/tokens.css      color, type, spacing variables — edit here to restyle
css/style.css       layout and components
js/main.js          nav, mobile menu, FAQ accordion, scroll reveals
assets/             logo, hero graphic, QR code, favicon (all SVG)
```

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
