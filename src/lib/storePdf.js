import { appwriteService } from "@/appwrite/app";
export const storePdf = async (file) => {
  try {
    //upload the file to appwrite
    const response = await appwriteService.uploadFile(file);
    console.log(response.uploadedFile);

    // extract the url pdf_file.href
    const pdf_file = await appwriteService.getFilePreview(
      response.uploadedFile.$id
    );
    console.log("pdf_file from appwrite: ", pdf_file);
    const pdfUrl = pdf_file.result.href;
    return pdfUrl;
    
  } catch (error) {
    console.log("error from store pdf", error);
    return {
      success: false,
      error: error.message || "unknwon error",
    };
  }
};
