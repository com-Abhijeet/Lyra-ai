import axios from "axios";

const GEMINI_API_BASE_URL = "https://api.gemini.com";

export const uploadPDF = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post(`${GEMINI_API_BASE_URL}/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const askQuestion = async (fileId: string, question: string) => {
  const response = await axios.post(`${GEMINI_API_BASE_URL}/ask`, {
    fileId,
    question,
  });

  return response.data;
};
