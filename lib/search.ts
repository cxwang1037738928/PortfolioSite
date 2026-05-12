// perfroms dot product search on the document embeddings to find the most relevant documents for a given query embedding

export function dotProduct(
  a: number[],
  b: number[]
) {

  let sum = 0;

  for (let i = 0; i < a.length; i++) {
    sum += a[i] * b[i];
  }

  return sum;
}

export function searchDocuments(
  queryEmbedding: number[],
  documents: any[],
  topK = 5
) {

  const scored = documents.map(doc => ({
    ...doc,
    score: dotProduct(
      queryEmbedding,
      doc.embedding
    ),
  }));

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, topK);
}