/*
  ============================================================
  PLANT BREEDING CLUB — CLUB DOCUMENTS + RECENT MEETING NOTES
  (from Google Drive)
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

  ------------------------------------------------------------
  Also lists the 3 most recent files in the "Meeting Notes"
  subfolder (see NOTES_SUBFOLDER_NAME in site-config.js — same
  folder events-calendar.js uses for the "📝 Meeting Notes →"
  links on past events). "Most recent" is ALWAYS by the date found
  in the filename itself (see driveExtractDateFromFilename in
  drive-utils.js — handles both a "2026-09-16 ..." prefix and a
  "Copy of Meeting 23 09-08-2026" style US date anywhere in the
  name) — deliberately not by Drive's "last modified" time, since
  that changes just from opening/viewing a file in some cases,
  which would silently reshuffle this list. A file with no
  parseable date in its name sorts to the bottom (it still shows
  up if there's room among the top 3, just never displaces a
  properly-dated file).
  ============================================================
*/

const RECENT_NOTES_MAX = 3;

function fileDateForSort(file) {
  const date = driveExtractDateFromFilename(file.name);
  return date ? new Date(date + "T12:00:00Z").getTime() : -Infinity;
}

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

// Shared renderer for both the Documents list and the Recent Meeting Notes
// list — same "resource-item" markup, different data source and blurb.
function renderResourceItems(list, files, blurbFn) {
  list.innerHTML = "";
  files.forEach(file => {
    const mimeType = driveResolvedMimeType(file);
    const a = document.createElement("a");
    a.href = driveOpenLink(file);
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
    a.querySelector("h4").textContent = prettifyDriveFilename(file.name);
    a.querySelector("p").textContent = blurbFn(file);
    list.appendChild(a);
  });
}

async function loadDocuments() {
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

  if (docs.length === 0) {
    list.innerHTML = "";
    empty.style.display = "block";
    return;
  }

  renderResourceItems(list, docs, doc => (doc.description && doc.description.trim()) || formatUpdatedDate(doc.modifiedTime));
}

async function loadRecentNotes() {
  const list = document.getElementById("notes-resource-list");
  const empty = document.getElementById("notes-empty");
  if (!list) return;

  if (GOOGLE_API_KEY === "YOUR_API_KEY_HERE") {
    list.innerHTML = "";
    empty.style.display = "block";
    empty.querySelector("p").textContent =
      "Live syncing isn't set up yet — see the setup steps at the top of site-config.js.";
    return;
  }

  let notes = [];
  try {
    const files = await driveListNamedSubfolder(NOTES_SUBFOLDER_NAME);
    notes = files
      .filter(f => driveResolvedMimeType(f) !== "application/vnd.google-apps.folder")
      .sort((a, b) => fileDateForSort(b) - fileDateForSort(a) || a.name.localeCompare(b.name))
      .slice(0, RECENT_NOTES_MAX);
  } catch (err) {
    console.error("Failed to load meeting notes from Drive:", err);
    list.innerHTML = "";
    empty.style.display = "block";
    empty.querySelector("p").textContent = "Couldn't load meeting notes right now — try refreshing in a bit.";
    return;
  }

  if (notes.length === 0) {
    list.innerHTML = "";
    empty.style.display = "block";
    return;
  }

  // Blurb here is always "the meeting date" (parsed from the filename —
  // see driveExtractDateFromFilename) rather than a Drive description,
  // since that's what's useful to know at a glance for a notes list.
  renderResourceItems(list, notes, file => {
    const date = driveExtractDateFromFilename(file.name);
    if (!date) return formatUpdatedDate(file.modifiedTime);
    return new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" })
      .format(new Date(date + "T12:00:00Z"));
  });
}

document.addEventListener("DOMContentLoaded", () => {
  loadDocuments();
  loadRecentNotes();
});
