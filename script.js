/* ══════════════════════════════════════════════
   LOOPY MEDIA — script.js (UPDATED)
══════════════════════════════════════════════ */

'use strict';

/* ─────────────────────────────────────
   1. CUSTOM CURSOR
───────────────────────────────────── */
(function initCursor() {
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;
  if (window.innerWidth < 769) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  function animateRing() {
    rx += (mx - rx) * 0.14;
    ry += (my - ry) * 0.14;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animateRing);
  }
  requestAnimationFrame(animateRing);

  const interactives = 'a, button, [data-faq], .ts-btn, .ts-dot, .pt-switch, .service-card, .pricing-card, .quiz-opt';
  document.querySelectorAll(interactives).forEach(el => {
    el.addEventListener('mouseenter', () => {
      ring.style.width = '60px'; ring.style.height = '60px'; ring.style.opacity = '0.35';
      dot.style.transform = 'translate(-50%,-50%) scale(1.6)';
    });
    el.addEventListener('mouseleave', () => {
      ring.style.width = '38px'; ring.style.height = '38px'; ring.style.opacity = '0.6';
      dot.style.transform = 'translate(-50%,-50%) scale(1)';
    });
  });
})();

/* ─────────────────────────────────────
   2. NAVBAR + SCROLL PROGRESS LINE
───────────────────────────────────── */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const fill   = document.getElementById('navLineFill');
  if (!navbar) return;

  function onScroll() {
    if (window.scrollY > 50) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');

    if (fill) {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const pct = h > 0 ? (window.scrollY / h) * 100 : 0;
      fill.style.width = pct + '%';
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ─────────────────────────────────────
   3. MOBILE MENU
───────────────────────────────────── */
(function initMobileMenu() {
  const burger = document.getElementById('hamburger');
  const menu   = document.getElementById('mobileMenu');
  if (!burger || !menu) return;

  function toggle() {
    const open = burger.classList.toggle('open');
    menu.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }
  burger.addEventListener('click', toggle);
  menu.querySelectorAll('a').forEach(l => l.addEventListener('click', () => {
    burger.classList.remove('open');
    menu.classList.remove('open');
    document.body.style.overflow = '';
  }));
})();

/* ─────────────────────────────────────
   4. SCROLL REVEAL
───────────────────────────────────── */
(function initScrollReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => obs.observe(el));
})();

/* ─────────────────────────────────────
   5. COUNTERS
───────────────────────────────────── */
(function initCounters() {
  function ease(t) { return 1 - Math.pow(1 - t, 3); }
  function run(el) {
    const target = parseInt(el.dataset.target, 10);
    const dur = 1800, start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / dur, 1);
      el.textContent = Math.floor(ease(p) * target);
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = target;
    }
    requestAnimationFrame(tick);
  }
  const all = document.querySelectorAll('[data-target]');
  if (!all.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { run(e.target); obs.unobserve(e.target); } });
  }, { threshold: 0.5 });
  all.forEach(el => obs.observe(el));
})();

/* ─────────────────────────────────────
   6. TESTIMONIAL SLIDER
───────────────────────────────────── */
(function initSlider() {
  const track    = document.getElementById('tsTrack');
  const prevBtn  = document.getElementById('tsPrev');
  const nextBtn  = document.getElementById('tsNext');
  const dotsWrap = document.getElementById('tsDots');
  if (!track || !prevBtn || !nextBtn || !dotsWrap) return;

  const cards = Array.from(track.children);
  let current = 0, perView = getPerView(), total = Math.ceil(cards.length / perView), autoTimer;

  function getPerView() {
    if (window.innerWidth >= 1000) return 3;
    if (window.innerWidth >= 640)  return 2;
    return 1;
  }

  function buildDots() {
    dotsWrap.innerHTML = '';
    total = Math.ceil(cards.length / perView);
    for (let i = 0; i < total; i++) {
      const d = document.createElement('button');
      d.classList.add('ts-dot');
      if (i === current) d.classList.add('active');
      d.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(d);
    }
  }
  function updateDots() {
    dotsWrap.querySelectorAll('.ts-dot').forEach((d, i) => d.classList.toggle('active', i === current));
  }
  function goTo(i) {
    current = Math.max(0, Math.min(i, total - 1));
    const w = cards[0].offsetWidth + 24;
    track.style.transform = `translateX(-${current * w * perView}px)`;
    updateDots();
  }
  function next() { goTo(current < total - 1 ? current + 1 : 0); }
  function prev() { goTo(current > 0 ? current - 1 : total - 1); }

  prevBtn.addEventListener('click', () => { prev(); resetAuto(); });
  nextBtn.addEventListener('click', () => { next(); resetAuto(); });

  function startAuto() { autoTimer = setInterval(next, 5000); }
  function resetAuto() { clearInterval(autoTimer); startAuto(); }

  window.addEventListener('resize', () => {
    perView = getPerView(); current = 0;
    track.style.transform = 'translateX(0)';
    buildDots();
  });

  let tx = 0;
  track.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = tx - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { diff > 0 ? next() : prev(); }
  });

  buildDots(); startAuto();
})();

