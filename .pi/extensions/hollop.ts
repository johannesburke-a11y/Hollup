/**
 * HOLLOP — pi Extension
 *
 * Hooks:
 *   session_start  → daily briefing widget (todos, inbox, weekly review status)
 *                  → runs daily-log-bootstrap (creates today's log if missing)
 *   agent_start    → clears the briefing widget on first prompt
 *   session_shutdown → auto write-back if daily log wasn't written manually
 *
 * Project-local: .pi/extensions/personalos.ts
 */

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import * as fs from "node:fs";
import * as path from "node:path";

export default function (pi: ExtensionAPI) {
  let briefingWidgetActive = false;

  // ─────────────────────────────────────────────────────────
  // session_start — Daily Briefing Widget + Bootstrap
  // ─────────────────────────────────────────────────────────
  pi.on("session_start", async (_event, ctx) => {
    const cwd = ctx.cwd;

    // 1. Bootstrap today's daily log
    bootstrapDailyLog(cwd);

    // 2. Build widget (TUI only)
    if (!ctx.hasUI) return;

    const lines: string[] = [];
    const today = new Date();
    const dateStr = formatDate(today);
    const cw = getCalendarWeek(today);

    lines.push(`  📅  ${dateStr}   CW ${cw}`);
    lines.push("");

    // P1/P2 todos
    try {
      const todoPath = path.join(cwd, "ops", "todo.md");
      if (fs.existsSync(todoPath)) {
        const p1p2 = extractP1P2Todos(fs.readFileSync(todoPath, "utf-8"));
        if (p1p2.length > 0) {
          lines.push(`  📌  Open P1/P2 tasks: ${p1p2.length}`);
          p1p2.slice(0, 3).forEach((t) => lines.push(`      · ${truncate(t, 60)}`));
          if (p1p2.length > 3) lines.push(`      · … +${p1p2.length - 3} more`);
        } else {
          lines.push("  ✅  No open P1/P2 tasks");
        }
      }
    } catch { /* non-fatal */ }

    lines.push("");

    // Stale inbox files
    try {
      const inboxPath = path.join(cwd, "inbox");
      if (fs.existsSync(inboxPath)) {
        const stale = getStaleInboxFiles(inboxPath, 3);
        if (stale.length > 0) {
          lines.push(`  📥  Stale inbox (>3d): ${stale.length} file(s)`);
          stale.slice(0, 3).forEach((f) => lines.push(`      · ${f}`));
        } else {
          lines.push("  📥  Inbox clear");
        }
      }
    } catch { /* non-fatal */ }

    lines.push("");

    // Weekly review status
    try {
      const decisionsPath = path.join(cwd, "ops", "decisions.md");
      if (fs.existsSync(decisionsPath)) {
        const lastReview = getLastWeeklyReview(fs.readFileSync(decisionsPath, "utf-8"));
        if (lastReview) {
          const daysSince = Math.floor((Date.now() - lastReview.getTime()) / 86_400_000);
          if (daysSince > 7) {
            lines.push(`  ⚠️   Weekly review overdue — last: ${daysSince}d ago`);
          } else {
            lines.push(`  ✅  Weekly review done — ${daysSince}d ago`);
          }
        } else {
          lines.push("  ⚠️   No weekly review yet — first one pending");
        }
      }
    } catch { /* non-fatal */ }

    lines.push("");

    ctx.ui.setWidget("personalos-briefing", lines);
    briefingWidgetActive = true;
  });

  // ─────────────────────────────────────────────────────────
  // agent_start — Clear widget on first prompt
  // ─────────────────────────────────────────────────────────
  pi.on("agent_start", async (_event, ctx) => {
    if (briefingWidgetActive && ctx.hasUI) {
      ctx.ui.setWidget("personalos-briefing", []);
      briefingWidgetActive = false;
    }
  });

  // ─────────────────────────────────────────────────────────
  // session_shutdown — Auto Write-Back
  // ─────────────────────────────────────────────────────────
  pi.on("session_shutdown", async (_event, ctx) => {
    const cwd = ctx.cwd;
    const today = formatDate(new Date());
    const dailyLogPath = path.join(cwd, "daily", `${today}.md`);

    // Only act if there was meaningful agent activity
    const entries = ctx.sessionManager.getEntries();
    const assistantTurns = entries.filter(
      (e) =>
        e.type === "message" &&
        (e as { type: string; message?: { role?: string } }).message?.role === "assistant",
    ).length;

    if (assistantTurns === 0) return;

    // Check if the daily log was already written with real content
    if (fs.existsSync(dailyLogPath)) {
      const content = fs.readFileSync(dailyLogPath, "utf-8");
      if (hasRealSessionEntry(content)) return;
    }

    // Auto-write a minimal session entry
    const summary = buildAutoSummary(entries, today);

    if (fs.existsSync(dailyLogPath)) {
      fs.appendFileSync(dailyLogPath, summary, "utf-8");
    } else {
      fs.writeFileSync(dailyLogPath, `# ${today}\n\n${summary}`, "utf-8");
    }

    if (ctx.hasUI) {
      ctx.ui.notify("Session auto-logged → daily/" + today + ".md", "info");
    }
  });
}

