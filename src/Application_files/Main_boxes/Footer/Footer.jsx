import React from "react";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer-container">
      <ul className="footer-list">
        <li className="footer-item">© {new Date().getFullYear()} Attendance</li>
        <li className="footer-item">Made by Ansh Sharma</li>
        <li className="footer-item">Stay Consistent</li>
      </ul>
    </footer>
  );
}

export default Footer;
