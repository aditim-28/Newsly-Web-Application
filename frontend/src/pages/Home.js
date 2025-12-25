import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api, { subscribeNewsStream } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Home.css';

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds = 1 minute
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // Timer for non-authenticated users
  useEffect(() => {
    if (!user) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            navigate('/signin');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Show prompt at 30 seconds
      const promptTimer = setTimeout(() => {
        setShowLoginPrompt(true);
      }, 30000);

      return () => {
        clearInterval(timer);
        clearTimeout(promptTimer);
      };
    }
  }, [user, navigate]);

  useEffect(() => {
    fetchHeadlines();
    // Subscribe to realtime stream and update articles as events arrive
    const unsubscribe = subscribeNewsStream(
      (payload) => {
        if (Array.isArray(payload?.articles)) {
          setArticles(payload.articles);
        }
      },
      (err) => {
        console.warn('Realtime stream error', err);
      }
    );
    return () => {
      unsubscribe?.();
    };
  }, []);

  const fetchHeadlines = async () => {
    try {
      setLoading(true);
      const response = await api.get('/news/headlines');
      setArticles(response.data.articles || []);
      setError('');
    } catch (err) {
      console.error('Error fetching headlines:', err);
      setError('Failed to load news articles');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="home-page">
      <Navbar />
      
      {/* Timer Banner for non-authenticated users */}
      {!user && (
        <div className="timer-banner">
          <div className="timer-content">
            <span className="timer-icon">⏱️</span>
            <span className="timer-text">
              Time remaining to browse: <strong>{formatTime(timeLeft)}</strong>
            </span>
            <button className="timer-signin-btn" onClick={() => navigate('/signin')}>
              Sign In Now
            </button>
          </div>
        </div>
      )}

      {/* Login Prompt Modal */}
      {showLoginPrompt && !user && (
        <div className="login-prompt-overlay">
          <div className="login-prompt-modal">
            <h3>🔒 Sign In Required</h3>
            <p>Your preview time is ending soon. Sign in to continue reading unlimited news!</p>
            <div className="prompt-buttons">
              <button className="btn btn-primary" onClick={() => navigate('/signin')}>
                Sign In
              </button>
              <button className="btn btn-secondary" onClick={() => navigate('/signup')}>
                Create Account
              </button>
            </div>
            <button className="close-prompt" onClick={() => setShowLoginPrompt(false)}>×</button>
          </div>
        </div>
      )}
      
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Welcome to Newsly</h1>
          <p className="hero-subtitle">Read news from across India in your preferred language</p>
          {!user && (
            <p className="hero-notice">👋 Browsing as guest - Sign in for unlimited access!</p>
          )}
          <div className="hero-buttons">
            {user ? (
              <>
                <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
                  Go to Dashboard
                </button>
                <button className="btn btn-secondary" onClick={() => navigate('/regional-news')}>
                  Regional News
                </button>
                <button className="btn btn-secondary" onClick={() => navigate('/epaper')}>
                  E-papers
                </button>
              </>
            ) : (
              <>
                <button className="btn btn-primary" onClick={() => navigate('/signin')}>
                  Sign In to Access
                </button>
                <button className="btn btn-secondary" onClick={() => navigate('/signup')}>
                  Create Account
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Latest News Section */}
      <div className="news-section">
        <div className="container">
          <h2 className="section-title">Latest Headlines</h2>
          
          {loading && (
            <div className="loading-message">Loading latest news...</div>
          )}
          
          {error && (
            <div className="error-message">{error}</div>
          )}
          
          {!loading && !error && articles.length > 0 && (
            <div className="news-grid">
              {articles.map((article, index) => (
                <div key={index} className="news-card">
                  {article.image && (
                    <div className="news-image">
                      <img src={article.image} alt={article.title} />
                    </div>
                  )}
                  <div className="news-content">
                    <div className="news-meta">
                      <span className="news-source">{article.source?.name || 'News Source'}</span>
                      <span className="news-date">{formatDate(article.publishedAt)}</span>
                    </div>
                    <h3 className="news-title">{article.title}</h3>
                    <p className="news-description">{article.description}</p>
                    <a 
                      href={article.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="news-link"
                    >
                      Read More →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="features-section">
        <div className="container">
          <h2>Why Choose Newsly?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📰</div>
              <h3>Multiple Languages</h3>
              <p>Read news in Hindi, Marathi, Tamil, Telugu, and more regional languages</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🗞️</div>
              <h3>Daily E-papers</h3>
              <p>Access the latest editions of newspapers from major cities</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌍</div>
              <h3>Regional Focus</h3>
              <p>Get news specific to your region with local insights</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Fast & Reliable</h3>
              <p>Quick loading times and reliable access to news sources</p>
            </div>
          </div>
        </div>
      </div>

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h4>Newsly</h4>
              <p>Your daily news companion in your language</p>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                <li><a href="#about">About Us</a></li>
                <li><a href="#contact">Contact Us</a></li>
                <li><a href="#privacy">Privacy Policy</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Follow Us</h4>
              <div className="social-links">
                <a href="#facebook">Facebook</a>
                <a href="#twitter">Twitter</a>
                <a href="#instagram">Instagram</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 Newsly. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
