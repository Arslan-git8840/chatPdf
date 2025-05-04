import { NextResponse } from "next/server";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file"); // Get the file from FormData

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file uploaded" },
        { status: 400 }
      );
    }

    const loader = new PDFLoader(file);
    const pages = await loader.load();
    console.log("Extracted pages:", pages);

    // Return the extracted text or pages as a response
    return NextResponse.json({ success: true, pages });
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
