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

const form = document.querySelector<HTMLFormElement>('#contactForm');
const status = document.querySelector<HTMLElement>('#formStatus');

form?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;

  const values = new FormData(form);
  const name = String(values.get('name') ?? '').trim();
  const email = String(values.get('email') ?? '').trim();
  const organization = String(values.get('organization') ?? '').trim();
  const subject = String(values.get('subject') ?? '').trim();
  const message = String(values.get('message') ?? '').trim();

  const body = [
    'Bonjour Impact Afriq,',
    '',
    'Nom : ' + name,
    'E-mail : ' + email,
    'Organisation : ' + (organization || 'Non précisée'),
    'Sujet : ' + subject,
    '',
    'Message :',
    message,
  ].join('\n');

  if (WHATSAPP_NUMBER) {
    const url = whatsappUrl(body);
    window.open(url, '_blank', 'noopener,noreferrer');
    if (status) status.textContent = 'Votre message est prêt dans WhatsApp. Vérifiez-le puis appuyez sur Envoyer.';
  } else if (CONTACT_EMAIL) {
    const url = 'mailto:' + CONTACT_EMAIL + '?subject=' + encodeURIComponent('Contact Impact Afriq — ' + subject) + '&body=' + encodeURIComponent(body);
    window.location.href = url;
    if (status) status.textContent = 'Votre application e-mail va s’ouvrir pour vous permettre d’envoyer le message.';
  } else {
    const url = whatsappUrl(body);
    window.open(url, '_blank', 'noopener,noreferrer');
    if (status) status.textContent = 'WhatsApp s’ouvre avec votre message. Pour diriger les demandes directement vers Impact Afriq, le numéro WhatsApp professionnel doit encore être configuré.';
  }
});

const currentYear = document.querySelector('#year');
if (currentYear) currentYear.textContent = String(new Date().getFullYear());
