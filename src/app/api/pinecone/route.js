import { Pinecone } from "@pinecone-database/pinecone";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { embeddings } = await req.json();
  console.log("embeddings in pinecone route", embeddings);
  try {
    const api_key = process.env.PINECONE_API_KEY;
    if (!api_key) throw new error("pinecone api key not found");
    const index_name = process.env.PINECONE_INDEX_NAME;
    if (!index_name) throw new error("pinecone index name not found");

    const client = new Pinecone({
      apiKey: api_key,
    });

    const index = await client.Index(index_name);

    console.log("index", index);

    const pineconeResponse = await index.namespace("ns1").upsert(embeddings);
    console.log("pineconeResponse", pineconeResponse);
    return NextResponse.json({ success: true, client, index });
  } catch (error) {
    console.log("error from pinecone", error);
  }
}
