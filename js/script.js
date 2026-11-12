const menuToggle = document.querySelector('.menu-toggle');
const primaryNav = document.querySelector('.primary-nav');

document.querySelectorAll('.cover-image img, .image-frame img').forEach((image) => {
  const showFallback = () => {
    const fallback = image.dataset.fallback;
    if (fallback && image.src !== fallback) {
      image.src = fallback;
      return;
    }
    image.closest('.image-frame')?.classList.add('is-placeholder');
  };
  image.addEventListener('error', showFallback);
  if (image.complete && !image.naturalWidth) showFallback();
});

menuToggle.addEventListener('click', () => {
  const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isExpanded));
  menuToggle.setAttribute('aria-label', isExpanded ? 'Open navigation' : 'Close navigation');
  primaryNav.classList.toggle('is-open', !isExpanded);
});

primaryNav.addEventListener('click', (event) => {
  if (event.target.closest('a')) {
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation');
    primaryNav.classList.remove('is-open');
  }
});

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const projectImageDialog = document.querySelector('.project-image-dialog');
const projectImageGallery = document.querySelector('.project-image-gallery');

document.querySelectorAll('.project-case-gallery').forEach((gallery) => {
  gallery.addEventListener('click', (event) => {
    const clickedImage = event.target.closest('img');
    if (!clickedImage || !clickedImage.naturalWidth) return;

    const images = [...gallery.querySelectorAll('img')].filter((image) => image.naturalWidth);
    const clickedIndex = images.indexOf(clickedImage);
    projectImageGallery.replaceChildren(...images.map((image) => {
      const preview = new Image();
      preview.src = image.currentSrc;
      preview.alt = image.alt;
      return preview;
    }));
    projectImageDialog.showModal();
    requestAnimationFrame(() => {
      projectImageGallery.focus({ preventScroll: true });
      const firstImage = projectImageGallery.firstElementChild;
      const activeImage = projectImageGallery.children[clickedIndex];
      projectImageGallery.scrollLeft = activeImage.offsetLeft - firstImage.offsetLeft;
    });
  });
});

document.querySelectorAll('.project-case-gallery img').forEach((image) => {
  image.tabIndex = 0;
  image.setAttribute('role', 'button');
  image.setAttribute('aria-haspopup', 'dialog');
  image.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      image.click();
    }
  });
});

document.querySelector('.project-image-close').addEventListener('click', () => projectImageDialog.close());

document.querySelector('.print-button').addEventListener('click', () => window.print());

document.querySelector('#enquiry-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const subject = encodeURIComponent(`Free site assessment request: ${formData.get('service')}`);
  const body = encodeURIComponent([
    `Name: ${formData.get('name')}`,
    `Email: ${formData.get('email')}`,
    `Telephone: ${formData.get('phone') || 'Not provided'}`,
    `Service: ${formData.get('service')}`,
    `Details: ${formData.get('message') || 'Not provided'}`
  ].join('\n'));
  document.querySelector('#form-note').textContent = 'Your email app is opening with the request details. Review and send to complete your enquiry.';
  window.location.href = `mailto:brshieldsolutions@gmail.com?subject=${subject}&body=${body}`;
});

document.querySelector('#year').textContent = new Date().getFullYear();