/* ════════════════════════════════════════════════
   main.js — cursor, drawer, page nav, reveal
   ════════════════════════════════════════════════ */
'use strict';

/* ─── CURSOR ─── */
(function initCursor() {
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring || window.matchMedia('(pointer: coarse)').matches) return;

  let mx = -100, my = -100, rx = -100, ry = -100;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  (function animate() {
    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animate);
  })();

  const hoverSel = 'a, button, [role="button"], input, textarea, .proj-card, .cert-card, .ach-card, .drawer-item, .ch-item, .tag, .sg-tag';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverSel)) document.body.classList.add('cursor-hover');
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverSel)) document.body.classList.remove('cursor-hover');
  });
  document.addEventListener('mousedown', () => document.body.classList.add('cursor-click'));
  document.addEventListener('mouseup',   () => document.body.classList.remove('cursor-click'));
  document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; ring.style.opacity = '1'; });
})();

/* ─── LOADING SCREEN ─── */
(function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;
  // Dismiss after animation finishes
  setTimeout(() => loader.classList.add('is-done'), 900);
})();

/* ─── DRAWER ─── */
(function initDrawer() {
  const hamburger = document.getElementById('hamburger');
  const drawer    = document.getElementById('drawer');
  const overlay   = document.getElementById('drawer-overlay');
  const closeBtn  = document.getElementById('drawer-close');
  if (!hamburger || !drawer || !overlay) return;

  function open() {
    drawer.classList.add('is-open');
    overlay.classList.add('is-open');
    hamburger.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    hamburger.setAttribute('aria-expanded', 'true');
    setTimeout(() => closeBtn?.focus(), 350);
  }
  function close() {
    drawer.classList.remove('is-open');
    overlay.classList.remove('is-open');
    hamburger.classList.remove('is-open');
    document.body.style.overflow = '';
    hamburger.setAttribute('aria-expanded', 'false');
  }

  hamburger.addEventListener('click', () =>
    drawer.classList.contains('is-open') ? close() : open()
  );
  overlay.addEventListener('click', close);
  closeBtn?.addEventListener('click', close);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) close();
  });
  // Close on nav item click (nav handler fires first, then this)
  drawer.querySelectorAll('.drawer-item[data-section]').forEach(item => {
    item.addEventListener('click', () => setTimeout(close, 80));
  });
})();

