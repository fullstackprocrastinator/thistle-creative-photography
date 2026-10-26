(() => {
  'use strict';

  const menuToggle = document.getElementById('menu-toggle');
  const navigation = document.getElementById('site-nav');
  const closeMenu = () => {
    menuToggle?.setAttribute('aria-expanded', 'false');
    navigation?.classList.remove('is-open');
  };

  if (menuToggle && navigation) {
    menuToggle.addEventListener('click', () => {
      const isOpen = menuToggle.getAttribute('aria-expanded') !== 'true';
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      navigation.classList.toggle('is-open', isOpen);
    });
    navigation.addEventListener('click', (event) => {
      if (event.target.closest('a')) closeMenu();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
        closeMenu();
        menuToggle.focus();
      }
    });
  }

  const gallery = document.getElementById('gallery');
  const cards = gallery ? Array.from(gallery.querySelectorAll('[data-category]')) : [];
  const filterButtons = Array.from(document.querySelectorAll('[data-filter]'));
  const galleryStatus = document.getElementById('gallery-status');
  const visibleCards = () => cards.filter((card) => !card.hidden);

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      filterButtons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
      cards.forEach((card) => {
        card.hidden = filter !== 'all' && card.dataset.category !== filter;
      });
      if (galleryStatus) {
        const count = visibleCards().length;
        galleryStatus.textContent = `${count} photograph${count === 1 ? '' : 's'} shown.`;
      }
    });
  });

  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightbox-image');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxDescription = document.getElementById('lightbox-description');
  const lightboxCount = document.getElementById('lightbox-count');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrevious = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  let activeCard = null;
  let returnFocus = null;
  let previousOverflow = '';

  const displayPhoto = (card) => {
    if (!card || !lightboxImage) return;
    activeCard = card;
    const group = visibleCards();
    lightboxImage.src = card.dataset.image || card.querySelector('img')?.src || '';
    lightboxImage.alt = card.querySelector('img')?.alt || card.dataset.description || card.dataset.title || 'Photograph by Thistle Creative Photography';
    if (lightboxTitle) lightboxTitle.textContent = card.dataset.title || '';
    if (lightboxDescription) lightboxDescription.textContent = card.dataset.description || '';
    if (lightboxCount) lightboxCount.textContent = `${group.indexOf(card) + 1} / ${group.length}`;
    if (lightboxPrevious) lightboxPrevious.disabled = group.length < 2;
    if (lightboxNext) lightboxNext.disabled = group.length < 2;
  };

  const restorePage = () => {
    document.body.style.overflow = previousOverflow;
    if (returnFocus?.isConnected) returnFocus.focus();
    returnFocus = null;
    activeCard = null;
  };

  const closeLightbox = () => {
    if (!lightbox?.hasAttribute('open')) return;
    if (typeof lightbox.close === 'function') lightbox.close();
    else {
      lightbox.removeAttribute('open');
      restorePage();
    }
  };

  const advancePhoto = (offset) => {
    const group = visibleCards();
    if (!group.length) return;
    const index = group.indexOf(activeCard);
    displayPhoto(group[(index + offset + group.length) % group.length]);
  };

  if (lightbox && lightboxImage) {
    const openPhoto = (card, trigger) => {
      returnFocus = trigger;
      previousOverflow = document.body.style.overflow;
      displayPhoto(card);
      if (typeof lightbox.showModal === 'function') lightbox.showModal();
      else {
        lightbox.setAttribute('open', '');
        lightbox.setAttribute('role', 'dialog');
        lightbox.setAttribute('aria-modal', 'true');
      }
      document.body.style.overflow = 'hidden';
      lightboxClose?.focus();
    };
    cards.forEach((card) => {
      card.addEventListener('click', () => openPhoto(card, card));
    });
    document.querySelectorAll('[data-open-category]').forEach((trigger) => {
      trigger.addEventListener('click', () => {
        const card = cards.find((item) => item.dataset.category === trigger.dataset.openCategory);
        if (!card) return;
        if (card.hidden) filterButtons.find((button) => button.dataset.filter === 'all')?.click();
        if (!card.hidden) openPhoto(card, trigger);
      });
    });
    lightboxClose?.addEventListener('click', closeLightbox);
    lightboxPrevious?.addEventListener('click', () => advancePhoto(-1));
    lightboxNext?.addEventListener('click', () => advancePhoto(1));
    lightbox.addEventListener('close', restorePage);
    lightbox.addEventListener('click', (event) => {
      if (event.target !== lightbox) return;
      const bounds = lightbox.getBoundingClientRect();
      const outside = event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom;
      if (outside) closeLightbox();
    });
    lightbox.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        advancePhoto(event.key === 'ArrowLeft' ? -1 : 1);
      }
      if (event.key === 'Escape' && typeof lightbox.close !== 'function') {
        event.preventDefault();
        closeLightbox();
      }
      if (event.key === 'Tab') {
        const focusable = Array.from(lightbox.querySelectorAll('button:not([disabled]), a[href], [tabindex="0"]'));
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    });
  }

  const enquiryForm = document.getElementById('enquiry-form');
  const enquiryStatus = document.getElementById('enquiry-status');
  enquiryForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!enquiryForm.reportValidity()) return;
    const fields = new FormData(enquiryForm);
    const value = (name) => String(fields.get(name) || '').trim();
    const session = value('session') || 'Photography';
    const subject = `${session} enquiry — ${value('name')}`;
    const body = `Hello Rachel,\r\n\r\n${value('message')}\r\n\r\nSession: ${session}\r\nName: ${value('name')}\r\nEmail: ${value('email')}`;
    if (enquiryStatus) {
      enquiryStatus.textContent = 'Your email app will open with your enquiry. Please press Send there to contact Rachel. If it does not open, email thistlecreativephotography@gmail.com directly.';
    }
    window.location.href = `mailto:thistlecreativephotography@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });

  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  // Motion is progressive enhancement: content is visible until setup succeeds.
  const revealElements = Array.from(document.querySelectorAll('[data-reveal]'));
  let revealObserver;
  const revealAll = () => {
    document.documentElement.classList.remove('motion-ready');
    revealElements.forEach((element) => element.classList.add('is-visible'));
    revealObserver?.disconnect();
  };
  try {
    const reducedMotion = typeof window.matchMedia === 'function'
      ? window.matchMedia('(prefers-reduced-motion: reduce)')
      : null;
    if (revealElements.length && 'IntersectionObserver' in window && reducedMotion && !reducedMotion.matches) {
      revealObserver = new IntersectionObserver((entries) => {
        try {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              revealObserver.unobserve(entry.target);
            }
          });
        } catch {
          revealAll();
        }
      }, { threshold: 0.08, rootMargin: '0px 0px -16px 0px' });
      revealElements.forEach((element) => {
        const bounds = element.getBoundingClientRect();
        if (bounds.top < window.innerHeight && bounds.bottom > 0) element.classList.add('is-visible');
        else revealObserver.observe(element);
      });
      document.documentElement.classList.add('motion-ready');
      const onMotionChange = (event) => { if (event.matches) revealAll(); };
      if (reducedMotion.addEventListener) reducedMotion.addEventListener('change', onMotionChange);
      else if (reducedMotion.addListener) reducedMotion.addListener(onMotionChange);
      window.addEventListener('error', revealAll, { once: true });
    }
  } catch {
    revealAll();
  }
})();
