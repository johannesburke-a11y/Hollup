/**
 * sync-meeting-notes.js — PersonalOS Meeting Notes Automation
 *
 * Finds meetings that have ended today (or in the past N hours),
 * searches Google Drive for associated Meet notes,
 * and saves them to automations/meeting-notes/<date>-<slug>.md
 *
 * Idempotent — tracks processed events in processed-events.json.
 *
 * Usage:
 *   node sync-meeting-notes.js             # sync today's ended meetings
 *   node sync-meeting-notes.js --hours 48  # look back 48 hours
 *   node sync-meeting-notes.js --dry-run   # print what would be saved, don't write
 */

import { google } from "googleapis";
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ─── Config ──────────────────────────────────────────────

const VAULT_ROOT = path.resolve(__dirname, "..", "..");
const OUTPUT_DIR = path.join(VAULT_ROOT, "automations", "meeting-notes");
const PROCESSED_FILE = path.join(__dirname, "processed-events.json");
const TOKEN_PATH = path.join(__dirname, "token.json");
const CREDENTIALS_PATH = path.join(__dirname, "credentials.json");

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

// ─── State: processed events ─────────────────────────────

function loadProcessed() {
  if (!fs.existsSync(PROCESSED_FILE)) return {};
  try { return JSON.parse(fs.readFileSync(PROCESSED_FILE, "utf-8")); }
  catch { return {}; }
}

function saveProcessed(state) {
  fs.writeFileSync(PROCESSED_FILE, JSON.stringify(state, null, 2));
}

// ─── Helpers ─────────────────────────────────────────────

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 60);
}

function formatDate(d) {
  return d.toISOString().split("T")[0];
}

function extractText(docContent) {
  return (docContent || [])
    .flatMap((el) => el.paragraph?.elements || [])
    .map((el) => el.textRun?.content || "")
    .join("")
    .trim();
}

function formatDuration(startStr, endStr) {
  const start = new Date(startStr);
  const end = new Date(endStr);
  const min = Math.round((end - start) / 60000);
  const startTime = start.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  const endTime = end.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  return `${startTime}–${endTime} (${min} min)`;
}

