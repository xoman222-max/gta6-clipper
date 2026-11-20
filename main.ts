// gta6-clipper-01 entry program (Node 22, standard library only).
//
// What it does: it hands the entry's VIDEO.json to the grader. The clip
// itself is the entry — the video lives on YouTube and the house reads its
// views through the YouTube Data API — so this program only has to deliver
// the file that names the video, byte for byte, into the output directory.
//
// Behaviour:
//   * reads VIDEO.json from the repository root (MAKEFUN_BOT_DIR, /bot in
//     the grader's container),
//   * checks it parses as JSON and carries a "url" string,
//   * writes that exact file, unchanged, to MAKEFUN_OUTPUT_DIR (/output
//     in the grader's container) as VIDEO.json.
// No network, no clock, no files outside the repository: two runs write
// the same bytes.
//
// Local run:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const sourcePath = join(BOT_DIR, 'VIDEO.json');
const targetPath = join(OUTPUT_DIR, 'VIDEO.json');

let raw: Buffer;
try {
  raw = readFileSync(sourcePath);
} catch (err) {
  console.error(`VIDEO.json could not be read from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}

let parsed: unknown;
try {
  parsed = JSON.parse(raw.toString('utf8'));
} catch (err) {
  console.error(`VIDEO.json is not valid JSON: ${(err as Error).message}`);
  process.exit(1);
}

if (typeof parsed !== 'object' || parsed === null || typeof (parsed as { url?: unknown }).url !== 'string') {
  console.error('VIDEO.json must be a JSON object with a string "url" field.');
  process.exit(1);
}

mkdirSync(OUTPUT_DIR, { recursive: true });
writeFileSync(targetPath, raw);
