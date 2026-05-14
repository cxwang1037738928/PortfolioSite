// lib/search.js

export function dotProduct(a, b) {

  let sum = 0;

  for (let i = 0; i < a.length; i++) {
    sum += a[i] * b[i];
  }

  return sum;
}

// counts the number of query words that appear in the document text and adds a small boost to the score for each hit
function rerank(query, docs) {

  const queryWords = query
    .toLowerCase()
    .split(/\W+/)
    .filter(Boolean);

  return docs.map(doc => {

    const text = doc.text.toLowerCase();

    let keywordHits = 0;

    for (const word of queryWords) {
      if (text.includes(word)) {
        keywordHits++;
      }
    }

    return {
      ...doc,

      rerankScore:
        doc.score + keywordHits * 0.03,
    };

  }).sort(
    (a, b) =>
      b.rerankScore - a.rerankScore
  );
}

export function searchDocuments(
  query,
  queryEmbedding,
  documents,
  topK = 3,
  minScore = 0.35 // added the minimum score threshold
) {

  const scored = documents
    .map(doc => ({
      ...doc,

      score: dotProduct(
        queryEmbedding,
        doc.embedding
      ),
    }))
    .filter(doc => doc.score >= minScore);

  const reranked = rerank(query, scored);

  return reranked.slice(0, topK);
}