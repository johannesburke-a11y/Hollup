/**
 * OCTO-CODER 3000 — 80s Arcade Animation
 * An orange octopus in a cowboy hat and sunglasses glides in
 * and types on 8 laptops simultaneously with his tentacles.
 *
 * Command: /octopus
 * Exit:    q / Esc / any key after steady state
 */

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { matchesKey, visibleWidth } from "@earendil-works/pi-tui";

// ─── ANSI ────────────────────────────────────────────────────────────────────
const R  = "\x1b[0m";
const BD = "\x1b[1m";
const BL = "\x1b[5m";
const O  = "\x1b[38;5;208m";   // orange
const DO = "\x1b[38;5;166m";   // dark orange
const Y  = "\x1b[38;5;226m";   // yellow
const CY = "\x1b[38;5;51m";    // cyan
const GR = "\x1b[38;5;82m";    // green
const MG = "\x1b[38;5;201m";   // magenta
const WH = "\x1b[97m";         // white
const PU = "\x1b[38;5;93m";    // purple
const RE = "\x1b[38;5;196m";   // red
const PI = "\x1b[38;5;213m";   // pink
const DI = "\x1b[2m";          // dim

// ─── Canvas helpers ──────────────────────────────────────────────────────────
type Cell = { c: string; k: string };

function makeCanvas(w: number, h: number): Cell[][] {
  return Array.from({ length: h }, () =>
    Array.from({ length: w }, () => ({ c: " ", k: "" }))
  );
}

function paint(canvas: Cell[][], x: number, y: number, text: string, color = ""): void {
  const row = canvas[Math.round(y)];
  if (!row) return;
  for (let i = 0; i < text.length; i++) {
    const cx = Math.round(x) + i;
    if (cx >= 0 && cx < row.length) row[cx] = { c: text[i], k: color };
  }
}

function paintChar(canvas: Cell[][], x: number, y: number, ch: string, color = ""): void {
  const row = canvas[Math.round(y)];
  const rx = Math.round(x);
  if (!row || rx < 0 || rx >= row.length) return;
  row[rx] = { c: ch, k: color };
}

function rowToString(row: Cell[]): string {
  let out = "";
  let lastK = "";
  for (const cell of row) {
    if (cell.k !== lastK) { out += R + cell.k; lastK = cell.k; }
    out += cell.c;
  }
  return out + R;
}

// ─── Animation component ─────────────────────────────────────────────────────
const CODE_CHARS = "abcdefghijklmnopqrstuvwxyz0123456789{}()[]<>=+-*/.,;:_!?";
const FX_WORDS   = ["ZAP!", "POW!", "BZZZT!", "HACK!", "CODE!", "BOOM!", "PING!", "GG!"];
const SCREEN_COLORS = [CY, GR, MG, PI, Y + BD, CY + BD, GR + BD, MG + BD];

class OctoCoderAnimation {
  private frame = 0;
  private score = 0;
  private interval: ReturnType<typeof setInterval> | null = null;
  private tui: { requestRender: () => void };
  private onClose: () => void;
  private cachedLines: string[] = [];
  private cachedWidth = 0;
  private version = 0;
  private cachedVersion = -1;

  // Laptop screen buffers: 8 screens × 3 lines
  private screens: string[][] = Array.from({ length: 8 }, () => ["", "", ""]);
  // Active FX popup
  private fx: { text: string; x: number; y: number; ttl: number } | null = null;

  constructor(tui: { requestRender: () => void }, onClose: () => void) {
    this.tui = tui;
    this.onClose = onClose;
    this.interval = setInterval(() => {
      this.tick();
      this.version++;
      this.tui.requestRender();
    }, 50); // 20fps
  }

  dispose(): void {
    if (this.interval) { clearInterval(this.interval); this.interval = null; }
  }

  handleInput(data: string): void {
    if (matchesKey(data, "escape") || data === "q" || data === "Q" || data[0] === "\x03") {
      this.dispose();
      this.onClose();
    }
  }

