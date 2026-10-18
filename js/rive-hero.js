// Hero playground drawn by Rive (assets/rive/hero.riv, source in rive/hero/scene.rml).
// The page feeds the pointer and the theme colours into the file's view model;
// the file reports back which toy was poked. The CSS shapes stay as the fallback.
import { reduced } from './motion.js';

const RUNTIME = 'vendor/rive/rive.js';
const WASM = 'vendor/rive/rive.wasm';
const FILE = 'assets/rive/hero.riv';

const TOYS = {
  sec:  { trigger: 'pokeSec',  text: 'Security ― 情報処理安全確保支援士に合格。設計段階から守る。' },
  biz:  { trigger: 'pokeBiz',  text: 'Business ― 経営学部出身。ビジネス課題から考えて作る。' },
  tech: { trigger: 'pokeTech', text: 'Technology ― バックエンドからフロントエンドまで一気通貫。' },
  go:   { trigger: 'pokeGo',   text: 'Go ― 一番好きな言語。echo にマージされた PR もある。' },
  ctf:  { trigger: 'pokeCtf',  text: 'CTF ― このサイトのどこかに問題が隠れている。' },
};

// view model colour -> CSS custom property it follows
const COLORS = {
  secBody: '--secondary-container', secInk: '--on-secondary-container',
  bizBody: '--tertiary-container', bizInk: '--on-tertiary-container',
  techBody: '--primary-container', techInk: '--on-primary-container',
  goBody: '--primary', goInk: '--on-primary',
  ctfBody: '--tertiary', ctfInk: '--on-tertiary',
  accent: '--primary',
};

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (window.rive) { resolve(); return; }
    const s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    s.onerror = () => reject(new Error(`failed to load ${src}`));
    document.head.appendChild(s);
  });
}

// Resolves any CSS colour (including oklch) to sRGB bytes by painting one pixel
const probe = document.createElement('canvas').getContext('2d', { willReadFrequently: true });
function toRgb(cssColor) {
  probe.clearRect(0, 0, 1, 1);
  probe.fillStyle = '#000';
  probe.fillStyle = cssColor;
  probe.fillRect(0, 0, 1, 1);
  const [r, g, b] = probe.getImageData(0, 0, 1, 1).data;
  return [r, g, b];
}

export function initRiveHero() {
  const stage = document.getElementById('heroStage');
  if (!stage || reduced) return;

  const start = () => boot(stage).catch(() => {
    // keep the CSS shapes if anything about the runtime fails
    stage.classList.remove('rive-loading');
  });
  const idle = window.requestIdleCallback || (cb => setTimeout(cb, 200));
  if (document.readyState === 'complete') idle(start, { timeout: 1500 });
  else window.addEventListener('load', () => idle(start, { timeout: 1500 }), { once: true });
}

async function boot(stage) {
  stage.classList.add('rive-loading');
  await loadScript(RUNTIME);
  const { Rive, RuntimeLoader, Layout, Fit, Alignment } = window.rive;
  RuntimeLoader.setWasmUrl(WASM);
  RuntimeLoader.setWasmFallbackUrl(null);

  const canvas = document.createElement('canvas');
  canvas.className = 'rive-canvas';
  stage.appendChild(canvas);

  const caption = document.getElementById('riveCaption');
  const progress = document.getElementById('riveProgress');

  const r = await new Promise((resolve, reject) => {
    const inst = new Rive({
      src: FILE,
      canvas,
      autoplay: true,
      autoBind: true,
      stateMachines: 'Hero Machine',
      isTouchScrollEnabled: true,
      layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
      onLoad: () => resolve(inst),
      onLoadError: reject,
    });
  });

  const vm = r.viewModelInstance;
  if (!vm) throw new Error('no view model');
  r.resizeDrawingSurfaceToCanvas();
  stage.classList.remove('rive-loading');
  stage.classList.add('rive-ready');

  // ── theme colours ──
  const applyColors = () => {
    const css = getComputedStyle(document.documentElement);
    for (const [prop, cssVar] of Object.entries(COLORS)) {
      const value = css.getPropertyValue(cssVar).trim();
      if (!value) continue;
      const [red, green, blue] = toRgb(value);
      vm.color(prop)?.rgb(red, green, blue);
    }
  };
  applyColors();
  new MutationObserver(applyColors).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'style'] });
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyColors);

  // ── pointer -> look direction (eased, only while it is moving) ──
  const lookX = vm.number('lookX');
  const lookY = vm.number('lookY');
  let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
  const step = () => {
    cx += (tx - cx) * 0.12;
    cy += (ty - cy) * 0.12;
    lookX.value = cx;
    lookY.value = cy;
    raf = Math.abs(tx - cx) + Math.abs(ty - cy) > 0.001 ? requestAnimationFrame(step) : 0;
  };
  const hero = stage.closest('.hero') || stage;
  hero.addEventListener('pointermove', e => {
    const rect = stage.getBoundingClientRect();
    const clamp = v => Math.max(-1, Math.min(1, v));
    tx = clamp((e.clientX - (rect.left + rect.width / 2)) / (rect.width * 0.8));
    ty = clamp((e.clientY - (rect.top + rect.height / 2)) / (rect.height * 0.8));
    if (!raf) raf = requestAnimationFrame(step);
  }, { passive: true });
  hero.addEventListener('pointerleave', () => {
    tx = 0;
    ty = 0;
    if (!raf) raf = requestAnimationFrame(step);
  });

  // ── pokes: a line of copy per toy, and the reward for finding all five ──
  const found = new Set();
  let hideTimer = 0;
  const show = (html, long = false) => {
    if (!caption) return;
    caption.innerHTML = html;
    caption.classList.add('is-on');
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => caption.classList.remove('is-on'), long ? 7000 : 3200);
  };
  const renderProgress = () => {
    if (!progress) return;
    progress.hidden = found.size === 0;
    progress.querySelectorAll('i').forEach((dot, i) => dot.classList.toggle('on', i < found.size));
    progress.querySelector('b').textContent = `${found.size}/5`;
  };
  const unlock = vm.trigger('unlock');

  Object.entries(TOYS).forEach(([key, toy]) => {
    vm.trigger(toy.trigger)?.on(() => {
      found.add(key);
      renderProgress();
      if (found.size < 5) {
        const span = document.createElement('span');
        span.textContent = toy.text;
        show(span.outerHTML);
        return;
      }
      unlock?.trigger();
      show('<strong>ALL ACCESS</strong> ― 5つ全部つついた。<a href="#ctf">ページの一番下の端末に、CTF が待っている ↓</a>', true);
      found.clear();
      setTimeout(renderProgress, 1800);
    });
  });

  // ── housekeeping ──
  let resizeQueued = false;
  new ResizeObserver(() => {
    if (resizeQueued) return;
    resizeQueued = true;
    requestAnimationFrame(() => { resizeQueued = false; r.resizeDrawingSurfaceToCanvas(); });
  }).observe(canvas);

  // stop drawing while the hero is off screen
  new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) r.play();
    else r.pause();
  }).observe(stage);

  canvas.addEventListener('pointerdown', () => canvas.classList.add('is-grabbing'));
  window.addEventListener('pointerup', () => canvas.classList.remove('is-grabbing'));
}
