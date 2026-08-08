/* ============================================================
   ANDREWS TX PICKLEBALL — SITE LOGIC
   Reads assets/js/data.js (TOURNAMENTS) and renders it into
   whichever page is currently open. You should not need to
   touch this file — edit data.js instead.

   Clicking a tournament card (on Home or the Tournaments page)
   or a result row (on the Results page) opens a pop-up window
   on top of the page. See the "MODAL — generic pop-up" section
   below if you ever need to tweak how the pop-up itself works.
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  initNavToggle();
  initHeroPhotoCarousel();
  initContactFab();

  const page = document.body.dataset.page;
  const all = (typeof TOURNAMENTS !== "undefined") ? TOURNAMENTS : [];

  const upcoming = all
    .filter(t => t.status === "upcoming" || t.status === "closed")
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const completed = all
    .filter(t => t.status === "completed")
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  if (page === "home") {
    renderHomeScoreboard(upcoming[0]);
    renderCardGrid(document.getElementById("upcoming-preview"), upcoming.slice(0, 3));
    renderResultsPreview(document.getElementById("results-preview"), completed.slice(0, 3));
    toggleEmptyState("upcoming-preview", "upcoming-empty", upcoming.length);
    toggleEmptyState("results-preview", "results-empty", completed.length);
  }

  if (page === "tournaments") {
    // upcoming/closed first (soonest first), then completed tournaments
    // afterward (most recent first) so people can browse past events too.
    const tournamentsPageList = upcoming.concat(completed);
    renderCardGrid(document.getElementById("tournaments-list"), tournamentsPageList);
    toggleEmptyState("tournaments-list", "tournaments-empty", tournamentsPageList.length);
    maybeAutoOpenFromHash(tournamentsPageList, "tournament");
  }

  if (page === "results") {
    renderResultsList(document.getElementById("results-list"), completed);
    toggleEmptyState("results-list", "results-empty", completed.length);
    maybeAutoOpenFromHash(completed, "result");
  }
});

/* ---------------- home: hero photo carousel ---------------- */
// Cross-fades through HERO_PHOTOS (defined in data.js) one at a time.
// Only runs on pages that have the #hero-photo-mount element (the Home page).
function initHeroPhotoCarousel() {
  const mount = document.getElementById("hero-photo-mount");
  if (!mount) return;

  const photos = (typeof HERO_PHOTOS !== "undefined" && HERO_PHOTOS.length) ? HERO_PHOTOS : [];
  if (!photos.length) { mount.style.display = "none"; return; }

  mount.innerHTML = photos.map((src, i) => `
    <div class="hero-photo-slide${i === 0 ? " active" : ""}">
      <img src="${escapeHtml(src)}" alt="" loading="${i === 0 ? "eager" : "lazy"}">
    </div>
  `).join("");

  if (photos.length < 2) return;

  const slides = mount.querySelectorAll(".hero-photo-slide");
  let i = 0;
  setInterval(() => {
    slides[i].classList.remove("active");
    i = (i + 1) % slides.length;
    slides[i].classList.add("active");
  }, 4000);
}

/* ---------------- contact fab ---------------- */
// Shows the "Questions? Contact Us" bubble automatically for a few seconds
// when the page loads (so it works on mobile, where there's no hover), then
// fades it out. Hovering/focusing the button brings it back any time.
function initContactFab() {
  const fab = document.querySelector(".contact-fab");
  if (!fab) return;

  fab.classList.add("intro");
  setTimeout(() => fab.classList.remove("intro"), 4000);
}

/* ---------------- nav ---------------- */
function initNavToggle() {
  const btn = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (!btn || !links) return;
  btn.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    btn.setAttribute("aria-expanded", open ? "true" : "false");
  });
}

function toggleEmptyState(listId, emptyId, count) {
  const list = document.getElementById(listId);
  const empty = document.getElementById(emptyId);
  if (!list || !empty) return;
  list.style.display = count ? "" : "none";
  empty.style.display = count ? "none" : "";
}

