/**
 * auth.js — Google OAuth2 flow for HOLLOP
 *
 * Run once to authenticate:
 *   node auth.js
 *
 * Saves token.json (gitignored) for all subsequent calls.
 */

import { google } from "googleapis";
import * as fs from "node:fs";
import * as path from "node:path";
import * as readline from "node:readline";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const CREDENTIALS_PATH = path.join(__dirname, "credentials.json");
const TOKEN_PATH = path.join(__dirname, "token.json");

const SCOPES = [
  "https://www.googleapis.com/auth/calendar",           // Read + write calendar
  "https://www.googleapis.com/auth/drive.readonly",     // Read Meet notes from Drive
  "https://www.googleapis.com/auth/documents.readonly", // Read Google Docs content
  "https://www.googleapis.com/auth/directory.readonly", // Read Workspace directory (names, titles, departments)
];

async function main() {
  if (!fs.existsSync(CREDENTIALS_PATH)) {
    console.error("❌  credentials.json not found in scripts/google-calendar/");
    process.exit(1);
  }

  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, "utf-8"));
  const { client_secret, client_id, redirect_uris } = credentials.installed;

  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  if (fs.existsSync(TOKEN_PATH)) {
    console.log("✅  token.json already exists. You are authenticated.");
    console.log("    Delete token.json and re-run to re-authenticate.");
    process.exit(0);
  }

  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });

  console.log("\n🔐  Authorize HOLLOP to access your Google account:\n");
  console.log("   " + authUrl);
  console.log("\nOpen the URL above in your browser, authorize, then paste the code here:\n");

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  rl.question("Authorization code: ", async (code) => {
    rl.close();
    try {
      const { tokens } = await oAuth2Client.getToken(code.trim());
      fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));
      console.log("\n✅  token.json saved. You are now authenticated.\n");
    } catch (err) {
      console.error("❌  Error getting token:", err.message);
      process.exit(1);
    }
  });
}

main();
