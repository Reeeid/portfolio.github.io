import { reduced } from './motion.js';

const SVG_NS = 'http://www.w3.org/2000/svg';
const MAX_LEVEL = 4;
const WIDTH = 132;

// Wavy line from 0 to `end`, as used by the M3 Expressive progress indicator
function wavePath(end) {
  let d = 'M2 7';
  for (let x = 2; x <= end; x += 2) d += `L${x} ${(7 + 2.6 * Math.sin((x - 2) / 3.6)).toFixed(2)}`;
  return d;
}

export function initSkills() {
  // Level meters
  document.querySelectorAll('.skill-chip[data-level]').forEach(chip => {
    const level = Math.max(0, Math.min(MAX_LEVEL, Number(chip.dataset.level)));
    const end = 2 + ((WIDTH - 4) * level) / MAX_LEVEL;

    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('class', 'sc-meter');
    svg.setAttribute('viewBox', `0 0 ${WIDTH} 14`);
    svg.setAttribute('aria-hidden', 'true');

    const track = document.createElementNS(SVG_NS, 'path');
    track.setAttribute('class', 'sc-meter-track');
    track.setAttribute('d', `M${Math.min(end + 6, WIDTH - 2)} 7H${WIDTH - 2}`);
    const active = document.createElementNS(SVG_NS, 'path');
    active.setAttribute('class', 'sc-meter-active');
    active.setAttribute('d', wavePath(end));
    svg.append(track, active);
    chip.querySelector('.sc-level')?.after(svg);

    if (reduced) return;
    const length = active.getTotalLength();
    active.style.strokeDasharray = length;
    active.style.strokeDashoffset = length;
    const draw = () => { active.style.strokeDashoffset = 0; };
    if (chip.classList.contains('is-in')) draw();
    else chip.addEventListener('reveal', draw, { once: true });
  });

  // Works filter
  const filters = document.getElementById('workFilters');
  const grid = document.getElementById('worksGrid');
  if (!filters || !grid) return;
  const chips = Array.from(filters.querySelectorAll('.chip'));
  const cards = Array.from(grid.querySelectorAll('.work-card'));
  const count = document.getElementById('workCount');

  filters.addEventListener('click', e => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    const filter = chip.dataset.filter;
    chips.forEach(c => c.setAttribute('aria-pressed', c === chip));

    let shown = 0;
    cards.forEach(card => {
      const cats = card.dataset.cat.split(' ');
      const match = filter === 'all' || cats.includes(filter) || cats.includes('all');
      card.hidden = !match;
      if (!match) return;
      card.style.setProperty('--i', shown++);
      card.classList.add('is-in');
      card.classList.remove('pop-in');
      void card.offsetWidth;
      card.classList.add('pop-in');
    });
    grid.classList.toggle('is-filtered', filter !== 'all');
    if (count) count.textContent = `${shown} 件を表示`;
  });
}
