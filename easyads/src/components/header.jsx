import React, { useEffect } from "react";
import "../styles/header.css";

function Header() {
  const scrollToSection = (event, sectionId) => {
    event.preventDefault();
    const section = document.getElementById(sectionId);
    window.scrollTo({
      top: section.offsetTop,
      behavior: "smooth",
    });
  };

  return (
    <header className="header">
      <div>
        <h2>EasyAds</h2>
      </div>
      <nav className="navbar">
        <ul className="navbar-nav">
          <li className="nav-item">
            <a
              href="#home-section"
              className="nav-link"
              onClick={(event) => scrollToSection(event, "home-section")}
            >
              Home
            </a>
          </li>
          <li className="nav-item">
            <a
              href="#script-section"
              className="nav-link"
              onClick={(event) => scrollToSection(event, "script-section")}
            >
              Script
            </a>
          </li>

          <li className="nav-item">
            <a
              href="#voice-section"
              className="nav-link"
              onClick={(event) => scrollToSection(event, "voice-section")}
            >
              Voice
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
