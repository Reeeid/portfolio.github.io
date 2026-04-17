// Navigation mini mode on scroll
export function initNav() {
  const nav = document.getElementById('siteNav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('mini', window.scrollY > 40);
  }, { passive: true });
}
