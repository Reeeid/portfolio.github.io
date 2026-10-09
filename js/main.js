import { initHeroBg } from './hero.js';
import { initSkills } from './skills.js';
import { initNav } from './nav.js';
import { initCTF } from './ctf.js';
import { initReveal, initRipple, initCountUp } from './motion.js';

document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.classList.add('ready');
  initSkills();
  initHeroBg();
  initNav();
  initReveal();
  initRipple();
  initCountUp();
  initCTF();
});
