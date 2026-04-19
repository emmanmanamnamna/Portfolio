/* ============================================================
   script.js — Lloyd Emman Portfolio
   Sections:
   1. Custom Cursor
   2. Hamburger / Mobile Menu
   3. Typing Effect
   4. Scroll Reveal (IntersectionObserver)
   5. Parallax Orbs
   6. Active Nav Link on Scroll
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ──────────────────────────────────────────────────────────
     1. Custom Cursor
     Only runs on devices that support hover (non-touch)
  ────────────────────────────────────────────────────────── */
  const cursorDot  = document.getElementById('cursor-dot');
  const cursorRing = document.getElementById('cursor-ring');

  const isTouchDevice = window.matchMedia('(hover: none)').matches;

  if (!isTouchDevice && cursorDot && cursorRing) {
    let mouseX = 0, mouseY = 0;
    let ringX  = 0, ringY  = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animateCursor() {
      // Dot snaps to mouse instantly
      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top  = mouseY + 'px';

      // Ring lags behind with lerp
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top  = ringY + 'px';

      requestAnimationFrame(animateCursor);
    }

    animateCursor();

    // Expand ring on interactive elements
    const interactiveEls = document.querySelectorAll(
      'a, button, .project-card, .skill-tag, .nav-cta, .mobile-link'
    );

    interactiveEls.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        cursorRing.style.width       = '60px';
        cursorRing.style.height      = '60px';
        cursorRing.style.borderColor = 'var(--accent2)';
        cursorDot.style.background   = 'var(--accent2)';
      });

      el.addEventListener('mouseleave', () => {
        cursorRing.style.width       = '36px';
        cursorRing.style.height      = '36px';
        cursorRing.style.borderColor = 'var(--accent)';
        cursorDot.style.background   = 'var(--accent)';
      });
    });
  }


  /* ──────────────────────────────────────────────────────────
     2. Hamburger / Mobile Menu
  ────────────────────────────────────────────────────────── */
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const menuClose  = document.getElementById('menuClose');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  function openMenu() {
    mobileMenu.classList.add('open');
    hamburger.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (hamburger) hamburger.addEventListener('click', openMenu);
  if (menuClose) menuClose.addEventListener('click', closeMenu);

  // Close menu when a nav link is clicked
  mobileLinks.forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });


  /* ──────────────────────────────────────────────────────────
     3. Typing Effect
  ────────────────────────────────────────────────────────── */
  const typedTextEl = document.getElementById('typed-text');

  const phrases = [
    'Full-Stack Developer.',
    'Problem Solver.',
    'Web Designer',
    'Coffee → Code Converter.',
    'Programmer.',
  ];

  let phraseIndex  = 0;
  let charIndex    = 0;
  let isDeleting   = false;

  const TYPING_SPEED   = 95;   // ms per character typed
  const DELETING_SPEED = 45;   // ms per character deleted
  const PAUSE_AFTER    = 2000; // ms pause after full phrase
  const PAUSE_BEFORE   = 400;  // ms pause before typing next phrase

  function type() {
    if (!typedTextEl) return;

    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      // Remove one character
      typedTextEl.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;

      if (charIndex < 0) {
        isDeleting  = false;
        charIndex   = 0;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(type, PAUSE_BEFORE);
        return;
      }
    } else {
      // Add one character
      typedTextEl.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;

      if (charIndex === currentPhrase.length) {
        isDeleting = true;
        setTimeout(type, PAUSE_AFTER);
        return;
      }
    }

    setTimeout(type, isDeleting ? DELETING_SPEED : TYPING_SPEED);
  }

  // Start after hero animation delay
  setTimeout(type, 1500);


  /* ──────────────────────────────────────────────────────────
     4. Scroll Reveal (IntersectionObserver)
  ────────────────────────────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Unobserve after reveal so it doesn't re-trigger
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealEls.forEach((el) => revealObserver.observe(el));


  /* ──────────────────────────────────────────────────────────
     5. Parallax Orbs (mouse-driven, desktop only)
  ────────────────────────────────────────────────────────── */
  if (!isTouchDevice) {
    const orbs = document.querySelectorAll('.orb');

    document.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth  - 0.5) * 30;
      const y = (e.clientY / window.innerHeight - 0.5) * 30;

      orbs.forEach((orb, i) => {
        const factor = (i + 1) * 0.5;
        orb.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
      });
    });
  }


  /* ──────────────────────────────────────────────────────────
     6. Active Nav Link on Scroll
  ────────────────────────────────────────────────────────── */
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-links a');
  const navHeight = document.getElementById('navbar')?.offsetHeight || 70;

  function updateActiveNav() {
    let currentId = '';

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - navHeight - 60;
      if (window.scrollY >= sectionTop) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + currentId) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav(); // run once on load

});

/* ──────────────────────────────────────────────────────────
   7. Copy Email on Button Click
────────────────────────────────────────────────────────── */
const copyEmailBtn = document.querySelector('.contact-actions .btn-primary');
const EMAIL = 'lloydemmanv@gmail.com';

if (copyEmailBtn) {
  copyEmailBtn.addEventListener('click', (e) => {
    e.preventDefault(); // stop mailto from opening

    navigator.clipboard.writeText(EMAIL).then(() => {
      const original = copyEmailBtn.textContent;
      copyEmailBtn.textContent = '✓ Email Copied!';
      copyEmailBtn.style.background = 'var(--accent3)';
      copyEmailBtn.style.boxShadow  = '0 0 30px rgba(0, 240, 192, 0.5)';

      setTimeout(() => {
        copyEmailBtn.textContent      = original;
        copyEmailBtn.style.background = '';
        copyEmailBtn.style.boxShadow  = '';
      }, 2500);

    }).catch(() => {
      // Fallback for older browsers
      const temp = document.createElement('textarea');
      temp.value = EMAIL;
      temp.style.position = 'fixed';
      temp.style.opacity  = '0';
      document.body.appendChild(temp);
      temp.select();
      document.execCommand('copy');
      document.body.removeChild(temp);

      copyEmailBtn.textContent = '✓ Email Copied!';
      setTimeout(() => { copyEmailBtn.textContent = 'Send a Message'; }, 2500);
    });
  });
}
