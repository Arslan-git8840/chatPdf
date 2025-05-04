import md5 from "md5";
import { pipeline, env } from "@huggingface/transformers";

env.allowLocalModels = false;
export async function EmbeddingDocs(doc) {
  const textt = doc?.pageContent || doc;
  const text = textt.replace(/\n/g, " ");
  const hash = md5(textt);
  try {
    const modelname = "mixedbread-ai/mxbai-embed-large-v1";
    const extractor = await pipeline("feature-extraction", modelname, {
      quantized: false,
    });
    console.log(extractor);
    const output = await extractor(text, {
      pooling: "cls",
    });
    const embeddingsBatch = output.tolist();
    console.log(embeddingsBatch);

    const returnObject = {
      id: hash,
      values: embeddingsBatch[0],
      metadata: {
        // pageNumber: doc.metadata.pageNumber,
        pageNumber: doc?.metadata?.pageNumber ?? null,
        text: text,
      },
    };

    console.log("EmbeddingDocs Return Object:", returnObject); // Added log

    return returnObject;
  } catch (error) {
    console.log("error calling openai embeddings api:", error);
  }
}
