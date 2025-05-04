import { Client, Storage, ID } from "appwrite";

class AppwriteService {
  constructor() {
    this.client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT) // Add your endpoint
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID); // Add your project ID
    this.storage = new Storage(this.client);
    this.bucketId = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID;
  }

  async uploadFile(file) {
    try {
      const uploadedFile = await this.storage.createFile(
        this.bucketId,
        ID.unique(),
        file
      );
      if (!uploadedFile) throw new error("file not uploaded to appwrite");

      return {
        success: true,
        uploadedFile,
      };
    } catch (error) {
      console.log("Failed to upload file", error);
      return {
        success: false,
        error: error.message || "Unknown error occurred",
      };
    }
  }

  async getFilePreview(fileId) {
    try {
      const result = this.storage.getFileView(this.bucketId, fileId);
      const downloadedFile = this.storage.getFileDownload(
        this.bucketId,
        fileId
      );
      return {
        success: true,
        result,
        downloadedFile
      };
    } catch (error) {
      console.log("error at getting file preview", error);
      return {
        success: false,
        error: error.message || "unknown error",
      };
    }
  }
}

export const appwriteService = new AppwriteService();
