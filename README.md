# Inquirex: Deterministic DSL meets Probabilistic LLM

A presentation about the Inquirex questionnaire engine and its LLM integration.

## Quick Start

```bash
npm install
just serve    # or: python3 -m http.server 8000
```

Open http://localhost:8000

## Presentation Controls

- **→** or **Space** — Next slide
- **←** — Previous slide
- **Esc** — Overview mode
- **F** — Fullscreen
- **S** — Speaker notes

## Technologies

- reveal.js — presentation framework
- highlight.js (reveal.js plugin, Monokai theme) — syntax highlighting
- Vanta.js WAVES + Three.js r134 — animated amber background (screen only)
- Custom CSS theme:
  - Dosis semi-bold (body) + Bebas Neue (headers) + JetBrains Mono (code)
  - Warm amber / espresso palette tuned to the Vanta waves color `0x432800`
  - Print styles flip to white bg, dark-grey body text, black headers

## Export to PDF

```bash
just pdf
```

Requires decktape (`npm install -g decktape`).