  invalidate(): void { this.cachedWidth = 0; }

  // ── Tick ──────────────────────────────────────────────────────────────────
  private tick(): void {
    this.frame++;
    if (this.frame >= 100) {
      // Typing phase
      if (this.frame % 2 === 0) {
        const i = Math.floor(Math.random() * 8);
        const lineIdx = Math.floor(Math.random() * 3);
        const maxLen = 8;
        if (this.screens[i][lineIdx].length < maxLen) {
          this.screens[i][lineIdx] += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
        } else {
          this.screens[i] = [this.screens[i][1], this.screens[i][2], ""];
        }
        this.score += 1;
      }
      // Random FX popup
      if (this.frame % 30 === 0 && !this.fx) {
        this.fx = {
          text: FX_WORDS[Math.floor(Math.random() * FX_WORDS.length)],
          x: 0, y: 0, // set in render
          ttl: 15,
        };
      }
      if (this.fx) {
        this.fx.ttl--;
        if (this.fx.ttl <= 0) this.fx = null;
      }
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────
  render(width: number): string[] {
    if (width === this.cachedWidth && this.version === this.cachedVersion) {
      return this.cachedLines;
    }
    this.cachedWidth = width;
    this.cachedVersion = this.version;

    const W = Math.min(width, 160);
    const H = 38;

    const canvas = makeCanvas(W, H);
    const cx = Math.floor(W / 2);  // center x

    // ── Layout constants ──
    const OCTO_TOP  = 4;
    const OCTO_HT   = 13;
    const OCTO_BOT  = OCTO_TOP + OCTO_HT;
    const LP_W      = 12;
    const LP_H      = 7;
    const LP_GAP    = Math.floor((W - 8 * LP_W) / 9);
    const LP_LEFT   = LP_GAP;
    const LP_TOP    = H - LP_H - 1;

    // Laptop x-centers
    const lpCenters = Array.from({ length: 8 }, (_, i) =>
      LP_LEFT + i * (LP_W + LP_GAP) + Math.floor(LP_W / 2)
    );

    // ── Phase calculations ──
    const f = this.frame;
    const phase =
      f < 20  ? "intro"     :
      f < 55  ? "slide_in"  :
      f < 75  ? "laptops"   :
      f < 100 ? "tentacles" :
                "typing";

    const octoOffset = phase === "intro" ? W
      : phase === "slide_in" ? Math.round(W * Math.pow(1 - (f - 20) / 35, 3))
      : 0;

    // ── Draw ──────────────────────────────────────────────────────────────

    // Border
    this.drawBorder(canvas, W, H);

    // Header
    this.drawHeader(canvas, W, cx);

    // Octopus
    if (phase !== "intro") {
      this.drawOctopus(canvas, cx + octoOffset, OCTO_TOP);
    }

    // Intro screen
    if (phase === "intro") {
      const msg = f % 6 < 3
        ? `${Y}${BD}${BL}  >>>  INSERT COIN  <<<  ${R}`
        : `${MG}${BD}  >>>  INSERT COIN  <<<  ${R}`;
      const msgV = "  >>>  INSERT COIN  <<<  ";
      paint(canvas, Math.floor((W - msgV.length) / 2), Math.floor(H / 2), msg);
      const sub = `${DI}  OCTO-CODER 3000  `;
      paint(canvas, Math.floor((W - sub.length) / 2), Math.floor(H / 2) + 2, sub);
    }

    // Laptops
    if (phase === "laptops" || phase === "tentacles" || phase === "typing") {
      const numVisible = phase === "laptops"
        ? Math.min(8, Math.floor((f - 55) / 2.5) + 1)
        : 8;
      for (let i = 0; i < numVisible; i++) {
        this.drawLaptop(canvas, LP_LEFT + i * (LP_W + LP_GAP), LP_TOP, i);
      }
    }

    // Tentacles
    if (phase === "tentacles" || phase === "typing") {
      const prog = phase === "tentacles" ? (f - 75) / 25 : 1.0;
      const waveTime = f;
      for (let i = 0; i < 8; i++) {
        this.drawTentacle(
          canvas,
          cx, OCTO_BOT,
          lpCenters[i], LP_TOP,
          prog, waveTime, i
        );
      }
    }

    // FX popup
    if (this.fx && phase === "typing") {
      const fxX = cx + (this.fx.x % 20) - 10;
      const fxY = OCTO_TOP + 6;
      const fading = this.fx.ttl < 5 ? DI : BD;
      paint(canvas, fxX, fxY, `${RE}${fading}${BL}${this.fx.text}${R}`);
    }

    // Score
    if (phase === "typing") {
      const sc = `${GR}${BD}SCORE: ${String(this.score).padStart(6, "0")}${R}`;
      paint(canvas, 2, H - 1, sc);
    }

    // Instructions
    paint(canvas, Math.floor(W / 2) - 10, H - 1, `${DI}[Q / ESC] EXIT${R}`);

    // Flush canvas to lines
    this.cachedLines = Array.from({ length: H }, (_, y) => rowToString(canvas[y]));
    return this.cachedLines;
  }

  // ── Sub-drawers ───────────────────────────────────────────────────────────

  private drawBorder(cv: Cell[][], W: number, H: number): void {
    const top = `${CY}${BD}╔${"═".repeat(W - 2)}╗${R}`;
    paint(cv, 0, 0, top);
    for (let y = 1; y < H - 1; y++) {
      paintChar(cv, 0, y, "║", CY + BD);
      paintChar(cv, W - 1, y, "║", CY + BD);
    }
    paint(cv, 0, H - 1, `${CY}${BD}╚${"═".repeat(W - 2)}╝${R}`);
  }

  private drawHeader(cv: Cell[][], W: number, cx: number): void {
    const stars = `${MG}${BD}★ ★ ★  ${R}`;
    const title = `${Y}${BD}  O C T O - C O D E R   3 0 0 0  ${R}`;
    const starse = `${MG}${BD}  ★ ★ ★${R}`;
    const full = stars + title + starse;
    const fullV = "★ ★ ★    O C T O - C O D E R   3 0 0 0    ★ ★ ★";
    paint(cv, Math.floor((W - fullV.length) / 2), 1, full);
    paint(cv, 0, 2, `${CY}${BD}╠${"═".repeat(W - 2)}╣${R}`);
  }

  private drawOctopus(cv: Cell[][], ocx: number, row: number): void {
    const ob = O + BD;
    const yb = Y + BD;
    const mb = MG + BD;
    const cyb = CY + BD;
    const db = DO + BD;

    // Hat (yellow)
    paint(cv, ocx - 5,  row + 0, `   _______   `,  yb);
    paint(cv, ocx - 5,  row + 1, `  |HOWDY!!|  `,  yb + BL);
    paint(cv, ocx - 7,  row + 2, ` __|_______|__ `, yb);
    paint(cv, ocx - 7,  row + 3, `/             \\`, yb);

    // Head
    paint(cv, ocx - 9,  row + 4,  `(  ▓▓▓▓▓▓▓▓▓▓▓▓▓  )`, ob);

    // Sunglasses row
    paint(cv, ocx - 9,  row + 5,  `( ▓▓             ▓▓ )`, ob);
    paint(cv, ocx - 5,  row + 5,  `[◉◉]`, mb);
    paint(cv, ocx + 1,  row + 5,  `[◉◉]`, mb);

    // Cheeks + smile
    paint(cv, ocx - 9,  row + 6,  `(  ▓▓▓▓▓▓▓▓▓▓▓▓▓  )`, ob);
    paint(cv, ocx - 9,  row + 7,  `(  ▓▓▓        ▓▓▓  )`, ob);
    paint(cv, ocx - 3,  row + 7,  `╰─────╯`, cyb);
    paint(cv, ocx - 9,  row + 8,  `(  ▓▓▓▓▓▓▓▓▓▓▓▓▓  )`, ob);

    // Neck + body base
    paint(cv, ocx - 9,  row + 9,  ` \\  ▓▓▓▓▓▓▓▓▓▓▓  / `, ob);
    paint(cv, ocx - 9,  row + 10, `  \\___________/  `,   ob);

    // Mantle (tentacle base)
    paint(cv, ocx - 9,  row + 11, `   /           \\   `, db);
    paint(cv, ocx - 9,  row + 12, `  / ∿ ∿ ∿ ∿ ∿  \\  `, db);
  }

  private drawTentacle(
    cv: Cell[][], x0: number, y0: number,
    x1: number,   y1: number,
    progress: number, time: number, idx: number
  ): void {
    const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0));
    const draw  = Math.floor(steps * progress);
    const col   = idx % 2 === 0 ? O + BD : DO + BD;

    const dx = x1 - x0;
    const dy = y1 - y0;
    const len = Math.sqrt(dx * dx + dy * dy);
    const px = -dy / len;  // perpendicular x
    const py =  dx / len;  // perpendicular y

    for (let s = 0; s <= draw; s++) {
      const t = s / steps;
      const bx = x0 + dx * t;
      const by = y0 + dy * t;

      // Wave envelope: peaks in middle of tentacle
      const env = Math.sin(t * Math.PI) * 1.8;
      const wave = Math.sin(s * 0.35 + time * 0.25 + idx * 1.1) * env;

      const wx = Math.round(bx + px * wave);
      const wy = Math.round(by + py * wave);

      // Choose glyph based on dominant direction
      const slope = Math.abs(dy) > 0 ? Math.abs(dx / dy) : 99;
      let ch: string;
      if (slope > 2)        ch = "~";
      else if (slope < 0.5) ch = "|";
      else if (dx * dy > 0) ch = "\\";
      else                  ch = "/";

      paintChar(cv, wx, wy, ch, col);
    }
  }

