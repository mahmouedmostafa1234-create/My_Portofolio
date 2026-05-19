/* =============================================
   MAHMOUD MOHAMMED MOSTAFA — PORTFOLIO JS
   Handles: Loader, Cursor, Typing, Navbar,
            Scroll Reveal, Skill Bars, Mobile Menu
   ============================================= */

// ========== LOADING SCREEN ==========
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  // Wait for fill animation (1.8s) then hide
  setTimeout(() => {
    loader.classList.add('hidden');
    // Trigger initial reveals after loader hides
    setTimeout(triggerHeroReveal, 400);
  }, 2200);
});

function triggerHeroReveal() {
  const heroEls = document.querySelectorAll('#hero .reveal-up, #hero .reveal-right');
  heroEls.forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), i * 150);
  });
}

// ========== CUSTOM CURSOR ==========
const cursorDot = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');

let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;

  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top = mouseY + 'px';
});

// Smooth ring follow
function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;

  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top = ringY + 'px';

  requestAnimationFrame(animateRing);
}
animateRing();

// Hover effect on interactive elements
const hoverables = document.querySelectorAll('a, button, .skill-card, .project-card, .soft-card, .info-card, .activity-item');
hoverables.forEach(el => {
  el.addEventListener('mouseenter', () => cursorRing.classList.add('hovered'));
  el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovered'));
});

// Hide cursor when leaving window
document.addEventListener('mouseleave', () => {
  cursorDot.style.opacity = '0';
  cursorRing.style.opacity = '0';
});
document.addEventListener('mouseenter', () => {
  cursorDot.style.opacity = '1';
  cursorRing.style.opacity = '0.6';
});

// ========== TYPING EFFECT ==========
const typedText = document.getElementById('typedText');
const phrases = [
  'CS Student @ Lotus University',
  'Aspiring Frontend Developer',
  'HTML · CSS · JavaScript',
  'GDG Minya Trainee',
  'Problem Solver & Builder',
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingPaused = false;

function typeLoop() {
  if (!typedText) return;

  const currentPhrase = phrases[phraseIndex];

  if (!isDeleting) {
    // Typing forward
    typedText.textContent = currentPhrase.substring(0, charIndex + 1);
    charIndex++;

    if (charIndex === currentPhrase.length) {
      // Pause at full phrase
      typingPaused = true;
      setTimeout(() => {
        typingPaused = false;
        isDeleting = true;
        typeLoop();
      }, 2000);
      return;
    }
  } else {
    // Deleting
    typedText.textContent = currentPhrase.substring(0, charIndex - 1);
    charIndex--;

    if (charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
    }
  }

  const speed = isDeleting ? 50 : 90;
  setTimeout(typeLoop, speed);
}

// Start typing after loader
setTimeout(typeLoop, 2800);

// ========== NAVBAR ==========
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  // Scrolled state
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Active link highlight
  let currentSection = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) {
      currentSection = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + currentSection) {
      link.classList.add('active');
    }
  });
});

// ========== MOBILE MENU ==========
const navToggle = document.getElementById('navToggle');
const navLinksContainer = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navLinksContainer.classList.toggle('open');
  navToggle.classList.toggle('open');
});

// Close menu on link click
navLinksContainer.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinksContainer.classList.remove('open');
    navToggle.classList.remove('open');
  });
});

// Close menu on outside click
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target)) {
    navLinksContainer.classList.remove('open');
    navToggle.classList.remove('open');
  }
});

// ========== SCROLL REVEAL ==========
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = parseInt(entry.target.dataset.delay) || 0;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -60px 0px'
});

// Observe all reveal elements (not hero — those are triggered after loader)
document.querySelectorAll('.reveal-up:not(#hero *), .reveal-right:not(#hero *)').forEach(el => {
  revealObserver.observe(el);
});

// ========== SKILL BAR ANIMATION ==========
const skillBarObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const bar = entry.target;
      const width = bar.dataset.width;
      const fill = bar.querySelector('.skill-fill');
      if (fill) {
        setTimeout(() => {
          fill.style.width = width + '%';
        }, 200);
      }
      skillBarObserver.unobserve(bar);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-bar[data-width]').forEach(bar => {
  skillBarObserver.observe(bar);
});

