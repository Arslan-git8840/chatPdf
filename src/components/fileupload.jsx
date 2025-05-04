"use client";
import { Inbox, Loader2 } from "lucide-react";
import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";
import TailwindcssButtons from './ui/button';
import { storePdf } from "@/lib/storePdf";
import axios from "axios";
import { PrepareDoc } from "@/lib/prepareDoc";
import { EmbeddingDocs } from "@/lib/embeddings";

const FileUpload = () => {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null); // Store a single file object

  const onDrop = useCallback((acceptedFiles) => {
    console.log("Files dropped:", acceptedFiles);
    if (acceptedFiles.length === 0) {
      console.log("No file accepted.");
      return;
    }

    const selectedFile = acceptedFiles[0];
    setFile(selectedFile);

    console.log("File details:", selectedFile);

    if (selectedFile.size > 10 * 1024 * 1024) {
      console.error("File too large");
      return;
    }

    setUploading(false);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
  });


  const uploadFile = async () => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      // 1.store into appwrite
      console.log("Step 1: Storing PDF");
      const response = await storePdf(file);
      console.log(response);

      // 2.ExtractTextFromPdf
      console.log("Step 2: Extracting text from PDF");
      const res = await axios.post("/api/langchain", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        }
      });
      console.log("Langchain response:", res.data.pages);

      const pages = res.data.pages;
      // 3.split and segment the pdf into pages 
      // const documents = await Promise.all(pages.map((page) => PrepareDoc(page)))
      //or
      console.log("Step 3: Preparing documents")
      const documents = await Promise.all(pages.map(PrepareDoc));
      console.log(documents); // [[]]

      // 4. embedding the docs
      // i. flat the documents ii. map them 
      const docs = documents.flat();

      console.log("Step 4: Creating embeddings");
      const embeddings = await Promise.all(docs.map(EmbeddingDocs));

      console.log('embeddings', embeddings)

      // save into pinecone
      console.log("Step 5: Uploading to Pinecone");

      const pineconeresponse = await axios.post('/api/pinecone', { embeddings });

      console.log("Pinecone response:", pineconeresponse);

      console.log("Step 6: Redirecting to chat");
      router.push('/chats')

    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="sm:p-4 p-0 bg-white rounded-xl">
      <div
        {...getRootProps({
          className:
            "border-dashed border-2 w-full rounded-xl cursor-pointer bg-gray-50 py-8 flex justify-center items-center flex-col",
          onDrop: (e) => e.preventDefault(),
        })}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <>
            <Loader2 className="h-10 w-10 text-pink-500 animate-spin" />
            <p className="mt-2 text-sm text-slate-400">Uploading file...</p>
          </>
        ) : (
          <>
            <Inbox className="w-10 h-10 text-pink-500" />
            <p className="mt-2 text-sm text-slate-400">
              {file ? `${file.name}` : "Drag & drop a PDF here or click to select"}
            </p>
          </>
        )}
      </div>
      <div className="flex items-center justify-center mt-4">
        <button onClick={uploadFile}>upload</button>
      </div>
    </div>
  );
};

export default FileUpload;
