// Hamburger menu toggle (shared by all pages)
function toggleMenu() {
  const menu = document.querySelector('.menu-links');
  const icon = document.querySelector('.hamburger-icon');
  if (menu) menu.classList.toggle('open');
  if (icon) icon.classList.toggle('open');
}

document.addEventListener('DOMContentLoaded', () => {
  // Project image carousels
  document.querySelectorAll('.carousel').forEach((carousel) => {
    const track = carousel.querySelector('.carousel-track');
    const slides = carousel.querySelectorAll('.carousel-slide');
    const dots = carousel.querySelectorAll('.dot');
    const prevBtn = carousel.querySelector('.carousel-btn.prev');
    const nextBtn = carousel.querySelector('.carousel-btn.next');
    let index = 0;

    function goTo(i) {
      index = (i + slides.length) % slides.length;
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((d, di) => d.classList.toggle('active', di === index));
      carousel.querySelectorAll('video').forEach((v) => v.pause());
    }

    if (prevBtn) prevBtn.addEventListener('click', () => goTo(index - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goTo(index + 1));
    dots.forEach((d, di) => d.addEventListener('click', () => goTo(di)));
  });

  // Click a project card to open its detail page (ignore clicks on carousel
  // controls, videos, and links, which handle their own interaction)
  document.querySelectorAll('.project[data-project]').forEach((card) => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.carousel-btn, .dot, a, video')) return;
      window.location.href = `project-${card.dataset.project}.html`;
    });
  });

  // Fade-in reveal on scroll
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.fade-in').forEach((el) => revealObserver.observe(el));

  // Staggered skill card reveal
  const skillsContainer = document.querySelector('.skills-container');
  if (skillsContainer) {
    skillsContainer.querySelectorAll('.skill').forEach((s) => {
      s.style.opacity = '0';
      s.style.transform = 'translateY(20px) scale(0.9)';
      s.style.transition = 'opacity .5s ease, transform .5s cubic-bezier(.34,1.56,.64,1), border-color .3s, box-shadow .3s';
    });
    const skillObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.skill').forEach((s, i) => {
            s.style.transitionDelay = `${i * 70}ms`;
            s.style.opacity = '1';
            s.style.transform = 'none';
          });
          skillObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    skillObserver.observe(skillsContainer);
  }

  // Typing effect for the hero subtitle
  const profileText = document.querySelector('.section__text__p2');
  if (profileText) {
    const text = profileText.textContent;
    profileText.textContent = '';
    let i = 0;
    (function typeWriter() {
      if (i < text.length) {
        profileText.textContent += text.charAt(i++);
        setTimeout(typeWriter, 50);
      }
    })();
  }

  // Contact form validation + submit
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const inputs = contactForm.querySelectorAll('input, textarea');
      let isValid = true;
      inputs.forEach((input) => {
        if (!input.value.trim()) {
          input.style.borderColor = '#ec4899';
          isValid = false;
        } else {
          input.style.borderColor = '';
        }
      });
      if (isValid) {
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        fetch(contactForm.action, {
          method: 'POST',
          body: new FormData(contactForm),
          headers: { Accept: 'application/json' },
        })
          .then((response) => {
            if (response.ok) {
              alert('Thank you for your message! I will get back to you soon.');
              contactForm.reset();
            } else {
              alert('Something went wrong sending your message. Please try again or email me directly.');
            }
          })
          .catch(() => {
            alert('Something went wrong sending your message. Please try again or email me directly.');
          })
          .finally(() => {
            submitBtn.disabled = false;
          });
      }
    });
  }

  // Constellation sparkle background
  const canvas = document.getElementById('constellation-canvas');
  if (canvas) initConstellation(canvas);
});

// ── Constellation background ──────────────────────────────────
function initConstellation(canvas) {
  const ctx = canvas.getContext('2d');
  const COLORS = ['#f9a8d4', '#c4b5fd', '#6ee7b7', '#bae6fd', '#fed7aa', '#fbcfe8', '#ddd6fe'];
  const CONNECT_DIST = 130;
  const NUM_STARS = 90;

  let stars = [];
  let W, H;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', () => { resize(); initStars(); });
  resize();

  // 4-point sparkle shape
  function drawSparkle(x, y, r, color, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.translate(x, y);
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4;
      const rad = i % 2 === 0 ? r : r * 0.38;
      ctx.lineTo(Math.cos(angle) * rad, Math.sin(angle) * rad);
    }
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.22, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.restore();
  }

  function initStars() {
    stars = Array.from({ length: NUM_STARS }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 2.8 + 1.2,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.018 + 0.008,
    }));
  }
  initStars();

  function animate() {
    ctx.clearRect(0, 0, W, H);

    for (const s of stars) {
      s.x += s.vx; s.y += s.vy;
      if (s.x < -10) s.x = W + 10;
      if (s.x > W + 10) s.x = -10;
      if (s.y < -10) s.y = H + 10;
      if (s.y > H + 10) s.y = -10;
      s.phase += s.speed;
    }

    for (let i = 0; i < stars.length; i++) {
      for (let j = i + 1; j < stars.length; j++) {
        const dx = stars[i].x - stars[j].x;
        const dy = stars[i].y - stars[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECT_DIST) {
          const alpha = (1 - dist / CONNECT_DIST) * 0.18;
          ctx.beginPath();
          ctx.moveTo(stars[i].x, stars[i].y);
          ctx.lineTo(stars[j].x, stars[j].y);
          const grad = ctx.createLinearGradient(stars[i].x, stars[i].y, stars[j].x, stars[j].y);
          grad.addColorStop(0, stars[i].color);
          grad.addColorStop(1, stars[j].color);
          ctx.strokeStyle = grad;
          ctx.globalAlpha = alpha;
          ctx.lineWidth = 0.7;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
    }

    for (const s of stars) {
      const twinkle = 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(s.phase));
      drawSparkle(s.x, s.y, s.r, s.color, twinkle);
    }

    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
}