/* ─── PAGE NAVIGATION ─── */
(function initPageNav() {
  const SECTIONS = [
    'hero', 'about', 'experience', 'projects',
    'skills', 'certifications', 'achievements', 'contact'
  ];
  const TOTAL = SECTIONS.length;
  let current = 0;

  /* Hide all sections initially via JS (CSS sets display:none as default) */
  SECTIONS.forEach(id => {
    const el = document.getElementById('section-' + id);
    if (el) el.style.display = 'none';
  });

  function goTo(index, instant = false) {
    if (index < 0 || index >= TOTAL) return;

    // Hide current
    const oldEl = document.getElementById('section-' + SECTIONS[current]);
    if (oldEl) {
      oldEl.style.opacity = '0';
      setTimeout(() => { oldEl.style.display = 'none'; }, instant ? 0 : 280);
    }

    current = index;

    // Show new
    const newEl = document.getElementById('section-' + SECTIONS[current]);
    if (!newEl) return;

    newEl.style.display = 'block';
    newEl.style.opacity = '0';
    void newEl.offsetHeight; // reflow
    newEl.style.transition = instant ? 'none' : 'opacity 0.35s ease';
    newEl.style.opacity = '1';

    window.scrollTo({ top: 0, behavior: instant ? 'auto' : 'smooth' });
    updateNav();
    triggerReveals(newEl);
  }

  function updateNav() {
    const id = SECTIONS[current];
    // Drawer
    document.querySelectorAll('.drawer-item[data-section]').forEach(el => {
      el.classList.toggle('is-active', el.dataset.section === id);
    });
    // Top nav
    document.querySelectorAll('.nav-link[data-section]').forEach(el => {
      el.classList.toggle('is-current', el.dataset.section === id);
    });
    // Indicators
    document.querySelectorAll('.page-nav-indicator').forEach(el => {
      el.textContent =
        String(current + 1).padStart(2, '0') + ' / ' +
        String(TOTAL).padStart(2, '0');
    });
    // Disable prev/next at boundaries
    document.querySelectorAll('.pnav-prev').forEach(btn => { btn.disabled = current === 0; });
    document.querySelectorAll('.pnav-next').forEach(btn => { btn.disabled = current === TOTAL - 1; });
  }

  function triggerReveals(container) {
    container.querySelectorAll('.reveal').forEach((el, i) => {
      el.classList.remove('is-visible');
      setTimeout(() => el.classList.add('is-visible'), 60 + i * 75);
    });
  }

  function navToId(sectionId) {
    const idx = SECTIONS.indexOf(sectionId);
    if (idx !== -1) goTo(idx);
  }

  /* Wire up: drawer items */
  document.querySelectorAll('.drawer-item[data-section]').forEach(el => {
    el.addEventListener('click', () => navToId(el.dataset.section));
  });

  /* Wire up: top nav links */
  document.querySelectorAll('.nav-link[data-section]').forEach(el => {
    el.addEventListener('click', () => navToId(el.dataset.section));
  });

  /* Wire up: logo → hero */
  document.querySelector('.nav-logo')?.addEventListener('click', () => goTo(0));

  /* Wire up: [data-goto] buttons anywhere */
  document.querySelectorAll('[data-goto]').forEach(el => {
    el.addEventListener('click', () => navToId(el.dataset.goto));
  });

  /* Wire up: prev/next page nav buttons */
  document.addEventListener('click', e => {
    if (e.target.closest('.pnav-prev')) goTo(current - 1);
    if (e.target.closest('.pnav-next')) goTo(current + 1);
  });

  /* Keyboard: arrow keys (only when not in an input) */
  document.addEventListener('keydown', e => {
    const tag = document.activeElement?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); goTo(current + 1); }
    if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   { e.preventDefault(); goTo(current - 1); }
  });

  /* Expose globally so terminal.js can call it */
  window.portfolioNav = { goTo, navToId, SECTIONS };

  /* Init: show hero immediately */
  goTo(0, true);
})();

/* ─── COUNT-UP ─── */
(function initCounters() {
  function countUp(el, target, duration) {
    const start = performance.now();
    (function step(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target) + (el.dataset.suffix || '');
      if (p < 1) requestAnimationFrame(step);
    })(start);
  }

  const aboutSection = document.getElementById('section-about');
  if (!aboutSection) return;

  let ran = false;
  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !ran) {
      ran = true;
      aboutSection.querySelectorAll('[data-count]').forEach(el => {
        countUp(el, parseInt(el.dataset.count, 10), 1200);
      });
    }
  }, { threshold: 0.2 });
  obs.observe(aboutSection);
})();

/* ─── SCROLL REVEAL (within a page) ─── */
(function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('is-visible'); });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
})();

/* ─── DRAG-SCROLL (Experience timeline) ─── */
(function initDragScroll() {
  document.querySelectorAll('.exp-scroll').forEach(wrap => {
    let down = false, startX, left;
    wrap.addEventListener('mousedown',  e => { down = true; startX = e.pageX - wrap.offsetLeft; left = wrap.scrollLeft; });
    wrap.addEventListener('mouseleave', () => down = false);
    wrap.addEventListener('mouseup',    () => down = false);
    wrap.addEventListener('mousemove',  e => {
      if (!down) return;
      e.preventDefault();
      wrap.scrollLeft = left - (e.pageX - wrap.offsetLeft - startX) * 1.4;
    });
  });
})();

/* ─── PROJECT FILTER ─── */
(function initProjectFilter() {
  const btns  = document.querySelectorAll('.proj-filter-btn');
  const cards = document.querySelectorAll('.proj-card[data-category]');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const f = btn.dataset.filter;
      cards.forEach(c => {
        c.style.display = (f === 'all' || c.dataset.category === f) ? '' : 'none';
      });
    });
  });
})();

/* ─── SKILLS TAG TOGGLE ─── */
(function initSkillToggle() {
  document.querySelectorAll('.sg-tag').forEach(tag => {
    tag.addEventListener('click', () => tag.classList.toggle('is-active'));
  });
})();
