/* ══════════════════════════════════════════════
   LOOPY MEDIA — script.js  (v2 — full rewrite)
══════════════════════════════════════════════ */

'use strict';

/* ─────────────────────────────────────
   1. CUSTOM CURSOR
───────────────────────────────────── */
(function initCursor() {
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring || window.innerWidth < 769) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px'; dot.style.top = my + 'px';
  });

  (function animateRing() {
    rx += (mx - rx) * 0.14; ry += (my - ry) * 0.14;
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    requestAnimationFrame(animateRing);
  })();

  document.querySelectorAll('a,button,[data-faq],.service-card,.pricing-card,.quiz-opt,.portfolio-card,.industry-card,.wc-card,.blog-card').forEach(el => {
    el.addEventListener('mouseenter', () => { ring.style.width = '60px'; ring.style.height = '60px'; ring.style.opacity = '0.35'; dot.style.transform = 'translate(-50%,-50%) scale(1.6)'; });
    el.addEventListener('mouseleave', () => { ring.style.width = '38px'; ring.style.height = '38px'; ring.style.opacity = '0.6'; dot.style.transform = 'translate(-50%,-50%) scale(1)'; });
  });
})();

/* ─────────────────────────────────────
   2. NAVBAR + SCROLL PROGRESS
───────────────────────────────────── */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const fill   = document.getElementById('navLineFill');
  if (!navbar) return;
  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    if (fill) {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      fill.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';
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
  function close() { burger.classList.remove('open'); menu.classList.remove('open'); document.body.style.overflow = ''; }
  burger.addEventListener('click', () => {
    const open = burger.classList.toggle('open');
    menu.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  menu.querySelectorAll('a').forEach(l => l.addEventListener('click', close));
})();

/* ─────────────────────────────────────
   4. SCROLL REVEAL
───────────────────────────────────── */
(function initScrollReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
  els.forEach(el => obs.observe(el));
})();

/* ─────────────────────────────────────
   5. COUNTERS
───────────────────────────────────── */
(function initCounters() {
  const ease = t => 1 - Math.pow(1 - t, 3);
  function run(el) {
    const target = +el.dataset.target, dur = 1800, start = performance.now();
    (function tick(now) {
      const p = Math.min((now - start) / dur, 1);
      el.textContent = Math.floor(ease(p) * target);
      if (p < 1) requestAnimationFrame(tick); else el.textContent = target;
    })(start);
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
  const track = document.getElementById('tsTrack');
  const prevBtn = document.getElementById('tsPrev');
  const nextBtn = document.getElementById('tsNext');
  const dotsWrap = document.getElementById('tsDots');
  if (!track || !prevBtn || !nextBtn || !dotsWrap) return;

  const cards = Array.from(track.children);
  let current = 0, perView = getPV(), total, autoTimer;

  function getPV() { return window.innerWidth >= 1000 ? 3 : window.innerWidth >= 640 ? 2 : 1; }

  function buildDots() {
    total = Math.ceil(cards.length / perView);
    dotsWrap.innerHTML = '';
    for (let i = 0; i < total; i++) {
      const d = document.createElement('button');
      d.className = 'ts-dot' + (i === current ? ' active' : '');
      d.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(d);
    }
  }
  function goTo(i) {
    current = Math.max(0, Math.min(i, total - 1));
    track.style.transform = `translateX(-${current * (cards[0].offsetWidth + 24) * perView}px)`;
    dotsWrap.querySelectorAll('.ts-dot').forEach((d, j) => d.classList.toggle('active', j === current));
  }
  const next = () => goTo(current < total - 1 ? current + 1 : 0);
  const prev = () => goTo(current > 0 ? current - 1 : total - 1);
  const resetAuto = () => { clearInterval(autoTimer); autoTimer = setInterval(next, 5000); };

  prevBtn.addEventListener('click', () => { prev(); resetAuto(); });
  nextBtn.addEventListener('click', () => { next(); resetAuto(); });

  window.addEventListener('resize', () => { perView = getPV(); current = 0; track.style.transform = ''; buildDots(); });

  let tx = 0;
  track.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => { const d = tx - e.changedTouches[0].clientX; if (Math.abs(d) > 50) { d > 0 ? next() : prev(); } });

  buildDots();
  autoTimer = setInterval(next, 5000);
})();

