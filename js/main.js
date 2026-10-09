import { initSkills } from './skills.js';
import { initNav } from './nav.js';
import { initCTF } from './ctf.js';
import { initReveal, initCountUp } from './motion.js';

document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.classList.add('ready');
  initSkills();
  initNav();
  initReveal();
  initCountUp();
  initCTF();
});
