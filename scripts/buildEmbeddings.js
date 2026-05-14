// scripts/buildEmbeddings.js

import fs from "fs";
import path from "path";
import crypto from "crypto";
import { pipeline } from "@xenova/transformers";

const DOCS_DIR = "./documents";
const OUTPUT_FILE = "./public/documents.json";

const MAX_CHARS = 500; // max characters per chunk, adjust as needed

/* -----------------------------
   CLEANING
----------------------------- */

function cleanText(text) {
  return text
    // remove obvious keyword sections if present
    .replace(/keywords?:[\s\S]*$/im, "")
    // normalize whitespace
    .replace(/\r/g, "")
    .trim();
}

/* -----------------------------
   CHUNKING (HYBRID)
----------------------------- */

// detect structure (markdown or fallback)
function detectSections(text) {
  if (text.includes("\n## ")) {
    return text.split(/\n##\s+/);
  }

  return text.split(/\n\s*\n/);
}

// normalize chunk
function normalize(chunk) {
  return chunk.trim().replace(/\s+/g, " ");
}

// sentence fallback splitter
function splitBySentences(text, maxChars = MAX_CHARS) {
  const sentences = text.split(/(?<=[.!?])\s+/);

  const chunks = [];
  let current = "";

  for (const s of sentences) {
    if (current.length + s.length > maxChars) {
      if (current) chunks.push(current.trim());
      current = s;
    } else {
      current += " " + s;
    }
  }

  if (current) chunks.push(current.trim());

  return chunks;
}

// enforce size limit
function enforceSize(chunk, maxChars = MAX_CHARS) {
  if (chunk.length <= maxChars) return [chunk];
  return splitBySentences(chunk, maxChars);
}

// main chunker
function chunkText(text) {
  const sections = detectSections(text);

  const chunks = [];

  for (const section of sections) {
    const cleaned = normalize(section);

    if (!cleaned) continue;

    const split = enforceSize(cleaned);

    chunks.push(...split);
  }

  return chunks;
}

/* -----------------------------
   EMBEDDING UTILS
----------------------------- */

// rounds down all embedding to a certain decimal
function truncateEmbedding(arr, precision = 5) {
  return Array.from(arr).map((v) =>
    Number(v.toFixed(precision))
  );
}

/* -----------------------------
   MAIN PIPELINE
----------------------------- */

async function main() {
  console.log("Loading embedding model...");

  const extractor = await pipeline(
    "feature-extraction",
    "Xenova/all-MiniLM-L6-v2"
  );

  const files = fs.readdirSync(DOCS_DIR);

  const documents = [];

  for (const file of files) {
    const filePath = path.join(DOCS_DIR, file);

    if (!fs.statSync(filePath).isFile()) continue;

    console.log(`Processing ${file}...`);

    const raw = fs.readFileSync(filePath, "utf-8");

    const cleaned = cleanText(raw);

    const chunks = chunkText(cleaned);

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];

      const output = await extractor(chunk, {
        pooling: "mean",
        normalize: true,
      });

      documents.push({
        id: crypto.randomUUID(),
        source: file,
        chunkIndex: i,
        text: chunk,

        embedding: truncateEmbedding(output.data),

        metadata: {
          title: file.replace(/\.[^/.]+$/, ""),
          length: chunk.length,
        },
      });
    }
  }

  fs.writeFileSync(
    OUTPUT_FILE,
    JSON.stringify(documents, null, 2)
  );

  console.log(`Saved ${documents.length} chunks`);
}

main();