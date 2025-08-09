// Navbar scroll effect
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  if (window.scrollY > 50) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');
});

// Mobile menu toggle
const mobileMenuToggle = document.getElementById('mobile-menu');
const mobileNav = document.getElementById('mobile-nav');
let isMenuOpen = false;

if (mobileMenuToggle && mobileNav) {
  mobileMenuToggle.addEventListener('click', () => {
    isMenuOpen = !isMenuOpen;
    mobileNav.classList.toggle('active', isMenuOpen);
    mobileMenuToggle.setAttribute('aria-expanded', String(isMenuOpen));
    // animate burger
    mobileMenuToggle.children[0].style.transform = isMenuOpen ? 'rotate(45deg) translateY(7px)' : 'rotate(0) translateY(0)';
    mobileMenuToggle.children[1].style.opacity = isMenuOpen ? '0' : '1';
    mobileMenuToggle.children[2].style.transform = isMenuOpen ? 'rotate(-45deg) translateY(-7px)' : 'rotate(0) translateY(0)';
  });

  // Close on link click
  document.querySelectorAll('.mobile-nav a').forEach(link => {
    link.addEventListener('click', () => {
      isMenuOpen = false;
      mobileNav.classList.remove('active');
      mobileMenuToggle.setAttribute('aria-expanded', 'false');
      mobileMenuToggle.children[0].style.transform = 'rotate(0) translateY(0)';
      mobileMenuToggle.children[1].style.opacity = '1';
      mobileMenuToggle.children[2].style.transform = 'rotate(0) translateY(0)';
    });
  });
}

// Smooth scrolling (offset for fixed nav)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const headerOffset = 80;
    const elementPosition = target.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - headerOffset;
    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
  });
});

// Fade-in on scroll
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('section').forEach(section => {
    section.classList.add('fade-in-section');
    observer.observe(section);
  });
  const skillsGrid = document.querySelector('.skills-grid');
  if (skillsGrid) observer.observe(skillsGrid);
});

// Typing effect for hero title (respect reduced motion)
document.addEventListener('DOMContentLoaded', () => {
  const heroText = document.querySelector('.hero-text h1');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!heroText || reduce) return;
  const text = heroText.textContent || '';
  heroText.textContent = '';
  let index = 0;
  function typeWriter() {
    if (index < text.length) {
      heroText.textContent += text.charAt(index++);
      setTimeout(typeWriter, 100);
    }
  }
  setTimeout(typeWriter, 500);
});

// Parallax for float elements
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  document.querySelectorAll('.float-element').forEach((el, i) => {
    const speed = 0.5 + (i * 0.2);
    el.style.transform = `translateY(${scrolled * speed}px)`;
  });
});

// Tilt effect on project cards
const tiltCards = document.querySelectorAll('[data-tilt]');
tiltCards.forEach(card => {
  const damp = 6; // lower = more tilt
  card.addEventListener('pointermove', (e) => {
    const r = card.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    const rx = (-(y - r.height/2) / r.height) * damp;
    const ry = ((x - r.width/2) / r.width) * damp;
    card.style.setProperty('--rx', `${rx}deg`);
    card.style.setProperty('--ry', `${ry}deg`);
    card.style.setProperty('--tz', `6px`);
  });
  card.addEventListener('pointerleave', () => {
    card.style.setProperty('--rx','0deg');
    card.style.setProperty('--ry','0deg');
    card.style.setProperty('--tz','0px');
  });
});

// Button glow follows cursor
document.querySelectorAll('.btn-primary').forEach(btn=>{
  btn.addEventListener('pointermove', e=>{
    const r = btn.getBoundingClientRect();
    btn.style.setProperty('--x', `${e.clientX - r.left}px`);
    btn.style.setProperty('--y', `${e.clientY - r.top}px`);
  });
});
/* ===== 2025 code-card: add caret + light animation (already styled) ===== */
// If you want a typewriter effect inside the code card, uncomment below:
// (Respects reduced motion)
(function(){
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const el = document.getElementById('codeBlock');
  if (!el || reduce) return;
  const full = el.textContent;
  el.textContent = '';
  let i = 0;
  function type() {
    if (i < full.length) {
      el.textContent += full.charAt(i++);
      setTimeout(type, 16); // fast type
    }
  }
  setTimeout(type, 400);
})();

/* ===== Transcript secure download (front-end gating) =====
   NOTE: Front-end passcodes are obfuscation only. The PDF is public if someone
   guesses the URL. For real protection, use a serverless function or private cloud link.
*/
const TRANSCRIPT_FILE = 'cv/transcript.pdf'; // put your file here
// Replace this hash with SHA-256 of your passcode (lowercase hex string)
const PASS_HASH = 'REPLACE_WITH_SHA256_HEX';

async function sha256Hex(str){
  const data = new TextEncoder().encode(str);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(digest)].map(b=>b.toString(16).padStart(2,'0')).join('');
}

// Helper to compute a hash for your passcode (open console and run):
// sha256Hex('YourPasscode').then(console.log)

(function(){
  const openBtn = document.getElementById('download-transcript');
  const modal = document.getElementById('passcode-modal');
  const input = document.getElementById('passcode-input');
  const error = document.getElementById('passcode-error');
  const confirmBtn = document.getElementById('confirm-passcode');
  const cancelBtn = document.getElementById('cancel-passcode');
  let lastFocus = null;

  if (!openBtn || !modal) return;

  function openModal(){
    lastFocus = document.activeElement;
    modal.classList.add('open');
    document.body.classList.add('modal-open');
    modal.setAttribute('aria-hidden','false');
    setTimeout(()=>input.focus(), 60);
  }
  function closeModal(){
    modal.classList.remove('open');
    document.body.classList.remove('modal-open');
    modal.setAttribute('aria-hidden','true');
    input.value = '';
    error.hidden = true;
    if (lastFocus) lastFocus.focus();
  }

  openBtn.addEventListener('click', openModal);
  cancelBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e)=>{ if(e.target === modal) closeModal(); });
  document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape' && modal.classList.contains('open')) closeModal(); });

  async function tryDownload(){
    const pass = input.value.trim();
    const hex = await sha256Hex(pass);
    if (hex === PASS_HASH) {
      // trigger download
      const a = document.createElement('a');
      a.href = TRANSCRIPT_FILE;
      a.download = '';
      document.body.appendChild(a);
      a.click();
      a.remove();
      closeModal();
    } else {
      error.hidden = false;
      input.select();
    }
  }

  confirmBtn.addEventListener('click', tryDownload);
  input.addEventListener('keydown', (e)=>{ if(e.key === 'Enter') tryDownload(); });
})();


// Console easter egg
console.log('%c👋 Hey there!', 'font-size: 24px; font-weight: bold; color: #6366f1;');
console.log('%cThanks for checking out my portfolio!', 'font-size: 16px; color: #06b6d4;');
console.log('%cReach me at Direodirile95@gmail.com', 'font-size: 14px; color: #8b5cf6;');
