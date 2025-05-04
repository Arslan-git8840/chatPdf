import {
  Document,
  RecursiveCharacterTextSplitter,
} from "@pinecone-database/doc-splitter";

export async function PrepareDoc(doc) {
  let { pageContent, metadata } = doc;
  pageContent = pageContent.replace(/\n/g, "");

  // split the doc and make segments
  const splitter = new RecursiveCharacterTextSplitter();

  const truncateStringByBytes = async (str, bytes) => {
    const enc = new TextEncoder();
    return new TextDecoder("utf-8").decode(enc.encode(str).slice(0, bytes));
  };

  const docs = await splitter.splitDocuments([
    new Document({
      pageContent,
      metadata: {
        pageNumber: metadata.loc.pageNumber,
        text: truncateStringByBytes(pageContent, 36000),
      },
    }),
  ]);

  console.log("splitted docs:", docs); // only one []

  return docs; // returning only one []
}
