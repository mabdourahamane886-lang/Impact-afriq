import './style.css';

const WHATSAPP_NUMBER = ''; // À renseigner au format international, sans + ni espaces.
const CONTACT_EMAIL = ''; // Adresse professionnelle à renseigner.

const whatsappText = (message: string) =>
  encodeURIComponent(message || 'Bonjour Impact Afriq, je souhaite en savoir plus sur vos services.');

function whatsappUrl(message: string) {
  const text = whatsappText(message);
  return WHATSAPP_NUMBER
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`
    : `https://wa.me/?text=${text}`;
}

document.querySelectorAll<HTMLAnchorElement>('[data-whatsapp]').forEach((link) => {
  link.href = whatsappUrl('Bonjour Impact Afriq, je souhaite échanger au sujet de vos services.');
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
});

const menuButton = document.querySelector<HTMLButtonElement>('#menuToggle');
const navigation = document.querySelector<HTMLElement>('#navLinks');

function closeMenu() {
  navigation?.classList.remove('open');
  menuButton?.setAttribute('aria-expanded', 'false');
  menuButton?.setAttribute('aria-label', 'Ouvrir le menu');
  if (menuButton) menuButton.innerHTML = '<span></span><span></span>';
}

menuButton?.addEventListener('click', () => {
  const isOpen = navigation?.classList.toggle('open') ?? false;
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Fermer le menu' : 'Ouvrir le menu');
  menuButton.innerHTML = isOpen ? '<span class="cross"></span>' : '<span></span><span></span>';
});

navigation?.querySelectorAll<HTMLAnchorElement>('a').forEach((link) => {
  link.addEventListener('click', closeMenu);
});

document.querySelector('#year')!.textContent = String(new Date().getFullYear());

const revealElements = document.querySelectorAll<HTMLElement>('[data-reveal]');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if ('IntersectionObserver' in window && !reduceMotion) {
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });

  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add('is-visible'));
}

async function submitFormToApi(form: HTMLFormElement, status: HTMLElement | null, subject: string) {
  if (!form.reportValidity()) return;
  const fields = Object.fromEntries(Array.from(new FormData(form).entries()).map(([key, value]) => [key, String(value).trim()]));
  if (status) status.textContent = 'Envoi en cours…';
  const submitButton = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  if (submitButton) submitButton.disabled = true;
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, fields }),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || 'Le service de contact est temporairement indisponible.');
    form.reset();
    if (status) status.textContent = 'Merci. Votre demande a été envoyée à Impact Afriq.';
  } catch (error) {
    if (status) status.textContent = error instanceof Error ? error.message : 'Envoi impossible. Réessayez plus tard.';
  } finally {
    if (submitButton) submitButton.disabled = false;
  }
}

const form = document.querySelector<HTMLFormElement>('#contactForm');
const status = document.querySelector<HTMLElement>('#formStatus');
form?.addEventListener('submit', (event) => {
  event.preventDefault();
  void submitFormToApi(form, status, 'Contact du site Impact Afriq');
});

const currentYear = document.querySelector('#year');
if (currentYear) currentYear.textContent = String(new Date().getFullYear());


// Fonctionnalités interactives des pages Événements, Partenariats, Actualités et Ressources.
function prepareMessage(formId: string, statusId: string, subject: string) {
  const form = document.querySelector<HTMLFormElement>('#' + formId);
  const status = document.querySelector<HTMLElement>('#' + statusId);
  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    void submitFormToApi(form, status, subject);
  });
}
prepareMessage('eventProposalForm', 'eventStatus', 'Proposition d’événement — Impact Afriq');
prepareMessage('partnerForm', 'partnerStatus', 'Proposition de partenariat — Impact Afriq');

document.querySelectorAll<HTMLButtonElement>('[data-filter]').forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter || 'all';
    document.querySelectorAll<HTMLButtonElement>('[data-filter]').forEach((item) => item.classList.toggle('active', item === button));
    document.querySelectorAll<HTMLElement>('[data-category]').forEach((card) => {
      card.hidden = filter !== 'all' && card.dataset.category !== filter;
    });
  });
});

const checklist = Array.from(document.querySelectorAll<HTMLInputElement>('.resource-check'));
function updateChecklist() {
  const done = checklist.filter((input) => input.checked).length;
  const label = document.querySelector<HTMLElement>('#checkProgress');
  const bar = document.querySelector<HTMLElement>('#progressBar');
  if (label) label.textContent = done + ' / ' + checklist.length + ' éléments';
  if (bar) bar.style.width = (checklist.length ? (done / checklist.length) * 100 : 0) + '%';
}
checklist.forEach((input) => input.addEventListener('change', updateChecklist));
document.querySelector('#printChecklist')?.addEventListener('click', () => window.print());
document.querySelector('#resetChecklist')?.addEventListener('click', () => {
  checklist.forEach((input) => { input.checked = false; });
  updateChecklist();
});
