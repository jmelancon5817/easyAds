import React from "react";

function Header() {
  return (
    <header className="header">
      <div>
        <h2>EasyAds</h2>
      </div>
      <nav className="navbar">
        <ul className="navbar-nav">
          <li className="nav-item">
            <a href="#" className="nav-link">
              Script
            </a>
          </li>

          <li className="nav-item">
            <a href="#" className="nav-link">
              Voice
            </a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link">
              Demo
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