/* ─────────────────────────────────────
   7. FAQ ACCORDION
───────────────────────────────────── */
(function initFAQ() {
  document.querySelectorAll('[data-faq]').forEach(item => {
    item.querySelector('.faq-q').addEventListener('click', () => {
      const was = item.classList.contains('open');
      document.querySelectorAll('[data-faq]').forEach(i => i.classList.remove('open'));
      if (!was) item.classList.add('open');
    });
  });
})();

/* ─────────────────────────────────────
   8. QUIZ — Business-Type Personalized
───────────────────────────────────── */
(function initQuiz() {
  const allCards = document.querySelectorAll('.quiz-card');
  const steps    = document.querySelectorAll('.qp-step');
  const fills    = ['qpLineFill','qpLineFill2','qpLineFill3'].map(id => document.getElementById(id));
  if (!allCards.length) return;

  /* ── Static card elements ── */
  const cardEls = Array.from(allCards); // [q1, q2, q3, q4, result]
  const q1Card  = cardEls[0];
  const q2Card  = cardEls[1];
  const q3Card  = cardEls[2];
  const q4Card  = cardEls[3];
  const resultCard = cardEls[4];

  let step = 0;          // 0-based index into cardEls
  let bizType = 'other';
  const answers = [];

  /* ── Dynamic question bank ── */
  const dynQ = {
    hospital: {
      q2: { t: 'Do you currently get online appointment inquiries?',
            o: [['❌ No — patients only call or walk in','starter'],['⚠️ A few, but not consistently','growth'],['✅ Yes, regularly through website or social','premium']] },
      q3: { t: 'Do you have a Google Business Profile or a website?',
            o: [['❌ No presence online at all','starter'],['⚠️ Have one, but it\'s outdated/incomplete','growth'],['✅ Yes, actively managed','premium']] }
    },
    restaurant: {
      q2: { t: 'Do customers find you online (Google, Instagram, Zomato)?',
            o: [['❌ Mostly word-of-mouth only','starter'],['⚠️ Some presence but inconsistent','growth'],['✅ Yes, active on multiple platforms','premium']] },
      q3: { t: 'Have you run Meta Ads or worked with food influencers?',
            o: [['❌ Never tried digital marketing','starter'],['⚠️ Tried once — results were average','growth'],['✅ Yes, it works well for us','premium']] }
    },
    gym: {
      q2: { t: 'Do you currently generate leads through social media?',
            o: [['❌ No — people just walk in','starter'],['⚠️ A few inquiries from posts','growth'],['✅ Yes, social is our main lead source','premium']] },
      q3: { t: 'Have you run online fitness campaigns or seasonal promotions?',
            o: [['❌ Never done digital campaigns','starter'],['⚠️ Tried once, results were average','growth'],['✅ Yes, we run regular online campaigns','premium']] }
    },
    other: {
      q2: { t: 'What\'s your biggest challenge right now?',
            o: [['😕 No online presence at all','starter'],['📱 Inconsistent social & low engagement','growth'],['💰 Need more leads and sales fast','premium']] },
      q3: { t: 'What stage is your business in?',
            o: [['🌱 Just starting (0–6 months)','starter'],['📈 Growing (6 months – 2 years)','growth'],['🚀 Established & scaling (2+ years)','premium']] }
    }
  };

  /* ── Plan results ── */
  const plans = {
    starter: { title:'Starter Plan', desc:'The perfect first step to establish your digital foundation.', price:'1,999',
      rec: { hospital:'We\'ll set up your Google Business Profile, create patient-trust content, and establish your social presence.',
             restaurant:'We\'ll create mouth-watering content to start building local digital visibility and attract new customers.',
             gym:'We\'ll establish your brand, set up your social media, and start attracting new member inquiries.',
             other:'We\'ll build your online foundation — profile, content strategy, and brand identity to get you started.' }},
    growth: { title:'Growth Plan', desc:'Perfect for scaling your audience and generating consistent leads.', price:'4,999',
      rec: { hospital:'We\'ll manage your local campaigns, grow patient inquiries, and build your online reputation.',
             restaurant:'We\'ll grow your Instagram, collaborate with local food influencers, and fill your tables.',
             gym:'We\'ll run seasonal campaigns, grow your community, and convert followers into paying members.',
             other:'We\'ll scale your social media, run campaigns, and generate consistent leads each month.' }},
    premium: { title:'Premium Plan', desc:'Full-service growth — social, ads, influencers, strategy, and reporting.', price:'9,999',
      rec: { hospital:'We\'ll manage your full digital presence — website, social, Meta Ads, and patient engagement.',
             restaurant:'We\'ll run Meta Ads, manage influencer deals, create viral content, and build your brand digitally.',
             gym:'We\'ll run performance campaigns, create transformation content, and manage your complete digital strategy.',
             other:'We\'ll handle everything — social, ads, content, and reporting — so you can focus on your business.' }}
  };

  /* ── Helpers ── */
  function showStep(idx) {
    cardEls.forEach(c => c.classList.remove('active'));
    cardEls[idx].classList.add('active');
  }
  function updateProgress() {
    steps.forEach((s, i) => {
      s.classList.toggle('done', i < step);
      s.classList.toggle('active', i === step);
      if (i >= step) s.classList.remove('done');
    });
    // Re-apply done properly
    steps.forEach((s, i) => { s.classList.remove('done','active'); if (i < step) s.classList.add('done'); else if (i === step) s.classList.add('active'); });
    fills.forEach((f, i) => { if (f) f.style.width = i < step ? '100%' : '0%'; });
  }

  function buildDynCard(cardEl, qData) {
    cardEl.querySelector('h3').textContent = qData.t;
    const wrap = cardEl.querySelector('.quiz-options');
    wrap.innerHTML = '';
    qData.o.forEach(([text, val]) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-opt';
      btn.dataset.val = val;
      btn.textContent = text;
      wrap.appendChild(btn);
    });
    /* Re-attach listeners */
    wrap.querySelectorAll('.quiz-opt').forEach(btn => {
      btn.addEventListener('click', () => recordAnswer(btn.dataset.val));
    });
  }

  function recordAnswer(val) {
    answers.push(val);
    step++;
    if (step < 4) {
      showStep(step);
      updateProgress();
    } else {
      showResult();
    }
  }

  function showResult() {
    /* Tally */
    const counts = { starter:0, growth:0, premium:0 };
    answers.forEach(a => { if (counts[a] !== undefined) counts[a]++; });
    let result = 'growth', max = 0;
    Object.keys(counts).forEach(k => { if (counts[k] > max) { max = counts[k]; result = k; } });

    const plan = plans[result];
    document.getElementById('qrTitle').textContent  = plan.title;
    document.getElementById('qrDesc').textContent   = plan.desc;
    document.getElementById('qrAmount').textContent = plan.price;

    const recEl = document.getElementById('qrRecommendation');
    if (recEl) {
      const bizLabel = { hospital:'clinic/hospital', restaurant:'restaurant', gym:'gym', other:'business' }[bizType] || 'business';
      recEl.innerHTML = `<strong>Our recommendation for your ${bizLabel}:</strong> ${plan.rec[bizType] || plan.rec.other}`;
      recEl.classList.add('show');
    }

    /* Mark all steps done */
    steps.forEach(s => { s.classList.remove('active'); s.classList.add('done'); });
    fills.forEach(f => { if (f) f.style.width = '100%'; });
    showStep(4); /* result card */
  }

  /* ── Q1 listeners (business type) ── */
  q1Card.querySelectorAll('.quiz-opt').forEach(btn => {
    btn.addEventListener('click', () => {
      bizType = btn.dataset.type || 'other';
      /* Build Q2 and Q3 now that we know the type */
      buildDynCard(q2Card, dynQ[bizType].q2);
      buildDynCard(q3Card, dynQ[bizType].q3);
      recordAnswer(btn.dataset.val);
    });
  });

  /* ── Q4 listeners (budget — static) ── */
  q4Card.querySelectorAll('.quiz-opt').forEach(btn => {
    btn.addEventListener('click', () => recordAnswer(btn.dataset.val));
  });

  /* ── Retry ── */
  const retryBtn = document.getElementById('quizRetry');
  if (retryBtn) {
    retryBtn.addEventListener('click', () => {
      step = 0; answers.length = 0; bizType = 'other';
      const recEl = document.getElementById('qrRecommendation');
      if (recEl) recEl.classList.remove('show');
      showStep(0);
      updateProgress();
    });
  }

  /* initial state */
  showStep(0);
  updateProgress();
})();

