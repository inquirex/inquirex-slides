/* Wrap every slide's primary heading in an anchor that opens the deck in
 * reveal.js's scroll view (all slides stacked, full-width, no nav chrome),
 * jumped to the same slide the user was on. Opens in a new tab.
 *
 * The scroll view itself is activated by `?view=scroll` which index.html
 * translates into `Reveal.initialize({ view: 'scroll', ... })`.
 */

(function () {
  function init() {
    if (!window.Reveal) {
      document.addEventListener('DOMContentLoaded', init, { once: true });
      return;
    }

    // Skip when we're *already* in the scroll view or a pdf-export mode —
    // no point linking to ourselves, and PDFs shouldn't carry live links.
    const params = new URLSearchParams(window.location.search);
    if (params.get('view') === 'scroll' || params.has('pdf')) return;
    if (document.documentElement.classList.contains('print-pdf')) return;

    Reveal.on('ready', () => {
      const sections = document.querySelectorAll('.reveal .slides > section');
      sections.forEach((section, idx) => {
        // Prefer h2 on content slides; fall back to h1 on title slides.
        const heading = section.querySelector('h2') || section.querySelector('h1');
        if (!heading || heading.dataset.linked === 'true') return;
        heading.dataset.linked = 'true';

        const anchor = document.createElement('a');
        anchor.className = 'title-link';
        anchor.href = `?view=scroll#/${idx}`;
        anchor.target = '_blank';
        anchor.rel = 'noopener';
        anchor.title = 'Open in scroll view (full-width, all slides)';

        // Stop the click from bubbling into reveal's own keyboard/touch handler.
        anchor.addEventListener('click', (e) => e.stopPropagation());

        // Move all heading children into the anchor so gradient fills,
        // text-shadows, and any inline markup are preserved.
        while (heading.firstChild) anchor.appendChild(heading.firstChild);
        heading.appendChild(anchor);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
