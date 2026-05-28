// lib/embedQuery.js
// don't load the extract until the user calls the function to avoid unnecessary loading and memory usage
let extractor = null;

function expandQuery(query) {

  const q = query.toLowerCase();
  // extremely basic query expansion
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
        quantized: true, // use the small version of the model since this is being ran in the browser
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