// scripts/buildEmbeddings.js

import fs from "fs";
import path from "path";
import crypto from "crypto";

import { pipeline } from "@xenova/transformers";
// directory where the source documents are stored
const DOCS_DIR = "./documents";
// file path of the output JSON file that will store the chunks and their embeddings
const OUTPUT_FILE = "./public/documents.json";

// max characters per chunk (after sectioning)
const MAX_CHARS = 1200;

/* ---------------------------------------
   TEXT CLEANING
--------------------------------------- */

function cleanText(text) {
  return text
    .replace(/\r/g, "") // get rid of \r\n
    .replace(/\t/g, " ") // get rid of tabs
    .replace(/[ ]{2,}/g, " ") // collapse multiple spaces
    .trim();  // remove white space at start/end
}

/* ---------------------------------------
   METADATA INFERENCE
--------------------------------------- */
// scans the entire text for keywords to infer a project type
// returns a string label that can be used for filtering later (e.g. "project", "coursework", "hobby", etc.)
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

  // #TODO: change later since astronomy could be a project or coursework, but for now just want to test hobby embedding quality
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
// detects the sections in the chunk based on markdown headings
function detectSections(text) {

  // markdown headings
  if (text.includes("\n##")) {

    // cleanly split by markdown sections (## heading)
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

// splits large chunks into smaller ones based on sentence boundaries
// returns an array of strings that are each under the max character limit
function splitLargeChunk(
  text,
  maxChars = MAX_CHARS
) {

  if (text.length <= maxChars) {
    return [text];
  }

  // sentence enders followed by whitespace
  const sentences = text.split(
    /(?<=[.!?])\s+/
  );

  const chunks = [];

  let current = "";

  for (const sentence of sentences) {

    if (current.length + sentence.length > maxChars) {
      if (current.trim()) {
        chunks.push(current.trim()); // add current chunk to chunks if its over the limit with the current sentence
      }
      current = sentence; // add current sentence to the new chunk
    } else {
      current += " " + sentence;
    }
  }
  // add any remaining text as a chunk
  if (current.trim()) {
    chunks.push(current.trim());
  }

  return chunks;
}

/* ---------------------------------------
   MAIN CHUNKER
--------------------------------------- */
// first detects each section, then splits each section into large chunks
// returns an array of strings that are each under the max character limit and sectioned by topic
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
// trundates the decimal places of embeddings to reduce computation strain
// modifies the arrays in place
// input: list of floats, output: list of floats with reduced precision
function truncateEmbedding(
  arr,
  precision = 5
) {
  for (let i = 0; i < arr.length; i++) {
    arr[i] = Number(
      arr[i].toFixed(precision)
    );
  }

  return arr;
}
// deprecated: no longer needed since this uses more memory
//function truncateEmbedding( arr, precision = 5 ) { return Array.from(arr).map(v => Number(v.toFixed(precision)) ); }
/* ---------------------------------------
   MAIN
--------------------------------------- */

async function main() {

  console.log("Loading model...");

  const extractor = await pipeline(
    "feature-extraction",
    "Xenova/all-MiniLM-L6-v2"
  );
  // load all files in the ./documents directory
  const files =
    fs.readdirSync(DOCS_DIR);

  const documents = [];
  // build files paths and read file metadata
  for (const file of files) {

    const filePath =
      path.join(DOCS_DIR, file);

    const stat =
      fs.statSync(filePath);

    if (!stat.isFile()) continue;

    console.log(`Processing ${file}...`);
    // decodes file into string
    const raw =
      fs.readFileSync(
        filePath,
        "utf-8"
      );

    const cleaned =
      cleanText(raw);

    const chunks =
      chunkText(cleaned);
    
    // removes file extension
    const title =
      file.replace(/\.[^/.]+$/, "");

    const type =
      inferType(file, cleaned);

    for (let i = 0;i < chunks.length;i++) {

      const chunk = chunks[i];

      // Combines the chunk with its title and type metadata to provide more context for the embedding model
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
      // append the truncated embedding to the documents array along with metadata.
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
  // write the documents array to a JSON file in the public directory
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