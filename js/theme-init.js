// Applies the saved theme before first paint. Loaded as a classic script in <head>.
(function () {
  var root = document.documentElement;
  root.classList.add('js');
  // If the module bundle never starts, drop .js so hidden-until-revealed content shows
  setTimeout(function () {
    if (!root.classList.contains('ready')) root.classList.remove('js');
  }, 3000);
  try {
    var theme = localStorage.getItem('r3id_theme');
    if (theme === 'light' || theme === 'dark') root.dataset.theme = theme;
    var hue = Number(localStorage.getItem('r3id_hue'));
    if (hue > 0 && hue <= 360) root.style.setProperty('--hue', hue);
  } catch (e) {}
})();
