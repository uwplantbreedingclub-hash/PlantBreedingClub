/*
  ============================================================
  PLANT BREEDING CLUB — PHOTO GALLERY (from Google Drive)
  ============================================================
  Replaces the old hand-edited photos.js array. Photos are now
  pulled live from the "Photos" subfolder inside the "Publicly
  Viewable" Google Drive folder (see site-config.js for the API
  key setup and folder ID) — INCLUDING any subfolders inside it
  (e.g. Photos/Cucumber Sexing/, Photos/Eagle Heights 2026/), up
  to 4 levels deep. Organize by event, by semester, however you
  like; every image anywhere under "Photos" shows up.

  HOW TO ADD A PHOTO NOW:
  1. Drop the image file into "Photos" (or one of its subfolders)
     in Google Drive — OR, if the photo already lives somewhere
     else in Drive, right-click it > Organize > Add shortcut >
     choose the destination folder. A shortcut works exactly like
     the real file here, with no duplicate copy.
     IMPORTANT if you use a shortcut: the ORIGINAL file (or its
     folder) still needs to be shared as "Anyone with the link:
     Viewer" — putting a shortcut in a public folder doesn't
     change the sharing on the file it points to.
  2. That's it — the gallery updates automatically on next page
     load. No commit, no editing this file.

  CAPTIONS: if a Drive file has a "Description" set (right-click
  the file in Drive > File information > Details, or the info
  panel), that's used as the caption. Otherwise, if the photo is
  inside a subfolder, the subfolder's name is used as the caption
  (e.g. a photo in Photos/Cucumber Sexing/ is captioned "Cucumber
  Sexing"). A photo sitting directly in "Photos" with no subfolder
  and no description falls back to a prettified filename. For a
  shortcut, the description checked is the shortcut's own, not the
  original file's — set it on the shortcut if you want a custom
  caption instead of the folder name.

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
    const files = await driveListNamedSubfolderRecursive(PHOTOS_SUBFOLDER_NAME);
    photos = files
      .filter(f => driveResolvedMimeType(f).startsWith("image/"))
      .sort((a, b) => new Date(b.modifiedTime) - new Date(a.modifiedTime));
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

    const caption = (photo.description && photo.description.trim()) || photo.folderName || prettifyFilename(photo.name);

    const img = document.createElement("img");
    img.src = driveThumbnailUrl(driveResolvedId(photo), 1000);
    img.alt = caption;
    img.loading = "lazy";

    item.appendChild(img);

    if (caption) {
      const cap = document.createElement("div");
      cap.className = "photo-caption";
      cap.textContent = caption;
      item.appendChild(cap);
    }

    grid.appendChild(item);
  });
});
