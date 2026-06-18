/**
 * calendar.js — HOLLOP Google Calendar integration
 *
 * Usage:
 *   node calendar.js <command> [options]
 *
 * Commands:
 *   today                  List today's events
 *   week                   List this week's events
 *   next <n>               List next N events (default: 10)
 *   briefing               Generate a meeting briefing for today
 *   meet-notes <eventId>   Pull Google Meet notes for an event
 *   create                 Create an event (interactive prompt)
 *   find-slot <duration>   Find free slots today/tomorrow for given duration (minutes)
 */

import { google } from "googleapis";
import * as fs from "node:fs";
import * as path from "node:path";
import * as readline from "node:readline";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TOKEN_PATH = path.join(__dirname, "token.json");
const CREDENTIALS_PATH = path.join(__dirname, "credentials.json");

// ─── Auth ────────────────────────────────────────────────

function getAuthClient() {
  if (!fs.existsSync(TOKEN_PATH)) {
    console.error("❌  Not authenticated. Run: node auth.js");
    process.exit(1);
  }
  if (!fs.existsSync(CREDENTIALS_PATH)) {
    console.error("❌  credentials.json not found.");
    process.exit(1);
  }

  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, "utf-8"));
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
  oAuth2Client.setCredentials(JSON.parse(fs.readFileSync(TOKEN_PATH, "utf-8")));
  return oAuth2Client;
}

// ─── Helpers ─────────────────────────────────────────────

function formatEvent(event) {
  const start = event.start?.dateTime || event.start?.date || "?";
  const end = event.end?.dateTime || event.end?.date || "?";
  const startTime = start.includes("T") ? new Date(start).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) : "(all day)";
  const endTime = end.includes("T") ? new Date(end).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) : "";
  const timeStr = endTime ? `${startTime}–${endTime}` : startTime;
  const attendees = (event.attendees || []).map((a) => a.displayName || a.email).join(", ");
  const meetLink = event.hangoutLink ? `\n      🎥  ${event.hangoutLink}` : "";
  const attendeeStr = attendees ? `\n      👥  ${attendees}` : "";
  return `  [${event.id?.slice(0, 8) || "?"}]  ${timeStr}  —  ${event.summary || "(no title)"}${attendeeStr}${meetLink}`;
}

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

function endOfDay(date) {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d.toISOString();
}

function startOfWeek() {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

function endOfWeek() {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? 0 : 7);
  d.setDate(diff);
  d.setHours(23, 59, 59, 999);
  return d.toISOString();
}

async function prompt(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => rl.question(question, (ans) => { rl.close(); resolve(ans.trim()); }));
}

// ─── Commands ─────────────────────────────────────────────

async function cmdToday(calendar) {
  const now = new Date();
  const res = await calendar.events.list({
    calendarId: "primary",
    timeMin: startOfDay(now),
    timeMax: endOfDay(now),
    singleEvents: true,
    orderBy: "startTime",
  });
  const events = res.data.items || [];
  if (events.length === 0) {
    console.log("📅  No events today.");
    return;
  }
  console.log(`\n📅  Today — ${now.toDateString()} (${events.length} events)\n`);
  events.forEach((e) => console.log(formatEvent(e)));
  console.log();
}

async function cmdWeek(calendar) {
  const res = await calendar.events.list({
    calendarId: "primary",
    timeMin: startOfWeek(),
    timeMax: endOfWeek(),
    singleEvents: true,
    orderBy: "startTime",
  });
  const events = res.data.items || [];
  if (events.length === 0) {
    console.log("📅  No events this week.");
    return;
  }
  console.log(`\n📅  This week (${events.length} events)\n`);
  events.forEach((e) => console.log(formatEvent(e)));
  console.log();
}

async function cmdNext(calendar, n = 10) {
  const res = await calendar.events.list({
    calendarId: "primary",
    timeMin: new Date().toISOString(),
    maxResults: parseInt(n),
    singleEvents: true,
    orderBy: "startTime",
  });
  const events = res.data.items || [];
  console.log(`\n📅  Next ${events.length} events\n`);
  events.forEach((e) => console.log(formatEvent(e)));
  console.log();
}

