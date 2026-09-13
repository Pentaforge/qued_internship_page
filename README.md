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
assets/og-image.png   1200x630 link-preview card (WhatsApp, Twitter, LinkedIn)
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

**The share message and URL** — top of `js/main.js`: `SHARE_URL`, `SHARE_TITLE`,
`SHARE_TEXT`. The Share buttons (closing CTA + mobile menu) are **phone-only**: they
are `hidden` in the HTML and JS decides three ways from what the device supports:

| Device | Behaviour |
| --- | --- |
| Touch + `navigator.share` | OS share sheet, label "Share" |
| Touch, no `navigator.share` | WhatsApp deep link (`wa.me`), label "WhatsApp" |
| Laptop / desktop (fine pointer) | Element removed entirely |

The WhatsApp branch exists because **Firefox for Android only gained
`navigator.share` in v155** — most Firefox users have no native share sheet. The
pointer test is needed on top of the feature test because macOS Safari supports
`navigator.share` on laptops, where the button makes no sense.

**`navigator.share` requires HTTPS.** Over plain `http://` it is undefined even in
Chrome, so testing on a bare IP address will silently fall through to WhatsApp.

**Link previews** — `assets/og-image.png` is what WhatsApp/Twitter/LinkedIn show when
someone forwards the link. The `og:image` tag uses an **absolute** URL
(`https://quedmetrics.com/assets/og-image.png`) because relative paths do not work
for previews. If the domain changes, update that tag and `SHARE_URL` together.
To regenerate the card, see git history for `_og.html` — it renders in the browser
at 1200x630 using the real brand fonts.

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

## Mobile

The phone layout is tuned in a `@media (max-width: 719px)` block near the bottom of
`style.css`. Decisions worth knowing before you change them:

- **The QR code is hidden on phones.** A QR cannot be scanned by the device showing
  it, so it was pure dead space; the Apply button directly above does the same job.
  It still appears from 720px up, where someone may scan it with a second device.
- **Button hierarchy differs by section.** The hero has two actions, stacked full
  width. The closing CTA has three: primary full width with the two secondaries
  paired on the row below, because three identical stacked pills read as a flat list
  with no primary. The `forms.gle` URL and the `2.3 MB` size label are hidden there
  on phones for room — the mobile menu and the "At a glance" link still show the size.
- **Tap targets are >= 44px** (Apple HIG / WCAG 2.5.5). Footer links get vertical
  padding rather than margin so the hit area grows without changing the visual gap.
  Inline links inside sentences are exempt under WCAG and are left alone.
- **Body copy is 16px on phones** (15px elsewhere) and section padding is tighter.
- **Safe-area insets** keep the nav and menu clear of notches and home indicators.
- `logo.png` is generated at 600px wide: exactly 3x the largest place it is shown,
  so it stays sharp on retina without shipping a needlessly heavy file.

Total first load on mobile is about **100 KB**. The brochure PDF (2.3 MB) is only
fetched when someone taps a download link, and `og-image.png` is never fetched by the
page at all — it is only read by WhatsApp/Twitter/LinkedIn when a link is shared.

## Notes

- Fonts load from Google Fonts with system fallbacks; the page renders fine offline.
- All animation is disabled under `prefers-reduced-motion`.
- No analytics or trackers are included.
