/**
 * Replaces placeholder midnight-exact `generatedAt` timestamps with the real
 * git commit date each file was first added — genuine history, not invented
 * variety. Leaves already-real timestamps (e.g. from the Phase 3 deep pass)
 * untouched. Idempotent: safe to re-run, since it always reads git's
 * historical record of each file's first appearance, which doesn't change
 * when the file's content is later edited (including by this script).
 *
 * Usage: npx tsx scripts/backfill-generated-dates.ts [--dry-run]
 */
import { readFile, writeFile, readdir } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import path from "node:path";
import type { GeneratedArticle } from "../lib/types";

const GEN_DIR = path.join(process.cwd(), "content", "generated");
const DRY_RUN = process.argv.includes("--dry-run");
const MIDNIGHT_RE = /T00:00:00(\.000)?Z$/;

function buildCreationDateMap(): Map<string, string> {
  const raw = execFileSync(
    "git",
    ["log", "--reverse", "--format=\x01%aI", "--name-only", "--", "content/generated/"],
    { cwd: process.cwd(), encoding: "utf-8", maxBuffer: 1024 * 1024 * 64 }
  );

  const map = new Map<string, string>();
  let currentDate: string | null = null;
  for (const line of raw.split("\n")) {
    if (line.startsWith("\x01")) {
      currentDate = line.slice(1).trim();
      continue;
    }
    const trimmed = line.trim();
    if (!trimmed || !currentDate) continue;
    // First appearance wins (--reverse walks oldest to newest), so later
    // edits to the same file don't overwrite its true creation date.
    if (!map.has(trimmed)) map.set(trimmed, currentDate);
  }
  return map;
}

async function main() {
  const creationDates = buildCreationDateMap();
  const files = (await readdir(GEN_DIR)).filter((f) => f.endsWith(".json"));

  let updated = 0;
  let skippedAlreadyReal = 0;
  let skippedNoHistory = 0;
  const samples: string[] = [];

  for (const file of files) {
    const filePath = path.join(GEN_DIR, file);
    const relPath = `content/generated/${file}`;
    const raw = await readFile(filePath, "utf-8");
    const article: GeneratedArticle = JSON.parse(raw);

    if (!MIDNIGHT_RE.test(article.generatedAt)) {
      skippedAlreadyReal++;
      continue;
    }

    const gitDate = creationDates.get(relPath);
    if (!gitDate) {
      skippedNoHistory++;
      continue;
    }

    const isoUtc = new Date(gitDate).toISOString();
    if (samples.length < 8) samples.push(`${file}: ${article.generatedAt} -> ${isoUtc}`);

    if (!DRY_RUN) {
      article.generatedAt = isoUtc;
      await writeFile(filePath, JSON.stringify(article, null, 2) + "\n");
    }
    updated++;
  }

  console.log(`${DRY_RUN ? "[dry run] " : ""}Updated: ${updated}`);
  console.log(`Already real: ${skippedAlreadyReal}`);
  console.log(`No git history found: ${skippedNoHistory}`);
  console.log("\nSample changes:");
  samples.forEach((s) => console.log(" ", s));
}

main();
