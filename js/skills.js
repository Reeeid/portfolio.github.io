// Skills section intersection observer for animation
export function initSkills() {
  const obs = new IntersectionObserver(e => {
    e.forEach(x => {
      if (x.isIntersecting) {
        x.target.classList.add('in');
        x.target.querySelectorAll('.skill-fill').forEach(f => {
          f.style.width = f.dataset.w + '%';
        });
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}
