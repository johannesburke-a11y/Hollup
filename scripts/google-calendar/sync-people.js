/**
 * sync-people.js — HOLLOP People Auto-Sync
 *
 * Scans recent + upcoming calendar events, extracts attendees,
 * looks them up in the Google Workspace directory,
 * and creates person stub files in people/<firstname-lastname>.md
 *
 * Idempotent — skips people who already have a file.
 * Tracks processed emails in processed-people.json.
 *
 * Usage:
 *   node sync-people.js                # scan ±7 days
 *   node sync-people.js --days 30      # scan ±30 days
 *   node sync-people.js --dry-run      # print what would be created
 */

import { google } from "googleapis";
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ─── Config ──────────────────────────────────────────────

const VAULT_ROOT = path.resolve(__dirname, "..", "..");
const PEOPLE_DIR = path.join(VAULT_ROOT, "people");
const PROCESSED_FILE = path.join(__dirname, "processed-people.json");
const TOKEN_PATH = path.join(__dirname, "token.json");
const CREDENTIALS_PATH = path.join(__dirname, "credentials.json");

const SELF_EMAIL = "johannes.burke@ionos.com";

// Patterns that identify group/resource mailboxes rather than people
const GROUP_PATTERNS = [
  /^ml_/i,          // mailing lists
  /^team_/i,
  /^pod_/i,
  /^hr-/i,
  /^all-/i,
  /^noreply/i,
  /^no-reply/i,
  /\.group@/i,
  /@resource\./i,
  /calendar\.google\.com$/,
];

// ─── Auth ────────────────────────────────────────────────

function getAuthClient() {
  if (!fs.existsSync(TOKEN_PATH) || !fs.existsSync(CREDENTIALS_PATH)) {
    console.error("❌  Not authenticated. Run: node scripts/google-calendar/auth.js");
    process.exit(1);
  }
  const creds = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, "utf-8"));
  const { client_secret, client_id, redirect_uris } = creds.installed;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
  oAuth2Client.setCredentials(JSON.parse(fs.readFileSync(TOKEN_PATH, "utf-8")));
  return oAuth2Client;
}

// ─── State ───────────────────────────────────────────────

function loadProcessed() {
  if (!fs.existsSync(PROCESSED_FILE)) return {};
  try { return JSON.parse(fs.readFileSync(PROCESSED_FILE, "utf-8")); }
  catch { return {}; }
}

function saveProcessed(state) {
  fs.writeFileSync(PROCESSED_FILE, JSON.stringify(state, null, 2));
}

// ─── Helpers ─────────────────────────────────────────────

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function isGroupEmail(email) {
  return GROUP_PATTERNS.some((p) => p.test(email));
}

function looksLikePerson(displayName) {
  if (!displayName) return false;
  return displayName.includes(" ") && !/^\s*$/.test(displayName);
}

// Derive a human name from email: timm.flagmeyer@ionos.com → "Timm Flagmeyer"
function nameFromEmail(email) {
  const local = email.split("@")[0];
  // Reject patterns that look like systems/groups
  if (/[_+]/.test(local)) return null;
  const parts = local.split(/[.-]/);
  if (parts.length < 2) return null;
  // Capitalize each part
  return parts
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}

function formatDate(d) {
  return d.toISOString().split("T")[0];
}

function buildPersonFile({ name, email, title, department, phone, location, meetingContexts, today }) {
  const slug = slugify(name);
  const org = email.split("@")[1]?.replace(/\..+$/, "") || "unknown";
  const orgCapitalized = org.charAt(0).toUpperCase() + org.slice(1);

  const contextLines = meetingContexts.length > 0
    ? meetingContexts.slice(0, 5).map((m) => `- Met in: _${m}_`).join("\n")
    : "- _(auto-created from calendar — add context manually)_";

  return `---
type: person
status: active
tags: [area/work, topic/ionos]
aliases: [${name}]
---

# ${name}

> ⚠️ Auto-created by HOLLOP sync-people — review and expand manually.

## Current Truth

| Field | Value |
|---|---|
| Email | ${email} |
| Phone | ${phone || "_TODO_"} |
| Role | ${title || "_TODO_"} |
| Department | ${department || "_TODO_"} |
| Organisation | ${orgCapitalized} |
| Location | ${location || "_TODO_"} |

## Context

_(auto-filled from Google Workspace directory — expand with working style, key traits, communication preferences)_

${contextLines}

## Open Loops

_(empty — add follow-up items here)_

## Timeline

_(append-only)_

### ${today} — Auto-created from calendar

Auto-created by HOLLOP sync-people from Google Calendar attendee data.
${title ? `Role at time of creation: ${title}.` : ""}
`;
}

// ─── Directory Lookup ─────────────────────────────────────

async function lookupDirectory(peopleApi, email) {
  try {
    const res = await peopleApi.people.searchDirectoryPeople({
      query: email,
      readMask: "names,emailAddresses,organizations,phoneNumbers,locations",
      sources: ["DIRECTORY_SOURCE_TYPE_DOMAIN_PROFILE"],
    });

    const person = res.data.people?.[0];
    if (!person) return {};

    const canonicalName =
      person.names?.[0]?.displayName ||
      [person.names?.[0]?.givenName, person.names?.[0]?.familyName].filter(Boolean).join(" ") ||
      null;

    return {
      canonicalName,
      title: person.organizations?.[0]?.title || null,
      department: person.organizations?.[0]?.department || null,
      phone: person.phoneNumbers?.[0]?.value || null,
      location: person.locations?.[0]?.value || null,
    };
  } catch {
    return {};
  }
}

