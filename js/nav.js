export function initNav() {
  const nav = document.getElementById('siteNav');
  const hamburger = document.getElementById('navHamburger');
  const navLinks = document.getElementById('navLinks');
document.getElementById('btnWorks')?.addEventListener('click', () => {
    document.getElementById('works').scrollIntoView({ behavior: 'smooth' });
  });
  document.getElementById('btnContact')?.addEventListener('click', () => {
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
  });

  window.addEventListener('scroll', () => {
    nav.classList.toggle('mini', window.scrollY > 40);
  }, { passive: true });

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
  });

  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
    });
  });
}
