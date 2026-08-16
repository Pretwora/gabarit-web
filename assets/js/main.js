// Стрелковый клуб «Габарит» — поведение страницы. Без библиотек.

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------- Шапка: фон при скролле ----------
const header = document.querySelector('.header');
const onScroll = () => header.classList.toggle('is-scrolled', scrollY > 24);
addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ---------- Мобильное меню ----------
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');
burger.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  header.classList.toggle('is-open', open);
  burger.setAttribute('aria-expanded', String(open));
});
nav.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') {
    nav.classList.remove('is-open');
    header.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
  }
});

// ---------- Появление при скролле ----------
const revealObserver = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  }
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach((el, i) => {
  // лёгкий stagger внутри одной строки карточек
  el.style.transitionDelay = `${(i % 3) * 60}ms`;
  revealObserver.observe(el);
});

// ---------- Счётчики ----------
function animateCount(el) {
  const target = Number(el.dataset.count);
  if (reduceMotion || target === 0) {
    el.textContent = String(target);
    return;
  }
  const duration = 1200;
  const start = performance.now();
  const tick = (now) => {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
    el.textContent = String(Math.round(target * eased));
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
const countObserver = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      animateCount(entry.target);
      countObserver.unobserve(entry.target);
    }
  }
}, { threshold: 0.6 });
document.querySelectorAll('[data-count]').forEach((el) => countObserver.observe(el));

// ---------- Кольцо прогресса ----------
const ring = document.querySelector('.ring');
if (ring) {
  const ringObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        ring.classList.add('is-visible');
        ringObserver.disconnect();
      }
    }
  }, { threshold: 0.6 });
  ringObserver.observe(ring);
}

// ---------- Лайтбокс ----------
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
document.querySelectorAll('.gallery__item img').forEach((img) => {
  img.parentElement.addEventListener('click', () => {
    lightboxImg.src = img.dataset.full || img.src;
    lightboxImg.alt = img.alt;
    lightbox.showModal();
  });
});
document.getElementById('lightboxClose').addEventListener('click', () => lightbox.close());
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) lightbox.close(); // клик по подложке
});
lightbox.addEventListener('close', () => { lightboxImg.src = ''; });
