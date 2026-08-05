// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
if (navToggle) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Hero interference pattern — Huygens wavelets from two coherent point
// sources, a nod to non-paraxial diffraction. Respects reduced-motion.
(function () {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let w, h, dpr;
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener('resize', resize);
  resize();

  const colors = ['#8b5cf6', '#3b82f6', '#22d3ee', '#10b981', '#f5a623'];

  function draw(t) {
    ctx.clearRect(0, 0, w, h);
    const s1x = w * 0.72, s1y = h * 0.15;
    const s2x = w * 0.95, s2y = h * 0.55;
    const wavelength = 46;
    const speed = prefersReduced ? 0 : 0.012;

    for (let i = 0; i < colors.length; i++) {
      ctx.strokeStyle = colors[i];
      ctx.globalAlpha = 0.16;
      ctx.lineWidth = 1;
      const phase = (t * speed + i * 7) % wavelength;
      for (let r = phase; r < 900; r += wavelength) {
        ctx.beginPath();
        ctx.arc(s1x, s1y, r, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
    if (!prefersReduced) requestAnimationFrame(draw);
  }

  requestAnimationFrame(draw);
})();

// Scroll-spy for nav active state (subtle underline via aria-current)
const sections = document.querySelectorAll('main section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');
if ('IntersectionObserver' in window && sections.length) {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navAnchors.forEach(a => {
          a.style.color = a.getAttribute('href') === `#${id}` ? 'var(--text-primary)' : '';
        });
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px' });
  sections.forEach(s => obs.observe(s));
}
