/*
  ============================================================
  PLANT BREEDING CLUB — SITE CONFIG
  ============================================================
  One place to update the Google API key and the IDs/names it
  points at. Loaded before drive-utils.js, events-calendar.js,
  and gallery-drive.js on any page that uses them.

  HOW TO SET UP THE GOOGLE API KEY (one-time):
  1. Go to https://console.cloud.google.com/ and create (or pick)
     a project.
  2. Under "APIs & Services" > "Library", enable BOTH:
       - "Google Calendar API"
       - "Google Drive API"
  3. Under "APIs & Services" > "Credentials", click
     "Create Credentials" > "API key" — one key covers both APIs.
  4. Restrict the key (click into it after creating):
       - Application restrictions: "Websites" / HTTP referrers,
         add: plantbreedingclub.com/* and www.plantbreedingclub.com/*
       - API restrictions: "Restrict key" > select BOTH
         "Google Calendar API" and "Google Drive API"
  5. Paste the key into GOOGLE_API_KEY below and commit.
  6. Double check sharing:
       - Calendar (uwplantbreedingclub@gmail.com) is public
       - The "Publicly Viewable" Drive folder — and everything
         inside it — is shared as "Anyone with the link: Viewer"
     Both already should be, but a file added later can default
     back to private, so it's worth a periodic check.
  ============================================================
*/

const GOOGLE_API_KEY = "AIzaSyAwIrsyPiRb2vzNx2qsC7mM7xmbn6jg6xQ"; 

const CALENDAR_ID = "uwplantbreedingclub@gmail.com";
const DISPLAY_TZ = "America/Chicago";

// "Publicly Viewable" Drive folder — contains the Photos / Posters / Notes /
// Documents subfolders. Only put things here you're fine with anyone on the
// internet seeing; the subfolder names below are matched by name,
// case-sensitive.
const PUBLIC_DRIVE_FOLDER_ID = "1to2hP-6UbrEAxKyTKkk2pVpu56-C02eO";
const PHOTOS_SUBFOLDER_NAME = "Photos";
const POSTERS_SUBFOLDER_NAME = "Posters";
const NOTES_SUBFOLDER_NAME = "Meeting Notes";
const DOCUMENTS_SUBFOLDER_NAME = "Documents"; // constitution, bylaws, etc. — listed on resources.html

