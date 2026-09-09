/*
  ============================================================
  PLANT BREEDING CLUB — PHOTO GALLERY (from Google Drive)
  ============================================================
  Replaces the old hand-edited photos.js array. Photos are now
  pulled live from the "Photos" subfolder inside the "Publicly
  Viewable" Google Drive folder (see site-config.js for the API
  key setup and folder ID).

  HOW TO ADD A PHOTO NOW:
  1. Drop the image file into the "Photos" subfolder of
     "Publicly Viewable" in Google Drive — OR, if the photo
     already lives somewhere else in Drive, right-click it >
     Organize > Add shortcut > choose "Photos". A shortcut works
     exactly like the real file here, with no duplicate copy.
     IMPORTANT if you use a shortcut: the ORIGINAL file (or its
     folder) still needs to be shared as "Anyone with the link:
     Viewer" — putting a shortcut in a public folder doesn't
     change the sharing on the file it points to.
  2. That's it — the gallery updates automatically on next page
     load. No commit, no editing this file.

  CAPTIONS: if a Drive file has a "Description" set (right-click
  the file in Drive > File information > Details, or the info
  panel), that's used as the caption. Otherwise the filename is
  used, with underscores/dashes turned into spaces. For a
  shortcut, the description/name checked is the shortcut's own,
  not the original file's — set it on the shortcut if you want a
  custom caption.

  Newest-uploaded (or newest-shortcutted) photos are shown first.
  ============================================================
*/

function prettifyFilename(name) {
  return name.replace(/\.[^/.]+$/, "").replace(/[_-]+/g, " ").trim();
}

document.addEventListener("DOMContentLoaded", async () => {
  const grid = document.getElementById("photo-grid");
  const empty = document.getElementById("photo-empty");
  if (!grid) return;

  if (GOOGLE_API_KEY === "YOUR_API_KEY_HERE") {
    empty.style.display = "block";
    empty.querySelector("p").textContent =
      "Live photo syncing isn't set up yet — see the setup steps at the top of site-config.js.";
    return;
  }

  let photos = [];
  try {
    const files = await driveListNamedSubfolder(PHOTOS_SUBFOLDER_NAME);
    photos = files.filter(f => driveResolvedMimeType(f).startsWith("image/"));
  } catch (err) {
    console.error("Failed to load photos from Drive:", err);
    empty.style.display = "block";
    empty.querySelector("p").textContent = "Couldn't load photos right now — try refreshing in a bit.";
    return;
  }

  if (photos.length === 0) {
    empty.style.display = "block";
    return;
  }

  photos.forEach(photo => {
    const item = document.createElement("div");
    item.className = "photo-item";

    const img = document.createElement("img");
    img.src = driveThumbnailUrl(driveResolvedId(photo), 1000);
    img.alt = (photo.description && photo.description.trim()) || prettifyFilename(photo.name);
    img.loading = "lazy";

    item.appendChild(img);

    const caption = (photo.description && photo.description.trim()) || prettifyFilename(photo.name);
    if (caption) {
      const cap = document.createElement("div");
      cap.className = "photo-caption";
      cap.textContent = caption;
      item.appendChild(cap);
    }

    grid.appendChild(item);
  });
});
