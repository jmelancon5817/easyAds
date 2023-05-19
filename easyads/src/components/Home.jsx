import React from "react";
import "../styles/home.css";

function Home() {
  return (
    <div className="home" id="home-section">
      <div className="home-header">
        <h2>Home</h2>
        <p>
          {" "}
          Our goal is to provide you with an easy and convenient way to create
          your podcast ads, giving you more time to focus on what really matters
          - producing great content for your listeners.
        </p>
        <ul>
          <li>EasyAds is a powerful tool designed for content creators.</li>
          <li>
            Effortlessly create custom ads for your podcast via a chatbot.
          </li>
          <li>Train a voice model to handle the ads for you.</li>
          <li>Easily insert them into your episodes.</li>
        </ul>
      </div>
    </div>
  );
}

export default Home;
