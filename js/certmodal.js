/* ════════════════════════════════════════════════
   certmodal.js — in-page certificate viewer
   ════════════════════════════════════════════════ */
'use strict';

(function initCertModal() {
  const modal       = document.getElementById('cert-modal');
  const closeBtn    = document.getElementById('modal-close');
  const issuerEl    = document.getElementById('modal-issuer');
  const titleEl     = document.getElementById('modal-title');
  const yearEl      = document.getElementById('modal-year');
  const extLink     = document.getElementById('modal-ext-link');
  const imgWrap     = document.getElementById('modal-img-wrap');
  const imgEl       = document.getElementById('modal-img');
  const pdfWrap     = document.getElementById('modal-pdf-wrap');
  const pdfEl       = document.getElementById('modal-pdf');
  const placeholder = document.getElementById('modal-placeholder');
  const phTitle     = document.getElementById('modal-placeholder-title');
  const phPath      = document.getElementById('modal-placeholder-path');
  if (!modal) return;

  function open(card) {
    const issuer = card.dataset.certIssuer || '';
    const title  = card.dataset.certTitle  || '';
    const year   = card.dataset.certYear   || '';
    const ext    = card.dataset.certExt    || '#';
    const img    = card.dataset.certImg    || '';
    const pdf    = card.dataset.certPdf    || '';

    // Populate header
    issuerEl.textContent = issuer;
    titleEl.textContent  = title;
    yearEl.textContent   = year;
    extLink.href         = ext;
    extLink.textContent  = ext.includes('tryhackme') ? 'View Profile →' : 'View on Issuer Site →';

    // Reset all panels
    imgWrap.style.display     = 'none';
    pdfWrap.style.display     = 'none';
    placeholder.style.display = 'none';

    if (img) {
      // Try loading image — show placeholder if it 404s
      imgEl.onerror = () => {
        imgWrap.style.display     = 'none';
        placeholder.style.display = 'block';
        phTitle.textContent = title;
        phPath.textContent  = img;
      };
      imgEl.onload = () => { imgWrap.style.display = 'block'; };
      imgEl.src = img;
    } else if (pdf) {
      pdfEl.src = pdf;
      pdfWrap.style.display = 'block';
    } else {
      placeholder.style.display = 'block';
      phTitle.textContent = title;
      phPath.textContent  = `/certs/${issuer.toLowerCase().replace(/\s+/g,'-')}.jpg`;
    }

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function close() {
    modal.style.display  = 'none';
    document.body.style.overflow = '';
    imgEl.src  = '';
    pdfEl.src  = '';
  }

  // Wire up all cert cards
  document.querySelectorAll('.cert-card[data-cert-title]').forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => open(card));
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(card); } });
  });

  // Close via button, overlay click, or Escape
  closeBtn?.addEventListener('click', close);
  modal.addEventListener('click', e => { if (e.target === modal) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.style.display === 'flex') close(); });
})();
