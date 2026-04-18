// Hero section background animation
export function initHeroBg() {

  const BGTEXT = 'SECURITY　Python　SQL　NETWORK　HTML　CSS　JAVASCRIPT　TYPESCRIPT　GO　CLOUD　DOCKER　GIT';

  const T = BGTEXT + '　';
  const bg = document.getElementById('heroBg');
  const isLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  const color = isLight ? '#000' : '#fff';

  const baseDurations = [16, 20, 18, 22, 15, 19, 17, 21, 14];
  for (let i = 0; i < 9; i++) {
    const r = document.createElement('div');
    r.className = 'hrow';
    r.style.color = color;
    r.style.willChange = 'transform';

    // s1を基準幅として使い、s2はその複製（シームレスループ用）
    const s1 = document.createElement('span');
    const s2 = document.createElement('span');
    s1.textContent = T.repeat(3);
    s2.textContent = T.repeat(3);
    s2.setAttribute('aria-hidden', 'true');
    r.appendChild(s1);
    r.appendChild(s2);
    bg.appendChild(r);

    // s1の幅が確定してからアニメーションを設定
    requestAnimationFrame(() => {
      const w = s1.getBoundingClientRect().width;
      if (w === 0) return;
      const dir = i % 2 === 0 ? -1 : 1;
      const dur = baseDurations[i] * 1000;
      const delay = -(baseDurations[i] * (i / 9)) * 1000;
      r.animate(
        [
          { transform: `translate3d(0, 0, 0)` },
          { transform: `translate3d(${dir * w}px, 0, 0)` },
        ],
        { duration: dur, delay, iterations: Infinity, easing: 'linear' }
      );
    });
  }
}
