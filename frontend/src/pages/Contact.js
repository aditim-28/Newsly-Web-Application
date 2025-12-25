import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Contact.css';

const Contact = ({ isAuthenticated }) => {
  const navigate = useNavigate();
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="contact-page">
      <header className="contact-header">
        <button className="contact-home" onClick={() => navigate('/')}>Home</button>
        <div>
          <h1>Contact Us</h1>
          <p>Questions, feedback, partnership ideas? We would love to hear from you.</p>
        </div>
      </header>

      <section className="contact-section">
        <div className="contact-card">
          <div className="contact-info">
            <h3>Reach us directly</h3>
            <p><strong>Email:</strong> hello@newsly.com</p>
            <p><strong>Phone:</strong> +91 90030 55558</p>
            <p><strong>Office:</strong> 19/1, Buildings Society, Mogappair East, Chennai - 600058</p>
            <div className="contact-pill-row">
              <span className="pill">24/7 support</span>
              <span className="pill">Ad inquiries</span>
              <span className="pill">Press</span>
            </div>
          </div>

          <div className="contact-form-wrapper">
            {submitted ? (
              <div className="contact-success">
                <h3>Message received!</h3>
                <p>Thanks for reaching out. Our team will respond shortly.</p>
                {isAuthenticated ? (
                  <button className="contact-btn" onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
                ) : (
                  <button className="contact-btn" onClick={() => navigate('/signin')}>Sign in</button>
                )}
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="field-row">
                  <label htmlFor="name">Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Your name"
                    value={formState.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="field-row">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formState.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="field-row">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="4"
                    placeholder="How can we help?"
                    value={formState.message}
                    onChange={handleChange}
                    required
                  />
                </div>
                <button type="submit" className="contact-btn">Send message</button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
