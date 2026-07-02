import { initHeroBg } from './hero.js';
import { initSkills } from './skills.js';
import { initNav } from './nav.js';
import { initCTF } from './ctf.js';

document.addEventListener('DOMContentLoaded', () => {
  initSkills();
  initHeroBg();
  initNav();
  initCTF();
});
