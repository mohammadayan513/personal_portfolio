/**
 * ALEX MORGAN — PORTFOLIO SCRIPT
 * File: js/script.js
 *
 * SECTIONS
 *  1. Loader
 *  2. Navbar — scroll behaviour & active link
 *  3. Hamburger / Mobile Menu
 *  4. Smooth Scroll (anchor clicks)
 *  5. Scroll Reveal Animation (IntersectionObserver)
 *  6. Skill Bar Animation
 *  7. Project Filter (category buttons)
 *  8. Contact Form (UI feedback only)
 *  9. Back-to-top Button
 * 10. Footer — dynamic copyright year
 * 11. Typed Role Text (hero)
 * 12. Animated Stat Counters
 * 13. Scroll Progress Bar
 * 14. Cursor Glow
 */

'use strict';

/* ================================================================
   HELPERS
   ================================================================ */

/**
 * Shorthand for document.querySelector
 * @param {string} sel
 * @param {Element} [ctx=document]
 * @returns {Element|null}
 */
const $ = (sel, ctx = document) => ctx.querySelector(sel);

/**
 * Shorthand for document.querySelectorAll (returns Array)
 * @param {string} sel
 * @param {Element} [ctx=document]
 * @returns {Element[]}
 */
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];


/* ================================================================
   1. LOADER
   Hides the full-page loading screen after the page is ready.
   ================================================================ */
(function initLoader() {
  const loader = $('#loader');
  if (!loader) return;

  // Minimum display time so the animation completes visually
  const MIN_DURATION = 2200; // matches nameFade animation duration
  const startTime    = Date.now();

  function hide() {
    const elapsed = Date.now() - startTime;
    const delay   = Math.max(0, MIN_DURATION - elapsed);
    setTimeout(() => {
      loader.classList.add('hidden');
      // Remove from DOM after transition to free memory
      loader.addEventListener('transitionend', () => loader.remove(), { once: true });
    }, delay);
  }

  if (document.readyState === 'complete') {
    hide();
  } else {
    window.addEventListener('load', hide, { once: true });
  }
})();


/* ================================================================
   2. NAVBAR — scroll behaviour & active section highlighting
   ================================================================ */
(function initNavbar() {
  const navbar   = $('#navbar');
  const navLinks = $$('.nav-link');

  if (!navbar) return;

  // ── Scrolled class (adds background shadow) ──────────────────
  function onScroll() {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveLink();
  }

  // ── Active section detection ──────────────────────────────────
  function updateActiveLink() {
    // Collect all sections that have a matching nav link
    const sections = navLinks
      .map(link => {
        const id = link.dataset.section;
        return id ? document.getElementById(id) : null;
      })
      .filter(Boolean);

    let currentId = '';
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      // Section is considered "active" when its top is within the top half of the viewport
      if (rect.top <= window.innerHeight * 0.4 && rect.bottom > 0) {
        currentId = section.id;
      }
    });

    navLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.section === currentId);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
})();


/* ================================================================
   3. HAMBURGER / MOBILE MENU
   ================================================================ */
(function initHamburger() {
  const hamburger  = $('#hamburger');
  const mobileMenu = $('#mobile-menu');
  if (!hamburger || !mobileMenu) return;

  function toggleMenu() {
    const isOpen = !mobileMenu.hidden;

    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  function openMenu() {
    mobileMenu.hidden = false;
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    mobileMenu.hidden = true;
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  }

  hamburger.addEventListener('click', toggleMenu);

  // Close when a mobile link is clicked
  $$('.mobile-link', mobileMenu).forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close when clicking outside
  document.addEventListener('click', e => {
    if (!mobileMenu.hidden && !hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
      closeMenu();
    }
  });

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !mobileMenu.hidden) closeMenu();
  });
})();


/* ================================================================
   4. SMOOTH SCROLL
   Handles all internal anchor links (href="#…") with an offset
   for the sticky navbar height.
   ================================================================ */
(function initSmoothScroll() {
  document.addEventListener('click', e => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const targetId = link.getAttribute('href').slice(1);
    if (!targetId) return; // bare "#" — skip

    const target = document.getElementById(targetId);
    if (!target) return;

    e.preventDefault();

    const navH   = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10) || 70;
    const top    = target.getBoundingClientRect().top + window.scrollY - navH;

    window.scrollTo({ top, behavior: 'smooth' });
  });
})();


/* ================================================================
   5. SCROLL REVEAL ANIMATION
   Uses IntersectionObserver to add .in-view class to elements with
   .reveal-up / .reveal-left / .reveal-right.
   ================================================================ */
