/* ════════════════════════════════════════════════
   typewriter.js — hero role switching animation
   ════════════════════════════════════════════════ */

'use strict';

(function initTypewriter() {
  const el = document.getElementById('hero-role-text');
  if (!el) return;

  const roles = [
    'Digital Forensics Analyst',
    'Cybersecurity Researcher',
    'Incident Responder',
    'Security Enthusiast',
    'CTF Competitor',
  ];

  let roleIndex  = 0;
  let charIndex  = 0;
  let isDeleting = false;
  let isPaused   = false;

  const CURSOR = '<span class="t-cursor"></span>';

  const TYPE_SPEED   = 72;
  const DELETE_SPEED = 38;
  const PAUSE_AFTER  = 2600;
  const PAUSE_BEFORE = 380;

  function tick() {
    if (isPaused) return;

    const current = roles[roleIndex];

    if (!isDeleting) {
      charIndex++;
      el.innerHTML = current.slice(0, charIndex) + CURSOR;

      if (charIndex === current.length) {
        isPaused = true;
        setTimeout(() => {
          isPaused   = false;
          isDeleting = true;
          tick();
        }, PAUSE_AFTER);
        return;
      }
      setTimeout(tick, TYPE_SPEED);
    } else {
      charIndex--;
      el.innerHTML = current.slice(0, charIndex) + CURSOR;

      if (charIndex === 0) {
        isDeleting = false;
        roleIndex  = (roleIndex + 1) % roles.length;
        setTimeout(tick, PAUSE_BEFORE);
        return;
      }
      setTimeout(tick, DELETE_SPEED);
    }
  }

  // Start after loader
  setTimeout(() => {
    el.innerHTML = CURSOR;
    tick();
  }, 1600);
})();