async function cmdBriefing(calendar, drive, docs) {
  const now = new Date();
  const res = await calendar.events.list({
    calendarId: "primary",
    timeMin: startOfDay(now),
    timeMax: endOfDay(now),
    singleEvents: true,
    orderBy: "startTime",
  });
  const events = res.data.items || [];

  console.log(`\n# Daily Briefing — ${now.toDateString()}\n`);
  console.log(`## Meetings today: ${events.length}\n`);

  for (const event of events) {
    const start = event.start?.dateTime ? new Date(event.start.dateTime) : null;
    const end = event.end?.dateTime ? new Date(event.end.dateTime) : null;
    const duration = start && end ? Math.round((end - start) / 60000) + " min" : "all day";
    const attendees = (event.attendees || []).map((a) => a.displayName || a.email);

    console.log(`### ${event.summary || "(no title)"}`);
    if (start) console.log(`- 🕐  ${start.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })} — ${duration}`);
    if (attendees.length) console.log(`- 👥  ${attendees.join(", ")}`);
    if (event.location) console.log(`- 📍  ${event.location}`);
    if (event.hangoutLink) console.log(`- 🎥  ${event.hangoutLink}`);
    if (event.description) console.log(`- 📝  ${event.description.slice(0, 200).replace(/\n/g, " ")}`);
    console.log(`- 🆔  Event ID: ${event.id}`);
    console.log();
  }
}

async function cmdMeetNotes(calendar, drive, docs, eventId) {
  if (!eventId) {
    console.error("❌  Provide an event ID: node calendar.js meet-notes <eventId>");
    process.exit(1);
  }

  // Get the event to find the meeting title and time
  let event;
  try {
    const res = await calendar.events.get({ calendarId: "primary", eventId });
    event = res.data;
  } catch {
    console.error(`❌  Event not found: ${eventId}`);
    process.exit(1);
  }

  const title = event.summary || "Meeting";
  const startDate = event.start?.dateTime
    ? new Date(event.start.dateTime).toISOString().split("T")[0]
    : "unknown-date";

  console.log(`\n🔍  Searching Meet notes for: "${title}"...\n`);

  // Search Drive for Google Meet notes related to this meeting
  const searchRes = await drive.files.list({
    q: `name contains '${title.replace(/'/g, "\\'")}' and mimeType='application/vnd.google-apps.document'`,
    fields: "files(id, name, createdTime, modifiedTime)",
    orderBy: "modifiedTime desc",
    pageSize: 5,
  });

  const files = searchRes.data.files || [];
  if (files.length === 0) {
    console.log("📭  No Meet notes found in Drive for this meeting title.");
    console.log("    (Notes are only available if you or someone in the meeting used the 'Take notes' feature in Google Meet)");
    return;
  }

  console.log(`Found ${files.length} matching document(s):\n`);
  files.forEach((f, i) => console.log(`  [${i + 1}] ${f.name} (modified: ${f.modifiedTime?.split("T")[0]})`));

  const choice = files.length === 1 ? "1" : await prompt("\nWhich document? (number): ");
  const file = files[parseInt(choice) - 1];
  if (!file) { console.error("Invalid choice."); return; }

  const docRes = await docs.documents.get({ documentId: file.id });
  const body = docRes.data.body?.content || [];

  const text = body
    .flatMap((el) => el.paragraph?.elements || [])
    .map((el) => el.textRun?.content || "")
    .join("")
    .trim();

  console.log(`\n## Meet Notes: ${file.name}\n`);
  console.log(text || "(document is empty)");
  console.log();
}

