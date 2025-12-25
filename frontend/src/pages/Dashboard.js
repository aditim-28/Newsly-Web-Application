import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { newsService } from '../services/api';
import './Dashboard.css';

const fallbackArticles = [
  {
    title: 'India at a glance: key stories today',
    description: 'Top developments across business, tech, politics, and sports to keep you informed quickly.',
    url: 'https://newsly.example.com/today',
    image: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=900&q=80',
    publishedAt: new Date().toISOString(),
    source: { name: 'Newsly Brief' }
  },
  {
    title: 'Markets and startups: what moved',
    description: 'A concise wrap of market moves, funding rounds, and startup launches across India.',
    url: 'https://newsly.example.com/markets',
    image: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=900&q=80',
    publishedAt: new Date().toISOString(),
    source: { name: 'Newsly Markets' }
  },
  {
    title: 'Tech and science roundup',
    description: 'Product launches, research highlights, and policy shifts shaping the tech landscape.',
    url: 'https://newsly.example.com/tech',
    image: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=900&q=80',
    publishedAt: new Date().toISOString(),
    source: { name: 'Newsly Tech' }
  }
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [location, setLocation] = useState('Detecting location...');
  const [dateTime, setDateTime] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Top Stories');

  useEffect(() => {
    // Format date/time once on load
    const now = new Date();
    const formatted = now.toLocaleString('en-IN', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    setDateTime(formatted);

    // Lightweight IP-based location lookup
    const detect = async () => {
      try {
        const resp = await fetch('https://ipapi.co/json/');
        if (resp.ok) {
          const data = await resp.json();
          const city = data.city || '';
          const region = data.region || '';
          const country = data.country_name || '';
          const label = [city, region, country].filter(Boolean).join(', ');
          setLocation(label || 'India');
        } else {
          setLocation('India');
        }
      } catch (e) {
        setLocation('India');
      }
    };
    detect();
  }, []);

  useEffect(() => {
    fetchHeadlines();
  }, []);

  const fetchHeadlines = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await newsService.getHeadlines();
      const incoming = response.data.articles || [];
      if (incoming.length > 0) {
        setArticles(incoming);
        setError('');
      } else {
        setArticles(fallbackArticles);
        setError('Unable to fetch live headlines. Showing cached news instead.');
      }
    } catch (err) {
      console.error('Error fetching headlines:', err);
      setArticles(fallbackArticles);
      const status = err?.response?.status;
      if (status === 403) {
        setError('API Key Issue: Please verify your GNews API key is active and properly configured.');
      } else if (status === 429) {
        setError('Rate limit reached. Showing cached headlines.');
      } else {
        setError('Unable to fetch live news. Showing cached headlines instead.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchHeadlines();
      setSelectedCategory('Top Stories');
      return;
    }
    try {
      setLoading(true);
      setError('');
      setSelectedCategory('');
      const resp = await newsService.searchNews(searchQuery.trim());
      const incoming = resp.data.articles || [];
      setArticles(incoming.length ? incoming : fallbackArticles);
      if (!incoming.length) {
        setError('No results found, showing fallback headlines.');
      }
    } catch (err) {
      setArticles(fallbackArticles);
      setError('Search unavailable right now. Showing fallback headlines.');
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = async (label) => {
    const topic = label.toLowerCase();
    setSelectedCategory(label);
    setSearchQuery('');
    if (topic === 'top stories') {
      fetchHeadlines();
      return;
    }
    try {
      setLoading(true);
      setError('');
      const resp = await newsService.getCategoryNews(topic);
      const incoming = resp.data.articles || [];
      setArticles(incoming.length ? incoming : fallbackArticles);
      if (!incoming.length) {
        setError('Category feed unavailable, showing fallback headlines.');
      }
    } catch (err) {
      setArticles(fallbackArticles);
      setError('Category feed unavailable, showing fallback headlines.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/signin');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  return (
    <div className="dashboard-page">
      <header className="top-strip">
        <div className="top-left">{dateTime}</div>
        <div className="top-right">{location}</div>
      </header>

      <nav className="primary-nav">
        <div className="nav-left" onClick={() => navigate('/dashboard')}>
          <span className="logo-mark">📰</span>
          <span className="logo-text">Newsly</span>
        </div>

        <div className="nav-center">
          <div className="search-wrapper">
            <form className="search-form" onSubmit={handleSearchSubmit}>
              <input
                className="search-input"
                placeholder="Search news..."
                aria-label="Search news"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="search-button">Search</button>
            </form>
          </div>
          <div className="pill-row">
            {['Top Stories', 'Business', 'Sports', 'Entertainment', 'Technology', 'Health', 'World'].map((pill) => (
              <button
                key={pill}
                className={`pill ${selectedCategory === pill ? 'active' : ''}`}
                onClick={() => handleCategorySelect(pill)}
                type="button"
              >
                {pill}
              </button>
            ))}
          </div>
        </div>

        <div className="nav-right">
          <button className="ghost-btn" onClick={() => navigate('/regional-news')}>Regional News</button>
          <button className="ghost-btn" onClick={() => navigate('/epaper')}>E-Paper</button>
          <button className="ghost-btn" onClick={() => navigate('/about')}>About Us</button>
          <button className="ghost-btn" onClick={() => navigate('/contact')}>Contact Us</button>
          <button className="primary-btn" onClick={handleLogout}>Sign Out</button>
        </div>
      </nav>

      <section className="hero-panel">
        <h1>Welcome to Newsly</h1>
        <p>Your trusted source for the latest news and updates</p>
        {error && (
          <div className="alert">
            <div className="alert-title">⚠️ API Key Issue</div>
            <p className="alert-body">{error}</p>
            <button className="retry-btn" onClick={fetchHeadlines}>Retry</button>
          </div>
        )}
      </section>

      {/* News Section */}
      <div className="news-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Latest Headlines</h2>
            <button className="refresh-btn" onClick={fetchHeadlines}>
              🔄 Refresh
            </button>
          </div>
          
          {loading && (
            <div className="loading-message">
              <div className="spinner"></div>
              <p>Loading latest news...</p>
            </div>
          )}
          
          {!loading && articles.length > 0 && (
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
                      Read Full Article →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && !error && articles.length === 0 && (
            <div className="no-news-message">
              <p>No news articles available at the moment.</p>
              <button onClick={fetchHeadlines} className="retry-btn">Try Again</button>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="dashboard-footer">
        <div className="container">
          <p>&copy; 2024 Newsly. All rights reserved.</p>
          <div className="footer-links">
            <button onClick={() => navigate('/about')} style={{background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', textDecoration: 'underline'}}>About Us</button>
            <button onClick={() => navigate('/contact')} style={{background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', textDecoration: 'underline'}}>Contact Us</button>
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
