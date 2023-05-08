import React, { useState } from "react";
import { ChatBubbleLeftEllipsisIcon } from "@heroicons/react/24/outline";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { FaceSmileIcon } from "@heroicons/react/24/outline";

function Script() {
  const [inputText, setInputText] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
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

      console.log(chatHistory);
      setChatHistory([
        ...chatHistory,
        { role: "user", content: inputText },
        { role: "system", content: data.script.content },
      ]);
    } catch (error) {
      console.error("Error:", error);
    }
    setInputText("");
    setIsLoading(false);
  };

  return (
    <div className="script">
      <div className="script-header">
        <h2>Generate Script</h2>
        <p>
          Use this tool to generate chatbot scripts based on your input. Type a
          prompt in the input box and click "Send" to generate a response from
          the chatbot. The conversation history will be displayed below, with
          icons representing user input and chatbot responses. You can copy the
          generated script to your clipboard by clicking the "Copy Script"
          button.
        </p>
      </div>
      <div className="chat-history">
        {chatHistory.map((message, index) => (
          <div className={`message ${message.role}`} key={index}>
            {message.role === "user" ? (
              <UserCircleIcon className="message-icon" />
            ) : (
              <FaceSmileIcon className="message-icon" />
            )}

            <span>{message.content}</span>
          </div>
        ))}
      </div>
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
          {isLoading ? "Generating..." : "Send"}
          <ChatBubbleLeftEllipsisIcon className="generate-icon" />
        </button>
      </div>
    </div>
  );
}

export default Script;
