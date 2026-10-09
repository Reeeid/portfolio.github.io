// Works filter
export function initSkills() {
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
    if (count) count.textContent = `${shown} 件を表示`;
  });
}
