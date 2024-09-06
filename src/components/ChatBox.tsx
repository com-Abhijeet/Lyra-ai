import { GoogleGenerativeAI } from "@google/generative-ai";
import { marked } from "marked";
import { useState, useEffect, useRef } from "react";
import { initializeVoiceRecognition } from "../utils/initializeVoiceRecognition";

const ChatBox = () => {
  const apiKey = import.meta.env.VITE_GOOGLE_AI_API_KEY || "";
  const [history, setHistory] = useState([
    {
      role: "user",
      parts: [{ text: "Hi Lyra, How do i get Started" }],
    },
    {
      role: "model",
      parts: [
        {
          text: "To get started , you could start with entering a prompt below",
        },
      ],
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messageRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [recognition, setRecognition] = useState<any>();
  const [isRecognitionRunning, setIsRecognitionRunning] = useState(false);

  useEffect(() => {
    const recognitionInstance = initializeVoiceRecognition(
      setInput,
      setIsRecognitionRunning
    );
    setRecognition(recognitionInstance);
  }, []);

  useEffect(() => {
    if (!isRecognitionRunning && input.trim() !== "") {
      fetchData();
    }
  }, [isRecognitionRunning]);

  const startVoiceRecognition = () => {
    if (recognition && !isRecognitionRunning) {
      recognition.start();
    }
  };

  const sanitizeHTML = async (html: string) => {
    const rawHTML = await marked(html);
    return rawHTML;
  };

  const fetchData = async () => {
    setLoading(true);
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-pro",
      tools: [
        {
          // codeExecution: {},
        },
      ],
    });

    const Chat = model.startChat({
      generationConfig: { candidateCount: 1 },
      history: history,
    });

    const prompt = input;
    setHistory([
      ...history,
      { role: "user", parts: [{ text: prompt }] },
      { role: "model", parts: [{ text: "Lyra is thinking..." }] },
    ]);
    setInput("");

    try {
      const result = await Chat.sendMessage(prompt);
      // console.log(result);
      const responseText =
        result.response.candidates?.[0]?.content.parts?.[0]?.text; // Extract text from the nested structure with null checks
      if (responseText) {
        const sanitizedText = await sanitizeHTML(responseText);
        setHistory((prevHistory) => [
          ...prevHistory.slice(0, -1),
          { role: "model", parts: [{ text: sanitizedText }] },
        ]);
      }
      console.log(result)
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    history.forEach((message, index) => {
      if (message.role === "model" && messageRefs.current[index]) {
        sanitizeHTML(message.parts.map((part: any) => part.text).join(" "))
          .then((sanitizedText) => {
            messageRefs.current[index]!.innerHTML = sanitizedText; // Non-null assertion operator used here
          })
          .catch((error) => console.error("Error sanitizing HTML:", error));
      }
    });
  }, [history]);

  useEffect(() => {
    // Scroll to the bottom of the chatbox when history changes
    const chatbox = document.querySelector(".chatbox");
    if (chatbox) {
      chatbox.scrollTop = chatbox.scrollHeight;
    }
  }, [history]);

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") {
      fetchData();
    }
  };

  return (
    <div className="container">
      <div className="chatbox">
        <h1 className="header">LYRA - AI</h1>
        <div>
          {history.map((message, index) => (
            <div key={index} className={`message-container ${message.role}`}>
              <div className="avatar">
                {message.role === "model" ? (
                  <img src="/model.png" alt="lyra avatar" />
                ) : (
                  <img src="/user.png" alt="user avatar" />
                )}
              </div>
              <div className="message-box">
                <p>
                  <span ref={(el) => (messageRefs.current[index] = el)}>
                    {message.role !== "model" &&
                      message.parts.map((part: any) => part.text).join(" ")}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="promptbox">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter Your Prompt"
        />
        <button onClick={startVoiceRecognition}>
          {!isRecognitionRunning ? (
            <i className="bi bi-mic promptbox-btn">{""} </i>
          ) : (
            <i className="spinner-border spinner-border-sm promptbox-btn">
              <i className="sr-only"></i>
            </i>
          )}
        </button>
        <button onClick={fetchData} disabled={loading}>
          {!loading ? (
            <i className="bi bi-send promptbox-btn"></i>
          ) : (
            <i className="spinner-border spinner-border-sm promptbox-btn">
              <i className="sr-only"></i>
            </i>
          )}
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
