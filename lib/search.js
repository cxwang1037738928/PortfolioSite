// lib/search.js

/* ---------------------------------------
   DOT PRODUCT
--------------------------------------- */
// simple dot product function for similarity scoring
// returns a single number representing the similarity between the query embedding and document embedding
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
// similar to type detectin in buildEmbeddings.js
// returns the general direction the query is going in
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
// boost the score of documents that contain exact keywords from the query to improve relevance of results
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
  let candidateDocs = documents; // list of documents to score
  console.log(`candiate docs before type filter: ${candidateDocs}`);
  // attempt to match the query to a type to filter documents before scoring for better relevance and less noise
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
  // adds score field to each document
  // score is the combination between dot product similarity and keyword boosting
  let scored = candidateDocs.map(doc => ({...doc, score:
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
  // important: adds more scores to documents from sources that already have high scoring
  // aggregates scores by source
  const sourceScores = {};
  for (const doc of scored) {
    if (!sourceScores[doc.source]) {
      sourceScores[doc.source] = 0;
    }
    sourceScores[doc.source] +=
      doc.score;
  }
  // add the total source score back to each document score with a small weight to reinforce sources that have multiple relevant chunks
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
  
  // sort by score descending
  // biggest score at scored[0]
  scored.sort(
    (a, b) =>
      b.score - a.score
  );

  /* -----------------------------
     DIVERSITY SELECTION
  ----------------------------- */
  // final chosen documents
  const selected = [];
  for(const doc of scored) {
    selected.push(doc);
    if (selected.length >= topK) {
      break;
    }
  }

  // Deprecated: source diversity resulted in too much hallucination since multiple project descriptions would get combined.
  //   new Set();

  // for (const doc of scored) {
  //   // avoid all chunks from one file
  //   if (usedSources.has(doc.source) && selected.length < topK - 1) {
  //     continue; // skip this document if its source is already used and we still have room to add more documents
  //   }

  //   selected.push(doc);

  //   usedSources.add(doc.source);

  //   if (selected.length >= topK) {
  //     break;
  //   }
  // }

  return selected;
}