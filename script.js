/* ═══════════════════════════════════════════════
   COLUMBINE MEDIA ANALYSIS — scripts.js
   ═══════════════════════════════════════════════ */

/* ────────────────────────────────────────────────
   NAV: Highlight active section on scroll
   ──────────────────────────────────────────────── */
function initNavHighlight() {
  const sections = document.querySelectorAll('[id]');
  const navLinks = document.querySelectorAll('nav a[href^="#"]');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => {
            link.classList.toggle(
              'active',
              link.getAttribute('href') === '#' + entry.target.id
            );
          });
        }
      });
    },
    { rootMargin: '-30% 0px -60% 0px' }
  );

  sections.forEach((s) => observer.observe(s));
}

/* ────────────────────────────────────────────────
   PHOTO SLOTS: Click to upload a local image
   Each .photo-slot has a hidden <input type="file">
   When a file is picked, show it inside the slot.
   ──────────────────────────────────────────────── */
function initPhotoSlots() {
  document.querySelectorAll('.photo-slot').forEach((slot) => {
    const input = slot.querySelector('input[type="file"]');
    const img   = slot.querySelector('img');
    if (!input || !img) return;

    input.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (ev) => {
        img.src = ev.target.result;
        img.classList.add('loaded');
        // Hide the placeholder icon & label once an image is loaded
        slot.querySelectorAll('.photo-slot-icon, .photo-slot-label')
            .forEach((el) => (el.style.display = 'none'));
      };
      reader.readAsDataURL(file);
    });
  });

  // Same logic for gallery slots
  document.querySelectorAll('.gallery-slot').forEach((slot) => {
    const input = slot.querySelector('input[type="file"]');
    const img   = slot.querySelector('img');
    if (!input || !img) return;

    input.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (ev) => {
        img.src = ev.target.result;
        img.classList.add('loaded');
        slot.querySelectorAll('.gallery-slot-icon, .gallery-slot-label')
            .forEach((el) => (el.style.display = 'none'));
      };
      reader.readAsDataURL(file);
    });
  });
}

/* ────────────────────────────────────────────────
   VIDEO SLOTS: Paste a YouTube URL to embed it
   Converts a standard YouTube watch URL or
   youtu.be short URL into an embed iframe.
   ──────────────────────────────────────────────── */
function getYouTubeEmbedURL(raw) {
  try {
    const url = new URL(raw.trim());

    // Full URL: youtube.com/watch?v=ID
    if (url.hostname.includes('youtube.com')) {
      const id = url.searchParams.get('v');
      if (id) return `https://www.youtube.com/embed/${id}?rel=0`;
    }

    // Short URL: youtu.be/ID
    if (url.hostname === 'youtu.be') {
      const id = url.pathname.slice(1);
      if (id) return `https://www.youtube.com/embed/${id}?rel=0`;
    }

    // Already an embed URL
    if (raw.includes('/embed/')) return raw.trim();
  } catch (_) {
    // Not a valid URL — try plain ID as fallback
  }

  // Maybe it's just a raw 11-char video ID
  if (/^[A-Za-z0-9_-]{11}$/.test(raw.trim())) {
    return `https://www.youtube.com/embed/${raw.trim()}?rel=0`;
  }

  return null;
}

function initVideoSlots() {
  document.querySelectorAll('.video-slot').forEach((slot) => {
    const form   = slot.querySelector('.video-url-form');
    const input  = form  && form.querySelector('input');
    const button = form  && form.querySelector('button');
    const iframe = slot.querySelector('iframe');
    if (!form || !input || !button || !iframe) return;

    function embedVideo() {
      const embedURL = getYouTubeEmbedURL(input.value);
      if (!embedURL) {
        input.style.borderColor = 'var(--red)';
        input.placeholder = 'Invalid URL — try again';
        return;
      }
      iframe.src = embedURL;
      iframe.classList.add('loaded');
      // Hide placeholder UI
      slot.querySelectorAll(
        '.video-slot-icon, .video-slot-label, .video-url-form'
      ).forEach((el) => (el.style.display = 'none'));
    }

    button.addEventListener('click', embedVideo);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') embedVideo();
    });
    input.addEventListener('focus', () => {
      input.style.borderColor = '';
    });
  });
}

/* ────────────────────────────────────────────────
   METER BARS: Animate on scroll into view
   ──────────────────────────────────────────────── */
function initMeterBars() {
  const fills = document.querySelectorAll('.meter-fill');
  if (!fills.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = 'running';
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  fills.forEach((fill) => {
    fill.style.animationPlayState = 'paused';
    observer.observe(fill);
  });
}

/* ────────────────────────────────────────────────
   BOOT
   ──────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initNavHighlight();
  initPhotoSlots();
  initVideoSlots();
  initMeterBars();
});