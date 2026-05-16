// lib/search.js

/* ---------------------------------------
   DOT PRODUCT
--------------------------------------- */

export function dotProduct(a, b) {

  let sum = 0;

  for (let i = 0; i < a.length; i++) {
    sum += a[i] * b[i];
  }

  return sum;
}

/* ---------------------------------------
   QUERY TYPE DETECTION
--------------------------------------- */

function inferQueryType(query) {

  const lower =
    query.toLowerCase();

  if (
    lower.includes("project") ||
    lower.includes("built") ||
    lower.includes("app") ||
    lower.includes("architecture")
  ) {
    return "project";
  }

  if (
    lower.includes("course") ||
    lower.includes("class") ||
    lower.includes("csc")
  ) {
    return "coursework";
  }

  if (
    lower.includes("astronomy") ||
    lower.includes("telescope") ||
    lower.includes("fitness")
  ) {
    return "hobby";
  }

  return null;
}

/* ---------------------------------------
   SIMPLE KEYWORD BOOST
--------------------------------------- */

function keywordBoost(
  query,
  text
) {

  const queryWords =
    query
      .toLowerCase()
      .split(/\W+/)
      .filter(Boolean);

  const lowerText =
    text.toLowerCase();

  let hits = 0;

  for (const word of queryWords) {

    if (
      word.length > 3 &&
      lowerText.includes(word)
    ) {
      hits++;
    }
  }

  return hits * 0.03;
}

/* ---------------------------------------
   MAIN SEARCH
--------------------------------------- */

export function searchDocuments(
  query,
  queryEmbedding,
  documents,
  topK = 5
) {

  const queryType =
    inferQueryType(query);

  /* -----------------------------
     FILTER BY TYPE
  ----------------------------- */

  let candidateDocs = documents;

  if (queryType) {

    candidateDocs =
      documents.filter(doc =>
        doc.metadata.type === queryType
      );

    // fallback if filter too aggressive
    if (candidateDocs.length < 3) {
      candidateDocs = documents;
    }
  }

  /* -----------------------------
     VECTOR SEARCH
  ----------------------------- */

  let scored =
    candidateDocs.map(doc => ({

      ...doc,

      score:
        dotProduct(
          queryEmbedding,
          doc.embedding
        ) +

        keywordBoost(
          query,
          doc.text
        ),
    }));

  /* -----------------------------
     SOURCE REINFORCEMENT
  ----------------------------- */

  const sourceScores = {};

  for (const doc of scored) {

    if (!sourceScores[doc.source]) {
      sourceScores[doc.source] = 0;
    }

    sourceScores[doc.source] +=
      doc.score;
  }

  scored =
    scored.map(doc => ({

      ...doc,

      score:
        doc.score +
        sourceScores[
          doc.source
        ] * 0.12,
    }));

  /* -----------------------------
     SORT
  ----------------------------- */

  scored.sort(
    (a, b) =>
      b.score - a.score
  );

  /* -----------------------------
     DIVERSITY SELECTION
  ----------------------------- */

  const selected = [];

  const usedSources =
    new Set();

  for (const doc of scored) {

    // avoid all chunks from one file
    if (
      usedSources.has(doc.source) &&
      selected.length < topK - 1
    ) {
      continue;
    }

    selected.push(doc);

    usedSources.add(doc.source);

    if (selected.length >= topK) {
      break;
    }
  }

  return selected;
}