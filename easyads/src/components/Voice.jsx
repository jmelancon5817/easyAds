import { use } from "chai";
import "../syles/voice.css";
import { useState, useEffect, useRef } from "react";
import Media from "./Media";

function Voice() {
  const [text, setText] = useState("");
  const [volume, setVolume] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [voice, setVoice] = useState(0);
  const [selectedVoice, setSelectedVoice] = useState(0);
  const [blobUrl, setBlobUrl] = useState(null);

  const EN_US_VOICES = window.speechSynthesis
    .getVoices()
    .filter((voice) => voice.lang.startsWith("en-US"));

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.volume = volume;
    utterance.pitch = pitch;
    utterance.voice = voice;
    console.log(utterance);
    speechSynthesis.speak(utterance);
  };
  const handleSpeakEnd = () => {
    const spokenText = speechSynthesis.pendingUtterance.text;
    setText((prevText) => prevText + spokenText);
  };

  useEffect(() => {
    // Listen for the end of speech event to capture the spoken text
    speechSynthesis.addEventListener("end", handleSpeakEnd);

    // Update the available voices whenever they change
    speechSynthesis.addEventListener("voiceschanged", handleVoiceChange);

    // Set the initial value of the voice state
    const voices = speechSynthesis.getVoices().filter((voice) => {
      return voice.lang.startsWith("en-US");
    });
    setVoice(voices[0]);

    // Remove the event listeners when the component unmounts
    return () => {
      speechSynthesis.removeEventListener("end", handleSpeakEnd);
      speechSynthesis.removeEventListener("voiceschanged", handleVoiceChange);
    };
  }, []);

  const handleVolumeChange = (e) => {
    setVolume(parseFloat(e.target.value));
  };

  const handlePitchChange = (e) => {
    setPitch(parseFloat(e.target.value));
  };

  const handleGenerate = () => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.volume = volume;
    utterance.pitch = pitch;
    utterance.voice = voice;

    const mediaRecorder = new MediaRecorder(new MediaStream());
    let audioChunks = [];

    mediaRecorder.addEventListener("dataavailable", (event) => {
      audioChunks.push(event.data);
    });

    mediaRecorder.addEventListener("stop", async () => {
      const audioBlob = new Blob(audioChunks);
      const blobUrl = URL.createObjectURL(audioBlob);

      const audio = new Audio(blobUrl);
      const response = await fetch(blobUrl);
      const audioData = await response.blob();

      const reader = new FileReader();
      reader.readAsDataURL(audioData);
      reader.onloadend = () => {
        const base64data = reader.result;
        const audioUrl = `data:audio/mp3;base64,${base64data.split(",")[1]}`;
        setBlobUrl(audioUrl);
      };
    });

    mediaRecorder.start();
    window.speechSynthesis.speak(utterance);

    setTimeout(() => {
      window.speechSynthesis.cancel();
      mediaRecorder.stop();
    }, 5000);
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = "generated-audio.mp3";
    link.click();
  };

  const handleVoiceChange = (e) => {
    const index = e.target.value;
    const selectedVoice = EN_US_VOICES[index];
    setSelectedVoice(index);
    setVoice(selectedVoice);
    console.log(index);
  };
  return (
    <div className="voice" id="voice-section">
      <h2>Voice Training</h2>
      <p>
        Click the "Speak" button to listen to the example ad, and read it aloud
        to train the voice model.
      </p>
      <div className="voice-select">
        <label htmlFor="voice-select">Voice: </label>
        <select
          id="voice-select"
          value={selectedVoice}
          onChange={handleVoiceChange}
        >
          {EN_US_VOICES.map((voice, index) => (
            <option value={index} key={voice.name}>
              {voice.name}
            </option>
          ))}
        </select>
      </div>
      <textarea value={text} onChange={(e) => setText(e.target.value)} />
      <div className="voice-settings">
        <div className="setting">
          <label>Volume:</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={handleVolumeChange}
          />
        </div>
        <div className="setting">
          <label>Pitch:</label>
          <input
            type="range"
            min="0.1"
            max="2"
            step="0.1"
            value={pitch}
            onChange={handlePitchChange}
          />
        </div>
      </div>
      <div className="voice-btns">
        <button className="btn" onClick={() => speak(text)}>
          Speak
        </button>
        <button className="btn" onClick={handleGenerate}>
          Generate
        </button>
      </div>
      {blobUrl && (
        <div>
          <audio controls src={blobUrl}></audio>
          <button className="btn" onClick={handleDownload}>
            Download
          </button>
        </div>
      )}
      <div>
        <Media />
      </div>
    </div>
  );
}

export default Voice;
