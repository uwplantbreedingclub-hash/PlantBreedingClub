/*
  ============================================================
  PLANT BREEDING CLUB — LIVE EVENTS (Calendar + Drive)
  ============================================================

  This pulls Upcoming Events and Past Events directly from the
  club's Google Calendar, so events.html no longer needs to be
  hand-edited every time something is scheduled. Add, move, or
  rename an event in Google Calendar and it flows through here
  automatically — the day after an event's start time passes, it
  moves itself from "Upcoming Events" into "Past Events".

  It also checks the "Posters" and "Notes" subfolders (inside the
  "Publicly Viewable" Drive folder — see site-config.js) for a file
  whose name starts with an event's date, and if one exists:
    - an upcoming event gets a "View Poster →" button
    - a past event gets a "Meeting Notes →" link
  See drive-utils.js for the exact matching rule. Posters/notes files can
  also be Drive shortcuts to files stored elsewhere (see drive-utils.js for
  the sharing caveat that comes with that).

  One-time setup (API key, sharing settings) is documented at the
  top of site-config.js, which must be loaded before this file
  (along with drive-utils.js).

  HOW EVENT TYPE BADGES WORK:
  There's no "category" field in Google Calendar, so the badge
  (Meeting / Journal Club / Tour / etc.) is guessed from keywords
  in the event title. Add or edit rules in BADGE_RULES below if a
  new kind of event doesn't get tagged the way you want.

  TIMEZONE: all times are displayed in America/Chicago regardless
  of the visitor's device, since the club meets on the UW campus.
  ============================================================
*/

const PAST_LOOKBACK_DAYS = 365;   // how far back to pull past events from
const UPCOMING_EVENTS_MAX = 8;    // cards to show in "Upcoming Events"
const PAST_EVENTS_MAX = 6;        // cards to show in "Past Events"

const BADGE_RULES = [
  [/journal club/i, "Journal Club"],
  [/skill.?share/i, "Skill Share"],
  [/tour/i, "Tour"],
  [/seminar|lecture/i, "Lecture"],
  [/meeting/i, "Meeting"],
  [/workshop/i, "Workshop"],
  [/social|mixer|hour/i, "Social"],
  [/work ?day|field prep|weed(ing)?|plot day/i, "Breeding"],
];
// Note: this is a best-effort guess from the title only — Google Calendar
// has no "category" field. Titles that don't match anything above show a
// plain "Event" badge, which is safer than a wrong guess. If a specific
// event keeps landing in the wrong bucket, add a more specific rule here,
// or consider color-coding events in Google Calendar and mapping colorId
// instead of guessing from words.

/* ---- DO NOT EDIT BELOW THIS LINE ---- */

const CLOCK_EMOJI = [
  "🕛", "🕧", "🕐", "🕜", "🕑", "🕝", "🕒", "🕞",
  "🕓", "🕟", "🕔", "🕠", "🕕", "🕡", "🕖", "🕢",
  "🕗", "🕣", "🕘", "🕤", "🕙", "🕥", "🕚", "🕦",
];

function badgeFor(title) {
  const match = BADGE_RULES.find(([pattern]) => pattern.test(title));
  return match ? match[1] : "Event";
}

// Timed events carry an explicit UTC offset in item.start.dateTime, so the
// instant is unambiguous — we just need to *display* it in DISPLAY_TZ rather
// than whatever timezone the visitor's device happens to be set to.
function timedParts(dateTimeStr) {
  const date = new Date(dateTimeStr);
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: DISPLAY_TZ,
    year: "numeric", month: "short", day: "numeric",
    hour: "numeric", minute: "2-digit", hourCycle: "h23",
  });
  const parts = {};
  fmt.formatToParts(date).forEach(p => { parts[p.type] = p.value; });
  const monthLong = new Intl.DateTimeFormat("en-US", { timeZone: DISPLAY_TZ, month: "long" }).format(date);
  const isoDate = new Intl.DateTimeFormat("en-CA", { timeZone: DISPLAY_TZ }).format(date); // "YYYY-MM-DD"
  return {
    date, isoDate, year: parts.year, month: parts.month, monthLong,
    day: Number(parts.day), hour: Number(parts.hour), minute: Number(parts.minute),
  };
}

