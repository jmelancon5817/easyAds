import React, { useState, useEffect } from "react";
import { ChatBubbleLeftEllipsisIcon } from "@heroicons/react/24/outline";

function Script() {
  const [inputText, setInputText] = useState("");
  const [generatedScript, setGeneratedScript] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const API_ENDPOINT = "http://localhost:8080/generateScript";

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handleGenerateScript = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: inputText,
          max_tokens: 100,
          temperature: 0.7,
        }),
      });
      const data = await response.json();
      setGeneratedScript(data.generatedScript);
    } catch (error) {
      console.error("Error:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    setGeneratedScript("");
  }, [inputText]);

  return (
    <div className="script">
      <div className="input-container">
        <textarea
          className="input-textarea"
          placeholder="Enter your input text..."
          value={inputText}
          onChange={handleInputChange}
        />
        <button
          className="generate-button"
          onClick={handleGenerateScript}
          disabled={!inputText || isLoading}
        >
          {isLoading ? "Generating..." : "Generate Script"}
          <ChatBubbleLeftEllipsisIcon className="generate-icon" />
        </button>
      </div>
      <div className="output-container">
        {generatedScript && (
          <div className="generated-script">
            <h3>Generated Script:</h3>
            <pre>{generatedScript}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default Script;