/* ---------------- helpers ---------------- */
function daysUntil(dateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr + "T00:00:00");
  return Math.round((target - today) / 86400000);
}

// Works out how to describe a tournament's field size, using teamsRegistered
// (if set in data.js) to show how many teams have signed up and how many
// spots are left. Falls back to just the cap if teamsRegistered isn't set.
function spotsInfo(t) {
  if (!t.teamsLimit) return { tracked: false, text: "Open field" };

  const reg = (typeof t.teamsRegistered === "number") ? t.teamsRegistered : null;
  if (reg === null) return { tracked: false, limit: t.teamsLimit, text: `${t.teamsLimit} teams` };

  const limit = t.teamsLimit;
  const left = Math.max(limit - reg, 0);
  const pct = Math.max(0, Math.min(100, Math.round((reg / limit) * 100)));
  const full = left <= 0;
  const low = !full && left <= Math.max(3, Math.round(limit * 0.15));
  const tail = full ? "Full" : `${left} spot${left === 1 ? "" : "s"} left`;

  return { tracked: true, reg, limit, left, pct, full, low, text: `${reg}/${limit} teams · ${tail}` };
}

// Renders the visual "spots left" progress bar. `opts.size` can be "sm"
// (tournament cards), "lg" (the details pop-up), or omitted (default —
// used on the homepage scoreboard). Returns "" for untracked tournaments
// (teamsRegistered not set), so callers can just drop it in unconditionally.
function spotsBarHtml(info, opts) {
  opts = opts || {};
  if (!info.tracked) return "";

  const stateClass = info.full ? " full" : info.low ? " low" : "";
  const sizeClass = opts.size ? ` ${opts.size}` : "";
  const darkClass = opts.onDark ? " on-dark" : "";
  const leftLabel = info.full ? "Full" : `${info.left} spot${info.left === 1 ? "" : "s"} left`;

  return `
    <div class="spots-bar-wrap${sizeClass}${darkClass}${stateClass}">
      <div class="spots-bar-label">
        <span class="spots-bar-tally">${escapeHtml(String(info.reg))} of ${escapeHtml(String(info.limit))} teams signed up</span>
        <span class="spots-bar-left">${escapeHtml(leftLabel)}</span>
      </div>
      <div class="spots-bar-track"><div class="spots-bar-fill" style="width:${info.pct}%"></div></div>
    </div>
  `;
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str).replace(/[&<>"']/g, s => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[s]));
}

// Turns a free-text field (blank line = new paragraph) into safe <p> tags,
// so you can type naturally in data.js and it'll look right in the pop-up.
function paragraphsHtml(text) {
  if (!text) return "";
  return text
    .split(/\n\s*\n/)
    .map(p => p.trim())
    .filter(Boolean)
    .map(p => `<p>${escapeHtml(p).replace(/\n/g, "<br>")}</p>`)
    .join("");
}

// If the page loaded with a #tournament-id in the URL (e.g. a link from the
// home page), automatically pop open that tournament/result's window.
function maybeAutoOpenFromHash(list, kind) {
  if (!location.hash) return;
  const id = location.hash.slice(1);
  const t = list.find(x => x.id === id);
  if (!t) return;
  setTimeout(() => {
    if (kind === "tournament") openTournamentModal(t);
    else openResultModal(t);
  }, 150);
}

/* ============================================================
   MODAL — generic pop-up
   A single reusable pop-up window. Call openModal(htmlString)
   to show it with a small-to-big animation; closeModal() hides
   it. Everything below (tournament details, results) just
   builds HTML and hands it to this.
   ============================================================ */
let modalEscHandler = null;

function openModal(innerHtml) {
  const existing = document.querySelector(".modal-overlay");
  if (existing) existing.remove();

  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  overlay.innerHTML = `
    <div class="modal-box" role="dialog" aria-modal="true">
      <button type="button" class="modal-close" aria-label="Close">&times;</button>
      <div class="modal-content">${innerHtml}</div>
    </div>
  `;
  document.body.appendChild(overlay);
  document.body.classList.add("modal-open");

  // double rAF so the browser paints the "small" state before animating to "big"
  requestAnimationFrame(() => requestAnimationFrame(() => overlay.classList.add("open")));

  overlay.addEventListener("click", (e) => { if (e.target === overlay) closeModal(); });
  overlay.querySelector(".modal-close").addEventListener("click", closeModal);

  modalEscHandler = (e) => { if (e.key === "Escape") closeModal(); };
  document.addEventListener("keydown", modalEscHandler);

  return overlay;
}

function closeModal() {
  const overlay = document.querySelector(".modal-overlay");
  if (!overlay) return;
  overlay.classList.remove("open");
  document.body.classList.remove("modal-open");
  if (modalEscHandler) { document.removeEventListener("keydown", modalEscHandler); modalEscHandler = null; }
  setTimeout(() => overlay.remove(), 220);
}

/* ---------------- home: scoreboard ---------------- */
function renderHomeScoreboard(next) {
  const mount = document.getElementById("scoreboard-mount");
  if (!mount) return;

  if (!next) {
    mount.innerHTML = `
      <span class="scoreboard-label">Next Up</span>
      <p class="scoreboard-empty">No tournament on the calendar yet — follow us on Instagram and we'll post the next one here first.</p>
      <div class="scoreboard-cta">
        <a class="btn btn-outline on-dark" href="tournaments.html">View All Tournaments</a>
      </div>
    `;
    return;
  }

  const days = daysUntil(next.date);
  const daysLabel = days > 1 ? `${days} days` : days === 1 ? "Tomorrow" : days === 0 ? "Today" : "Underway";
  const spots = spotsInfo(next);

  mount.innerHTML = `
    <span class="scoreboard-label">Next Up</span>
    <div class="scoreboard-name">${escapeHtml(next.name)}</div>
    <div class="scoreboard-stats">
      <div class="stat"><span class="stat-key">Countdown</span><span class="stat-value">${escapeHtml(daysLabel)}</span></div>
      <div class="stat"><span class="stat-key">Date</span><span class="stat-value">${escapeHtml(next.dateDisplay)}</span></div>
      <div class="stat"><span class="stat-key">Location</span><span class="stat-value">${escapeHtml(next.location)}</span></div>
      <div class="stat"><span class="stat-key">Format</span><span class="stat-value">${escapeHtml(next.format)}</span></div>
      <div class="stat"><span class="stat-key">Field Size</span><span class="stat-value">${escapeHtml(spots.text)}</span></div>
    </div>
    ${spotsBarHtml(spots, { onDark: true })}
    <div class="scoreboard-cta">
      ${signupButtonHtml(next, "on-dark")}
      <a class="btn btn-outline on-dark" href="tournaments.html">View All Tournaments</a>
    </div>
  `;

  // If the sign-up button is an embedded-form button (not a plain link),
  // wire it up to open the pop-up with the form already showing.
  const embedBtn = mount.querySelector(".js-card-signup-embed");
  if (embedBtn) {
    embedBtn.addEventListener("click", () => openTournamentModal(next, { showEmbed: true }));
  }
}

function signupButtonHtml(t, extraClass) {
  const cls = extraClass ? ` ${extraClass}` : "";
  if (t.status === "upcoming" && t.signupUrl) {
    return `<a class="btn btn-primary${cls}" href="${escapeHtml(t.signupUrl)}" target="_blank" rel="noopener">Sign Up Your Team</a>`;
  }
  if (t.status === "upcoming" && t.signupEmbed) {
    return `<button type="button" class="btn btn-primary${cls} js-card-signup-embed">Sign Up Your Team</button>`;
  }
  if (t.status === "completed") {
    return `<a class="btn btn-outline${cls}" href="results.html#${escapeHtml(t.id)}">View Results</a>`;
  }
  return `<span class="btn btn-disabled${cls}">Registration Closed</span>`;
}

/* ---------------- tournament cards (home preview + tournaments page) ---------------- */
function renderCardGrid(mount, list) {
  if (!mount) return;

  mount.innerHTML = list.map(t => {
    const ribbonClass = t.status === "upcoming" ? "ribbon-upcoming" : t.status === "completed" ? "ribbon-completed" : "ribbon-closed";
    const ribbonText = t.status === "upcoming" ? "Upcoming" : t.status === "completed" ? "Completed" : "Registration Closed";
    const spots = spotsInfo(t);
    const photo = t.results && t.results.champions && t.results.champions.photo;
    const ribbon = `<span class="ribbon ${ribbonClass}">${ribbonText}</span>`;
    const photoBlock = photo
      ? `<div class="card-photo"><img src="${escapeHtml(photo)}" alt="${escapeHtml(t.name)} champions" loading="lazy">${ribbon}</div>`
      : ribbon;

    return `
      <article class="card js-tournament-card" id="${escapeHtml(t.id)}" data-id="${escapeHtml(t.id)}" tabindex="0" role="button" aria-label="View details for ${escapeHtml(t.name)}">
        ${photoBlock}
        <h3>${escapeHtml(t.name)}</h3>
        <div class="card-date">${escapeHtml(t.dateDisplay)}</div>
        <div class="card-meta">
          <span>📍 ${escapeHtml(t.location)}</span>
          <span>🏓 ${escapeHtml(t.format)}</span>
          <span>👥 ${escapeHtml(spots.text)}${spots.full ? " 🔴" : ""}</span>
        </div>
        ${spotsBarHtml(spots, { size: "sm" })}
        <p>${escapeHtml(t.description || "")}</p>
        <div class="card-actions">
          ${signupButtonHtml(t)}
          ${hasSchedule(t) ? `<button type="button" class="btn btn-outline btn-small js-view-schedule">🗓️ View Schedule</button>` : ""}
          <button type="button" class="btn btn-outline btn-small js-view-details">Details</button>
        </div>
      </article>
    `;
  }).join("");

  mount.querySelectorAll(".js-tournament-card").forEach(card => {
    const t = list.find(x => x.id === card.dataset.id);
    if (!t) return;

    // Clicking anywhere on the card opens the pop-up, EXCEPT actual
    // links/buttons inside it (those handle their own behavior below).
    card.addEventListener("click", (e) => {
      if (e.target.closest("a, button")) return;
      openTournamentModal(t);
    });
    card.addEventListener("keydown", (e) => {
      if ((e.key === "Enter" || e.key === " ") && document.activeElement === card) {
        e.preventDefault();
        openTournamentModal(t);
      }
    });

    const detailsBtn = card.querySelector(".js-view-details");
    if (detailsBtn) detailsBtn.addEventListener("click", () => openTournamentModal(t));

    const scheduleBtn = card.querySelector(".js-view-schedule");
    if (scheduleBtn) scheduleBtn.addEventListener("click", () => openTournamentModal(t, { scrollToSchedule: true }));

    const embedBtn = card.querySelector(".js-card-signup-embed");
    if (embedBtn) embedBtn.addEventListener("click", () => openTournamentModal(t, { showEmbed: true }));
  });
}

// True if a tournament has at least one scheduled match to show.
function hasSchedule(t) {
  return !!(t.schedule && t.schedule.rounds && t.schedule.rounds.length);
}

// Builds the pop-up content for a single tournament: name, quick facts, a
// sign-up button right up top, a "registration closed / spots full" banner
// when applicable, and then whatever free-text you put in `details` in
// data.js (rules, what to bring, parking, anything you want).
function buildTournamentModalHtml(t) {
  const spots = spotsInfo(t);

  let statusBanner = "";
  if (t.status === "closed") {
    statusBanner = `<div class="modal-status-banner">🔒 Registration is closed${t.teamsLimit ? ` — all ${t.teamsLimit} spots are filled` : ""}. Follow us on Instagram for the next tournament.</div>`;
  } else if (t.status === "completed") {
    const champ = t.results && t.results.champions ? t.results.champions.team : null;
    statusBanner = `<div class="modal-status-banner complete">🏆 This tournament is complete.${champ ? ` Champions: ${escapeHtml(champ)}.` : ""}</div>`;
  }

  let signupRow = "";
  if (t.status === "upcoming" && t.signupUrl) {
    signupRow = `<a class="btn btn-primary" href="${escapeHtml(t.signupUrl)}" target="_blank" rel="noopener">Sign Up Your Team ↗</a>`;
  } else if (t.status === "upcoming" && t.signupEmbed) {
    signupRow = `<button type="button" class="btn btn-primary js-modal-embed-toggle">Sign Up Your Team</button>`;
  } else if (t.status === "closed") {
    signupRow = `<span class="btn btn-disabled">Registration Closed</span>`;
  } else if (t.status === "completed") {
    signupRow = `<a class="btn btn-outline" href="results.html#${escapeHtml(t.id)}">View Full Results ↗</a>`;
  }

  const embedBlock = (t.status === "upcoming" && t.signupEmbed)
    ? `<div class="embed-wrap js-modal-embed" style="display:none;"><iframe src="${escapeHtml(t.signupEmbed)}" title="Sign up form for ${escapeHtml(t.name)}" loading="lazy"></iframe></div>`
    : "";

  const description = t.description ? `<p>${escapeHtml(t.description)}</p>` : "";
  const notes = paragraphsHtml(t.details);

  return `
    <span class="eyebrow modal-eyebrow">${escapeHtml(t.dateDisplay)}</span>
    <h2 class="modal-title">${escapeHtml(t.name)}</h2>
    <div class="modal-meta">📍 ${escapeHtml(t.location)} &nbsp;·&nbsp; 🏓 ${escapeHtml(t.format)} &nbsp;·&nbsp; 👥 ${escapeHtml(spots.text)}${spots.full ? " 🔴" : ""}</div>
    ${spotsBarHtml(spots, { size: "lg" })}
    <div class="modal-signup-row">${signupRow}</div>
    ${statusBanner}
    <div class="modal-notes">${description}${notes}</div>
    ${scheduleHtml(t.schedule)}
    ${embedBlock}
  `;
}

// Renders the "First-Round Schedule" block inside a tournament's pop-up,
// built from the optional `schedule` field in data.js (see HOW-TO-UPDATE.md).
// Each match's team1/team2 can be a plain string, or an object like
// { players: "Jane D. & Sam R.", teamName: "Kitchen Crashers" } to show the
// actual players' names with their team name in parentheses. Returns "" if
// the tournament has no schedule set, so this can always be dropped into
// the modal HTML unconditionally.
function scheduleHtml(schedule) {
  if (!schedule || !schedule.rounds || !schedule.rounds.length) return "";

  const note = schedule.note ? `<p class="schedule-note">${escapeHtml(schedule.note)}</p>` : "";

  const rounds = schedule.rounds.map(r => `
    <div class="schedule-round">
      <div class="schedule-round-time">${escapeHtml(r.time)}</div>
      <table class="schedule-table">
        <tbody>
          ${r.matches.map(m => `
            <tr>
              <td>Court ${escapeHtml(String(m.court))}</td>
              <td>${scheduleEntryHtml(m.team1)}<span class="schedule-vs">vs</span>${scheduleEntryHtml(m.team2)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `).join("");

  return `
    <div class="modal-schedule" id="modal-schedule-section">
      <h3 class="modal-schedule-title">🗓️ First-Round Schedule</h3>
      ${note}
      ${rounds}
      ${byesHtml(schedule)}
    </div>
  `;
}

// Formats one side of a match. Accepts either a plain string (just shown
// as-is) or { players, teamName } to show the players' real names with
// their team name in parentheses, e.g. "Jane D. & Sam R. (Kitchen Crashers)".
function scheduleEntryHtml(entry) {
  if (!entry) return "";
  if (typeof entry === "string") return escapeHtml(entry);
  const players = escapeHtml(entry.players || "");
  const teamName = entry.teamName ? ` <span class="schedule-team-name">(${escapeHtml(entry.teamName)})</span>` : "";
  return `${players}${teamName}`;
}

// Renders the "First-Round Byes" list inside a tournament's pop-up — teams
// who skip Round 1 entirely and advance straight to Round 2 (used when the
// team count isn't a clean bracket size, see HOW-TO-UPDATE.md). Accepts the
// same string OR { players, teamName } format as match entries.
function byesHtml(schedule) {
  if (!schedule || !schedule.byes || !schedule.byes.length) return "";
  const items = schedule.byes.map(b => `<li>${scheduleEntryHtml(b)}</li>`).join("");
  return `
    <div class="modal-byes">
      <h4 class="modal-byes-title">🎟️ First-Round Byes</h4>
      <p class="schedule-note">These teams don't play Round 1 — they advance straight to Round 2. Watch Scoreholio for your Round 2 time and court.</p>
      <ul class="byes-list">${items}</ul>
    </div>
  `;
}

function openTournamentModal(t, opts) {
  opts = opts || {};
  const overlay = openModal(buildTournamentModalHtml(t));

  const toggleBtn = overlay.querySelector(".js-modal-embed-toggle");
  const embed = overlay.querySelector(".js-modal-embed");
  if (toggleBtn && embed) {
    toggleBtn.addEventListener("click", () => {
      const showing = embed.style.display !== "none";
      embed.style.display = showing ? "none" : "block";
      toggleBtn.textContent = showing ? "Sign Up Your Team" : "Hide Form ↑";
      if (!showing) embed.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
    if (opts.showEmbed) {
      embed.style.display = "block";
      toggleBtn.textContent = "Hide Form ↑";
    }
  }

  if (opts.scrollToSchedule) {
    const section = overlay.querySelector("#modal-schedule-section");
    if (section) {
      setTimeout(() => section.scrollIntoView({ behavior: "smooth", block: "start" }), 320);
    }
  }
}

/* ---------------- home: results preview ---------------- */
function renderResultsPreview(mount, list) {
  if (!mount) return;
  mount.innerHTML = list.map(t => {
    const champ = t.results && t.results.champions ? t.results.champions.team : null;
    const photo = t.results && t.results.champions && t.results.champions.photo;
    const photoBlock = photo
      ? `<div class="card-photo-sm"><img src="${escapeHtml(photo)}" alt="${escapeHtml(champ || t.name)}" loading="lazy"><span class="ribbon ribbon-completed">Complete</span></div>`
      : `<span class="ribbon ribbon-completed">Complete</span>`;
    return `
      <a class="card" style="text-decoration:none; color:inherit;" href="results.html#${escapeHtml(t.id)}">
        ${photoBlock}
        <h3>${escapeHtml(t.name)}</h3>
        <div class="card-date">${escapeHtml(t.dateDisplay)}</div>
        <p>${champ ? `Champions: <strong>${escapeHtml(champ)}</strong>` : "See how it played out."}</p>
        <div class="card-actions"><span class="btn btn-outline btn-small">View Results</span></div>
      </a>
    `;
  }).join("");
}

/* ---------------- results page: clickable rows -> pop-up ---------------- */
function renderResultsList(mount, list) {
  if (!mount) return;

  mount.innerHTML = list.map(t => {
    const champ = t.results && t.results.champions;
    const thumb = champ && champ.photo
      ? `<span class="result-thumb"><img src="${escapeHtml(champ.photo)}" alt="${escapeHtml(champ.team || t.name)}" loading="lazy"></span>`
      : "";
    return `
    <div class="result-item" id="${escapeHtml(t.id)}" data-id="${escapeHtml(t.id)}" tabindex="0" role="button" aria-label="View results for ${escapeHtml(t.name)}">
      <div class="result-trigger">
        <span class="result-trigger-left">
          ${thumb}
          <span>
            <span class="result-trigger-title">${escapeHtml(t.name)}</span>
            <span class="result-trigger-meta">${escapeHtml(t.dateDisplay)} · ${escapeHtml(t.location)}${champ ? ` · 🥇 ${escapeHtml(champ.team)}` : ""}</span>
          </span>
        </span>
        <span class="chevron">→</span>
      </div>
    </div>
  `;
  }).join("");

  mount.querySelectorAll(".result-item").forEach(item => {
    const t = list.find(x => x.id === item.dataset.id);
    if (!t) return;
    const open = () => openResultModal(t);
    item.addEventListener("click", open);
    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); }
    });
  });
}

function openResultModal(t) {
  const r = t.results || {};
  const html = `
    <span class="eyebrow modal-eyebrow">${escapeHtml(t.dateDisplay)}</span>
    <h2 class="modal-title">${escapeHtml(t.name)}</h2>
    <div class="modal-meta">📍 ${escapeHtml(t.location)}</div>
    ${renderResultDetail(r)}
  `;
  openModal(html);
}

function renderResultDetail(r) {
  const hasPodium = r.champions || r.runnerUp || r.thirdPlace;

  const podiumCard = (entry, label, medal) => {
    if (!entry) return "";
    const photo = entry.photo
      ? `<div class="podium-photo"><img src="${escapeHtml(entry.photo)}" alt="${escapeHtml(entry.team)} — ${escapeHtml(label)}" loading="lazy"></div>`
      : "";
    return `
      <div class="podium-card">
        ${photo}
        <span class="podium-place">${medal} ${escapeHtml(label)}</span>
        <div class="podium-team">${escapeHtml(entry.team)}</div>
        <div class="podium-players">${(entry.players || []).map(escapeHtml).join(" & ")}</div>
      </div>`;
  };

  const podium = hasPodium ? `
    <div class="podium">
      ${podiumCard(r.champions, "Champions", "🥇")}
      ${podiumCard(r.runnerUp, "Runner-Up", "🥈")}
      ${podiumCard(r.thirdPlace, "3rd Place", "🥉")}
    </div>
  ` : "";

  const standings = (r.standings && r.standings.length) ? `
    <table class="standings">
      <thead><tr><th>Place</th><th>Team</th><th>Players</th></tr></thead>
      <tbody>
        ${r.standings.map(s => `
          <tr>
            <td>${escapeHtml(String(s.place))}</td>
            <td>${escapeHtml(s.team)}</td>
            <td>${(s.players || []).map(escapeHtml).join(" & ")}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  ` : "";

  const links = [
    r.bracketImageUrl ? `<a href="${escapeHtml(r.bracketImageUrl)}" target="_blank" rel="noopener">View Bracket ↗</a>` : "",
    r.photosUrl ? `<a href="${escapeHtml(r.photosUrl)}" target="_blank" rel="noopener">Photo Album ↗</a>` : ""
  ].filter(Boolean).join(" &nbsp;·&nbsp; ");

  const summary = r.summary ? `<p>${escapeHtml(r.summary)}</p>` : "";

  if (!hasPodium && !standings && !summary) {
    return `<p>Results haven't been posted for this tournament yet — check back soon.</p>`;
  }

  return `${summary}${podium}${standings}${links ? `<p style="margin-top:14px;">${links}</p>` : ""}`;
}
