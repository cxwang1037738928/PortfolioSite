// lib/embedQuery.js

let extractor = null;

function expandQuery(query) {

  const q = query.toLowerCase();

  // primitive query expansion
  if (
    q.includes("yourself") ||
    q.includes("about you")
  ) {
    return (
      query +
      " biography background projects education"
    );
  }

  return query;
}

export async function embedQuery(text) {

  if (!extractor) {

    const transformers =
      await import("@xenova/transformers");

    transformers.env.allowLocalModels = false;
    transformers.env.useBrowserCache = false; // MUST be false to avoid caching the model in the browser and running out of memory

    extractor = await transformers.pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2",
      {
        quantized: true,
      }
    );
  }

  const expanded = expandQuery(text);

  const output = await extractor(expanded, {
    pooling: "mean",
    normalize: true,
  });

  return Array.from(output.data);
}