// ─────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────

function formatDate(d: Date): string {
  return d.toISOString().split("T")[0];
}

function getCalendarWeek(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7);
}

function truncate(s: string, n: number): string {
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}

function bootstrapDailyLog(cwd: string): void {
  const today = formatDate(new Date());
  const target = path.join(cwd, "daily", `${today}.md`);
  if (fs.existsSync(target)) return;

  const templatePath = path.join(cwd, "resources", "templates", "daily.md");
  if (!fs.existsSync(templatePath)) return;

  const content = fs.readFileSync(templatePath, "utf-8").replace(/YYYY-MM-DD/g, today);
  fs.writeFileSync(target, content, "utf-8");
}

function extractP1P2Todos(content: string): string[] {
  return content
    .split("\n")
    .filter((line) => /\[ \]/.test(line) && /\bP[12]\b/i.test(line))
    .map((line) => line.replace(/^[-*]\s*\[ \]\s*/, "").trim());
}

function getStaleInboxFiles(inboxPath: string, thresholdDays: number): string[] {
  const threshold = thresholdDays * 86_400_000;
  const now = Date.now();
  return fs
    .readdirSync(inboxPath)
    .filter((f) => f.endsWith(".md") && f !== "_index.md")
    .filter((f) => {
      try {
        return now - fs.statSync(path.join(inboxPath, f)).mtimeMs > threshold;
      } catch {
        return false;
      }
    });
}

function getLastWeeklyReview(content: string): Date | null {
  let last: Date | null = null;
  for (const match of content.matchAll(/(\d{4}-\d{2}-\d{2}).*[Ww]eekly review completed/g)) {
    const d = new Date(match[1]);
    if (!last || d > last) last = d;
  }
  return last;
}

function hasRealSessionEntry(content: string): boolean {
  // Template has empty "- " bullets; real entries have actual text after the bullet
  const sessionBlocks = content.split("## Session");
  if (sessionBlocks.length < 2) return false;
  // Check if any session block has a non-empty "What was done" bullet
  return sessionBlocks.slice(1).some((block) => /### What was done\n\n- .+/s.test(block));
}

function buildAutoSummary(entries: unknown[], today: string): string {
  const now = new Date();
  const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

  // Grab last assistant text for a rough title
  let lastText = "";
  for (let i = entries.length - 1; i >= 0; i--) {
    const e = entries[i] as { type: string; message?: { role?: string; content?: unknown } };
    if (e.type !== "message" || e.message?.role !== "assistant") continue;
    const content = e.message.content;
    if (!Array.isArray(content)) continue;
    for (const block of content) {
      const b = block as { type?: string; text?: string };
      if (b.type === "text" && typeof b.text === "string" && b.text.trim().length > 10) {
        lastText = b.text.split("\n")[0].trim();
        break;
      }
    }
    if (lastText) break;
  }

  const title = truncate(lastText || "Session activity", 60);

  return `
## Session (auto-logged ~${time}) — ${title}

### What was done

- *(auto-logged by session_shutdown hook — expand manually if needed)*

### Write-back done

- \`daily/${today}.md\` — auto-logged

### Open / next session

- Review and expand this log entry if the session was significant

---
`;
}