/* ─────────────────────────────────────
   9. CONTACT FORM — WhatsApp submit
───────────────────────────────────── */
function handleFormSubmit() {
  const name  = document.getElementById('cf-name');
  const phone = document.getElementById('cf-phone');
  const type  = document.getElementById('cf-type');
  const msg   = document.getElementById('cf-msg');
  const succ  = document.getElementById('cfSuccess');
  const btn   = document.getElementById('cfSubmit');
  if (!name || !phone) return;

  if (!name.value.trim())  { shakeInput(name);  name.focus();  return; }
  if (!phone.value.trim()) { shakeInput(phone); phone.focus(); return; }

  const bizType = type && type.value ? type.value : 'Not specified';
  const note    = msg && msg.value.trim() ? '\nMessage: ' + msg.value.trim() : '';
  const text    = encodeURIComponent(
    `Hi Loopy Media, I'd like a free audit for my business.\n\nName: ${name.value.trim()}\nWhatsApp: ${phone.value.trim()}\nBusiness Type: ${bizType}${note}`
  );

  btn.textContent = 'Opening WhatsApp…';
  btn.disabled = true;

  setTimeout(() => {
    window.open('https://wa.me/919484882220?text=' + text, '_blank');
    btn.style.display = 'none';
    if (succ) succ.classList.add('show');
    ['cf-name','cf-phone','cf-type','cf-msg'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
  }, 600);
}

function shakeInput(el) {
  el.style.borderColor = '#ff4d4d';
  el.animate([{transform:'translateX(0)'},{transform:'translateX(-6px)'},{transform:'translateX(6px)'},{transform:'translateX(0)'}],{duration:280,easing:'ease-in-out'});
  setTimeout(() => { el.style.borderColor = ''; }, 1500);
}

/* ─────────────────────────────────────
   10. SMOOTH SCROLL
───────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function(e) {
    const t = document.querySelector(this.getAttribute('href'));
    if (!t) return;
    e.preventDefault();
    window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
  });
});

/* ─────────────────────────────────────
   11. AUDIT POPUP (10s delay)
───────────────────────────────────── */
(function initAuditPopup() {
  const modal    = document.getElementById('auditModal');
  const closeBtn = document.getElementById('amClose');
  const backdrop = document.getElementById('amBackdrop');
  if (!modal || sessionStorage.getItem('auditDismissed')) return;

  const timer = setTimeout(() => { modal.classList.add('show'); document.body.style.overflow = 'hidden'; }, 10000);

  function closeModal() { modal.classList.remove('show'); document.body.style.overflow = ''; sessionStorage.setItem('auditDismissed','1'); }
  if (closeBtn)  closeBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('show')) closeModal(); });

  const contact = document.getElementById('contact');
  if (contact) {
    new IntersectionObserver(([e]) => { if (e.isIntersecting) { clearTimeout(timer); sessionStorage.setItem('auditDismissed','1'); } }, { threshold: 0.2 }).observe(contact);
  }
})();

