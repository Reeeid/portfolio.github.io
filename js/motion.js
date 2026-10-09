// Shared motion helpers: spring, reveal, ripple, count-up
export const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
export const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;

// Damped spring toward a target. apply() receives the current value every frame.
export function spring(apply, { stiffness = 200, damping = 20, mass = 1, eps = 0.01 } = {}) {
  let value = 0, target = 0, velocity = 0, raf = 0, last = 0;

  function step(now) {
    const dt = Math.min((now - last) / 1000, 1 / 30) / 2;
    last = now;
    for (let i = 0; i < 2; i++) {
      velocity += ((-stiffness * (value - target) - damping * velocity) / mass) * dt;
      value += velocity * dt;
    }
    if (Math.abs(velocity) < eps && Math.abs(value - target) < eps) {
      value = target;
      velocity = 0;
      raf = 0;
      apply(value);
      return;
    }
    apply(value);
    raf = requestAnimationFrame(step);
  }

  return {
    set(next) {
      target = next;
      if (reduced) { value = next; velocity = 0; apply(value); return; }
      if (!raf) { last = performance.now(); raf = requestAnimationFrame(step); }
    },
    jump(next) { value = target = next; velocity = 0; apply(value); },
    get: () => value,
  };
}

// Adds .is-in once an element scrolls into view and fires a 'reveal' event on it
export function initReveal() {
  document.querySelectorAll('[data-stagger]').forEach(group => {
    Array.from(group.children).forEach((child, i) => child.style.setProperty('--i', i));
  });

  const targets = document.querySelectorAll('[data-reveal]');
  const show = el => {
    el.classList.add('is-in');
    el.dispatchEvent(new CustomEvent('reveal'));
  };
  if (!('IntersectionObserver' in window)) { targets.forEach(show); return; }

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      show(e.target);
      obs.unobserve(e.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });
  targets.forEach(el => obs.observe(el));
}

// Material ripple for any .ripple element
export function initRipple() {
  if (reduced) return;
  document.addEventListener('pointerdown', e => {
    const host = e.target.closest?.('.ripple');
    if (!host) return;
    const r = host.getBoundingClientRect();
    const size = Math.hypot(r.width, r.height) * 2;
    const ink = document.createElement('span');
    ink.className = 'ripple-ink';
    ink.style.width = ink.style.height = `${size}px`;
    ink.style.left = `${e.clientX - r.left - size / 2}px`;
    ink.style.top = `${e.clientY - r.top - size / 2}px`;
    host.appendChild(ink);
    ink.addEventListener('animationend', () => ink.remove());
  });
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