(function initScrollReveal() {
  const elements = $$('.reveal-up, .reveal-left, .reveal-right');
  if (!elements.length) return;

  // Respect prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    elements.forEach(el => el.classList.add('in-view'));
    return;
  }

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target); // animate once
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach(el => observer.observe(el));
})();


/* ================================================================
   6. SKILL BAR ANIMATION
   Triggers progress-bar fills when the skills section enters view.
   ================================================================ */
(function initSkillBars() {
  const fills = $$('.skill-fill');
  if (!fills.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // If reduced motion, fill instantly
  if (prefersReducedMotion) {
    fills.forEach(fill => {
      fill.style.width = (fill.dataset.width || '0') + '%';
    });
    return;
  }

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const fill = entry.target;
          // Small timeout for visual polish (bars fill after card appears)
          setTimeout(() => {
            fill.style.width = (fill.dataset.width || '0') + '%';
          }, 200);
          observer.unobserve(fill);
        }
      });
    },
    { threshold: 0.5 }
  );

  fills.forEach(fill => observer.observe(fill));
})();


/* ================================================================
   7. PROJECT FILTER
   Filters project cards by category using data-category attributes.
   ================================================================ */
(function initProjectFilter() {
  const filterBtns = $$('.filter-btn');
  const cards      = $$('.project-card');

  if (!filterBtns.length || !cards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter; // 'all' | 'html-css' | 'javascript' | 'php-mysql'

      cards.forEach(card => {
        const category = card.dataset.category;
        const show     = filter === 'all' || category === filter;

        if (show) {
          card.classList.remove('hidden-card');
          // Trigger re-reveal if needed
          setTimeout(() => card.classList.add('in-view'), 50);
        } else {
          card.classList.add('hidden-card');
        }
      });
    });
  });
})();


/* ================================================================
   8. CONTACT FORM (UI feedback)
   Provides client-side validation feedback and a simulated
   "sent" state. Wire up a real service (Formspree, EmailJS, etc.)
   by replacing the setTimeout block in handleSubmit().
   ================================================================ */
