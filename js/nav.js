import { spring, reduced } from './motion.js';

export function initNav() {
  const root = document.documentElement;
  const nav = document.getElementById('siteNav');
  const hamburger = document.getElementById('navHamburger');
  const navLinks = document.getElementById('navLinks');
  if (!nav || !hamburger || !navLinks) return;

  const save = (key, value) => { try { localStorage.setItem(key, value); } catch {} };

  // Mobile menu
  function setMenu(open) {
    navLinks.classList.toggle('open', open);
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
    hamburger.firstElementChild.className = open ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
  }
  hamburger.addEventListener('click', () => setMenu(!navLinks.classList.contains('open')));
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));

  // Light / dark toggle
  const themeBtn = document.getElementById('themeBtn');
  themeBtn?.addEventListener('click', () => {
    const isDark = root.dataset.theme
      ? root.dataset.theme === 'dark'
      : matchMedia('(prefers-color-scheme: dark)').matches;
    root.dataset.theme = isDark ? 'light' : 'dark';
    save('r3id_theme', root.dataset.theme);
  });

  // Seed color picker: every color token derives from --hue
  const paletteBtn = document.getElementById('paletteBtn');
  const paletteMenu = document.getElementById('paletteMenu');
  if (paletteBtn && paletteMenu) {
    const swatches = Array.from(paletteMenu.querySelectorAll('.swatch'));
    const markActive = () => {
      const hue = getComputedStyle(root).getPropertyValue('--hue').trim();
      swatches.forEach(s => s.setAttribute('aria-pressed', s.dataset.hue === hue));
    };
    const setPalette = open => {
      paletteMenu.hidden = !open;
      paletteBtn.setAttribute('aria-expanded', open);
    };
    paletteBtn.addEventListener('click', () => { markActive(); setPalette(paletteMenu.hidden); });
    swatches.forEach(s => s.addEventListener('click', () => {
      root.style.setProperty('--hue', s.dataset.hue);
      save('r3id_hue', s.dataset.hue);
      markActive();
    }));
    document.addEventListener('click', e => {
      if (!paletteMenu.hidden && !e.target.closest('#paletteMenu, #paletteBtn')) setPalette(false);
    });
    document.addEventListener('keydown', e => {
      if (e.key !== 'Escape') return;
      if (!paletteMenu.hidden) { setPalette(false); paletteBtn.focus(); }
      setMenu(false);
    });
  }

  // Wavy scroll progress (M3 Expressive wavy indicator)
  const wave = document.getElementById('scrollWave');
  let setWave = null;
  if (wave) {
    let d = 'M0 5';
    for (let x = 0; x <= 1000; x += 4) d += `L${x} ${(5 + 2.6 * Math.sin(x / 9)).toFixed(2)}`;
    wave.innerHTML = `<svg viewBox="0 0 1000 10" preserveAspectRatio="none"><path d="${d}" vector-effect="non-scaling-stroke"/></svg>`;
    // A tuna rides the head of the wave and turns around when you scroll back up
    const fish = document.createElement('i');
    fish.className = 'fa-solid fa-fish wave-fish';
    fish.setAttribute('aria-hidden', 'true');
    wave.after(fish);
    let prev = 0, facing = 1;
    const clip = raw => {
      const v = Math.max(0, Math.min(1, raw));
      wave.style.clipPath = `inset(0 ${(100 - v * 100).toFixed(2)}% 0 0)`;
      if (Math.abs(v - prev) > 0.0004) facing = v > prev ? 1 : -1;
      const x = v * 1000;
      const y = 5 + 2.6 * Math.sin(x / 9);
      const tilt = Math.cos(x / 9) * 16 * facing;
      fish.style.opacity = v > 0.004 ? '1' : '0';
      fish.style.transform = `translate(calc(${(v * 100).toFixed(3)}vw - 50%), ${(y - 9).toFixed(1)}px) scaleX(${facing}) rotate(${tilt.toFixed(1)}deg)`;
      prev = v;
    };
    const s = spring(clip, { stiffness: 140, damping: 26, eps: 0.0005 });
    setWave = v => (reduced ? clip(v) : s.set(v));
  }

  // App bar: compact after scrolling, hidden while scrolling down
  let lastY = window.scrollY;
  function onScroll() {
    const y = window.scrollY;
    nav.classList.toggle('mini', y > 40);
    const menuOpen = navLinks.classList.contains('open') || (paletteMenu && !paletteMenu.hidden);
    if (y > lastY + 4 && y > 360 && !menuOpen) nav.classList.add('is-hidden');
    else if (y < lastY - 4) nav.classList.remove('is-hidden');
    lastY = y;
    if (setWave) {
      const max = root.scrollHeight - window.innerHeight;
      setWave(max > 0 ? y / max : 0);
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Active section indicator sliding between nav links
  if ('IntersectionObserver' in window) {
    const links = Array.from(navLinks.querySelectorAll('a[href^="#"]'));
    const pill = document.createElement('span');
    pill.className = 'nav-pill';
    pill.setAttribute('aria-hidden', 'true');
    navLinks.prepend(pill);

    let activeId = null;
    const place = () => {
      const link = links.find(l => l.getAttribute('href') === `#${activeId}`);
      links.forEach(l => (l === link ? l.setAttribute('aria-current', 'location') : l.removeAttribute('aria-current')));
      if (!link) { pill.style.opacity = '0'; return; }
      pill.style.width = `${link.offsetWidth}px`;
      pill.style.transform = `translateX(${link.offsetLeft}px)`;
      pill.style.opacity = '1';
    };
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        activeId = e.target.id;
        place();
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('main section[id]').forEach(sec => obs.observe(sec));
    window.addEventListener('resize', place);
  }
}
