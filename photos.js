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
    caption: "PBC Student, Andream with a high anthocyanin sweet corn ear at the Sweet Corn Skill Share, August 2025" // UPDATE: describe what this photo is
  },

  // ---- November 2025 ----
  {
    src: "photos/20251116_115135.jpg",
    caption: "PBC Students "put the plot to bed", November 2025" // UPDATE: describe what this photo is
  },
  {
    src: "photos/20251116_123613.jpg",
    caption: "The 2026 Growing plot, Eagle Heights Garden" // UPDATE: describe what this photo is
  },

  // ---- December 2025 ----
  {
    src: "photos/20251201_163435.jpg",
    caption: "PBC Students look over beet phenotypes at out Beet Selection Skill Share, December 2025" // UPDATE: describe what this photo is
  },
  {
    src: "photos/20251216_132047.jpg",
    caption: "PBC members clean our newly allocated lab space" // UPDATE: describe what this photo is
  },
  {
    src: "photos/signal-2026-04-16-224502.jpeg",
    caption: "Living Trellis Project Plots, Hayward WI 2025" // UPDATE: describe what this photo is
  },
  {
    src: "photos/signal-2026-04-16-224502_002.jpeg",
    caption: "Carrot roots entertwined, photo taken in carrot research plots, El Centro CA" // UPDATE: describe what this photo is
  },
  {
    src: "photos/signal-2026-04-16-224502_003.jpeg",
    caption: "Mature vs Immature pinto beans" // UPDATE: describe what this photo is
  },
  {
    src: "photos/signal-2026-04-16-224502_004.jpeg",
    caption: "The 2026 Executive team in the PBC Lab space" // UPDATE: describe what this photo is
  },
   {
    src: "photos/signal-2026-04-16-224502_006.jpeg",
    caption: "PBC Students make oat pollinations at out Oat and Barley Skill Share" // UPDATE: describe what this photo is
  },
   {
    src: "photos/signal-2026-04-16-224502_007.jpeg",
    caption: "PBC Students make oat pollinations at out Oat and Barley Skill Share" // UPDATE: describe what this photo is
  },
   {
    src: "photos/signal-2026-04-16-224502_008.jpeg",
    caption: "PBC Students learning about oat and barley breeding with the Cereal Grains Breeding group" // UPDATE: describe what this photo is
  },
   {
    src: "photos/signal-2026-04-16-224502_009.jpeg",
    caption: "Carrot breeding cycle depiction from our Carrot Skill Share" // UPDATE: describe what this photo is
  },
   {
    src: "photos/signal-2026-04-16-224502_010.jpeg",
    caption: "Carrot Umbel phenotype from our Carrot Skill Share" // UPDATE: describe what this photo is
  },
   {
    src: "photos/signal-2026-04-16-224502_011.jpeg",
    caption: "PBC Student, Heather, look over beet phenotypes at out Beet Selection Skill Share with beet breeder Dr. Irwin Goldman" // UPDATE: describe what this photo is
  },
   {
    src: "photos/signal-2026-04-16-224502_012.jpeg",
    caption: "PBC Students "putting the plot to bed" in November 2025" // UPDATE: describe what this photo is
  },
   {
    src: "photos/signal-2026-04-16-224502_014.jpeg",
    caption: "Collection of beets from our Beet Selection Skill Share" // UPDATE: describe what this photo is
  },
   {
    src: "photos/signal-2026-04-16-224502_016.jpeg",
    caption: "PBPG Students Anson and Heather work on cleaning our new lab space" // UPDATE: describe what this photo is
  },
   {
    src: "photos/signal-2026-04-16-224502_017.jpeg",
    caption: "PAS Students learning in our April 2026 Coding Cafe session" // UPDATE: describe what this photo is
  },
   {
    src: "photos/signal-2026-04-16-224502_018.jpeg",
    caption: "Breeding cucumber lines from our April 2026 Cucumber Skill Share" // UPDATE: describe what this photo is
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
