/**
 * gta6-meme-x-01 — the entry program.
 *
 * This repository hands make.fun the address of one X post: the GTA 6 meme
 * in meme.png, posted from a public account. All this program does is carry
 * that address from the repository into the grader's output directory.
 *
 * It reads POST.json out of the bot directory (the repository root when the
 * grader runs it), checks that it really is a JSON object naming one X
 * status URL, and then copies the file byte for byte into the output
 * directory, creating that directory first when it does not exist yet.
 * The URL must be an http(s) address on x.com or twitter.com, with an
 * optional www./mobile. prefix, a handle, /status/, and a numeric id
 * (a query string or fragment after the id is tolerated). The output
 * path must be a directory or not exist yet; a file sitting there is a
 * plain error, not a crash.
 *
 * There is no network access here, no clock, and nothing is read from
 * outside the repository: two runs on the same repository write the same
 * bytes. Anything wrong — a missing file, broken JSON, a url that is not an
 * X status address, an output path that is a file — is reported on stderr
 * and the process exits 1.
 *
 * Run it the way the grader does:
 *
 *   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
 */

import { copyFileSync, existsSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

// An X status address: x.com or twitter.com, optional www./mobile. prefix,
// a handle, /status/, and digits for the id. A query string or fragment
// after the id is tolerated and ignored.
const STATUS_URL =
  /^https?:\/\/(?:www\.|mobile\.)?(?:x\.com|twitter\.com)\/[^/]+\/status\/\d+(?:[?#].*)?$/;

// Where the repository lives and where the output goes. The grader sets
// both; the defaults match the paths the house documents.
const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

const POST_FILENAME = "POST.json";

/** Report a problem on stderr and stop with exit code 1. */
function fail(message: string): never {
  console.error(`gta6-meme-x-01: error: ${message}`);
  process.exit(1);
}

/** Read POST.json and return its parsed value, or fail loudly. */
function readPost(botDir: string): unknown {
  const postPath = join(botDir, POST_FILENAME);
  let raw: string;
  try {
    raw = readFileSync(postPath, "utf8");
  } catch {
    fail(`cannot read ${postPath}`);
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    fail(`${POST_FILENAME} is not valid JSON`);
  }
  return parsed;
}

/** Check the parsed POST.json is an object with a usable X status url. */
function checkPost(value: unknown): void {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    fail(`${POST_FILENAME} must be a JSON object`);
  }
  const url = (value as Record<string, unknown>).url;
  if (typeof url !== "string" || url.length === 0) {
    fail(`${POST_FILENAME} must carry a "url" string`);
  }
  if (!STATUS_URL.test(url)) {
    const shown = url.length > 120 ? `${url.slice(0, 120)}…` : url;
    fail(`"url" is not an X status address: ${shown}`);
  }
}

function main(): void {
  const botDir = resolve(BOT_DIR);
  const outputDir = resolve(OUTPUT_DIR);

  const post = readPost(botDir);
  checkPost(post);

  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  } else if (!statSync(outputDir).isDirectory()) {
    fail(`output path is not a directory: ${outputDir}`);
  }

  // A plain byte copy, so out/POST.json is identical to the repository's.
  copyFileSync(join(botDir, POST_FILENAME), join(outputDir, POST_FILENAME));
}

main();
