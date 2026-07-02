export function initSkills() {
  const carousel = document.getElementById('skillCarousel');
  const track    = document.getElementById('scTrack');
  if (!carousel || !track) return;

  // Duplicate chips for seamless infinite loop
  Array.from(track.querySelectorAll('.skill-chip'))
    .forEach(chip => track.appendChild(chip.cloneNode(true)));

  // 3D tilt
  function bindTilt(chip) {
    chip.addEventListener('mouseenter', () => {
      chip.style.transition = 'border-color .15s, box-shadow .15s, transform .1s ease';
    });
    chip.addEventListener('mousemove', e => {
      const r = chip.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      chip.style.transform =
        `perspective(500px) rotateY(${x * 22}deg) rotateX(${y * -22}deg) scale(1.06)`;
    });
    chip.addEventListener('mouseleave', () => {
      chip.style.transition = 'border-color .15s, box-shadow .15s, transform .35s ease';
      chip.style.transform = '';
    });
  }
  track.querySelectorAll('.skill-chip').forEach(bindTilt);

  // Auto-scroll state
  const SPEED   = 0.55; // px per frame
  let pos       = 0;    // current translateX (negative = left)
  let halfW     = 0;
  let isPaused  = false;
  let isDragging = false;
  let dragStartX = 0, dragStartPos = 0;

  function normalize(p) {
    if (halfW === 0) return p;
    while (p < -halfW) p += halfW;
    while (p >  0)     p -= halfW;
    return p;
  }

  function applyTransform() {
    track.style.transform = `translateX(${pos}px)`;
  }

  function tick() {
    if (!isDragging && !isPaused) {
      pos = normalize(pos - SPEED);
      applyTransform();
    }
    requestAnimationFrame(tick);
  }

  // Pause on hover so 3D tilt can be used comfortably
  carousel.addEventListener('mouseenter', () => { isPaused = true; });
  carousel.addEventListener('mouseleave', () => { if (!isDragging) isPaused = false; });

  // Drag to scrub
  carousel.addEventListener('mousedown', e => {
    isDragging  = true;
    isPaused    = true;
    dragStartX  = e.clientX;
    dragStartPos = pos;
    carousel.style.cursor = 'grabbing';
  });
  window.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    carousel.style.cursor = 'grab';
    pos = normalize(pos);
    isPaused = false;
  });
  window.addEventListener('mousemove', e => {
    if (!isDragging) return;
    pos = normalize(dragStartPos + (e.clientX - dragStartX));
    applyTransform();
  });

  // Start after layout is ready
  requestAnimationFrame(() => {
    halfW = track.offsetWidth / 2;
    requestAnimationFrame(tick);
  });

  // Reveal for other .reveal elements
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}
