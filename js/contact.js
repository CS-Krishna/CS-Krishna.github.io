/* ════════════════════════════════════════════════
   contact.js — form validation + Formspree
   Works 100% on GitHub Pages — no backend needed.

   SETUP: Go to https://formspree.io/new
   Create a free form → copy your endpoint URL
   Replace FORMSPREE_ENDPOINT below with it.
   ════════════════════════════════════════════════ */
'use strict';

(function initContactForm() {
  // ↓ Replace with your Formspree endpoint after signing up
  // e.g. 'https://formspree.io/f/xabc1234'
  const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xqeoydpo';

  const form      = document.getElementById('contact-form');
  const msgEl     = document.getElementById('form-message');
  const submitBtn = document.getElementById('contact-submit');
  if (!form) return;

  const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setFieldError(id, hasError) {
    document.getElementById(id)?.classList.toggle('is-error', hasError);
  }

  function showMessage(type, text) {
    if (!msgEl) return;
    msgEl.className = `form-message is-${type}`;
    msgEl.textContent = text;
    msgEl.style.display = 'block';
  }

  function validate(name, email, message) {
    let ok = true;
    if (!name || name.trim().length < 2)          { setFieldError('f-name',    true); ok = false; }
    else                                             setFieldError('f-name',    false);
    if (!email || !EMAIL_RX.test(email))           { setFieldError('f-email',   true); ok = false; }
    else                                             setFieldError('f-email',   false);
    if (!message || message.trim().length < 10)    { setFieldError('f-message', true); ok = false; }
    else                                             setFieldError('f-message', false);
    return ok;
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const name    = document.getElementById('f-name')?.value    || '';
    const email   = document.getElementById('f-email')?.value   || '';
    const message = document.getElementById('f-message')?.value || '';
    const honey   = form.querySelector('[name="_honey"]')?.value || '';

    // Honeypot — bots fill hidden fields
    if (honey) return;

    if (!validate(name, email, message)) {
      showMessage('error', 'Please fill in all fields correctly.');
      return;
    }

    submitBtn.disabled    = true;
    submitBtn.textContent = 'Transmitting...';
    if (msgEl) msgEl.style.display = 'none';

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method:  'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });

      if (res.ok) {
        showMessage('success', '// Message received. I\'ll be in touch shortly.');
        form.reset();
        ['f-name','f-email','f-message'].forEach(id => setFieldError(id, false));
      } else {
        const json = await res.json().catch(() => ({}));
        showMessage('error', json?.error || 'Something went wrong. Email me directly.');
      }
    } catch {
      showMessage('error', 'Network error. Email krishna@sachdevakrishna.me directly.');
    } finally {
      submitBtn.disabled    = false;
      submitBtn.textContent = 'Send Message →';
    }
  });

  ['f-name','f-email','f-message'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', () => setFieldError(id, false));
  });
})();