(function initContactForm() {
  const submitBtn = $('#form-submit');
  const statusEl  = $('#form-status');

  if (!submitBtn) return;

  // Field references
  const fields = {
    name:    $('#cf-name'),
    email:   $('#cf-email'),
    subject: $('#cf-subject'),
    message: $('#cf-message'),
  };

  // Simple email regex
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setStatus(msg, colour) {
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.style.color  = colour || 'var(--grad-end)';
  }

  function clearStatus() { setStatus(''); }

  function validate() {
    if (!fields.name.value.trim())                { setStatus('⚠ Please enter your name.', '#f87171'); return false; }
    if (!EMAIL_RE.test(fields.email.value.trim())) { setStatus('⚠ Enter a valid email address.', '#f87171'); return false; }
    if (!fields.subject.value.trim())             { setStatus('⚠ Please enter a subject.', '#f87171'); return false; }
    if (fields.message.value.trim().length < 10)  { setStatus('⚠ Message must be at least 10 characters.', '#f87171'); return false; }
    return true;
  }

  function handleSubmit() {
    clearStatus();
    if (!validate()) return;

    // Disable button during "send"
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    /*
     * ── TO USE A REAL FORM SERVICE ──────────────────────────────
     * Replace the setTimeout below with a fetch() call, e.g.:
     *
     * fetch('https://formspree.io/f/YOUR_FORM_ID', {
     *   method: 'POST',
     *   headers: { 'Content-Type': 'application/json' },
     *   body: JSON.stringify({
     *     name:    fields.name.value,
     *     email:   fields.email.value,
     *     subject: fields.subject.value,
     *     message: fields.message.value,
     *   }),
     * })
     * .then(res => res.ok ? onSuccess() : onError())
     * .catch(onError);
     * ────────────────────────────────────────────────────────── */

    // Simulated success (remove this in production)
    setTimeout(() => {
      onSuccess();
    }, 1200);
  }

  function onSuccess() {
    submitBtn.disabled   = false;
    submitBtn.innerHTML  = '✓ Message Sent!';
    submitBtn.style.background = 'linear-gradient(135deg,#22c55e,#16a34a)';
    setStatus('Thanks! I\'ll get back to you soon.', '#4ade80');

    // Reset fields
    Object.values(fields).forEach(f => { f.value = ''; });

    // Restore button after 4 s
    setTimeout(() => {
      submitBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="22" y1="2" x2="11" y2="13"/>
          <polygon points="22 2 15 22 11 13 2 9 22 2"/>
        </svg>
        Send Message`;
      submitBtn.style.background = '';
      clearStatus();
    }, 4000);
  }

  function onError() {
    submitBtn.disabled  = false;
    submitBtn.innerHTML = 'Send Message';
    setStatus('⚠ Something went wrong. Please try again.', '#f87171');
  }

  submitBtn.addEventListener('click', handleSubmit);

  // Clear error on input
  Object.values(fields).forEach(field => {
    field.addEventListener('input', clearStatus);
  });
})();


/* ================================================================
   9. BACK-TO-TOP BUTTON
   ================================================================ */
(function initBackTop() {
  const btn = $('#back-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();


/* ================================================================
   10. FOOTER — DYNAMIC COPYRIGHT YEAR
   ================================================================ */
(function initFooterYear() {
  const el = $('#copy-year');
  if (el) el.textContent = new Date().getFullYear();
})();


/* ================================================================
   11. TYPED ROLE TEXT (hero)
   Cycles through the roles listed in #typed-text's data-roles
   attribute, typing and deleting each one like a terminal.
   ── To edit the roles: change the comma-separated list on the
      data-roles="" attribute of #typed-text in index.html.
   ================================================================ */
(function initTypedText() {
  const el = $('#typed-text');
  if (!el) return;

  const roles = (el.dataset.roles || '')
    .split(',')
    .map(r => r.trim())
    .filter(Boolean);

  if (!roles.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    el.textContent = roles[0];
    return;
  }

  const TYPE_SPEED   = 65;   // ms per character while typing
  const DELETE_SPEED = 35;   // ms per character while deleting
  const HOLD_TIME    = 1800; // ms to pause once fully typed
  const GAP_TIME     = 400;  // ms pause once fully deleted

  let roleIndex = 0;
  let charIndex = 0;
  let deleting  = false;

  function tick() {
    const current = roles[roleIndex];

    if (!deleting) {
      charIndex++;
      el.textContent = current.slice(0, charIndex);

      if (charIndex === current.length) {
        deleting = true;
        return setTimeout(tick, HOLD_TIME);
      }
      return setTimeout(tick, TYPE_SPEED);
    }

    // Deleting
    charIndex--;
    el.textContent = current.slice(0, charIndex);

    if (charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      return setTimeout(tick, GAP_TIME);
    }
    return setTimeout(tick, DELETE_SPEED);
  }

  setTimeout(tick, TYPE_SPEED);
})();


/* ================================================================
   12. ANIMATED STAT COUNTERS
   Counts each .counter element up from 0 to its data-count value
   once it scrolls into view (used on the hero badges).
   ================================================================ */
(function initCounters() {
  const counters = $$('.counter');
  if (!counters.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function animateCount(el) {
    const target   = parseInt(el.dataset.count, 10) || 0;
    const duration = 1100; // ms
    const start    = performance.now();

    function frame(now) {
      const progress = Math.min((now - start) / duration, 1);
      // Ease-out for a natural "settle" feel
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);

      if (progress < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  if (prefersReducedMotion) {
    counters.forEach(el => { el.textContent = el.dataset.count; });
    return;
  }

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );

  counters.forEach(el => observer.observe(el));
})();


/* ================================================================
   13. SCROLL PROGRESS BAR
   Fills the thin bar fixed to the top of the viewport based on how
   far the user has scrolled through the page.
   ================================================================ */
(function initScrollProgress() {
  const bar = $('#scroll-progress-bar');
  if (!bar) return;

  function update() {
    const scrollTop    = window.scrollY;
    const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
    const progress     = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width    = progress + '%';
  }

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
})();


/* ================================================================
   14. CURSOR GLOW
   A soft radial glow that follows the mouse on desktop, adding a
   subtle premium "spotlight" feel. Disabled on touch devices via
   CSS (see .cursor-glow media query in style.css).
   ================================================================ */
(function initCursorGlow() {
  const glow = $('#cursor-glow');
  if (!glow) return;

  const isTouch = window.matchMedia('(hover: none)').matches;
  if (isTouch) return;

  let raf = null;

  window.addEventListener('mousemove', e => {
    glow.classList.add('active');
    if (raf) return;
    raf = requestAnimationFrame(() => {
      glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      raf = null;
    });
  }, { passive: true });

  document.addEventListener('mouseleave', () => glow.classList.remove('active'));
})();
