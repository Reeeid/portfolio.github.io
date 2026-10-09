// Hero stage: decorative Material shapes with pointer parallax
import { spring, reduced, finePointer } from './motion.js';

const SVG_NS = 'http://www.w3.org/2000/svg';
const POINTS = 120;
const TAU = Math.PI * 2;

const superellipse = (a, b, p) => t =>
  1 / Math.pow(Math.pow(Math.abs(Math.cos(t)) / a, p) + Math.pow(Math.abs(Math.sin(t)) / b, p), 1 / p);

// Every shape is a radius function sampled at the same angles, so any two can be interpolated
const SHAPES = {
  circle:   () => 86,
  cookie:   t => 82 + 7 * Math.cos(9 * t),
  clover:   t => 70 + 20 * Math.cos(4 * t),
  flower:   t => 68 + 22 * Math.cos(6 * t),
  burst:    t => 80 + 9 * Math.cos(12 * t),
  trefoil:  t => 72 + 18 * Math.cos(3 * t),
  squircle: superellipse(88, 88, 4),
  pill:     superellipse(96, 58, 5),
  diamond:  superellipse(96, 96, 1.5),
};

function sample(name) {
  const fn = SHAPES[name] || SHAPES.circle;
  return Array.from({ length: POINTS }, (_, i) => {
    const t = (i / POINTS) * TAU;
    const r = fn(t);
    return [r * Math.cos(t), r * Math.sin(t)];
  });
}

function toPath(pts) {
  let d = '';
  for (let i = 0; i < pts.length; i++) {
    d += `${i ? 'L' : 'M'}${pts[i][0].toFixed(1)} ${pts[i][1].toFixed(1)}`;
  }
  return d + 'Z';
}

// Draws a shape into host and returns morph(), which springs to the next shape in the list
function createMorphShape(host, names) {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', '-100 -100 200 200');
  svg.setAttribute('aria-hidden', 'true');
  const path = document.createElementNS(SVG_NS, 'path');
  svg.appendChild(path);
  host.prepend(svg);
  host.classList.add('has-svg');

  const shapes = names.map(sample);
  let index = 0;
  let from = shapes[0];
  let to = shapes[0];
  let current = shapes[0];

  const progress = spring(t => {
    current = from.map((p, i) => [p[0] + (to[i][0] - p[0]) * t, p[1] + (to[i][1] - p[1]) * t]);
    path.setAttribute('d', toPath(current));
  }, { stiffness: 170, damping: 11, eps: 0.002 });
  const turn = spring(deg => { svg.style.transform = `rotate(${deg}deg)`; }, { stiffness: 90, damping: 13 });

  path.setAttribute('d', toPath(current));
  let angle = 0;

  return function morph() {
    index = (index + 1) % shapes.length;
    from = current;
    to = shapes[index];
    progress.jump(0);
    progress.set(1);
    angle += 45;
    turn.set(angle);
  };
}

export function initHeroBg() {
  const stage = document.getElementById('heroStage');
  if (!stage) return;

  const items = Array.from(stage.querySelectorAll('.shape')).map(btn => {
    const names = (btn.dataset.shapes || 'circle').split(',');
    createMorphShape(btn.querySelector('.shape-body'), names);
    const depth = parseFloat(btn.dataset.depth) || 0.5;
    const item = { btn, depth };

    const render = () => {
      const x = parallax.x * depth * 34;
      const y = parallax.y * depth * 34;
      btn.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
    };
    item.render = render;

    return item;
  });

  const parallax = { x: 0, y: 0 };
  const renderAll = () => items.forEach(item => item.render());
  if (finePointer && !reduced) {
    const px = spring(v => { parallax.x = v; renderAll(); }, { stiffness: 60, damping: 16, eps: 0.0005 });
    const py = spring(v => { parallax.y = v; renderAll(); }, { stiffness: 60, damping: 16, eps: 0.0005 });
    const hero = stage.closest('.hero') || stage;
    hero.addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse') return;
      const r = hero.getBoundingClientRect();
      px.set((e.clientX - r.left) / r.width - 0.5);
      py.set((e.clientY - r.top) / r.height - 0.5);
    });
  }

  // Small self-morphing indicators (M3 Expressive loading indicator)
  document.querySelectorAll('[data-morph-loader]').forEach(el => {
    const morph = createMorphShape(el, ['cookie', 'squircle', 'flower', 'pill', 'burst', 'circle', 'clover']);
    if (reduced) return;
    setInterval(() => { if (!document.hidden) morph(); }, 1300);
  });
}
