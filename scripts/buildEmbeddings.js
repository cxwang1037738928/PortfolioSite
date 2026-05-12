// static build script to create document embeddings for all files in the documents directory

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

import { pipeline } from '@xenova/transformers';

const DOCS_DIR = './documents';
const OUTPUT_FILE = './public/documents.json';

const CHUNK_SIZE = 500;
const CHUNK_OVERLAP = 100;

// chunks text into overlapping pieces to create more context for the embedding model
function chunkText(text, chunkSize = 800, overlap = 100) {

  const chunks = [];

  let start = 0;

  while (start < text.length) {

    const end = start + chunkSize;

    chunks.push(text.slice(start, end));

    start += chunkSize - overlap;
  }

  return chunks;
}

// truncate embedding values to reduce file size while keeping most of the information

function truncateEmbedding(arr, precision = 5) {

  return Array.from(arr).map(v =>
    Number(v.toFixed(precision))
  );
}

async function main() {

  console.log('Loading embedding model...');

  const extractor = await pipeline(
    'feature-extraction',
    'Xenova/all-MiniLM-L6-v2'
  );

  const files = fs.readdirSync(DOCS_DIR); // take every file in the documents directory, will ignore subdirectories for simplicity

  const documents = [];

  for (const file of files) {

    const filePath = path.join(DOCS_DIR, file);

    const stat = fs.statSync(filePath);

    if (!stat.isFile()) continue;

    console.log(`Processing ${file}...`);

    const content = fs.readFileSync(
      filePath,
      'utf-8'
    );

    const chunks = chunkText(
      content,
      CHUNK_SIZE,
      CHUNK_OVERLAP
    );

    for (let i = 0; i < chunks.length; i++) {

      const chunk = chunks[i];

      const output = await extractor(chunk, {
        pooling: 'mean',
        normalize: true, // normalize output so only need to perform dot product
      });

      const embedding = truncateEmbedding(
        output.data
      );

      documents.push({
        id: crypto.randomUUID(),

        source: file,

        chunkIndex: i,

        text: chunk,

        embedding,

        metadata: {
          title: file.replace(/\.[^/.]+$/, ''),
          length: chunk.length,
          createdAt: new Date().toISOString(),
        },
      });
    }
  }

  fs.writeFileSync(
    OUTPUT_FILE,
    JSON.stringify(documents)
  );

  console.log(
    `Saved ${documents.length} chunks`
  );
}

main();