/* ─────────────────────────────────────
   12. AUDIT POPUP FORM submit
───────────────────────────────────── */
function handleAuditSubmit() {
  const name  = document.getElementById('amName');
  const phone = document.getElementById('amPhone');
  const succ  = document.getElementById('amSuccess');
  if (!name || !phone) return;
  if (!name.value.trim())  { shakeInput(name);  name.focus();  return; }
  if (!phone.value.trim()) { shakeInput(phone); phone.focus(); return; }

  const text = encodeURIComponent(`Hi Loopy Media, I'd like a free audit for my business.\nName: ${name.value.trim()}\nPhone: ${phone.value.trim()}`);
  window.open('https://wa.me/919484882220?text=' + text, '_blank');
  if (succ) succ.classList.add('show');
  name.value = ''; phone.value = '';
  setTimeout(() => {
    const modal = document.getElementById('auditModal');
    if (modal) { modal.classList.remove('show'); document.body.style.overflow = ''; sessionStorage.setItem('auditDismissed','1'); }
  }, 2500);
}

/* ─────────────────────────────────────
   13. PARALLAX — hero rings
───────────────────────────────────── */
(function() {
  const rings = document.querySelector('.hero-bg-rings');
  if (!rings) return;
  window.addEventListener('scroll', () => { rings.style.transform = `translateY(calc(-50% + ${window.scrollY * 0.08}px))`; }, { passive: true });
})();

