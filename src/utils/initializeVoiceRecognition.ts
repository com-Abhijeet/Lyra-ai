// voiceRecognitionHelper.ts
export const initializeVoiceRecognition = (
    setInput: (input: string) => void,
    setIsRecognitionRunning: (isRunning: boolean) => void
  ) => {
    if (!("webkitSpeechRecognition" in window)) {
      console.error("Speech recognition not supported in this browser.");
      return null;
    }
  
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-IN";
  
    recognition.onstart = () => {
      setIsRecognitionRunning(true);
    };
  
    recognition.onend = () => {
      setIsRecognitionRunning(false);
    };
  
    recognition.onresult = (event: { results: { transcript: any; }[][]; }) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };
  
    recognition.onerror = (event: { error: any; }) => {
      console.error("Speech recognition error", event.error);
      setIsRecognitionRunning(false);
    };
  
    return recognition;
  };