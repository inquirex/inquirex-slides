/* Responsive navigation dropdown.
 *
 * On narrow viewports (see CSS breakpoint), reveal.js's arrow controls are
 * hidden and this hamburger button appears top-right. Tapping it opens a
 * dropdown with Prev / Next / Overview buttons and a live list of slide
 * titles that the presenter can jump to.
 */

(function () {
  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    if (attrs) {
      for (const k in attrs) {
        if (k === 'dataset') {
          for (const dk in attrs[k]) node.dataset[dk] = attrs[k][dk];
        } else if (k === 'text') {
          node.textContent = attrs[k];
        } else {
          node.setAttribute(k, attrs[k]);
        }
      }
    }
    if (children) {
      for (const c of children) {
        if (c) node.appendChild(c);
      }
    }
    return node;
  }

  function buildDom() {
    const toggleBtn = el('button', {
      class: 'mobile-nav-toggle',
      'aria-label': 'Slide menu',
      'aria-expanded': 'false',
      type: 'button'
    }, [el('span'), el('span'), el('span')]);

    const prevBtn = el('button', { type: 'button', dataset: { action: 'prev' }, text: '\u2190 Prev', title: 'Previous slide' });
    const nextBtn = el('button', { type: 'button', dataset: { action: 'next' }, text: 'Next \u2192', title: 'Next slide' });
    const row = el('div', { class: 'mobile-nav-row' }, [prevBtn, nextBtn]);

    const overviewBtn = el('button', {
      type: 'button',
      class: 'mobile-nav-wide',
      dataset: { action: 'overview' },
      text: 'Overview'
    });

    const divider = el('div', { class: 'mobile-nav-divider' });
    const slideList = el('div', {
      class: 'mobile-nav-slides',
      role: 'group',
      'aria-label': 'Jump to slide'
    });

    const menu = el('div', {
      class: 'mobile-nav-menu',
      role: 'menu',
      'aria-hidden': 'true'
    }, [row, overviewBtn, divider, slideList]);

    const root = el('nav', { class: 'mobile-nav' }, [toggleBtn, menu]);
    document.body.appendChild(root);
    return root;
  }

  function populateSlides(root) {
    const list = root.querySelector('.mobile-nav-slides');
    list.textContent = '';
    const sections = document.querySelectorAll('.reveal .slides > section');
    sections.forEach((section, idx) => {
      const heading = section.querySelector('h1, h2, h3, h4');
      const label = heading ? heading.textContent.trim() : `Slide ${idx + 1}`;
      const btn = el('button', {
        type: 'button',
        class: 'mobile-nav-slide-item',
        dataset: { slideIndex: String(idx) },
        text: `${String(idx + 1).padStart(2, '0')}  ${label}`
      });
      list.appendChild(btn);
    });
  }

  function markActive(root) {
    const currentIdx = Reveal.getIndices().h;
    root.querySelectorAll('[data-slide-index]').forEach((btn) => {
      btn.classList.toggle(
        'active',
        parseInt(btn.dataset.slideIndex, 10) === currentIdx
      );
    });
  }

  function close(root) {
    root.classList.remove('open');
    root.querySelector('.mobile-nav-toggle').setAttribute('aria-expanded', 'false');
    root.querySelector('.mobile-nav-menu').setAttribute('aria-hidden', 'true');
  }

  function toggle(root) {
    const willOpen = !root.classList.contains('open');
    root.classList.toggle('open', willOpen);
    root.querySelector('.mobile-nav-toggle')
        .setAttribute('aria-expanded', String(willOpen));
    root.querySelector('.mobile-nav-menu')
        .setAttribute('aria-hidden', String(!willOpen));
  }

  function wire(root) {
    const btnToggle = root.querySelector('.mobile-nav-toggle');
    const menu = root.querySelector('.mobile-nav-menu');

    btnToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggle(root);
    });

    document.addEventListener('click', (e) => {
      if (!root.contains(e.target)) close(root);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && root.classList.contains('open')) close(root);
    });

    menu.addEventListener('click', (e) => {
      const hit = e.target.closest('button');
      if (!hit) return;
      const action = hit.dataset.action;
      const slideIndex = hit.dataset.slideIndex;

      if (slideIndex !== undefined) {
        Reveal.slide(parseInt(slideIndex, 10));
      } else if (action === 'prev') {
        Reveal.prev();
      } else if (action === 'next') {
        Reveal.next();
      } else if (action === 'overview') {
        Reveal.toggleOverview();
      }
      close(root);
    });
  }

  function init() {
    if (!window.Reveal) {
      document.addEventListener('DOMContentLoaded', init, { once: true });
      return;
    }
    // Skip in pdf-export modes — no navigation needed there.
    const htmlEl = document.documentElement;
    if (htmlEl.classList.contains('print-pdf') ||
        htmlEl.classList.contains('pdf-mode')) {
      return;
    }

    Reveal.on('ready', () => {
      const root = buildDom();
      populateSlides(root);
      wire(root);
      markActive(root);
      Reveal.on('slidechanged', () => markActive(root));
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
