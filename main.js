'use strict';

/* ══════════════════════════════════════════
   THEME — pill toggle, localStorage
══════════════════════════════════════════ */
const html = document.documentElement;

// Apply saved theme immediately (no flash)
let currentTheme = 'light';
try { currentTheme = localStorage.getItem('theme') || 'light'; } catch(e) {}
html.setAttribute('data-theme', currentTheme);

document.getElementById('themeToggle')?.addEventListener('click', function() {
  const next = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
  html.setAttribute('data-theme', next);
  try { localStorage.setItem('theme', next); } catch(e) {}
  // Button micro-bounce
  this.style.transform = 'scale(0.88)';
  setTimeout(() => { this.style.transform = ''; }, 180);
});

/* ══════════════════════════════════════════
   NAV — scroll shadow + active link
══════════════════════════════════════════ */
const nav = document.getElementById('nav');

function updateNav() {
  if (!nav) return;
  nav.classList.toggle('scrolled', window.scrollY > 48);
  const sections = [...document.querySelectorAll('section[id]')];
  const links    = [...document.querySelectorAll('.nav-links a')];
  let active = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) active = s.id; });
  links.forEach(a => {
    const on = a.getAttribute('href') === '#' + active;
    a.style.color      = on ? 'var(--text)' : '';
    a.style.fontWeight = on ? '600' : '';
  });
}
window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

/* ══════════════════════════════════════════
   MOBILE MENU
══════════════════════════════════════════ */
const ham = document.getElementById('ham');
const mob = document.getElementById('mobMenu');

ham?.addEventListener('click', () => {
  const open = mob.classList.toggle('open');
  ham.classList.toggle('open', open);
  ham.setAttribute('aria-expanded', String(open));
});

window.closeMob = function() {
  mob?.classList.remove('open');
  ham?.classList.remove('open');
  ham?.setAttribute('aria-expanded', 'false');
};

document.addEventListener('click', e => {
  if (mob?.classList.contains('open') && !e.target.closest('nav') && !e.target.closest('.mob-menu')) {
    closeMob();
  }
});

/* ══════════════════════════════════════════
   SCROLL REVEAL
══════════════════════════════════════════ */
const srEls = document.querySelectorAll('.sr');
if ('IntersectionObserver' in window && srEls.length) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.07, rootMargin: '0px 0px -28px 0px' });
  srEls.forEach(el => io.observe(el));
} else {
  srEls.forEach(el => el.classList.add('visible'));
}

/* ══════════════════════════════════════════
   HERO TYPE ROTATOR
══════════════════════════════════════════ */
(function() {
  const types = document.querySelectorAll('.served-type');
  if (!types.length) return;
  let i = 0;
  setInterval(() => {
    types[i].classList.remove('active');
    i = (i + 1) % types.length;
    types[i].classList.add('active');
  }, 1900);
})();

/* ══════════════════════════════════════════
   SERVICE ACCORDION
   Injects the +/× toggle button into each
   service card header and handles open/close
══════════════════════════════════════════ */
document.querySelectorAll('.svc').forEach((svc, idx) => {
  const head   = svc.querySelector('.svc-head');
  const detail = svc.querySelector('.svc-detail');
  if (!head || !detail) return;

  // Inject toggle indicator into grid (4th column)
  const toggle = document.createElement('span');
  toggle.className = 'svc-toggle';
  toggle.setAttribute('aria-hidden', 'true');
  toggle.textContent = '+';
  head.appendChild(toggle);

  head.addEventListener('click', () => {
    const isOpen = svc.classList.contains('open');

    // Close all first
    document.querySelectorAll('.svc.open').forEach(s => {
      s.classList.remove('open');
      const d = s.querySelector('.svc-detail');
      if (d) d.style.maxHeight = '0';
    });

    // Open clicked one if it was closed
    if (!isOpen) {
      svc.classList.add('open');
      detail.style.maxHeight = (detail.scrollHeight + 60) + 'px';
    }
  });

  // Open first service by default
  if (idx === 0) {
    svc.classList.add('open');
    detail.style.maxHeight = (detail.scrollHeight + 60) + 'px';
  }
});

/* ══════════════════════════════════════════
   FAQ ACCORDION
══════════════════════════════════════════ */
window.toggleFaq = function(btn) {
  const fi   = btn.closest('.fi');
  const fa   = fi.querySelector('.fa');
  const open = fi.classList.contains('open');

  document.querySelectorAll('.fi.open').forEach(item => {
    item.classList.remove('open');
    item.querySelector('.fa').style.maxHeight = '0';
    item.querySelector('.fq').setAttribute('aria-expanded', 'false');
  });

  if (!open) {
    fi.classList.add('open');
    fa.style.maxHeight = fa.scrollHeight + 'px';
    btn.setAttribute('aria-expanded', 'true');
  }
};

/* ══════════════════════════════════════════
   SMOOTH ANCHOR SCROLL
══════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    if (!id) return;
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    window.scrollTo({ top: target.offsetTop - 72, behavior: 'smooth' });
    closeMob();
  });
});

/* ══════════════════════════════════════════
   3D TILT on client cards
══════════════════════════════════════════ */
document.querySelectorAll('.client-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    card.style.transform  = `translateY(-5px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
    card.style.transition = 'transform 0.08s ease';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform  = '';
    card.style.transition = '';
  });
});

/* ══════════════════════════════════════════
   PARALLAX — hero name drifts on scroll
══════════════════════════════════════════ */
const heroName = document.querySelector('.hero-name');
if (heroName && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  window.addEventListener('scroll', () => {
    heroName.style.transform = `translateY(${window.scrollY * 0.10}px)`;
  }, { passive: true });
}

/* ══════════════════════════════════════════
   CONTACT FORM → WHATSAPP
══════════════════════════════════════════ */
window.submitForm = function(e) {
  e.preventDefault();
  const name  = document.getElementById('fn')?.value.trim();
  const phone = document.getElementById('fp')?.value.trim();
  const biz   = document.getElementById('fb')?.value.trim();
  const svc   = document.getElementById('fs')?.value;
  const msg   = document.getElementById('fm')?.value.trim();
  const note  = document.getElementById('formNote');

  if (!name || !phone || !biz) {
    if (note) {
      note.textContent = '⚠️ Please fill in your name, phone number, and business name.';
      note.style.color = 'var(--accent)';
      setTimeout(() => { note.textContent = '🔒 Private & confidential. No spam, ever.'; note.style.color = ''; }, 3500);
    }
    return;
  }

  const text = encodeURIComponent([
    'Hi Rayees! I came from your website.',
    '',
    `Name: ${name}`,
    `Phone: ${phone}`,
    `Business: ${biz}`,
    svc   ? `Service: ${svc}` : '',
    msg   ? `\nMessage: ${msg}` : '',
  ].filter(Boolean).join('\n'));

  window.open(`https://wa.me/918082127654?text=${text}`, '_blank', 'noopener');
};
