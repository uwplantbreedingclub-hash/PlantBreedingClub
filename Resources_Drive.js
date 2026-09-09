/*
  ============================================================
  PLANT BREEDING CLUB — CLUB DOCUMENTS (from Google Drive)
  ============================================================
  Lists whatever's in the "Documents" subfolder of the "Publicly
  Viewable" Google Drive folder (constitution, bylaws, budget,
  etc.) as a resource-item list at the top of resources.html.
  Subfolders inside "Documents" are included too, up to 4 levels
  deep, same as the photo gallery.

  HOW TO ADD A DOCUMENT:
  1. Drop the file (or a shortcut to one stored elsewhere — see
     drive-utils.js for how shortcuts work) into the "Documents"
     subfolder of "Publicly Viewable" in Google Drive.
  2. That's it — it shows up here automatically on next page load.

  TITLE / BLURB: the filename (prettified) is used as the title.
  If the file has a "Description" set in Drive (right-click >
  File information > Details), that's used as the blurb under the
  title; otherwise the blurb shows when the file was last updated.

  Newest-updated documents are shown first.
  ============================================================
*/

function prettifyDriveFilename(name) {
  return name.replace(/\.[^/.]+$/, "").replace(/[_-]+/g, " ").trim();
}

function documentIconFor(mimeType) {
  if (mimeType === "application/pdf") return "📕";
  if (mimeType === "application/vnd.google-apps.document") return "📄";
  if (mimeType === "application/vnd.google-apps.spreadsheet") return "📊";
  if (mimeType === "application/vnd.google-apps.presentation") return "📽️";
  return "📎";
}

function formatUpdatedDate(isoString) {
  if (!isoString) return "";
  return `Updated ${new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric", timeZone: DISPLAY_TZ }).format(new Date(isoString))}`;
}

document.addEventListener("DOMContentLoaded", async () => {
  const list = document.getElementById("documents-resource-list");
  const empty = document.getElementById("documents-empty");
  if (!list) return;

  if (GOOGLE_API_KEY === "YOUR_API_KEY_HERE") {
    list.innerHTML = "";
    empty.style.display = "block";
    empty.querySelector("p").textContent =
      "Live document syncing isn't set up yet — see the setup steps at the top of site-config.js.";
    return;
  }

  let docs = [];
  try {
    const files = await driveListNamedSubfolderRecursive(DOCUMENTS_SUBFOLDER_NAME);
    docs = files
      .filter(f => driveResolvedMimeType(f) !== "application/vnd.google-apps.folder")
      .sort((a, b) => new Date(b.modifiedTime) - new Date(a.modifiedTime));
  } catch (err) {
    console.error("Failed to load documents from Drive:", err);
    list.innerHTML = "";
    empty.style.display = "block";
    empty.querySelector("p").textContent = "Couldn't load documents right now — try refreshing in a bit.";
    return;
  }

  list.innerHTML = "";

  if (docs.length === 0) {
    empty.style.display = "block";
    return;
  }

  docs.forEach(doc => {
    const mimeType = driveResolvedMimeType(doc);
    const blurb = (doc.description && doc.description.trim()) || formatUpdatedDate(doc.modifiedTime);

    const a = document.createElement("a");
    a.href = driveOpenLink(doc);
    a.target = "_blank";
    a.rel = "noopener";
    a.className = "resource-item";
    a.innerHTML = `
      <div class="resource-icon">${documentIconFor(mimeType)}</div>
      <div class="resource-text">
        <h4></h4>
        <p></p>
      </div>
      <span class="resource-arrow">→</span>
    `;
    a.querySelector("h4").textContent = prettifyDriveFilename(doc.name);
    a.querySelector("p").textContent = blurb;
    list.appendChild(a);
  });
});