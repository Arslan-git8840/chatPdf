"use client";

import React, { useState } from "react";
import { appwriteService } from "@/appwrite/app";

function Page() {
    const [file, setFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState("");

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            setUploadStatus("Please select a file.");
            return;
        }

        setUploadStatus("Uploading...");

        try {
            const response = await appwriteService.uploadFile(file);

            const url = await appwriteService.getFilePreview(response.uploadedFile.$id);
            console.log("file url:", url);
            if (response.success) {
                setUploadStatus("File uploaded successfully!");
                console.log("Uploaded file details:", response.uploadedFile);
            } else {
                setUploadStatus(`Upload failed: ${response.error}`);
            }
        } catch (error) {
            setUploadStatus(`Upload error: ${error.message}`);
        }
    };

    return (
        <div className="p-4">
            <input type="file" onChange={handleFileChange} className="border p-2" />
            <button
                onClick={handleUpload}
                className="bg-blue-500 text-white p-2 rounded ml-2"
            >
                Upload
            </button>
            {uploadStatus && <p className="mt-2 text-sm">{uploadStatus}</p>}
        </div>
    );
}

export default Page;
