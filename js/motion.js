// Shared motion helpers: reveal on scroll, count-up
export const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

// Adds .is-in once an element scrolls into view
export function initReveal() {
  document.querySelectorAll('[data-stagger]').forEach(group => {
    Array.from(group.children).forEach((child, i) => child.style.setProperty('--i', i));
  });

  const targets = document.querySelectorAll('[data-reveal]');
  if (!('IntersectionObserver' in window)) {
    targets.forEach(el => el.classList.add('is-in'));
    return;
  }

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-in');
      obs.unobserve(e.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -5% 0px' });
  targets.forEach(el => obs.observe(el));
}

// Counts from 0 up to the number already written in the element
export function initCountUp() {
  if (reduced || !('IntersectionObserver' in window)) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      obs.unobserve(e.target);
      const el = e.target;
      const end = Number(el.textContent);
      if (!Number.isFinite(end)) return;
      const start = performance.now();
      const DURATION = 1100;
      (function frame(now) {
        const t = Math.min((now - start) / DURATION, 1);
        el.textContent = Math.round(end * (1 - Math.pow(1 - t, 4)));
        if (t < 1) requestAnimationFrame(frame);
      })(start);
    });
  }, { threshold: 0.8 });
  document.querySelectorAll('[data-count]').forEach(el => obs.observe(el));
}
