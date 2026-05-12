export function dotProduct(a, b) {

  let sum = 0;

  for (let i = 0; i < a.length; i++) {
    sum += a[i] * b[i];
  }

  return sum;
}

export function searchDocuments(
  queryEmbedding,
  documents,
  topK = 5
) {

  const scored = documents.map((doc) => ({
    ...doc,
    score: dotProduct(
      queryEmbedding,
      doc.embedding
    ),
  }));

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, topK);
}