// ========== SMOOTH SCROLL FOR ANCHOR LINKS ==========
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const navHeight = navbar.offsetHeight;
      const targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;
      window.scrollTo({ top: targetPos, behavior: 'smooth' });
    }
  });
});

// ========== PARALLAX ORBS (subtle) ==========
window.addEventListener('mousemove', (e) => {
  const x = (e.clientX / window.innerWidth - 0.5) * 20;
  const y = (e.clientY / window.innerHeight - 0.5) * 20;

  const orb1 = document.querySelector('.orb-1');
  const orb2 = document.querySelector('.orb-2');
  const orb3 = document.querySelector('.orb-3');

  if (orb1) orb1.style.transform = `translate(${x * 0.5}px, ${y * 0.5}px)`;
  if (orb2) orb2.style.transform = `translate(${-x * 0.3}px, ${-y * 0.3}px)`;
  if (orb3) orb3.style.transform = `translate(${x * 0.8}px, ${y * 0.8}px)`;
});

// ========== LOADER TEXT CYCLING ==========
const loaderMessages = ['Initializing...', 'Loading assets...', 'Almost ready...', 'Welcome!'];
const loaderTextEl = document.querySelector('.loader-text');
let msgIdx = 0;

if (loaderTextEl) {
  const msgInterval = setInterval(() => {
    msgIdx = (msgIdx + 1) % loaderMessages.length;
    loaderTextEl.style.opacity = '0';
    setTimeout(() => {
      loaderTextEl.textContent = loaderMessages[msgIdx];
      loaderTextEl.style.opacity = '1';
    }, 200);
  }, 500);

  setTimeout(() => clearInterval(msgInterval), 2200);
}

// ========== GLITCH EFFECT ON HERO NAME (subtle) ==========
const heroName = document.querySelector('.hero-name');
if (heroName) {
  setInterval(() => {
    if (Math.random() > 0.95) {
      heroName.style.textShadow = `2px 0 var(--accent), -2px 0 var(--accent-2)`;
      setTimeout(() => {
        heroName.style.textShadow = '';
      }, 80);
    }
  }, 3000);
}

// ========== ACTIVE NAV TOGGLE ANIMATION ==========
// Hamburger → X animation
const style = document.createElement('style');
style.textContent = `
  .nav-toggle.open span:nth-child(1) {
    transform: rotate(45deg) translate(5px, 5px);
  }
  .nav-toggle.open span:nth-child(2) {
    opacity: 0;
    transform: translateX(10px);
  }
  .nav-toggle.open span:nth-child(3) {
    transform: rotate(-45deg) translate(5px, -5px);
  }
  .nav-toggle span {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
`;
document.head.appendChild(style);

// ========== STAT COUNTER ANIMATION ==========
function animateCounter(element, target, suffix = '') {
  const start = 0;
  const duration = 1500;
  const step = (timestamp, startTime) => {
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease out cubic
    const current = start + (target - start) * eased;
    element.textContent = Number.isInteger(target)
      ? Math.round(current) + suffix
      : current.toFixed(1) + suffix;
    if (progress < 1) requestAnimationFrame(ts => step(ts, startTime));
  };
  requestAnimationFrame(ts => step(ts, ts));
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const statNums = entry.target.querySelectorAll('.stat-num');
      statNums.forEach(num => {
        const text = num.textContent;
        const value = parseFloat(text);
        const suffix = text.replace(/[\d.]/g, '');
        animateCounter(num, value, suffix);
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const statsContainer = document.querySelector('.hero-stats');
if (statsContainer) statsObserver.observe(statsContainer);

// ========== CONSOLE EASTER EGG ==========
console.log('%c👋 Hey there, fellow developer!', 'font-size: 18px; color: #00e5ff; font-weight: bold;');
console.log('%cMahmoud Mohammed Mostafa — CS Student & Aspiring Frontend Dev', 'color: #718096; font-size: 12px;');
console.log('%cThis portfolio was built with pure HTML, CSS & JavaScript. No frameworks!', 'color: #00ff94; font-size: 11px;');
console.log('%c📧 mahmouedmostafa1234@gmail.com', 'color: #7b61ff; font-size: 11px;');