/* ─────────────────────────────────────
   7. FAQ
───────────────────────────────────── */
(function initFAQ() {
  const items = document.querySelectorAll('[data-faq]');
  items.forEach(item => {
    const btn = item.querySelector('.faq-q');
    btn.addEventListener('click', () => {
      const open = item.classList.contains('open');
      items.forEach(i => i.classList.remove('open'));
      if (!open) item.classList.add('open');
    });
  });
})();

/* ─────────────────────────────────────
   8. PRICING TOGGLE
───────────────────────────────────── */
(function initPricingToggle() {
  const sw    = document.getElementById('ptSwitch');
  const lM    = document.getElementById('ptMonthly');
  const lA    = document.getElementById('ptAnnual');
  if (!sw) return;
  const mPrices = document.querySelectorAll('.monthly-price');
  const aPrices = document.querySelectorAll('.annual-price');
  let isAnnual = false;
  function set() {
    sw.classList.toggle('on', isAnnual);
    lM.classList.toggle('active', !isAnnual);
    lA.classList.toggle('active', isAnnual);
    mPrices.forEach(el => el.classList.toggle('hidden', isAnnual));
    aPrices.forEach(el => el.classList.toggle('hidden', !isAnnual));
  }
  sw.addEventListener('click', () => { isAnnual = !isAnnual; set(); });
  lM.addEventListener('click', () => { isAnnual = false; set(); });
  lA.addEventListener('click', () => { isAnnual = true; set(); });
  set();
})();

/* ─────────────────────────────────────
   9. QUIZ — Find Your Plan
───────────────────────────────────── */
(function initQuiz() {
  const cards = document.querySelectorAll('.quiz-card');
  const steps = document.querySelectorAll('.qp-step');
  const fills = [
    document.getElementById('qpLineFill'),
    document.getElementById('qpLineFill2'),
    document.getElementById('qpLineFill3')
  ];
  if (!cards.length) return;

  let currentQ = 0;
  const answers = [];
  const totalQ = 4;

  // Plan definitions
  const plans = {
    starter: { title: 'Starter Plan',  desc: 'Perfect to build your foundation and grow steady.',     price: '9,999' },
    growth:  { title: 'Growth Plan',   desc: 'Designed to dominate social and convert traffic.',      price: '19,999' },
    scale:   { title: 'Scale Plan',    desc: 'The full growth engine for serious scaling.',           price: '39,999' }
  };

  function showCard(idx) {
    cards.forEach(c => c.classList.remove('active'));
    cards[idx].classList.add('active');
  }
  function updateSteps() {
    steps.forEach((s, i) => {
      s.classList.remove('active', 'done');
      if (i < currentQ) s.classList.add('done');
      else if (i === currentQ) s.classList.add('active');
    });
    fills.forEach((f, i) => {
      if (!f) return;
      f.style.width = (i < currentQ) ? '100%' : '0%';
    });
  }

  cards.forEach((card, idx) => {
    if (card.dataset.q === 'result') return;
    const opts = card.querySelectorAll('.quiz-opt');
    opts.forEach(opt => {
      opt.addEventListener('click', () => {
        answers.push(opt.dataset.val);
        currentQ++;
        if (currentQ < totalQ) {
          showCard(currentQ);
          updateSteps();
        } else {
          // Determine result by majority vote
          const counts = { starter: 0, growth: 0, scale: 0 };
          answers.forEach(a => counts[a]++);
          let result = 'growth';
          let max = 0;
          Object.keys(counts).forEach(k => {
            if (counts[k] > max) { max = counts[k]; result = k; }
          });
          const plan = plans[result];
          document.getElementById('qrTitle').textContent  = plan.title;
          document.getElementById('qrDesc').textContent   = plan.desc;
          document.getElementById('qrAmount').textContent = plan.price;

          showCard(cards.length - 1);
          steps.forEach(s => s.classList.add('done'));
          fills.forEach(f => f && (f.style.width = '100%'));
        }
      });
    });
  });

  const retry = document.getElementById('quizRetry');
  if (retry) {
    retry.addEventListener('click', () => {
      currentQ = 0; answers.length = 0;
      showCard(0); updateSteps();
    });
  }
})();

