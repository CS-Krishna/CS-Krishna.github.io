/* ════════════════════════════════════════════════
   terminal.js — interactive terminal widget
   ════════════════════════════════════════════════ */
'use strict';

(function initTerminal() {
  const body  = document.getElementById('term-body');
  const input = document.getElementById('term-input');
  const form  = document.getElementById('term-form');
  if (!body || !input) return;

  /* ─── COMMAND REGISTRY ─── */
  const CMD = {
    help: () => [
      { t: 'info', v: '// AVAILABLE COMMANDS' },
      { t: 'out',  v: '' },
      { t: 'out',  v: '  about           — Investigator profile' },
      { t: 'out',  v: '  experience       — Mission history' },
      { t: 'out',  v: '  projects         — Open case files' },
      { t: 'out',  v: '  skills           — Technology matrix' },
      { t: 'out',  v: '  certifications   — Credential vault' },
      { t: 'out',  v: '  achievements     — Commendations' },
      { t: 'out',  v: '  contact          — Open secure channel' },
      { t: 'out',  v: '  whoami           — Subject identity' },
      { t: 'out',  v: '  resume           — Download CV' },
      { t: 'out',  v: '  clear            — Clear terminal' },
      { t: 'out',  v: '  exit             — Close terminal' },
      { t: 'out',  v: '' },
      { t: 'cmt',  v: '  // Tip: use ↑↓ for history, Tab to autocomplete' },
    ],

    whoami: () => [
      { t: 'info', v: '// SUBJECT IDENTIFICATION' },
      { t: 'out',  v: '' },
      { t: 'out',  v: '  Name        :  Krishna Sachdevaa' },
      { t: 'out',  v: '  Role        :  Digital Forensics Analyst' },
      { t: 'out',  v: '  Institution :  NFSU Goa — M.Sc. DFIS' },
      { t: 'out',  v: '  Internship  :  Central Forensics Science Laboratory, Chandigarh (June 2026) [ ACTIVE ]' },
      { t: 'out',  v: '  Status      :  Available for Opportunities' },
      { t: 'out',  v: '' },
      { t: 'ok',   v: '  [VERIFIED] Subject record authenticated.' },
    ],

    about: () => {
      window.portfolioNav?.navToId('about');
      return [
        { t: 'ok',  v: '// Navigating → INVESTIGATOR PROFILE' },
        { t: 'out', v: '  Loading subject dossier...' },
        { t: 'ok',  v: '  Done.' },
      ];
    },

    experience: () => {
      window.portfolioNav?.navToId('experience');
      return [
        { t: 'info', v: '// MISSION LOG' },
        { t: 'out',  v: '' },
        { t: 'out',  v: '  [2026-06]  Central Forensics Science Laboratory, Chandigarh     — Forensic Intern  [ ACTIVE ]' },
        { t: 'out',  v: '  [2024]     Netsmartz            — Cybersecurity Intern' },
        { t: 'out',  v: '  [2023]     Super Student        — UAT Intern' },
        { t: 'out',  v: '  [ongoing]  CTF Platforms        — Competitor' },
        { t: 'out',  v: '' },
        { t: 'ok',   v: '  Navigating...' },
      ];
    },

    projects: () => {
      window.portfolioNav?.navToId('projects');
      return [
        { t: 'info', v: '// CASE FILES LOADED' },
        { t: 'out',  v: '' },
        { t: 'out',  v: '  [DF-001]   Android Forensics Tool       ★ FLAGSHIP' },
        { t: 'out',  v: '  [SEC-002]  Network Vulnerability Scanner' },
        { t: 'out',  v: '  [WEB-003]  Web Security Framework' },
        { t: 'out',  v: '' },
        { t: 'ok',   v: '  Navigating...' },
      ];
    },

    skills: () => {
      window.portfolioNav?.navToId('skills');
      return [
        { t: 'info', v: '// TECHNOLOGY MATRIX' },
        { t: 'out',  v: '' },
        { t: 'out',  v: '  Forensics   : Autopsy · FTK · ADB · Cellebrite · Volatility' },
        { t: 'out',  v: '  Security    : Burp Suite · Wireshark · Nmap · Metasploit' },
        { t: 'out',  v: '  Programming : Python · Bash · SQL · PowerShell' },
        { t: 'out',  v: '  Networking  : TCP/IP · Packet Analysis · DNS · Firewall' },
        { t: 'out',  v: '  Cloud / OS  : Kali Linux · Ubuntu · AWS · VMware · Docker' },
        { t: 'out',  v: '  Standards   : OWASP · NIST · ISO 27001 · MITRE ATT&CK' },
        { t: 'out',  v: '' },
        { t: 'ok',   v: '  Navigating...' },
      ];
    },

    certifications: () => {
      window.portfolioNav?.navToId('certifications');
      return [
        { t: 'info', v: '// CREDENTIAL VAULT' },
        { t: 'out',  v: '' },
        { t: 'out',  v: '  Google      — Cybersecurity Professional Certificate  [2023]' },
        { t: 'out',  v: '  EC-Council  — Certified Ethical Hacker (CEH)          [2024]' },
        { t: 'out',  v: '  ISC²        — Certified in Cybersecurity (CC)         [2024]' },
        { t: 'out',  v: '  eLearnsec   — Junior Penetration Tester (eJPT)        [2024]' },
        { t: 'out',  v: '' },
        { t: 'ok',   v: '  Navigating...' },
      ];
    },

    achievements: () => {
      window.portfolioNav?.navToId('achievements');
      return [
        { t: 'info', v: '// COMMENDATION RECORD' },
        { t: 'out',  v: '' },
        { t: 'out',  v: '  ✦  Android Forensics Tool — Published' },
        { t: 'out',  v: '  ✦  CFSL Forensic Internship — June 2026' },
        { t: 'out',  v: '  ✦  Google Cybersecurity Certificate' },
        { t: 'out',  v: '  ✦  ISC² & EC-Council Dual Certified' },
        { t: 'out',  v: '  ✦  Active CTF Competitor' },
        { t: 'out',  v: '  ✦  NFSU Goa — M.Sc. Admission' },
        { t: 'out',  v: '' },
        { t: 'ok',   v: '  Navigating...' },
      ];
    },

    contact: () => {
      window.portfolioNav?.navToId('contact');
      return [
        { t: 'info', v: '// SECURE CHANNEL' },
        { t: 'out',  v: '' },
        { t: 'out',  v: '  Email    :  krishna@sachdevakrishna.me' },
        { t: 'out',  v: '  GitHub   :  github.com/CS-Krishna' },
        { t: 'out',  v: '  LinkedIn :  linkedin.com/in/krishna-sachdev' },
        { t: 'out',  v: '  Web      :  sachdevakrishna.me' },
        { t: 'out',  v: '' },
        { t: 'ok',   v: '  Establishing connection...' },
      ];
    },

    resume: () => {
      document.querySelector('[data-resume]')?.click();
      return [
        { t: 'info', v: '// INITIATING DOWNLOAD' },
        { t: 'out',  v: '  Accessing credential archive...' },
        { t: 'out',  v: '  Verifying file integrity...' },
        { t: 'ok',   v: '  KrishnaSachdev-CV.pdf — Download started.' },
      ];
    },

    clear: () => {
      setTimeout(() => {
        body.innerHTML = '';
        addLine({ t: 'cmt', v: '// Terminal cleared. Type \'help\' for commands.' });
      }, 60);
      return [];
    },

    exit: () => {
      const panel = document.getElementById('terminal-panel');
      setTimeout(() => {
        if (panel) { panel.style.opacity = '0'; setTimeout(() => panel.style.display = 'none', 350); }
      }, 300);
      return [{ t: 'out', v: '// Closing terminal...' }];
    },
  };

  /* ─── RENDER ─── */
  const TYPE_MAP = {
    prompt: 'none',
    ok:     't-out-ok',
    info:   't-out-info',
    warn:   't-out-warn',
    err:    't-out-err',
    cmt:    't-comment',
    out:    't-out',
  };

  function esc(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function addLine(line, delay = 0) {
    return new Promise(res => setTimeout(() => {
      const el = document.createElement('span');
      el.className = 't-line';
      if (line.t === 'prompt') {
        el.innerHTML = `<span class="t-prompt">visitor@ks:~$</span> <span class="t-cmd">${esc(line.v)}</span>`;
      } else {
        el.className = `t-line ${TYPE_MAP[line.t] || 't-out'}`;
        el.textContent = line.v;
      }
      body.appendChild(el);
      body.scrollTop = body.scrollHeight;
      res();
    }, delay));
  }

  /* ─── HISTORY ─── */
  const hist = [];
  let histIdx = -1;

  /* ─── RUN ─── */
  async function run(raw) {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;
    hist.unshift(raw.trim());
    histIdx = -1;

    await addLine({ t: 'prompt', v: raw.trim() });

    if (CMD[cmd]) {
      const lines = CMD[cmd]() || [];
      for (let i = 0; i < lines.length; i++) {
        await addLine(lines[i], i * 26);
      }
      // spacer
      setTimeout(() => { addLine({ t: 'out', v: '' }); }, lines.length * 26 + 50);
    } else {
      await addLine({ t: 'err', v: `  Command not found: '${esc(cmd)}'. Type 'help'.` });
      await addLine({ t: 'out', v: '' }, 40);
    }
  }

  /* ─── INPUT ─── */
  form?.addEventListener('submit', e => {
    e.preventDefault();
    const val = input.value;
    input.value = '';
    run(val);
  });

  input.addEventListener('keydown', e => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (histIdx < hist.length - 1) { histIdx++; input.value = hist[histIdx]; }
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      histIdx > 0 ? (histIdx--, input.value = hist[histIdx]) : (histIdx = -1, input.value = '');
    }
    if (e.key === 'Tab') {
      e.preventDefault();
      const partial = input.value.trim().toLowerCase();
      if (!partial) return;
      const match = Object.keys(CMD).find(k => k.startsWith(partial) && k !== partial);
      if (match) input.value = match;
    }
  });

  /* ─── AUTO DEMO (runs after loader) ─── */
  function autoDemo() {
    addLine({ t: 'ok',   v: '// Secure connection established.' });
    addLine({ t: 'info', v: '// Welcome to Krishna Sachdeva\'s portfolio terminal.' });
    addLine({ t: 'cmt',  v: '// Type \'help\' to see available commands.' });
    addLine({ t: 'out',  v: '' });

    // Animate "whoami" being typed into placeholder
    const demo = 'whoami';
    let i = 0;
    const iv = setInterval(() => {
      if (i <= demo.length) {
        input.placeholder = demo.slice(0, i) + '▊';
        i++;
      } else {
        clearInterval(iv);
        input.placeholder = '';
        setTimeout(() => {
          run(demo);
          setTimeout(() => { input.placeholder = 'type a command...'; }, 600);
        }, 500);
      }
    }, 85);
  }

  setTimeout(autoDemo, 2000);
})();
