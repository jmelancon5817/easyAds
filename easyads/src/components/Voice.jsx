import "../styles/voice.css";
import React, { useState, useEffect } from "react";

function Voice() {
  const [text, setText] = useState("");
  const [volume, setVolume] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [voice, setVoice] = useState(null);
  const [selectedVoice, setSelectedVoice] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);

  const EN_US_VOICES = window.speechSynthesis
    .getVoices()
    .filter((voice) => voice.lang.startsWith("en-US"));

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.volume = volume;
    utterance.pitch = pitch;
    utterance.voice = voice;

    const mediaStream = new MediaStream();
    const mediaStreamTrack = audioContext.createMediaStreamTrack();
    mediaStream.addTrack(mediaStreamTrack);

    const mediaRecorder = new MediaRecorder(mediaStream);
    let chunks = [];

    mediaRecorder.addEventListener("dataavailable", (event) => {
      chunks.push(event.data);
    });

    mediaRecorder.addEventListener("stop", () => {
      const audioBlob = new Blob(chunks, { type: "audio/mp3" });
      setAudioBlob(audioBlob);

      // Clear the chunks array for future recordings
      chunks = [];
    });

    utterance.addEventListener("start", () => {
      mediaRecorder.start();
    });

    utterance.addEventListener("end", () => {
      mediaRecorder.stop();
    });

    speechSynthesis.speak(utterance);
  };

  const handleSpeakEnd = () => {
    const spokenText = speechSynthesis.pendingUtterance.text;
    setText((prevText) => prevText + spokenText);
  };

  useEffect(() => {
    // Listen for the end of speech event to capture the spoken text
    speechSynthesis.addEventListener("end", handleSpeakEnd);

    // Set the initial value of the voice state
    const voices = speechSynthesis.getVoices().filter((voice) => {
      return voice.lang.startsWith("en-US");
    });
    setVoice(voices[0]);

    // Remove the event listener when the component unmounts
    return () => {
      speechSynthesis.removeEventListener("end", handleSpeakEnd);
    };
  }, []);

  const handleVolumeChange = (e) => {
    setVolume(parseFloat(e.target.value));
  };

  const handlePitchChange = (e) => {
    setPitch(parseFloat(e.target.value));
  };

  const handleDownload = () => {
    const url = URL.createObjectURL(audioBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "generated-audio.mp3";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleVoiceChange = (e) => {
    const index = e.target.value;
    const selectedVoice = EN_US_VOICES[index];
    setSelectedVoice(index);
    setVoice(selectedVoice);
  };

  return (
    <div className="voice">
      <h2>Voice Training</h2>
      <p>
        Click the "Speak" button to listen to the example ad, and read it aloud
        to train the voice model.
      </p>
      <p>Click the "Generate" button to download an mp3 file of the ad read.</p>
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
        <button className="btn" onClick={handleDownload}>
          Generate
        </button>
      </div>
    </div>
  );
}

export default Voice;
