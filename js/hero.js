// Hero section background animation
export function initHeroBg() {
  const BGTEXT = 'DESIGN　SECURITY　BUILD　LAUNCH　CODE　SHIP　CREATE　';
  const T = BGTEXT.repeat(4);
  const bg = document.getElementById('heroBg');
  const colors = ['#a78bfa', '#34d399', '#fb923c', '#f472b6', '#60a5fa'];
  
  for (let i = 0; i < 9; i++) {
    const r = document.createElement('div');
    r.className = 'hrow ' + (i % 2 === 0 ? 'l' : 'r');
    r.textContent = T;
    r.style.color = colors[i % 5];
    bg.appendChild(r);
  }
}