function buildMarkdown({ event, notes, driveFile }) {
  const date = formatDate(new Date(event.start?.dateTime || event.start?.date));
  const title = event.summary || "Untitled Meeting";
  const attendees = (event.attendees || [])
    .map((a) => a.displayName ? `${a.displayName} <${a.email}>` : a.email)
    .join(", ");
  const duration = event.start?.dateTime
    ? formatDuration(event.start.dateTime, event.end.dateTime)
    : "all day";
  const meetLink = event.hangoutLink || "";
  const description = event.description?.trim() || "";

  const notesSection = notes
    ? `## Meet Notes\n\n${notes}`
    : `## Meet Notes\n\n_(No notes found in Google Drive for this meeting)_`;

  return `---
type: automation-output
source: google-calendar/sync-meeting-notes
captured: ${new Date().toISOString().split("T")[0]}
event_id: ${event.id}
drive_doc: ${driveFile?.id || "none"}
---

# Meeting Notes: ${title}

> Auto-captured by PersonalOS sync-meeting-notes automation.
> Promote to \`interactions/\` if this meeting needs follow-up tracking.

## Meta

| Field | Value |
|---|---|
| Date | ${date} |
| Duration | ${duration} |
| Attendees | ${attendees || "—"} |
| Google Meet | ${meetLink || "—"} |
| Drive Doc | ${driveFile ? `[${driveFile.name}](https://docs.google.com/document/d/${driveFile.id})` : "—"} |

${description ? `## Calendar Description\n\n${description}\n\n` : ""}${notesSection}

## Follow-up

> _Review and add any action items to \`ops/todo.md\`._

- [ ] _(add action items here)_

---
*Auto-generated: ${new Date().toISOString()}*
`;
}

// ─── Main ─────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const hoursBack = parseInt(args[args.indexOf("--hours") + 1] || "24") || 24;
  const dryRun = args.includes("--dry-run");

  if (dryRun) console.log("🔍  Dry run — no files will be written\n");

  // Ensure output dir exists
  if (!dryRun) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const auth = getAuthClient();
  const calendar = google.calendar({ version: "v3", auth });
  const drive = google.drive({ version: "v3", auth });
  const docs = google.docs({ version: "v1", auth });

  const processed = loadProcessed();
  const now = new Date();
  const since = new Date(now.getTime() - hoursBack * 3600 * 1000);

  // Fetch events in the window
  const res = await calendar.events.list({
    calendarId: "primary",
    timeMin: since.toISOString(),
    timeMax: now.toISOString(),
    singleEvents: true,
    orderBy: "startTime",
  });

  const events = (res.data.items || []).filter((e) => {
    // Must have a Meet link (real video meeting)
    if (!e.hangoutLink) return false;
    // Must have ended
    const end = e.end?.dateTime ? new Date(e.end.dateTime) : null;
    if (!end || end > now) return false;
    return true;
  });

  if (events.length === 0) {
    console.log(`📭  No ended Meet meetings found in the past ${hoursBack}h.`);
    return;
  }

  console.log(`📅  Found ${events.length} ended meeting(s) to process:\n`);

  let saved = 0;
  let skipped = 0;

  for (const event of events) {
    const title = event.summary || "Untitled Meeting";
    const date = formatDate(new Date(event.start?.dateTime || event.start?.date));
    const slug = slugify(title);
    const outputFile = path.join(OUTPUT_DIR, `${date}-${slug}.md`);

    // Skip if already processed
    if (processed[event.id]) {
      console.log(`  ⏭️   Already processed: ${title}`);
      skipped++;
      continue;
    }

    // Skip if output file already exists
    if (fs.existsSync(outputFile)) {
      console.log(`  ⏭️   File already exists: ${path.basename(outputFile)}`);
      processed[event.id] = { processedAt: new Date().toISOString(), file: outputFile };
      skipped++;
      continue;
    }

    console.log(`  🔍  Processing: ${title} (${date})`);

    // Search Drive for notes
    let driveFile = null;
    let notes = null;

    try {
      const safeName = title.replace(/'/g, "\\'").slice(0, 80);
      const searchRes = await drive.files.list({
        q: `name contains '${safeName}' and mimeType='application/vnd.google-apps.document' and trashed=false`,
        fields: "files(id, name, createdTime, modifiedTime)",
        orderBy: "modifiedTime desc",
        pageSize: 3,
      });

      const files = searchRes.data.files || [];

      // Pick the most recently modified doc created around the meeting time
      const eventStart = new Date(event.start?.dateTime || event.start?.date);
      const eventEnd = new Date(event.end?.dateTime || event.end?.date);
      const window = 24 * 3600 * 1000; // 24h window around meeting

      const candidates = files.filter((f) => {
        const created = new Date(f.createdTime);
        return Math.abs(created - eventStart) < window;
      });

      driveFile = candidates[0] || files[0] || null;

      if (driveFile) {
        const docRes = await docs.documents.get({ documentId: driveFile.id });
        notes = extractText(docRes.data.body?.content);
        if (!notes) notes = null;
        console.log(`      📄  Notes found: ${driveFile.name}`);
      } else {
        console.log(`      📭  No Meet notes found in Drive`);
      }
    } catch (err) {
      console.log(`      ⚠️   Drive search failed: ${err.message}`);
    }

    const markdown = buildMarkdown({ event, notes, driveFile });

    if (dryRun) {
      console.log(`      → Would write: ${path.relative(VAULT_ROOT, outputFile)}`);
    } else {
      fs.writeFileSync(outputFile, markdown, "utf-8");
      processed[event.id] = {
        processedAt: new Date().toISOString(),
        file: path.relative(VAULT_ROOT, outputFile),
        hasNotes: !!notes,
      };
      console.log(`      ✅  Saved: ${path.relative(VAULT_ROOT, outputFile)}`);
      saved++;
    }
  }

  if (!dryRun) saveProcessed(processed);

  console.log(`\n✅  Done — ${saved} saved, ${skipped} skipped.\n`);
}

main().catch((err) => {
  console.error("❌  Error:", err.message);
  process.exit(1);
});
