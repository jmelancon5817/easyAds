import { useState, useEffect } from "react";

function Voice() {
  const [text, setText] = useState("");

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
  };

  const handleSpeakEnd = () => {
    const spokenText = speechSynthesis.pendingUtterance.text;
    setText((prevText) => prevText + spokenText);
  };

  useEffect(() => {
    // Call the speak function to play the first example ad
    speak("Example ad text goes here");

    // Listen for the end of speech event to capture the spoken text
    speechSynthesis.addEventListener("end", handleSpeakEnd);

    // Remove the event listener when the component unmounts
    return () => {
      speechSynthesis.removeEventListener("end", handleSpeakEnd);
    };
  }, []);

  return (
    <div className="voice">
      <h2>Voice Training</h2>
      <p>
        Click the "Speak" button to listen to the example ad, and read it aloud
        to train the voice model.
      </p>
      <button onClick={() => speak(text)}>Speak</button>
      <p>You have read the following text:</p>
      <textarea value={text} onChange={(e) => setText(e.target.value)} />
    </div>
  );
}

export default Voice;
