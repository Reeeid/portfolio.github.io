// Skills section intersection observer for animation
export function initSkills() {
  const obs = new IntersectionObserver(e => {
    e.forEach(x => {
      if (x.isIntersecting) {
        x.target.classList.add('in');
        const skillBar = x.target.querySelector('.skill-bar');
        if (skillBar) {
          const level = parseInt(skillBar.dataset.level);
          const color = skillBar.dataset.color;
          // Create 5 segments
          skillBar.innerHTML = '';
          for (let i = 1; i <= 5; i++) {
            const segment = document.createElement('div');
            segment.className = 'skill-segment';
            if (i <= level) {
              segment.classList.add('active');
              segment.style.backgroundColor = color;
            }
            skillBar.appendChild(segment);
          }
        }
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}