// ─── Main ─────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const days = parseInt(args[args.indexOf("--days") + 1] || "7") || 7;
  const dryRun = args.includes("--dry-run");

  if (dryRun) console.log("🔍  Dry run — no files will be written\n");

  const auth = getAuthClient();
  const calendar = google.calendar({ version: "v3", auth });
  const peopleApi = google.people({ version: "v1", auth });

  const processed = loadProcessed();
  const today = formatDate(new Date());
  const now = new Date();
  const from = new Date(now.getTime() - days * 86_400_000);
  const to = new Date(now.getTime() + days * 86_400_000);

  // Fetch events in window
  const res = await calendar.events.list({
    calendarId: "primary",
    timeMin: from.toISOString(),
    timeMax: to.toISOString(),
    singleEvents: true,
    orderBy: "startTime",
    maxResults: 500,
  });

  const events = res.data.items || [];

  // Collect unique attendees with meeting context
  // Only track people from small meetings (≤8 attendees) OR recurring contacts (2+ meetings)
  const attendeeMap = new Map(); // email → { displayName, meetings[] }
  const SMALL_MEETING_THRESHOLD = 4; // true 1:1 / very small meetings only

  for (const event of events) {
    const title = event.summary || "Untitled";
    const attendeeCount = (event.attendees || []).length;
    const isSmallMeeting = attendeeCount <= SMALL_MEETING_THRESHOLD;

    for (const attendee of event.attendees || []) {
      const email = attendee.email?.toLowerCase();
      const name = attendee.displayName;

      if (!email || email === SELF_EMAIL) continue;
      if (isGroupEmail(email)) continue;

      const resolvedName = looksLikePerson(name) ? name : nameFromEmail(email);
      if (!resolvedName) continue;

      if (!attendeeMap.has(email)) {
        attendeeMap.set(email, { displayName: resolvedName, meetings: [], smallMeetingCount: 0 });
      } else if (!looksLikePerson(attendeeMap.get(email).displayName) && looksLikePerson(resolvedName)) {
        attendeeMap.get(email).displayName = resolvedName;
      }

      const entry = attendeeMap.get(email);
      entry.meetings.push(title);
      if (isSmallMeeting) entry.smallMeetingCount++;
    }
  }

  // Filter: small meeting participant OR appears in 4+ distinct meetings
  const uniqueMeetings = (meetings) => new Set(meetings).size;
  for (const [email, data] of attendeeMap) {
    const keep = data.smallMeetingCount > 0 || uniqueMeetings(data.meetings) >= 4;
    if (!keep) attendeeMap.delete(email);
  }

  console.log(`📅  Scanned ${events.length} events over ±${days} days`);
  console.log(`👥  Found ${attendeeMap.size} unique people\n`);

  let created = 0;
  let skipped = 0;

  for (const [email, { displayName, meetings }] of attendeeMap) {
    const name = displayName;
    const slug = slugify(name);
    const filePath = path.join(PEOPLE_DIR, `${slug}.md`);

    // Skip if file already exists
    if (fs.existsSync(filePath)) {
      skipped++;
      continue;
    }

    // Skip if already processed
    if (processed[email]) {
      skipped++;
      continue;
    }

    // Look up in Workspace directory
    process.stdout.write(`  🔍  ${name} (${email})... `);
    const dirInfo = await lookupDirectory(peopleApi, email);

    // Use canonical name from directory if available
    const finalName = dirInfo.canonicalName || name;
    const finalSlug = slugify(finalName);
    const finalPath = path.join(PEOPLE_DIR, `${finalSlug}.md`);

    // Re-check with canonical name
    if (fs.existsSync(finalPath)) {
      processed[email] = { createdAt: today, file: `people/${finalSlug}.md`, name: finalName, skipped: true };
      console.log(`⏭️   already exists`);
      skipped++;
      continue;
    }

    const content = buildPersonFile({
      name: finalName,
      email,
      title: dirInfo.title,
      department: dirInfo.department,
      phone: dirInfo.phone,
      location: dirInfo.location,
      meetingContexts: [...new Set(meetings)],
      today,
    });

    if (dryRun) {
      console.log(`→ Would create: people/${finalSlug}.md${dirInfo.title ? ` [${dirInfo.title}]` : ""}`);
    } else {
      fs.writeFileSync(finalPath, content, "utf-8");
      processed[email] = {
        createdAt: today,
        file: `people/${finalSlug}.md`,
        name: finalName,
        title: dirInfo.title || null,
      };
      console.log(`✅  people/${finalSlug}.md${dirInfo.title ? ` — ${dirInfo.title}` : ""}`);
      created++;
    }
  }

  if (!dryRun) saveProcessed(processed);

  console.log(`\n✅  Done — ${created} created, ${skipped} skipped.\n`);
}

main().catch((err) => {
  console.error("❌  Error:", err.message);
  process.exit(1);
});
