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
    dot.style.left  = mx + 'px'; dot.style.top   = my + 'px';
    rx += (mx - rx) * 0.12;     ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px'; ring.style.top  = ry + 'px';
    requestAnimationFrame(animate);
  })();

  const hoverSel = 'a,button,[role="button"],input,textarea,.proj-card,.cert-card,.ach-card,.drawer-item,.ch-item,.tag,.sg-tag';
  document.addEventListener('mouseover', e => { if (e.target.closest(hoverSel)) document.body.classList.add('cursor-hover'); });
  document.addEventListener('mouseout',  e => { if (e.target.closest(hoverSel)) document.body.classList.remove('cursor-hover'); });
  document.addEventListener('mousedown', () => document.body.classList.add('cursor-click'));
  document.addEventListener('mouseup',   () => document.body.classList.remove('cursor-click'));
  document.addEventListener('mouseleave',() => { dot.style.opacity='0'; ring.style.opacity='0'; });
  document.addEventListener('mouseenter',() => { dot.style.opacity='1'; ring.style.opacity='1'; });
})();

/* ─── LOADING SCREEN ─── */
(function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;
  // Dismiss after bar animation (700ms) + small buffer
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

  hamburger.addEventListener('click', () => drawer.classList.contains('is-open') ? close() : open());
  overlay.addEventListener('click', close);
  closeBtn?.addEventListener('click', close);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && drawer.classList.contains('is-open')) close(); });
  drawer.querySelectorAll('.drawer-item[data-section]').forEach(item => {
    item.addEventListener('click', () => setTimeout(close, 80));
  });
})();

/* ─── PAGE NAVIGATION ─── */
(function initPageNav() {
  const SECTIONS = ['hero','about','experience','projects','skills','certifications','achievements','contact'];
  const TOTAL    = SECTIONS.length;
  let current    = 0;

  // CSS already hides all .page-section via display:none
  // We only need to manage classes — no style manipulation

  function goTo(index, instant) {
    if (index < 0 || index >= TOTAL) return;

    // Hide old
    const oldEl = document.getElementById('section-' + SECTIONS[current]);
    if (oldEl) {
      oldEl.classList.remove('is-active', 'is-entering');
    }

    current = index;

    // Show new
    const newEl = document.getElementById('section-' + SECTIONS[current]);
    if (!newEl) return;

    newEl.classList.add('is-active');

    // Trigger opacity transition on next frame
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        newEl.classList.add('is-entering');
      });
    });

    window.scrollTo({ top: 0, behavior: instant ? 'auto' : 'smooth' });
    updateNav();
    triggerReveals(newEl);
  }

  function updateNav() {
    const id = SECTIONS[current];
    document.querySelectorAll('.drawer-item[data-section]').forEach(el => {
      el.classList.toggle('is-active', el.dataset.section === id);
    });
    document.querySelectorAll('.nav-link[data-section]').forEach(el => {
      el.classList.toggle('is-current', el.dataset.section === id);
    });
    document.querySelectorAll('.page-nav-indicator').forEach(el => {
      el.textContent = String(current + 1).padStart(2,'0') + ' / ' + String(TOTAL).padStart(2,'0');
    });
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

  // Wire up drawer
  document.querySelectorAll('.drawer-item[data-section]').forEach(el => {
    el.addEventListener('click', () => navToId(el.dataset.section));
  });
  // Wire up top nav
  document.querySelectorAll('.nav-link[data-section]').forEach(el => {
    el.addEventListener('click', () => navToId(el.dataset.section));
  });
  // Logo → hero
  document.querySelector('.nav-logo')?.addEventListener('click', () => goTo(0));
  // data-goto buttons
  document.querySelectorAll('[data-goto]').forEach(el => {
    el.addEventListener('click', () => navToId(el.dataset.goto));
  });
  // Prev / next
  document.addEventListener('click', e => {
    if (e.target.closest('.pnav-prev')) goTo(current - 1);
    if (e.target.closest('.pnav-next')) goTo(current + 1);
  });
  // Arrow keys
  document.addEventListener('keydown', e => {
    const tag = document.activeElement?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); goTo(current + 1); }
    if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   { e.preventDefault(); goTo(current - 1); }
  });

  // Expose for terminal.js
  window.portfolioNav = { goTo, navToId, SECTIONS };

  // Show hero immediately on load — no timeout, no wait
  goTo(0, true);
})();

/* ─── COUNT-UP ─── */
(function initCounters() {
  function countUp(el, target, duration) {
    const start = performance.now();
    (function step(now) {
      const p = Math.min((now - start) / duration, 1);
      const v = Math.round((1 - Math.pow(1 - p, 3)) * target);
      el.textContent = v + (el.dataset.suffix || '');
      if (p < 1) requestAnimationFrame(step);
    })(start);
  }
  const about = document.getElementById('section-about');
  if (!about) return;
  let ran = false;
  new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !ran) {
      ran = true;
      about.querySelectorAll('[data-count]').forEach(el => countUp(el, parseInt(el.dataset.count), 1200));
    }
  }, { threshold: 0.2 }).observe(about);
})();

/* ─── SCROLL REVEAL ─── */
(function initReveal() {
  new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('is-visible'); });
  }, { threshold: 0.08 }).observe.bind(
    new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('is-visible'); });
    }, { threshold: 0.08 })
  );
  // Simple approach
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('is-visible'); });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
})();

/* ─── DRAG SCROLL (Experience) ─── */
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
      cards.forEach(c => { c.style.display = (f === 'all' || c.dataset.category === f) ? '' : 'none'; });
    });
  });
})();

/* ─── SKILLS TAG TOGGLE ─── */
(function initSkillToggle() {
  document.querySelectorAll('.sg-tag, .tag').forEach(tag => {
    tag.addEventListener('click', () => tag.classList.toggle('is-active'));
  });
})();
