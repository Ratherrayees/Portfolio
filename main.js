/* ============================================================
   RAYEES AHMAD RATHER — PORTFOLIO JS
   ============================================================ */

'use strict';

/* ─── CUSTOM CURSOR ─── */
(function initCursor() {
  const cursor = document.getElementById('cursor');
  const ring   = document.getElementById('cursor-ring');
  if (!cursor || !ring) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  // Smooth lag for ring
  function animateRing() {
    rx += (mx - rx) * 0.13;
    ry += (my - ry) * 0.13;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Expand cursor on interactive elements
  document.addEventListener('mouseover', e => {
    if (e.target.closest('a, button, [role="button"]')) {
      cursor.style.width  = '18px';
      cursor.style.height = '18px';
      ring.style.width    = '52px';
      ring.style.height   = '52px';
      ring.style.borderColor = 'rgba(184,242,77,0.5)';
    }
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest('a, button, [role="button"]')) {
      cursor.style.width  = '';
      cursor.style.height = '';
      ring.style.width    = '';
      ring.style.height   = '';
      ring.style.borderColor = '';
    }
  });
})();


/* ─── NAVBAR ─── */
(function initNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;

  // Scroll-based style
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  // Active link highlight
  const sections = Array.from(document.querySelectorAll('section[id]'));
  const links    = Array.from(document.querySelectorAll('.nav-links a'));

  const updateActive = () => {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 140) current = s.id;
    });
    links.forEach(a => {
      const active = a.getAttribute('href') === '#' + current;
      a.style.color = active ? 'var(--text)' : '';
      a.style.fontWeight = active ? '700' : '';
    });
  };
  window.addEventListener('scroll', updateActive, { passive: true });

  // Mobile hamburger
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  if (!hamburger || !navLinks) return;

  // Create mobile drawer
  const drawer = document.createElement('div');
  drawer.className = 'nav-drawer';
  drawer.setAttribute('aria-label', 'Mobile navigation');
  drawer.innerHTML = `
    <a href="#about" onclick="closeDrawer()">About</a>
    <a href="#services" onclick="closeDrawer()">Services</a>
    <a href="#work" onclick="closeDrawer()">Work</a>
    <a href="#process" onclick="closeDrawer()">Process</a>
    <a href="#faq" onclick="closeDrawer()">FAQ</a>
    <div class="nav-drawer-cta">
      <a href="https://wa.me/918082127654?text=Hi%20Rayees%2C%20I%20want%20to%20grow%20my%20business." class="btn btn-wa" target="_blank" rel="noopener" style="width:100%;justify-content:center;">💬 WhatsApp</a>
    </div>`;
  document.querySelector('header').appendChild(drawer);

  let drawerOpen = false;

  hamburger.addEventListener('click', () => {
    drawerOpen = !drawerOpen;
    hamburger.classList.toggle('open', drawerOpen);
    hamburger.setAttribute('aria-expanded', drawerOpen);
    drawer.classList.toggle('open', drawerOpen);
  });

  window.closeDrawer = function () {
    drawerOpen = false;
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    drawer.classList.remove('open');
  };

  // Close on outside click
  document.addEventListener('click', e => {
    if (drawerOpen && !e.target.closest('header')) closeDrawer();
  });
})();


/* ─── SCROLL REVEAL ─── */
(function initReveal() {
  const els = document.querySelectorAll('.sr');
  if (!els.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => observer.observe(el));
})();


/* ─── ANIMATED COUNTERS ─── */
(function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';
      let start    = 0;
      const duration = 1400;
      const startTime = performance.now();

      const step = now => {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        const current  = Math.floor(eased * target);
        el.textContent = prefix + current + suffix;
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = prefix + target + suffix;
      };
      requestAnimationFrame(step);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
})();


/* ─── HERO CARD PROGRESS BAR ─── */
(function initProgressBar() {
  const fill = document.querySelector('.hcard-fill');
  if (!fill) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        fill.classList.add('animated');
        observer.unobserve(fill);
      }
    });
  }, { threshold: 0.3 });
  observer.observe(fill);
})();


/* ─── FAQ ACCORDION ─── */
window.toggleFaq = function (btn) {
  const item   = btn.closest('.fi');
  const answer = item.querySelector('.fa');
  const isOpen = item.classList.contains('open');

  // Close all
  document.querySelectorAll('.fi.open').forEach(openItem => {
    openItem.classList.remove('open');
    const a = openItem.querySelector('.fa');
    a.hidden = false;
    a.style.maxHeight = '0';
    setTimeout(() => { if (!openItem.classList.contains('open')) a.hidden = true; }, 400);
    openItem.querySelector('.fq').setAttribute('aria-expanded', 'false');
  });

  if (!isOpen) {
    item.classList.add('open');
    answer.hidden = false;
    // Force reflow
    answer.getBoundingClientRect();
    answer.style.maxHeight = answer.scrollHeight + 'px';
    btn.setAttribute('aria-expanded', 'true');
  }
};


/* ─── CONTACT FORM → WHATSAPP ─── */
window.handleFormSubmit = function (e) {
  e.preventDefault();
  const form = e.target;

  // Basic validation
  const name  = form.querySelector('#f-name').value.trim();
  const phone = form.querySelector('#f-phone').value.trim();
  const biz   = form.querySelector('#f-biz').value.trim();
  const svc   = form.querySelector('#f-svc').value;
  const msg   = form.querySelector('#f-msg').value.trim();

  if (!name || !phone || !biz) {
    showFormError('Please fill in your name, phone, and business name.');
    return;
  }

  const text = encodeURIComponent(
    `Hi Rayees! I came from your website.\n\n` +
    `Name: ${name}\n` +
    `Phone: ${phone}\n` +
    `Business: ${biz}\n` +
    `Service: ${svc || 'Not specified'}\n` +
    (msg ? `\nMessage: ${msg}` : '')
  );

  window.open(`https://wa.me/918082127654?text=${text}`, '_blank', 'noopener');
};

function showFormError(msg) {
  const note = document.querySelector('.form-note');
  if (note) {
    const original = note.textContent;
    note.textContent = '⚠️ ' + msg;
    note.style.color = '#f2704d';
    setTimeout(() => {
      note.textContent = original;
      note.style.color = '';
    }, 3500);
  }
}


/* ─── SMOOTH SECTION TRANSITIONS ─── */
(function initSmoothLinks() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const id = anchor.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const offset = 80; // nav height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


/* ─── PERFORMANCE: LAZY LOAD FONTS CHECK ─── */
(function checkFonts() {
  if (!document.fonts) return;
  document.fonts.ready.then(() => {
    document.body.classList.add('fonts-loaded');
  });
})();