// All-day events only carry a plain "YYYY-MM-DD" with no time or offset —
// there's nothing to convert, so we read the digits directly rather than
// routing them through Date/timezone math (which can shift the calendar
// day depending on the visitor's system clock).
function allDayParts(dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const anchor = new Date(Date.UTC(y, m - 1, d, 12));
  const month = anchor.toLocaleString("en-US", { month: "short", timeZone: "UTC" });
  const monthLong = anchor.toLocaleString("en-US", { month: "long", timeZone: "UTC" });
  return { date: anchor, isoDate: dateStr, year: String(y), month, monthLong, day: d, hour: null, minute: null };
}

function isAllDay(item) {
  return !item.start.dateTime;
}

function eventParts(item) {
  return isAllDay(item) ? allDayParts(item.start.date) : timedParts(item.start.dateTime);
}

function formatTime(hour, minute) {
  const period = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${String(minute).padStart(2, "0")} ${period}`;
}

function clockEmojiFor(hour, minute) {
  const h12 = hour % 12;
  const halfPast = minute >= 30 ? 1 : 0;
  return CLOCK_EMOJI[h12 * 2 + halfPast];
}

function stripHtml(html) {
  const div = document.createElement("div");
  div.innerHTML = html || "";
  return (div.textContent || div.innerText || "").trim();
}

function truncate(text, maxLen) {
  if (text.length <= maxLen) return text;
  const cut = text.slice(0, maxLen);
  return cut.slice(0, cut.lastIndexOf(" ")) + "…";
}

function buildUpcomingCard(item, postersIndex) {
  const parts = eventParts(item);
  const badge = badgeFor(item.summary || "");
  const description = truncate(stripHtml(item.description), 180);
  const poster = postersIndex[parts.isoDate];

  const metaSpans = [];
  metaSpans.push(
    isAllDay(item)
      ? "🗓️ All day"
      : `${clockEmojiFor(parts.hour, parts.minute)} ${formatTime(parts.hour, parts.minute)} CT`
  );
  if (item.location) metaSpans.push(`📍 ${item.location}`);

  const card = document.createElement("div");
  card.className = "event-card";
  card.innerHTML = `
    <div class="event-date-box">
      <div class="event-month">${parts.month}</div>
      <div class="event-day">${parts.day}</div>
    </div>
    <div class="event-info">
      <span class="event-type-badge">${badge}</span>
      <h3></h3>
      <p></p>
      <div class="event-meta">${metaSpans.map(s => `<span>${s}</span>`).join("")}</div>
    </div>
    <div class="event-actions">
      <a href="${item.htmlLink}" target="_blank" rel="noopener" class="btn btn-green" style="white-space: nowrap;">View in Calendar →</a>
      ${poster ? `<a href="${driveOpenLink(poster)}" target="_blank" rel="noopener" class="btn btn-green" style="white-space: nowrap;">View Poster →</a>` : ""}
    </div>
  `;
  card.querySelector("h3").textContent = item.summary || "Untitled Event";
  card.querySelector("p").textContent = description;
  return card;
}

function buildPastCard(item, notesIndex) {
  const parts = eventParts(item);
  const badge = badgeFor(item.summary || "");
  const description = truncate(stripHtml(item.description), 180);
  const notes = notesIndex[parts.isoDate];

  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <span class="card-badge"></span>
    <h3></h3>
    <p></p>
    <div class="card-meta"><span></span></div>
    ${notes ? `<a href="${driveOpenLink(notes)}" target="_blank" rel="noopener" style="display:inline-block; margin-top:0.75rem; font-family:var(--font-mono); font-size:0.8rem; font-weight:600;">📝 Meeting Notes →</a>` : ""}
  `;
  card.querySelector(".card-badge").textContent = badge;
  card.querySelector("h3").textContent = item.summary || "Untitled Event";
  card.querySelector("p").textContent = description;
  card.querySelector(".card-meta span").textContent = `${parts.monthLong} ${parts.day}, ${parts.year}`;
  return card;
}