  private drawLaptop(cv: Cell[][], x: number, y: number, idx: number): void {
    const sc  = SCREEN_COLORS[idx];
    const fr  = CY + BD;
    const W12 = LP_W;

    paint(cv, x, y,     `${fr}╭${"─".repeat(W12 - 2)}╮${R}`);
    paint(cv, x, y + 1, `${fr}│${R}${GR}${BD}>${R}         ${fr}│${R}`);

    for (let row = 0; row < 3; row++) {
      const text = (this.screens[idx][row] || "").slice(0, W12 - 4);
      const padded = text + " ".repeat(W12 - 4 - text.length);
      const cursor = row === 2 && text.length < W12 - 4 ? `${Y}${BD}▌${R}` : "";
      paint(cv, x, y + 2 + row,
        `${fr}│${R}${sc} ${padded}${cursor}${" ".repeat(!cursor ? 0 : -1)} ${fr}│${R}`
      );
    }

    paint(cv, x, y + 5, `${fr}╰${"─".repeat(W12 - 2)}╯${R}`);
    paint(cv, x, y + 6, `${DI} ${"▬".repeat(W12 - 2)} ${R}`);
  }
}

// ─── Extension entry ──────────────────────────────────────────────────────────
export default function (pi: ExtensionAPI) {
  pi.registerCommand("octopus", {
    description: "🐙 OCTO-CODER 3000 — 80s arcade animation",
    handler: async (_args, ctx) => {
      if (ctx.mode !== "tui") {
        ctx.ui.notify("OCTO-CODER 3000 requires TUI mode", "warning");
        return;
      }

      await ctx.ui.custom((_tui, _theme, _kb, done) => {
        const anim = new OctoCoderAnimation(_tui, () => done(undefined));
        return {
          render: (width: number) => anim.render(width),
          handleInput: (data: string) => anim.handleInput(data),
          invalidate: () => anim.invalidate(),
        };
      });
    },
  });
}
