/*
  ============================================================
  PLANT BREEDING CLUB — GOOGLE DRIVE HELPERS
  ============================================================
  Shared helpers for pulling files out of the "Publicly Viewable"
  Google Drive folder. Used by gallery-drive.js (photos) and
  events-calendar.js (posters + meeting notes). Config lives in
  site-config.js, which must be loaded before this file.
  ============================================================
*/

async function driveFindSubfolderId(parentId, name) {
  const q = `'${parentId}' in parents and name = '${name}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`;
  const params = new URLSearchParams({ key: GOOGLE_API_KEY, q, fields: "files(id,name)" });
  const res = await fetch(`https://www.googleapis.com/drive/v3/files?${params}`);
  if (!res.ok) throw new Error(`Drive API returned ${res.status} while looking for folder "${name}"`);
  const data = await res.json();
  return data.files && data.files[0] ? data.files[0].id : null;
}

async function driveListFiles(folderId) {
  if (!folderId) return [];
  const files = [];
  let pageToken = "";
  do {
    const params = new URLSearchParams({
      key: GOOGLE_API_KEY,
      q: `'${folderId}' in parents and trashed = false`,
      fields: "nextPageToken, files(id,name,description,mimeType,modifiedTime,shortcutDetails)",
      orderBy: "modifiedTime desc",
      pageSize: "100",
    });
    if (pageToken) params.set("pageToken", pageToken);
    const res = await fetch(`https://www.googleapis.com/drive/v3/files?${params}`);
    if (!res.ok) throw new Error(`Drive API returned ${res.status} while listing folder ${folderId}`);
    const data = await res.json();
    files.push(...(data.files || []));
    pageToken = data.nextPageToken || "";
  } while (pageToken && files.length < 500);
  return files;
}

// Convenience: resolve a named subfolder under PUBLIC_DRIVE_FOLDER_ID and
// return its files in one call. Returns [] (not an error) if the subfolder
// doesn't exist yet, so a missing "Posters" folder just means no posters
// show up rather than breaking the page.
async function driveListNamedSubfolder(subfolderName) {
  const folderId = await driveFindSubfolderId(PUBLIC_DRIVE_FOLDER_ID, subfolderName);
  if (!folderId) {
    console.warn(`Drive folder "${subfolderName}" not found under the Publicly Viewable folder.`);
    return [];
  }
  return driveListFiles(folderId);
}

function driveThumbnailUrl(fileId, width) {
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w${width || 1000}`;
}

function driveViewLink(fileId) {
  return `https://drive.google.com/file/d/${fileId}/view`;
}

// A file in one of the public subfolders can be a *shortcut* to something
// that actually lives elsewhere in Drive (Organize > Add shortcut) — that's
// Drive's equivalent of a symlink, and it's the recommended way to publish
// an existing photo without duplicating it. A shortcut's own mimeType is
// always "application/vnd.google-apps.shortcut"; the file it points to is
// described by shortcutDetails. These two helpers "see through" a shortcut
// to the real thing so the rest of the code doesn't need a special case.
//
// IMPORTANT: putting a shortcut in the public folder does NOT make the
// target file public — Drive checks sharing on the target itself. A
// shortcut to a private file will show up in the listing but render as a
// broken/access-denied image for visitors until that original file (or its
// containing folder) is also shared as "Anyone with the link: Viewer".
function driveIsShortcut(file) {
  return file.mimeType === "application/vnd.google-apps.shortcut";
}

function driveResolvedMimeType(file) {
  return driveIsShortcut(file) ? (file.shortcutDetails && file.shortcutDetails.targetMimeType) || "" : file.mimeType;
}

function driveResolvedId(file) {
  return driveIsShortcut(file) ? (file.shortcutDetails && file.shortcutDetails.targetId) || file.id : file.id;
}

// Matches files whose name STARTS WITH a "YYYY-MM-DD" date, indexed by that
// date string, so a page can ask "was anything uploaded for this event's
// date?" Naming convention: put the event's date at the very start of the
// filename, e.g. "2026-09-16 Biweekly Meeting poster.png" or
// "2026-08-05 Ethical Dilemmas notes.pdf".
// If two events land on the same date, whichever matching file Drive
// returns first wins — keep same-day filenames distinct if that matters.
function driveIndexByDatePrefix(files) {
  const index = {};
  const DATE_PREFIX = /^(\d{4}-\d{2}-\d{2})/;
  files.forEach(file => {
    const match = file.name.match(DATE_PREFIX);
    if (!match) return;
    const date = match[1];
    if (!index[date]) index[date] = file;
  });
  return index;
}
