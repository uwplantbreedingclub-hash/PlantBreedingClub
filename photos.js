/*
  ============================================================
  PLANT BREEDING CLUB — PHOTO GALLERY LIST
  ============================================================

  HOW TO ADD A PHOTO:
  1. Upload your image to the "photos/" folder in GitHub
  2. Copy one of the entries below and add it to the array
  3. Fill in the filename and a short caption
  4. Save and commit — the gallery updates automatically!

  Example entry:
  {
    src: "photos/spring-kickoff-2026.jpg",
    caption: "Spring Kickoff Meeting, April 2026"
  },

  TIPS:
  - Keep image files under 2MB for fast loading
  - JPG works great for photos; PNG for screenshots
  - Captions are optional — just leave caption: "" if you don't want one
  ============================================================
*/

const PHOTOS = [

  // ---- Add your photos below this line ----
  // { src: "photos/your-photo.jpg", caption: "Your caption here" },

  // ---- Example (delete when you add real photos) ----
  // { src: "photos/spring-meetup.jpg", caption: "Spring Meetup 2026" },
  // { src: "photos/seed-lab-tour.jpg", caption: "Seed Lab Tour, May 2026" },
  // { src: "photos/farm-visit.jpg",    caption: "Farm Visit, Fall 2025" },

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
