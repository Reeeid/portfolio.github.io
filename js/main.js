// Main initialization entry point
import { initHeroBg } from './hero.js';
import { initTicker } from './ticker.js';
import { initSkills } from './skills.js';
import { initNav } from './nav.js';
import { openWork, closeWork, closeWorkOut } from './works.js';

// Initialize all modules
document.addEventListener('DOMContentLoaded', () => {
  initHeroBg();
  initTicker();
  initSkills();
  initNav();
});

// Expose functions globally for HTML onclick handlers
window.openWork = openWork;
window.closeWork = closeWork;
window.closeWorkOut = closeWorkOut;
