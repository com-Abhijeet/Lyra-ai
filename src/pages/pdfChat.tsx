import React, { useState } from "react";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const pdfChat = () => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [fileUri, setFileUri] = useState("");
  const apiKey = import.meta.env.VITE_GOOGLE_AI_API_KEY || "";

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const fileManager = new GoogleAIFileManager(apiKey);
      const uploadResponse = await fileManager.uploadFile(file.name, {
        mimeType: file.type,
        displayName: file.name,
      });

      console.log(
        `Uploaded file ${uploadResponse.file.displayName} as: ${uploadResponse.file.uri}`
      );
      setFileUri(uploadResponse.file.uri);
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    if (!fileUri) return;

    setLoading(true);
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const result = await model.generateContent([
        {
          fileData: {
            mimeType: "application/pdf",
            fileUri: fileUri,
          },
        },
        { text: input },
      ]);

      console.log(result.response.text());
    } catch (error) {
      console.error("Error generating content:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="promptbox">
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
        />
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter Your Prompt"
          disabled={loading}
        />
        <button onClick={fetchData} disabled={loading}>
          {!loading ? (
            <i className="bi bi-send"></i>
          ) : (
            <i className="spinner-border spinner-border-sm">
              <i className="sr-only"></i>
            </i>
          )}
        </button>
      </div>
    </div>
  );
};

export default pdfChat;
