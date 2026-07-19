(() => {
  const nav = document.querySelector('#nav');
  const menuToggle = document.querySelector('.menu-toggle');
  const toTop = document.querySelector('.to-top');

  menuToggle?.addEventListener('click', () => {
    const open = nav?.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(Boolean(open)));
    menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menuToggle.innerHTML = `<i class="bi bi-${open ? 'x' : 'list'}"></i>`;
  });
  document.querySelectorAll('#nav a').forEach(link => link.addEventListener('click', () => nav?.classList.remove('open')));

  const updateScrollState = () => {
    document.body.classList.toggle('scrolled', window.scrollY > 24);
    toTop?.classList.toggle('show', window.scrollY > 600);
  };
  window.addEventListener('scroll', updateScrollState, { passive: true });
  updateScrollState();
  toTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  document.querySelectorAll('[data-year]').forEach(element => { element.textContent = new Date().getFullYear(); });

  const revealItems = document.querySelectorAll('.detail-reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.1 });
    revealItems.forEach(item => revealObserver.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('visible'));
  }

  const lightbox = document.querySelector('#innerbalance-lightbox');
  if (!lightbox) return;
  lightbox.setAttribute('role', 'dialog');
  lightbox.setAttribute('aria-modal', 'true');
  const image = lightbox.querySelector('[data-lightbox-image]');
  const fallback = lightbox.querySelector('[data-lightbox-fallback]');
  const title = lightbox.querySelector('#ib-lightbox-title');
  const caption = lightbox.querySelector('[data-lightbox-caption]');
  let activeTrigger = null;

  const closeLightbox = () => { if (lightbox.open) lightbox.close(); };
  document.querySelectorAll('[data-lightbox-src]').forEach(trigger => {
    trigger.addEventListener('click', () => {
      activeTrigger = trigger;
      const src = trigger.dataset.lightboxSrc;
      const label = trigger.dataset.lightboxTitle || 'InnerBalance project image';
      title.textContent = label;
      caption.textContent = src;
      image.hidden = false;
      fallback.hidden = true;
      image.alt = label;
      image.removeAttribute('src');
      image.src = src;
      lightbox.showModal();
      lightbox.querySelector('[data-lightbox-close]')?.focus();
    });
  });
  image.addEventListener('error', () => {
    image.hidden = true;
    fallback.hidden = false;
  });
  lightbox.querySelector('[data-lightbox-close]')?.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', event => { if (event.target === lightbox) closeLightbox(); });
  lightbox.addEventListener('close', () => activeTrigger?.focus());
  lightbox.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeLightbox();
      return;
    }
    if (event.key !== 'Tab') return;
    const focusable = [...lightbox.querySelectorAll('button,a[href],[tabindex]:not([tabindex="-1"])')]
      .filter(element => !element.hasAttribute('disabled'));
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
})();
