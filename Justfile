# Inquirex Presentation — Justfile

[no-exit-message]
recipes:
    @just --choose

# Default task
default: serve

# Install npm dependencies
install:
    npm install

stop:
    /bin/ps -ef | egrep '[n]pm (run|exec) (dev|serve|browser-sync)' | awk '{print $2}' | xargs kill -TERM
    sleep 1
    /bin/ps -ef | egrep '[n]pm (run|exec) (dev|serve|browser-sync)' | awk '{print $2}' | xargs kill -KILL

# Start HTTP server
serve: stop
    npm run serve &

# Start with auto-reload
dev: stop
    npm run dev &

# Open in browser
preview: serve
    sleep 1 && open http://localhost:8000

# Open browser only
open:
    open http://localhost:8000

# Show slide count
stats:
    @echo "Slides: $(grep -c '^---$$' slides.md)"
    @echo "Code blocks: $(grep -c '^\`\`\`' slides.md)"
    @wc -w slides.md | awk '{print "Words: " $$1}'

# Export to PDF (requires decktape)
print-pdf: dev
    npx decktape reveal http://localhost:8001/?print-pdf inquirex-printout.pdf --size 1280x850
    open inquirex-printout.pdf

pdf: dev
    npx decktape reveal http://localhost:8001/?pdf inquirex.pdf --size 1280x850
    open inquirex.pdf

# Clean
clean:
    rm -rf node_modules

# Reinstall
reinstall: clean install
