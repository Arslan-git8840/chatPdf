import { Pinecone } from "@pinecone-database/pinecone";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { embeddings } = await req.json();

  if (!embeddings || !Array.isArray(embeddings)) {
    throw new Error("Embeddings array is required");
  }

  try {
    const api_key = process.env.PINECONE_API_KEY;
    if (!api_key) throw new error("pinecone api key not found");

    const client = new Pinecone({
      apiKey: api_key,
    });

    const index = await client.Index("chatpdf");

    const queryResult = await index.namespace("ns1").query({
      topK: 5,
      vector: embeddings,
      includeMetadata: true,
    });
    console.log(queryResult);
    return NextResponse.json({ result: queryResult.matches || [] });
  } catch (error) {
    console.log("error from pinecone", error);
  }
}
