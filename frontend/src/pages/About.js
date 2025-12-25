import React from 'react';
import { useNavigate } from 'react-router-dom';
import './About.css';

const About = ({ isAuthenticated }) => {
  const navigate = useNavigate();

  return (
    <div className="about-page">
      <header className="about-header">
        <button className="about-home" onClick={() => navigate('/dashboard')}>Home</button>
        <h1>About Newsly</h1>
        <p>
          We are a modern news companion built for speed, clarity, and trust. Our dashboard blends
          top headlines, regional coverage, and e-papers so you can stay informed in one place.
        </p>
      </header>

      <section className="about-section">
        <h2 className="section-title">What we offer</h2>
        <div className="about-row">
          <div className="text-box">
            <h3>Fast, reliable news</h3>
            <p>
              Curated headlines refreshed frequently so you see what matters first. No clutter, no noise.
            </p>
            <ul>
              <li>Top headlines powered by trusted sources</li>
              <li>Regional news and e-papers in one view</li>
              <li>Built for mobile and desktop</li>
            </ul>
          </div>
          <div className="image-box">
            <img src="https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1200&q=80" alt="News dashboard" />
          </div>
        </div>
      </section>

      <section className="about-section alt">
        <h2 className="section-title">Why users choose us</h2>
        <div className="about-row">
          <div className="image-box">
            <img src="https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80" alt="Reading news" />
          </div>
          <div className="text-box">
            <h3>Clarity and convenience</h3>
            <p>
              No more jumping between apps. We keep your headlines, local editions, and e-papers together.
            </p>
            <ul>
              <li>Clean reading experience with fewer ads</li>
              <li>Smart navigation between Home, Dashboard, and E-papers</li>
              <li>Privacy-first: your account stays secure</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="contact-cta">
        <h3>Have feedback or ideas?</h3>
        <p>We are continuously improving. Tell us what features you want to see next.</p>
        {isAuthenticated ? (
          <button className="cta-btn" onClick={() => navigate('/dashboard')}>Go to dashboard</button>
        ) : (
          <button className="cta-btn" onClick={() => navigate('/contact')}>Contact us</button>
        )}
      </section>
    </div>
  );
};

export default About;
