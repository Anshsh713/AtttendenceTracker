import React from "react";
import { Link } from "react-router-dom";
import "./About.css";

export default function About() {
  return (
    <div className="about-container">
      <div className="about-card">
        <h1 className="title">Smart Attendance Manager</h1>

        <p className="subtitle">
          A modern, intuitive, and powerful way to track attendance — built for
          students, teachers, and organizations. Stay organized. Stay ahead.
        </p>

        <div className="button-group">
          <Link to="/login" className="btn btn-light">
            Login
          </Link>

          <Link to="/signup" className="btn btn-dark">
            Create Account
          </Link>
        </div>

        <div className="features">
          <div className="feature-card">
            <h3>📊 Smart Analytics</h3>
            <p>
              Visualize attendance trends and insights with real-time
              dashboards.
            </p>
          </div>

          <div className="feature-card">
            <h3>⚡ Fast & Simple</h3>
            <p>
              Mark attendance in seconds with an intuitive and clean interface.
            </p>
          </div>

          <div className="feature-card">
            <h3>🔐 Secure Access</h3>
            <p>
              Your data is encrypted and protected with secure authentication.
            </p>
          </div>
        </div>

        <p className="footer">
          © {new Date().getFullYear()} Smart Attendance Manager — All Rights
          Reserved
        </p>
      </div>
    </div>
  );
}