/* ─────────────────────────────────────
   14. PRICING TABS
───────────────────────────────────── */
(function initPricingTabs() {
  const nav    = document.getElementById('pricingTabNav');
  const panels = document.querySelectorAll('.ptab-panel');
  if (!nav || !panels.length) return;

  nav.querySelectorAll('.ptab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      /* Buttons */
      nav.querySelectorAll('.ptab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      /* Panels */
      panels.forEach(p => p.classList.remove('active'));
      const target = document.getElementById('tab-' + btn.dataset.tab);
      if (target) {
        target.classList.add('active');
        /* Re-trigger reveal animations inside the newly shown panel */
        target.querySelectorAll('.reveal:not(.visible)').forEach(el => {
          const obs = new IntersectionObserver(entries => {
            entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
          }, { threshold: 0.06 });
          obs.observe(el);
        });
      }
    });
  });

  /* Deep-link: if URL has #pricing?tab=social etc. – optional enhancement */
  const hash = window.location.hash;
  if (hash === '#pricing') {
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get('tab');
    if (tab) {
      const matchBtn = nav.querySelector(`[data-tab="${tab}"]`);
      if (matchBtn) matchBtn.click();
    }
  }
})();

/* Hero Slider Logic */
document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll(".hero-slide");
  const dots = document.querySelectorAll(".slider-dot");
  if (!slides.length) return;

  let currentSlide = 0;
  let slideInterval;
  const intervalTime = 5000; // 5 seconds

  function goToSlide(index) {
    slides[currentSlide].classList.remove("hero-slide-active");
    if (dots.length > 0) dots[currentSlide].classList.remove("active");
    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add("hero-slide-active");
    if (dots.length > 0) dots[currentSlide].classList.add("active");
  }

  function nextSlide() {
    goToSlide(currentSlide + 1);
  }

  function startSlider() {
    slideInterval = setInterval(nextSlide, intervalTime);
  }

  function pauseSlider() {
    clearInterval(slideInterval);
  }

  dots.forEach(dot => {
    dot.addEventListener("click", () => {
      pauseSlider();
      goToSlide(parseInt(dot.dataset.slide));
      startSlider();
    });
  });

  const prevArrow = document.querySelector(".prev-arrow");
  const nextArrow = document.querySelector(".next-arrow");

  if (prevArrow) {
    prevArrow.addEventListener("click", () => {
      pauseSlider();
      goToSlide(currentSlide - 1);
      startSlider();
    });
  }

  if (nextArrow) {
    nextArrow.addEventListener("click", () => {
      pauseSlider();
      nextSlide();
      startSlider();
    });
  }

  const heroSlider = document.getElementById("heroSlider");
  if (heroSlider) {
    heroSlider.addEventListener("mouseenter", pauseSlider);
    heroSlider.addEventListener("mouseleave", startSlider);
  }

  startSlider();
});
