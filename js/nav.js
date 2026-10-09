export function initNav() {
  const nav = document.getElementById('siteNav');
  const hamburger = document.getElementById('navHamburger');
  const navLinks = document.getElementById('navLinks');
  if (!nav || !hamburger || !navLinks) return;

  // Mobile menu
  function setMenu(open) {
    navLinks.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
    hamburger.firstElementChild.className = open ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
  }
  hamburger.addEventListener('click', () => setMenu(!navLinks.classList.contains('open')));
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') setMenu(false);
  });

  // Hide the bar while scrolling down, bring it back on the way up
  let lastY = window.scrollY;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > lastY + 4 && y > 360 && !navLinks.classList.contains('open')) nav.classList.add('is-hidden');
    else if (y < lastY - 4) nav.classList.remove('is-hidden');
    lastY = y;
  }, { passive: true });

  // Light up the hop for the section currently in view
  if (!('IntersectionObserver' in window)) return;
  const links = Array.from(navLinks.querySelectorAll('a[href^="#"]'));
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      links.forEach(l => {
        if (l.getAttribute('href') === `#${e.target.id}`) l.setAttribute('aria-current', 'location');
        else l.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  document.querySelectorAll('main section[id]').forEach(sec => obs.observe(sec));
}