function renderEmpty(container, message) {
  const p = document.createElement("p");
  p.style.fontFamily = "var(--font-mono)";
  p.style.color = "var(--muted)";
  p.textContent = message;
  container.appendChild(p);
}

// Instant used only for sorting / upcoming-vs-past comparison — does not
// need to be timezone-exact, just internally consistent.
function sortInstant(item) {
  return item.start.dateTime ? new Date(item.start.dateTime) : new Date(item.start.date + "T12:00:00");
}

async function fetchCalendarEvents() {
  const timeMin = new Date(Date.now() - PAST_LOOKBACK_DAYS * 24 * 60 * 60 * 1000).toISOString();
  const params = new URLSearchParams({
    key: GOOGLE_API_KEY,
    singleEvents: "true",
    orderBy: "startTime",
    maxResults: "250",
    timeMin: timeMin,
  });
  const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events?${params}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Calendar API error: ${await googleApiErrorMessage(res)}`);
  const data = await res.json();
  return data.items || [];
}

async function loadEvents() {
  const upcomingContainer = document.getElementById("events-list");
  const pastContainer = document.getElementById("past-events-grid");
  if (!upcomingContainer && !pastContainer) return;

  if (GOOGLE_API_KEY === "YOUR_API_KEY_HERE") {
    const msg = "Live event syncing isn't set up yet — see the setup steps at the top of site-config.js. In the meantime, check the calendar below.";
    if (upcomingContainer) { upcomingContainer.innerHTML = ""; renderEmpty(upcomingContainer, msg); }
    if (pastContainer) { pastContainer.innerHTML = ""; renderEmpty(pastContainer, msg); }
    return;
  }

  try {
    const [items, posterFiles, noteFiles] = await Promise.all([
      fetchCalendarEvents(),
      driveListNamedSubfolder(POSTERS_SUBFOLDER_NAME).catch(err => { console.warn("Posters lookup failed:", err); return []; }),
      driveListNamedSubfolder(NOTES_SUBFOLDER_NAME).catch(err => { console.warn("Notes lookup failed:", err); return []; }),
    ]);
    const postersIndex = driveIndexByDatePrefix(posterFiles);
    const notesIndex = driveIndexByDatePrefix(noteFiles);

    const now = new Date();

    const upcoming = items
      .filter(item => sortInstant(item) >= now)
      .sort((a, b) => sortInstant(a) - sortInstant(b))
      .slice(0, UPCOMING_EVENTS_MAX);

    const past = items
      .filter(item => sortInstant(item) < now)
      .sort((a, b) => sortInstant(b) - sortInstant(a))
      .slice(0, PAST_EVENTS_MAX);

    if (upcomingContainer) {
      upcomingContainer.innerHTML = "";
      if (upcoming.length === 0) {
        renderEmpty(upcomingContainer, "Nothing on the calendar yet — check back soon!");
      } else {
        upcoming.forEach(item => upcomingContainer.appendChild(buildUpcomingCard(item, postersIndex)));
      }
    }

    if (pastContainer) {
      pastContainer.innerHTML = "";
      if (past.length === 0) {
        renderEmpty(pastContainer, "No past events yet — this section fills in automatically once the first event wraps up.");
      } else {
        past.forEach(item => pastContainer.appendChild(buildPastCard(item, notesIndex)));
      }
    }
  } catch (err) {
    console.error("Failed to load events:", err);
    const msg = "Couldn't load events right now. In the meantime, check the calendar below.";
    if (upcomingContainer) { upcomingContainer.innerHTML = ""; renderEmpty(upcomingContainer, msg); }
    if (pastContainer) { pastContainer.innerHTML = ""; renderEmpty(pastContainer, msg); }
  }
}

document.addEventListener("DOMContentLoaded", loadEvents);
