/**
 * gta6-meme-x-01 — round 2 entrypoint.
 *
 * The joke this time is the download bar, not the wait: GTA 6 sits at 98%
 * with three days left, while the agent already got paid on make.fun.
 *
 * What this program does is deliberately boring: it takes POST.json from
 * the repository and puts an identical copy in the output directory, so
 * the house can find the X post it has to read. Nothing else. No network,
 * no clock, no files outside the repository — running it twice writes the
 * same bytes both times.
 *
 * Run it the way the grader does:
 *   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
 */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const POST_FILE = "POST.json";

// An X status address, with or without www./mobile., on x.com or
// twitter.com, optionally /i/web/status/<id>; anything after the id
// (a query or a fragment) is ignored by the house.
const STATUS_ADDRESS =
  /^(?:https?:\/\/)?(?:www\.|mobile\.)?(?:x\.com|twitter\.com)\/(?:i\/web\/status\/|[^/]+\/status\/)(\d+)(?:[?#].*)?$/;

// Keep failure reports short: one line, never a stack trace.
function clip(text: string, limit = 160): string {
  const oneLine = text.replace(/\s+/g, " ").trim();
  return oneLine.length > limit ? oneLine.slice(0, limit - 1) + "…" : oneLine;
}

function die(message: string): never {
  process.stderr.write(`main.ts: ${clip(message)}\n`);
  process.exit(1);
}

// The directory the house points at the repository with; the current
// directory when it does not say.
function botDir(): string {
  return process.env.MAKEFUN_BOT_DIR ?? ".";
}

// Where the copy goes; /output when the house does not say.
function outputDir(): string {
  return process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
}

// Read POST.json as text. die() never returns, so a successful call
// always yields the file's contents.
function readPostText(dir: string): string {
  try {
    return readFileSync(join(dir, POST_FILE), "utf8");
  } catch (error) {
    die(`cannot read ${POST_FILE}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// Parse the file's text as JSON, or fail with a one-line report.
function parsePost(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch (error) {
    die(`${POST_FILE} is not valid JSON: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// The post file must be an object with a url that is an X status address.
function checkPost(data: unknown): void {
  if (typeof data !== "object" || data === null || Array.isArray(data)) {
    die(`${POST_FILE} must be a JSON object like {"url": "https://x.com/<handle>/status/<id>"}`);
  }
  const url = (data as Record<string, unknown>).url;
  if (typeof url !== "string" || !STATUS_ADDRESS.test(url)) {
    die(`${POST_FILE}.url must be an X status address`);
  }
}

// Read the copy back and confirm it matches the file we validated, so a
// half-written copy can never pass as a good one.
function verifyCopy(out: string, raw: string): void {
  let copied: string;
  try {
    copied = readFileSync(join(out, POST_FILE), "utf8");
  } catch (error) {
    die(`cannot read back ${POST_FILE} from ${out}: ${error instanceof Error ? error.message : String(error)}`);
  }
  if (copied !== raw) {
    die(`copy of ${POST_FILE} in ${out} does not match the repository file`);
  }
}

function main(): void {
  const raw = readPostText(botDir());
  checkPost(parsePost(raw));
  const out = outputDir();
  try {
    mkdirSync(out, { recursive: true });
    writeFileSync(join(out, POST_FILE), raw, "utf8");
  } catch (error) {
    die(`cannot write ${POST_FILE} to ${out}: ${error instanceof Error ? error.message : String(error)}`);
  }
  verifyCopy(out, raw);
}

main();
