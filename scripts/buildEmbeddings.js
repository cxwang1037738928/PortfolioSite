// scripts/buildEmbeddings.js

import fs from "fs";
import path from "path";
import crypto from "crypto";

import { pipeline } from "@xenova/transformers";

const DOCS_DIR = "./documents";
const OUTPUT_FILE = "./public/documents.json";

const MAX_CHARS = 1200;

/* ---------------------------------------
   TEXT CLEANING
--------------------------------------- */

function cleanText(text) {
  return text
    .replace(/\r/g, "")
    .replace(/\t/g, " ")
    .replace(/[ ]{2,}/g, " ")
    .trim();
}

/* ---------------------------------------
   METADATA INFERENCE
--------------------------------------- */

function inferType(filename, text) {
  const lower = (
    filename + " " + text
  ).toLowerCase();

  if (
    lower.includes("project") ||
    lower.includes("architecture") ||
    lower.includes("tech stack")
  ) {
    return "project";
  }

  if (
    lower.includes("csc") ||
    lower.includes("course")
  ) {
    return "coursework";
  }

  if (
    lower.includes("astronomy") ||
    lower.includes("fitness") ||
    lower.includes("telescope")
  ) {
    return "hobby";
  }

  return "general";
}

/* ---------------------------------------
   SECTION DETECTION
--------------------------------------- */

function detectSections(text) {

  // markdown headings
  if (text.includes("\n##")) {

    return text
      .split(/\n(?=##)/)
      .map(s => s.trim())
      .filter(Boolean);
  }

  // fallback: paragraph grouping
  return text
    .split(/\n\s*\n/)
    .map(s => s.trim())
    .filter(Boolean);
}

/* ---------------------------------------
   SPLIT LARGE CHUNKS
--------------------------------------- */

function splitLargeChunk(
  text,
  maxChars = MAX_CHARS
) {

  if (text.length <= maxChars) {
    return [text];
  }

  const sentences = text.split(
    /(?<=[.!?])\s+/
  );

  const chunks = [];

  let current = "";

  for (const sentence of sentences) {

    if (
      current.length + sentence.length >
      maxChars
    ) {

      if (current.trim()) {
        chunks.push(current.trim());
      }

      current = sentence;

    } else {

      current += " " + sentence;
    }
  }

  if (current.trim()) {
    chunks.push(current.trim());
  }

  return chunks;
}

/* ---------------------------------------
   MAIN CHUNKER
--------------------------------------- */

function chunkText(text) {

  const sections = detectSections(text);

  const chunks = [];

  for (const section of sections) {

    const split =
      splitLargeChunk(section);

    chunks.push(...split);
  }

  return chunks;
}

/* ---------------------------------------
   EMBEDDING COMPRESSION
--------------------------------------- */

function truncateEmbedding(
  arr,
  precision = 5
) {

  return Array.from(arr).map(v =>
    Number(v.toFixed(precision))
  );
}

/* ---------------------------------------
   MAIN
--------------------------------------- */

async function main() {

  console.log("Loading model...");

  const extractor = await pipeline(
    "feature-extraction",
    "Xenova/all-MiniLM-L6-v2"
  );

  const files =
    fs.readdirSync(DOCS_DIR);

  const documents = [];

  for (const file of files) {

    const filePath =
      path.join(DOCS_DIR, file);

    const stat =
      fs.statSync(filePath);

    if (!stat.isFile()) continue;

    console.log(`Processing ${file}...`);

    const raw =
      fs.readFileSync(
        filePath,
        "utf-8"
      );

    const cleaned =
      cleanText(raw);

    const chunks =
      chunkText(cleaned);

    const title =
      file.replace(/\.[^/.]+$/, "");

    const type =
      inferType(file, cleaned);

    for (
      let i = 0;
      i < chunks.length;
      i++
    ) {

      const chunk = chunks[i];

      // IMPORTANT:
      // inject source/project identity
      // directly into embedding text
      const embeddingText = `
Project: ${title}

Type: ${type}

${chunk}
`;

      const output =
        await extractor(
          embeddingText,
          {
            pooling: "mean",
            normalize: true,
          }
        );

      documents.push({

        id: crypto.randomUUID(),

        source: file,

        chunkIndex: i,

        text: chunk,

        embedding:
          truncateEmbedding(
            output.data
          ),

        metadata: {

          title,

          type,

          length: chunk.length,
        },
      });
    }
  }

  fs.writeFileSync(
    OUTPUT_FILE,
    JSON.stringify(
      documents,
      null,
      2
    )
  );

  console.log(
    `Saved ${documents.length} chunks`
  );
}

main();