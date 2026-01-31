import React from "react";
import { Link } from "react-router-dom";
import "./About.css";
import studentsImage from "./assets/students_marking.png";
import logo from "./assets/logo.png";

const About = () => {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-text-content">
              <div className="brand-logo-container">
                <img src={logo} alt="Attendance Tracker Logo" className="brand-logo" />
              </div>
              <span className="badge">Welcome to Attendance Tracker</span>
              <h1 className="hero-title">
                Revolutionizing <br />
                <span className="highlight">Academic Management</span>
              </h1>
              <p className="hero-description">
                The most intuitive way to track your attendance, analyze your progress,
                and stay ahead of your schedule. Built by students, for students.
              </p>
              <div className="hero-actions">
                <Link to="/login" className="btn btn-primary">Join Now</Link>
                <Link to="/signup" className="btn btn-outline">Create Free Account</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Showcase */}
      <section className="experience-section">
        <div className="container">
          <div className="experience-grid">
            <div className="image-wrapper">
              <img src={studentsImage} alt="Students using attendance app" className="main-image" />
              <div className="image-overlay-card">
                <h3>99% Reliability</h3>
                <p>Trusted by thousands every day.</p>
              </div>
            </div>
            <div className="experience-content">
              <h2 className="section-title">Seamless Experience</h2>
              <p className="section-text">
                Gone are the days of manual registers and complex spreadsheets. Our platform
                provides a clean, lightning-fast interface to mark your presence in a single tap.
              </p>
              <ul className="benefit-list">
                <li>
                  <span className="check">✓</span>
                  <span>Instant data synchronization across devices</span>
                </li>
                <li>
                  <span className="check">✓</span>
                  <span>Comprehensive history and trend analysis</span>
                </li>
                <li>
                  <span className="check">✓</span>
                  <span>Smart notifications for low attendance</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="features-section">
        <div className="container">
          <div className="center-header">
            <h2 className="section-title">Everything You Need</h2>
            <p className="section-subtitle">Powerful tools designed to simplify your academic life.</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-box">📊</div>
              <h3>Deep Analytics</h3>
              <p>Visualize your attendance with beautiful charts and percentage breakdowns.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon-box">📅</div>
              <h3>Smart Scheduling</h3>
              <p>Keep track of today's classes and upcoming sessions effortlessly.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon-box">🔄</div>
              <h3>History Management</h3>
              <p>Easily manage and audit your past records with full edit capabilities.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon-box">🔒</div>
              <h3>Enterprise Security</h3>
              <p>Your data is encrypted and stored securely in the cloud.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="container">
          <div className="mission-box">
            <h2 className="section-title">Our Vision</h2>
            <p>
              "To empower every student and educator with the tools they need to stay
              organized, focused, and successful in their academic journey."
            </p>
            <div className="mission-footer">
              <span className="brand-name">Attendance Tracker Team</span>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-box">
            <h2>Ready to transform your routine?</h2>
            <p>Join our growing community and never lose track of a class again.</p>
            <Link to="/login" className="btn btn-primary large">Start Tracking Today</Link>
          </div>
        </div>
      </section>

      <footer className="professional-footer">
        <div className="container">
          <div className="footer-flex">
            <p>© {new Date().getFullYear()} Attendance Tracker. All rights reserved.</p>
            <div className="footer-links">
              <Link to="/">Home</Link>
              <Link to="/login">Join</Link>
              <Link to="/about">About Us</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;
