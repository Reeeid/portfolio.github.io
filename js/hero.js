// Hero section background animation
export function initHeroBg() {
  const WORDS = [
    { text: 'PHP',        color: '#7b88c9', icon: 'devicon-php-plain' },
    { text: 'C#',         color: '#a855f7', icon: 'devicon-csharp-plain' },
    { text: 'SECURITY',   color: '#f472b6', icon: null },
    { text: 'Python',     color: '#facc15', icon: 'devicon-python-plain' },
    { text: 'SQL',        color: '#60a5fa', icon: 'devicon-postgresql-plain' },
    { text: 'NETWORK',    color: '#34d399', icon: null },
    { text: 'HTML',       color: '#fb923c', icon: 'devicon-html5-plain' },
    { text: 'CSS',        color: '#38bdf8', icon: 'devicon-css3-plain' },
    { text: 'JAVASCRIPT', color: '#fde047', icon: 'devicon-javascript-plain' },
    { text: 'TYPESCRIPT', color: '#60a5fa', icon: 'devicon-typescript-plain' },
    { text: 'GO',         color: '#67e8f9', icon: 'devicon-go-plain' },
    { text: 'CLOUD',      color: '#a78bfa', icon: 'devicon-amazonwebservices-plain' },
    { text: 'DOCKER',     color: '#38bdf8', icon: 'devicon-docker-plain' },
    { text: 'GIT',        color: '#f87171', icon: 'devicon-git-plain' },
  ];
  const SEP = '　';

  function makeUnit(frag) {
    WORDS.forEach(w => {
      const s = document.createElement('span');
      s.style.color = w.color;
      s.style.marginRight = '0.15em';
      if (w.icon) {
        const i = document.createElement('i');
        i.className = w.icon + ' colored';
        i.style.marginRight = '0.2em';
        i.style.fontSize = '0.85em';
        i.style.verticalAlign = 'middle';
        s.appendChild(i);
      }
      s.appendChild(document.createTextNode(w.text + SEP));
      frag.appendChild(s);
    });
  }

  document.querySelectorAll('#heroBg .hrow').forEach(r => {
    r.style.animationPlayState = 'paused';
    const frag = document.createDocumentFragment();
    for (let rep = 0; rep < 8; rep++) makeUnit(frag);
    r.appendChild(frag);
  });

  document.fonts.ready.then(() => {
    const probe = document.createElement('div');
    probe.style.cssText = 'position:absolute;visibility:hidden;white-space:nowrap;font-size:48px;font-weight:800;top:-9999px;';
    makeUnit(probe);
    document.body.appendChild(probe);
    const unitW = probe.getBoundingClientRect().width;
    document.body.removeChild(probe);

    document.querySelectorAll('#heroBg .hrow').forEach(r => {
      r.style.setProperty('--shift', r.classList.contains('l') ? `-${unitW}px` : `${unitW}px`);
      r.style.animationPlayState = 'running';
    });
  });
}
