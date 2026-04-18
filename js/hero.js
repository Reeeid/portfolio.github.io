// Hero section background animation
export function initHeroBg() {

  const BGTEXT = 'SECURITY　Python　SQL　NETWORK　HTML　CSS　JAVASCRIPT　TYPESCRIPT　GO　CLOUD　DOCKER　GIT';

  const T = BGTEXT.repeat(3) + '　';
  const bg = document.getElementById('heroBg');
  const isLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  const color = isLight ? '#000' : '#fff';

  const baseDurations = [16, 20, 18, 22, 15, 19, 17, 21, 14];
  for (let i = 0; i < 9; i++) {
    const r = document.createElement('div');
    r.className = 'hrow ' + (i % 2 === 0 ? 'l' : 'r');
    // 同じspanを2つ並べることでループの切れ目をなくす
    const s1 = document.createElement('span');
    const s2 = document.createElement('span');
    s1.textContent = T;
    s2.textContent = T;
    s2.setAttribute('aria-hidden', 'true');
    r.appendChild(s1);
    r.appendChild(s2);
    r.style.color = color;
    r.style.animationDuration = baseDurations[i] + 's';
    r.style.animationDelay = -(baseDurations[i] * (i / 9)) + 's';
    bg.appendChild(r);
  }
}
