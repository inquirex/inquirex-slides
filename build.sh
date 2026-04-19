#!/usr/bin/env bash
# build.sh — produce a fully self-contained static build in dist/
# No bundler, no Vite. Just copies the files that index.html needs and
# rewrites node_modules/ paths to vendor/reveal/.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
DIST="$ROOT/dist"
NM="$ROOT/node_modules/reveal.js"

echo "→ Cleaning dist/"
rm -rf "$DIST"
mkdir -p "$DIST/vendor/reveal/dist/theme/fonts/source-sans-pro" \
         "$DIST/vendor/reveal/plugin/highlight" \
         "$DIST/vendor/reveal/plugin/markdown" \
         "$DIST/vendor/reveal/plugin/notes" \
         "$DIST/assets"

echo "→ Copying presentation assets"
cp "$ROOT/slides.md" "$DIST/"
cp -R "$ROOT/assets/css" "$ROOT/assets/js" "$ROOT/assets/img" "$DIST/assets/" 2>/dev/null || true

echo "→ Copying reveal.js runtime"
# Core CSS + JS
cp "$NM/dist/reveal.css"     "$DIST/vendor/reveal/dist/"
cp "$NM/dist/reveal.js"      "$DIST/vendor/reveal/dist/"
# Theme + fonts
cp "$NM/dist/theme/black.css" "$DIST/vendor/reveal/dist/theme/"
cp -R "$NM/dist/theme/fonts/source-sans-pro" "$DIST/vendor/reveal/dist/theme/fonts/"
# Plugins
cp "$NM/plugin/highlight/highlight.js" "$NM/plugin/highlight/monokai.css" "$DIST/vendor/reveal/plugin/highlight/"
cp "$NM/plugin/markdown/markdown.js" "$DIST/vendor/reveal/plugin/markdown/"
cp "$NM/plugin/notes/notes.js" "$NM/plugin/notes/speaker-view.html" "$DIST/vendor/reveal/plugin/notes/"

echo "→ Rewriting paths in index.html"
gsed 's|node_modules/reveal\.js/|vendor/reveal/|g' "$ROOT/index.html" > "$DIST/index.html"

FILE_COUNT=$(find "$DIST" -type f | wc -l | tr -d ' ')
SIZE=$(du -sh "$DIST" | cut -f1)
echo "✓ Built dist/ — $FILE_COUNT files, $SIZE total"
