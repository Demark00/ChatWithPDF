import axios from "axios";
import FormData from "form-data";
import dotenv from "dotenv";

dotenv.config(); // Ensure env variables are loaded

const pdfMicroserviceURL = process.env.PDF_MICROSERVICE || "http://localhost:8001";

export const extractTextFromPdf = async (buffer: Buffer): Promise<string> => {
  const form = new FormData();
  form.append("file", buffer, {
    filename: "uploaded.pdf",
    contentType: "application/pdf",
  });

  try {
    const response = await axios.post(
      `${pdfMicroserviceURL}/extract-text`,
      form,
      {
        headers: form.getHeaders(),
        maxBodyLength: Infinity,
      }
    );

    return response.data.text;
  } catch (error) {
    console.error("Error calling Python service:", error);
    throw new Error("Failed to extract text from PDF");
  }
};

export const chunkText = (text: string, size: number = 1000): string[] => {
  const chunks = [];
  for (let i = 0; i < text.length; i += size) {
    chunks.push(text.slice(i, i + size));
  }
  return chunks;
};