/* ─────────────────────────────────────
   10. CONTACT FORM submit
───────────────────────────────────── */
function handleFormSubmit() {
  const name    = document.getElementById('cf-name');
  const phone   = document.getElementById('cf-phone');
  const success = document.getElementById('cfSuccess');
  const btn     = document.getElementById('cfSubmit');
  if (!name || !phone) return;

  if (!name.value.trim()) { shakeInput(name); name.focus(); return; }
  if (!phone.value.trim()) { shakeInput(phone); phone.focus(); return; }

  btn.textContent = 'Sending…';
  btn.disabled = true;
  setTimeout(() => {
    btn.style.display = 'none';
    if (success) success.classList.add('show');
    ['cf-name','cf-business','cf-phone','cf-service','cf-msg'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
  }, 1200);
}
function shakeInput(el) {
  el.style.borderColor = '#ff4d4d';
  el.animate(
    [{ transform: 'translateX(0)' }, { transform: 'translateX(-6px)' },
     { transform: 'translateX(6px)' }, { transform: 'translateX(0)' }],
    { duration: 280, easing: 'ease-in-out' }
  );
  setTimeout(() => { el.style.borderColor = ''; }, 1500);
}

/* ─────────────────────────────────────
   11. SMOOTH SCROLL
───────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function (e) {
    const t = document.querySelector(this.getAttribute('href'));
    if (!t) return;
    e.preventDefault();
    const top = t.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ─────────────────────────────────────
   12. AUDIT POPUP (after 10s)
───────────────────────────────────── */
(function initAuditPopup() {
  const modal    = document.getElementById('auditModal');
  const close    = document.getElementById('amClose');
  const backdrop = document.getElementById('amBackdrop');
  if (!modal) return;

  // Don't show again if user dismissed it this session
  const dismissed = sessionStorage.getItem('auditDismissed');
  if (dismissed) return;

  // Open after 10 seconds
  const timer = setTimeout(openModal, 10000);

  function openModal() {
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    modal.classList.remove('show');
    document.body.style.overflow = '';
    sessionStorage.setItem('auditDismissed', '1');
  }
  close.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('show')) closeModal();
  });

  // If user reaches #contact, cancel popup
  const contact = document.getElementById('contact');
  if (contact) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          clearTimeout(timer);
          sessionStorage.setItem('auditDismissed', '1');
        }
      });
    }, { threshold: 0.2 });
    obs.observe(contact);
  }
})();

/* ─────────────────────────────────────
   13. AUDIT FORM submit
───────────────────────────────────── */
function handleAuditSubmit() {
  const name = document.getElementById('amName');
  const phone = document.getElementById('amPhone');
  const success = document.getElementById('amSuccess');
  if (!name.value.trim()) { shakeInput(name); name.focus(); return; }
  if (!phone.value.trim()) { shakeInput(phone); phone.focus(); return; }

  // Send to WhatsApp
  const message = `Hi Loopy Media, I want a FREE AUDIT.%0AName: ${encodeURIComponent(name.value)}%0APhone: ${encodeURIComponent(phone.value)}`;
  window.open(`https://wa.me/919876543210?text=${message}`, '_blank');

  success.classList.add('show');
  name.value = ''; phone.value = '';
  setTimeout(() => {
    const modal = document.getElementById('auditModal');
    if (modal) {
      modal.classList.remove('show');
      document.body.style.overflow = '';
      sessionStorage.setItem('auditDismissed', '1');
    }
  }, 2500);
}

/* ─────────────────────────────────────
   14. PARALLAX hero rings
───────────────────────────────────── */
(function initParallax() {
  const rings = document.querySelector('.hero-bg-rings');
  if (!rings) return;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    rings.style.transform = `translateY(calc(-50% + ${y * 0.08}px))`;
  }, { passive: true });
})();