async function cmdCreate(calendar) {
  console.log("\n📅  Create a new calendar event\n");

  const title = await prompt("Title: ");
  const dateStr = await prompt("Date (YYYY-MM-DD): ");
  const startStr = await prompt("Start time (HH:MM, 24h): ");
  const endStr = await prompt("End time (HH:MM, 24h): ");
  const attendeesStr = await prompt("Attendees (comma-separated emails, or leave blank): ");
  const description = await prompt("Description (optional): ");
  const meetLink = await prompt("Add Google Meet link? (y/n): ");

  const startDateTime = new Date(`${dateStr}T${startStr}:00`);
  const endDateTime = new Date(`${dateStr}T${endStr}:00`);

  const event = {
    summary: title,
    description: description || undefined,
    start: { dateTime: startDateTime.toISOString(), timeZone: "Europe/Berlin" },
    end: { dateTime: endDateTime.toISOString(), timeZone: "Europe/Berlin" },
    attendees: attendeesStr
      ? attendeesStr.split(",").map((e) => ({ email: e.trim() }))
      : undefined,
    conferenceData: meetLink.toLowerCase() === "y"
      ? { createRequest: { requestId: `personalos-${Date.now()}` } }
      : undefined,
  };

  console.log("\nCreating event...");
  const res = await calendar.events.insert({
    calendarId: "primary",
    resource: event,
    conferenceDataVersion: meetLink.toLowerCase() === "y" ? 1 : 0,
    sendNotifications: true,
  });

  console.log(`\n✅  Event created: ${res.data.summary}`);
  console.log(`    ID: ${res.data.id}`);
  if (res.data.hangoutLink) console.log(`    Meet: ${res.data.hangoutLink}`);
  console.log(`    Link: ${res.data.htmlLink}\n`);
}

async function cmdFindSlot(calendar, durationMin = 60) {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  for (const day of [now, tomorrow]) {
    const label = day.toDateString();
    const res = await calendar.events.list({
      calendarId: "primary",
      timeMin: startOfDay(day),
      timeMax: endOfDay(day),
      singleEvents: true,
      orderBy: "startTime",
    });

    const events = res.data.items?.filter((e) => e.start?.dateTime) || [];
    const busy = events.map((e) => ({
      start: new Date(e.start.dateTime),
      end: new Date(e.end.dateTime),
    }));

    // Work hours: 08:00–18:00
    const workStart = new Date(day);
    workStart.setHours(8, 0, 0, 0);
    const workEnd = new Date(day);
    workEnd.setHours(18, 0, 0, 0);

    const slots = [];
    let cursor = new Date(Math.max(workStart.getTime(), now.getTime()));

    for (const block of busy) {
      if (cursor < block.start) {
        const gapMin = (block.start - cursor) / 60000;
        if (gapMin >= durationMin) {
          slots.push({ start: new Date(cursor), end: new Date(block.start) });
        }
      }
      cursor = new Date(Math.max(cursor.getTime(), block.end.getTime()));
    }

    if (cursor < workEnd) {
      const gapMin = (workEnd - cursor) / 60000;
      if (gapMin >= durationMin) {
        slots.push({ start: new Date(cursor), end: workEnd });
      }
    }

    if (slots.length > 0) {
      console.log(`\n🕐  Free slots on ${label} (≥${durationMin} min):\n`);
      slots.forEach((s) => {
        const st = s.start.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
        const en = s.end.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
        console.log(`    ${st} – ${en}`);
      });
    } else {
      console.log(`\n❌  No free slots ≥${durationMin} min on ${label}`);
    }
  }
  console.log();
}

// ─── Main ─────────────────────────────────────────────────

async function main() {
  const [,, cmd, ...args] = process.argv;

  if (!cmd) {
    console.log(`
HOLLOP — Google Calendar CLI

Commands:
  today                  List today's events
  week                   List this week's events
  next [n]               List next N events (default: 10)
  briefing               Daily meeting briefing
  meet-notes <eventId>   Pull Google Meet notes for an event
  create                 Create a new event (interactive)
  find-slot [minutes]    Find free slots (default: 60 min)
`);
    process.exit(0);
  }

  const auth = getAuthClient();
  const calendar = google.calendar({ version: "v3", auth });
  const drive = google.drive({ version: "v3", auth });
  const docs = google.docs({ version: "v1", auth });

  switch (cmd) {
    case "today":        await cmdToday(calendar); break;
    case "week":         await cmdWeek(calendar); break;
    case "next":         await cmdNext(calendar, args[0] || 10); break;
    case "briefing":     await cmdBriefing(calendar, drive, docs); break;
    case "meet-notes":   await cmdMeetNotes(calendar, drive, docs, args[0]); break;
    case "create":       await cmdCreate(calendar); break;
    case "find-slot":    await cmdFindSlot(calendar, parseInt(args[0]) || 60); break;
    default:
      console.error(`❌  Unknown command: ${cmd}`);
      process.exit(1);
  }
}

main().catch((err) => {
  console.error("❌  Error:", err.message);
  process.exit(1);
});
