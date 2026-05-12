let extractor = null;

export async function embedQuery(text) {

  if (!extractor) {

    const transformers =
      await import("@xenova/transformers");

    // IMPORTANT FIXES
    transformers.env.allowLocalModels = false;

    transformers.env.useBrowserCache = false;

    extractor = await transformers.pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2",
      {
        quantized: true,
        revision: "main",           // explicit revision
        cache_dir: undefined,       // use default browser cache
      }
    );
  }

  const output = await extractor(text, {
    pooling: "mean",
    normalize: true,
  });

  return Array.from(output.data);
}