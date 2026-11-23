const menu = document.querySelector('.menu');
const nav = document.querySelector('#navigation');
const mobile = window.matchMedia('(max-width: 900px)');

function setMenu(open) {
  menu.setAttribute('aria-expanded', String(open));
  nav.hidden = mobile.matches && !open;
}

function updateMenu() {
  menu.hidden = !mobile.matches;
  setMenu(false);
}

menu.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') !== 'true'));
mobile.addEventListener('change', updateMenu);
updateMenu();

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
    setMenu(false);
    menu.focus();
  }
});

const motionToggle = document.querySelector('.motion-toggle');
motionToggle.hidden = false;
motionToggle.addEventListener('click', () => {
  const paused = motionToggle.parentElement.classList.toggle('paused');
  motionToggle.setAttribute('aria-pressed', String(paused));
});

if ('IntersectionObserver' in window) {
  function reveal(element) {
    element.dataset.revealState = 'visible';
    observer.unobserve(element);
  }

  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) reveal(entry.target);
    }
  }, { rootMargin: "0px 0px 12% 0px", threshold: 0.06 });

  document.querySelectorAll('.reveal').forEach(element => {
    element.dataset.revealState = 'pending';
    element.addEventListener('focusin', () => reveal(element), { once: true });
    observer.observe(element);
  });

  function revealFragment() {
    if (!location.hash) return;
    const target = document.querySelector(':target');
    if (!target) return;
    for (const element of [target.closest('.reveal'), ...target.querySelectorAll('.reveal')]) {
      if (element) reveal(element);
    }
  }
  window.addEventListener('hashchange', revealFragment);
  revealFragment();
}

const dialog = document.querySelector('#photo-view');
if (dialog && typeof dialog.showModal === 'function') {
  const photo = dialog.querySelector('img');
  document.querySelectorAll('[data-photo]').forEach(link => {
    link.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      photo.src = link.href;
      photo.alt = link.querySelector('img').alt;
      dialog.showModal();
    });
  });
  dialog.querySelector('button').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener('close', () => photo.removeAttribute('src'));
}
