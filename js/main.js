import { initHeroBg } from './hero.js';
import { initRiveHero } from './rive-hero.js';
import { initSkills } from './skills.js';
import { initNav } from './nav.js';
import { initCTF } from './ctf.js';
import { initReveal, initRipple, initCountUp } from './motion.js';

document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.classList.add('ready');
  initSkills();
  initHeroBg();
  initRiveHero();
  initNav();
  initReveal();
  initRipple();
  initCountUp();
  initCTF();
});
