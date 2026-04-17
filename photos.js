/*
  ============================================================
  PLANT BREEDING CLUB — PHOTO GALLERY LIST
  ============================================================

  HOW TO ADD A PHOTO:
  1. Upload your image to the "photos/" folder in GitHub
  2. Copy one of the entries below and add it to the array
  3. Fill in the filename and a short caption
  4. Save and commit — the gallery updates automatically!

  TIPS:
  - Keep image files under 2MB for fast loading
  - JPG/JPEG works great for photos
  - Captions are optional — just leave caption: "" if you don't want one
  ============================================================
*/

const PHOTOS = [

  // ---- August 2025 ----
  {
    src: "photos/20250808_160615.jpg",
    caption: "August 2025" // UPDATE: describe what this photo is
  },

  // ---- November 2025 ----
  {
    src: "photos/20251116_115135.jpg",
    caption: "November 2025" // UPDATE: describe what this photo is
  },
  {
    src: "photos/20251116_123613.jpg",
    caption: "November 2025" // UPDATE: describe what this photo is
  },

  // ---- December 2025 ----
  {
    src: "photos/20251201_163435.jpg",
    caption: "December 2025" // UPDATE: describe what this photo is
  },
  {
    src: "photos/20251216_132047.jpg",
    caption: "December 2025" // UPDATE: describe what this photo is
  },

  // ---- April 2026 ----
  {
    src: "photos/signal-2026-04-16-224502.jpeg",
    caption: "April 2026" // UPDATE: describe what this photo is
  },
  {
    src: "photos/signal-2026-04-16-224502_002.jpeg",
    caption: "April 2026" // UPDATE: describe what this photo is
  },
  {
    src: "photos/signal-2026-04-16-224502_003.jpeg",
    caption: "April 2026" // UPDATE: describe what this photo is
  },
  {
    src: "photos/signal-2026-04-16-224502_004.jpeg",
    caption: "April 2026" // UPDATE: describe what this photo is
  },

];

/* ---- DO NOT EDIT BELOW THIS LINE ---- */
document.addEventListener('DOMContentLoaded', () => {
  const grid  = document.getElementById('photo-grid');
  const empty = document.getElementById('photo-empty');

  if (!grid) return;

  const realPhotos = PHOTOS.filter(p => p && p.src);

  if (realPhotos.length === 0) {
    empty.style.display = 'block';
    return;
  }

  realPhotos.forEach(photo => {
    const item = document.createElement('div');
    item.className = 'photo-item';

    const img = document.createElement('img');
    img.src = photo.src;
    img.alt = photo.caption || 'Plant Breeding Club photo';
    img.loading = 'lazy';

    item.appendChild(img);

    if (photo.caption) {
      const cap = document.createElement('div');
      cap.className = 'photo-caption';
      cap.textContent = photo.caption;
      item.appendChild(cap);
    }

    grid.appendChild(item);
  });
});
