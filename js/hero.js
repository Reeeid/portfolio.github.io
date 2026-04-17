// Hero section background animation
export function initHeroBg() {
  const skillLabels = Array.from(document.querySelectorAll('#skillsEl .skill-label'))
    .map(label => {
      // `label.textContent` may contain the numeric score at the end; remove it.
      const text = label.textContent.replace(/\s*\d+$/u, '').trim();
      return text;
    })
    .filter(Boolean);

  const BGTEXT = skillLabels.length
    ? skillLabels.join('　') + '　'
    : 'SECURITY　Python　SQL　NETWORK　HTML　CSS　JAVASCRIPT　TYPESCRIPT　GO　CLOUD　DOCKER　GIT';

  const T = BGTEXT.repeat(4);
  const bg = document.getElementById('heroBg');
  const isLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  const color = isLight ? '#000' : '#fff';

  for (let i = 0; i < 9; i++) {
    const r = document.createElement('div');
    r.className = 'hrow ' + (i % 2 === 0 ? 'l' : 'r');
    r.textContent = T;
    r.style.color = color;
    bg.appendChild(r);
  }
}
