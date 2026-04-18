// Main initialization entry point
import { initHeroBg } from './hero.js';
import { initSkills } from './skills.js';
import { initNav } from './nav.js';

// Initialize all modules
document.addEventListener('DOMContentLoaded', () => {
  initSkills();
  initHeroBg();
  initNav();
});
