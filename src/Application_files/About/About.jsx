import React from "react";
import { Link } from "react-router-dom";
import "./About.css";

export default function About() {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <span className="badge">Welcome to the Future</span>
          <h1 className="hero-title">
            Smart Attendance, <br />
            <span className="highlight">Simplified.</span>
          </h1>
          <p className="hero-subtitle">
            The ultimate solution for schools, universities, and organizations.
            Track, analyze, and manage attendance with effortless precision.
          </p>
          <div className="cta-group">
            <Link to="/signup" className="btn btn-primary">
              Get Started Free
            </Link>
            <Link to="/login" className="btn btn-outline">
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="mission-container">
          <div className="mission-text">
            <h2>Our Mission</h2>
            <p>
              We believe time is the most valuable asset. By automating
              attendance, we empower educators and managers to focus on what
              truly matters—teaching, mentoring, and leading.
            </p>
          </div>
          <div className="mission-stats">
            <div className="stat-item">
              <h3>10k+</h3>
              <p>Active Users</p>
            </div>
            <div className="stat-item">
              <h3>99.9%</h3>
              <p>Uptime</p>
            </div>
            <div className="stat-item">
              <h3>50+</h3>
              <p>Institutions</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="features-section">
        <div className="features-header">
          <h2>Why Choose Us?</h2>
          <p>Everything you need to manage your team effectively.</p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="icon">📊</div>
            <h3>Real-Time Analytics</h3>
            <p>
              Get instant insights into attendance trends with our powerful,
              easy-to-read dashboards.
            </p>
          </div>
          <div className="feature-card">
            <div className="icon">⚡</div>
            <h3>Lightning Fast</h3>
            <p>
              Mark attendance in seconds with our optimized, One-Tap interface.
              Say goodbye to paperwork.
            </p>
          </div>
          <div className="feature-card">
            <div className="icon">🔒</div>
            <h3>Secure & Private</h3>
            <p>
              Enterprise-grade encryption keeps your data safe. Your privacy is
              our top priority.
            </p>
          </div>
          <div className="feature-card">
            <div className="icon">📱</div>
            <h3>Mobile First</h3>
            <p>
              Access your data from anywhere, on any device. Fully responsive
              and always ready.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bottom-cta">
        <h2>Ready to transform your workflow?</h2>
        <Link to="/signup" className="btn btn-glow">
          Join Us Today
        </Link>
      </section>

      <footer className="about-footer">
        <p>© {new Date().getFullYear()} Smart Attendance Manager. Built for efficiency.</p>
      </footer>
    </div>
  );
}
