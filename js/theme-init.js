// Marks the page as script-enabled before first paint. Loaded as a classic script in <head>.
(function () {
  var root = document.documentElement;
  root.classList.add('js');
  // If the module bundle never starts, drop .js so hidden-until-revealed content shows
  setTimeout(function () {
    if (!root.classList.contains('ready')) root.classList.remove('js');
  }, 3000);
})();
