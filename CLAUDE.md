# CLAUDE.md — Inquirex Presentation

## What This Repo Is

A reveal.js slide deck about the **Inquirex** questionnaire-engine ecosystem,
delivered at SFRuby in April 2026 by Konstantin Gredeskoul.

Title: *"Inquirex — Deterministic DSL meets Probabilistic LLM"*
Tagline: *Ask the right questions. Skip the rest.*

This directory is **only the slides** — it does not contain the gems themselves.
For context on what Inquirex is as a product, see the parent-directory
`../CLAUDE.md`. Anything about gem implementation, DSL design, or the JSON wire
format lives there; do not duplicate that content here.

## What Lives Here

```
inquirex-presentation/
├── index.html                ← reveal.js bootstrap + Vanta init
├── slides.md                 ← the entire deck, in Markdown
├── assets/
│   ├── css/theme.css         ← custom theme (fonts, palette, screen + print)
│   ├── js/
│   │   ├── three.r134.min.js ← Three.js r134 (required by Vanta)
│   │   └── vanta.waves.min.js← animated WAVES background
│   └── img/                  ← images referenced from slides
├── package.json              ← reveal.js dependency only
├── Justfile                  ← serve / preview / pdf / stats tasks
└── node_modules/             ← reveal.js (installed)
```

`slides.md` is loaded by reveal.js as external Markdown via `data-markdown`.
Slide separators are `^---$` (horizontal) and `^----$` (vertical).

## Visual System

The deck has **two distinct visual modes** that share the same Markdown source:

### Screen (live presentation)

- **Background:** animated Vanta WAVES layer (`#vanta-bg`), Three.js-driven,
  color `0x432800` (deep amber), shininess 84, slow warm swells.
- **Palette:** warm amber / espresso, tuned to harmonize with the waves:
  - `--brand` honey gold `#e9b872`
  - `--brand-light` pale gold `#fde68a`
  - `--accent` warm coral `#fb923c`
  - `--highlight` bright amber `#ffd166`
  - `--text-primary` cream `#fef8e7`
  - `--text-muted` sand `#cdb28a`
- Slides have **transparent backgrounds** so the Vanta animation shows through
  uniformly. A radial vignette on `#vanta-bg::after` deepens the edges to keep
  text centered in a calmer zone.
- Content blocks (tables, blockquotes, code) have semi-opaque warm-dark panels
  with a subtle backdrop-blur — they "float" above the waves rather than being
  absorbed into them.
- Body text carries a soft `text-shadow` to keep it crisp on the animated layer.

### Print / PDF export

- **Background:** solid white, Vanta layer hidden entirely.
- **Body text:** dark grey (`#333`), no text-shadow.
- **Headers (`h1/h2/h3`):** pure black. The title-slide gradient fill is
  overridden back to solid black.
- Tables, code blocks, and blockquotes swap to light-grey surfaces with
  light borders; syntax-highlighting tokens are overridden for readability
  on white.
- Triggered by `@media print` AND the `html.print-pdf` class that reveal.js
  sets when `?print-pdf` is in the URL (decktape uses this).

## Typography

Three fonts, all imported at the top of `assets/css/theme.css`:

| Role | Font | Weight | Notes |
|------|------|--------|-------|
| Body (`.reveal`) | **Dosis** | 600 (semi-bold) | paragraphs, lists, blockquotes |
| Headers (`h1`, `h2`, `h3`) | **Bebas Neue** | 400 (only weight it ships) | display-style, caps-height glyphs |
| Code (`code`, `pre`) | **JetBrains Mono** | 400 / 600 | syntax highlighting via Monokai plugin |

If you change a font, update the `@import` URL at the top of `theme.css` AND
the `font-family` declarations — both must match. Bebas Neue has only weight 400;
do not apply `font-weight: 500/600/700` to headers expecting a heavier variant.

## Running the Deck

```bash
just serve        # python3 -m http.server 8000
just serve-watch  # browser-sync with live reload
just preview      # serve + open browser
just pdf          # export via decktape (npm i -g decktape required)
just stats        # slide count / code-block count / word count
```

Open at http://localhost:8000.

Reveal.js config lives inline in `index.html` (1280×720, fade transitions,
slide numbers `c/t`, center layout). Plugins enabled: markdown, highlight, notes.

## Editing Conventions

- All slide content is in `slides.md`. Do **not** move content into `index.html`.
- **Do not add per-slide `data-background-color` or `data-background-gradient`**
  directives. Slides are deliberately transparent so the Vanta layer shows
  through uniformly. The two exceptions are the opener and closer, which carry
  `<!-- .slide: class="title-slide" -->` to pick up title-specific sizing.
- Use `---` (alone on a line) to separate slides. Never `----` unless you
  genuinely want a vertical sub-slide stack.
- Code blocks use fenced triple-backticks with language tags (`ruby`, `json`,
  `text`, `html`). Syntax highlighting is handled by the reveal.js highlight
  plugin (Monokai theme on screen; overridden light-theme tokens in print).
- Keep code blocks under ~25 lines so they don't scroll. `theme.css` caps
  `pre code` at `max-height: 520px`.
- Tables are fine for comparisons; the theme styles them as floating
  warm-dark panels with amber-tinted headers. Keep them to ~7 rows max at
  the deck's 720px stage height.

## Theme Gotchas

- The h1 on the title slide uses a honey→amber→coral gradient via
  `-webkit-background-clip: text`. Do **not** remove the paired
  `-webkit-text-fill-color: transparent` — without it the gradient won't
  render and the title falls back to solid cream.
- The Vanta layer (`#vanta-bg`) is `position: fixed` behind the reveal
  container. If you change the reveal stacking, preserve the rule that makes
  `.reveal .backgrounds` and `.reveal .slide-background*` transparent —
  otherwise reveal's own background layer paints over the waves.
- Print/PDF rules use `!important` extensively because they need to beat
  inline styles and reveal.js built-ins. Don't remove the `!important`
  without testing a real decktape export.

## When Working on This Deck

- **Don't touch `../CLAUDE.md` or any gem source** from here — this directory
  only owns the presentation. Gem changes belong in their own subrepo.
- **Don't add build tooling** (bundlers, PostCSS, SCSS compilers). The deck
  is deliberately a static HTML file + one CSS file + one Markdown file +
  two vendored JS libraries. Keep it deployable by dropping the directory
  on any static host.
- **Don't edit files under `node_modules/`** or the vendored
  `assets/js/three.r134.min.js` / `vanta.waves.min.js`. If reveal.js or
  Vanta behavior needs tweaking, override via `theme.css` or the init
  block in `index.html`.
- **Verify visually** after CSS or font changes: start `just serve-watch`
  and look at several representative slides (title, a code-heavy slide, a
  table, a blockquote). Also test the print view (Cmd-P preview or
  `just pdf`) to confirm white bg + dark-grey text + black headers still hold.
- **PDF export** uses decktape at 1280×720 with `?print-pdf`. If slides
  overflow in PDF but look fine in the browser, check `max-height` rules in
  `theme.css` — decktape is stricter about vertical bounds than live reveal.js.
