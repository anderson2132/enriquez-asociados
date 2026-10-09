document.getElementById('year').textContent = new Date().getFullYear();

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');

navToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
  const icon = navToggle.querySelector('i');
  icon.classList.toggle('fa-bars');
  icon.classList.toggle('fa-xmark');
});

const navLinks = Array.from(mainNav.querySelectorAll('a'));

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.querySelector('i').classList.add('fa-bars');
    navToggle.querySelector('i').classList.remove('fa-xmark');
  });
});

// Header scrolled state
const header = document.getElementById('header');
const updateHeader = () => header.classList.toggle('scrolled', window.scrollY > 10);
window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

// Scrollspy
const sections = navLinks
  .map(link => document.getElementById(link.dataset.nav))
  .filter(Boolean);

if ('IntersectionObserver' in window && sections.length) {
  const spy = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      navLinks.forEach(link => {
        link.classList.toggle('active-link', link.dataset.nav === id);
        if (link.dataset.nav === id) {
          link.setAttribute('aria-current', 'true');
        } else {
          link.removeAttribute('aria-current');
        }
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

  sections.forEach(section => spy.observe(section));
}

// Scroll reveal animations
const revealEls = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window && !prefersReducedMotion) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach(el => revealObserver.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('in-view'));
}

// Scroll-to-top button
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
  scrollTopBtn.classList.toggle('visible', window.scrollY > 500);
}, { passive: true });

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
});

// Practice area select -> pre-select in contact form (if navigated from a practice card)
const areaSelect = document.getElementById('area');

// Contact form validation (demo only — no backend yet)
const contactForm = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const fields = [
  {
    input: document.getElementById('name'),
    group: document.getElementById('name').closest('.form-group'),
    validate: (value) => value.trim().length > 1
  },
  {
    input: document.getElementById('email'),
    group: document.getElementById('email').closest('.form-group'),
    validate: (value) => emailPattern.test(value.trim())
  },
  {
    input: document.getElementById('message'),
    group: document.getElementById('message').closest('.form-group'),
    validate: (value) => value.trim().length > 9
  }
];

fields.forEach(field => {
  field.input.addEventListener('input', () => {
    if (field.group.classList.contains('invalid') && field.validate(field.input.value)) {
      field.group.classList.remove('invalid');
    }
  });
});

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  let firstInvalid = null;

  fields.forEach(field => {
    const isValid = field.validate(field.input.value);
    field.group.classList.toggle('invalid', !isValid);
    if (!isValid && !firstInvalid) firstInvalid = field.input;
  });

  if (firstInvalid) {
    firstInvalid.focus();
    formNote.textContent = 'Revisa los campos marcados en rojo.';
    formNote.style.color = 'var(--danger)';
    return;
  }

  formNote.style.color = 'var(--accent)';
  formNote.textContent = '¡Gracias! Tu consulta fue registrada (demo local, aún sin envío real).';
  contactForm.reset();
});
