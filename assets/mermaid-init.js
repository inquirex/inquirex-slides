/* Mermaid bootstrap for reveal.js.
 *
 * Finds ```mermaid code fences (rendered as `<pre><code class="language-mermaid">`
 * by reveal.js's markdown plugin), swaps them for `<div class="mermaid">` with
 * the raw source, and runs mermaid to render inline SVG diagrams.
 *
 * Themed to match the warm amber palette defined in theme.css.
 */

(function () {
  if (!window.mermaid) return;

  mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'loose',
    theme: 'base',
    fontFamily: '"Dosis", "Helvetica Neue", sans-serif',
    fontSize: 32, // doubled from mermaid's default ~16px
    themeVariables: {
      background:       'transparent',
      primaryColor:     '#1a0f06',
      primaryBorderColor: '#e9b872',
      primaryTextColor: '#fef8e7',
      secondaryColor:   '#281c0a',
      tertiaryColor:    '#0a0604',
      lineColor:        '#fbbf24',
      textColor:        '#fef8e7',
      nodeBorder:       '#e9b872',
      clusterBkg:       'rgba(20, 12, 4, 0.6)',
      clusterBorder:    'rgba(233, 184, 114, 0.4)',
      edgeLabelBackground: 'rgba(10, 6, 4, 0.85)',
      fontSize:         '32px'
    },
    flowchart: { htmlLabels: true, useMaxWidth: true, nodeSpacing: 50, rankSpacing: 70 }
  });

  function transformFences(root) {
    const scope = root || document;
    const codes = scope.querySelectorAll('code.language-mermaid');
    codes.forEach((code) => {
      const pre = code.closest('pre') || code;
      const source = code.textContent;
      const div = document.createElement('div');
      div.className = 'mermaid';
      div.textContent = source;
      pre.replaceWith(div);
    });
  }

  function run() {
    transformFences();
    try {
      mermaid.run({ querySelector: '.reveal .mermaid' });
    } catch (err) {
      console.error('[mermaid] render failed:', err);
    }
  }

  function init() {
    if (!window.Reveal) {
      document.addEventListener('DOMContentLoaded', init, { once: true });
      return;
    }
    Reveal.on('ready', run);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
