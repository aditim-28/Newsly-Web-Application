import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { newsService } from '../services/api';
import Navbar from '../components/Navbar';
import './RegionalNews.css';

const DEFAULT_LOCATION = 'maharashtra';

export default function RegionalNews() {
  const [location, setLocation] = useState('');
  const [stateParams, setStateParams] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detecting, setDetecting] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const fetchRegionalNews = useCallback(async (selectedLocation) => {
    try {
      setLoading(true);
      const response = await newsService.getRegionalNews(selectedLocation);
      const stateParams = response.data.stateParams;
      const articles = response.data.articles || [];
      
      setStateParams(stateParams);
      
      if (articles.length > 0) {
        setArticles(articles);
        console.log(`Loaded ${articles.length} articles for ${selectedLocation.toUpperCase()}`);
      } else {
        console.warn(`No articles found for ${selectedLocation}`);
        setArticles([]);
      }
    } catch (err) {
      console.error('Error fetching regional news:', err);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const normalizeState = (name) => {
    if (!name) return DEFAULT_LOCATION;
    const v = name.toLowerCase();
    // map common variants
    if (v.includes('uttar pradesh')) return 'uttar pradesh';
    if (v.includes('madhya pradesh')) return 'madhya pradesh';
    if (v.includes('tamil nadu')) return 'tamil nadu';
    const known = ['maharashtra', 'karnataka', 'tamil nadu', 'telangana', 'andhra pradesh', 'west bengal', 'bihar', 'uttar pradesh', 'madhya pradesh', 'rajasthan', 'punjab', 'haryana', 'delhi', 'kerala', 'goa', 'dhaka'];
    return known.find(s => v.includes(s.split(' ')[0])) || DEFAULT_LOCATION;
  };

  const autoDetectLocation = useCallback(async () => {
    try {
      setDetecting(true);
      setLoading(true);
      // Lightweight IP-based detection
      const resp = await fetch('https://ipapi.co/json/');
      if (resp.ok) {
        const data = await resp.json();
        const detected = normalizeState(data.region || data.region_code || data.city);
        setLocation(detected);
        await fetchRegionalNews(detected);
      } else {
        setLocation(DEFAULT_LOCATION);
        await fetchRegionalNews(DEFAULT_LOCATION);
      }
    } catch (e) {
      setLocation(DEFAULT_LOCATION);
      await fetchRegionalNews(DEFAULT_LOCATION);
    } finally {
      setDetecting(false);
    }
  }, [fetchRegionalNews]);

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }
    autoDetectLocation();
  }, [user, navigate, autoDetectLocation]);

  if (!user) return null;

  return (
    <div className="regional-news-page">
      <Navbar />

      <div className="news-header">
        <h1>Regional News</h1>
        <p>We auto-detect your region and show only local headlines</p>
      </div>

      <div className="news-container">
        <div className="topbar">
          <button className="back-dashboard" onClick={() => navigate('/dashboard')}>
            ← Back to Dashboard
          </button>
        </div>
        <div className="location-banner">
          <div>
            <p className="location-label">Detected Region</p>
            <h3 className="location-value">{location ? location.toUpperCase() : 'Detecting...'}</h3>
            <p className="location-note">Content is limited to your current location.</p>
          </div>
          <button className="detect-btn" onClick={autoDetectLocation} disabled={detecting || loading}>
            {detecting ? 'Detecting…' : 'Refresh location'}
          </button>
        </div>

        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading news...</p>
          </div>
        ) : stateParams ? (
          <div className="news-content">
            <div className="news-info">
              <h2>News for {location.toUpperCase()}</h2>
              <div className="news-details">
                <div className="detail-card">
                  <h3>Language</h3>
                  <p className="language-tag">{stateParams.lang}</p>
                </div>
                <div className="detail-card">
                  <h3>Search Term</h3>
                  <p className="search-term">{stateParams.q}</p>
                </div>
              </div>
              <div className="news-grid">
                {articles && articles.length > 0 ? (
                  articles.map((article, idx) => (
                    <div key={idx} className="news-card">
                      {article.image && (
                        <div className="news-image">
                          <img src={article.image} alt={article.title} onError={(e) => {e.target.style.display = 'none'}} />
                        </div>
                      )}
                      <div className="news-content">
                        <h3>{article.title}</h3>
                        <p>{article.description}</p>
                        <div className="news-meta">
                          <span className="news-source">{article.source?.name || 'News Source'}</span>
                          <span className="news-date">
                            {new Date(article.publishedAt).toLocaleDateString('en-IN', { 
                              day: 'numeric', 
                              month: 'short', 
                              year: 'numeric' 
                            })}
                          </span>
                        </div>
                        <a href={article.url} target="_blank" rel="noopener noreferrer" className="read-more">Read More →</a>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="news-card">
                    <h3>No articles available</h3>
                    <p>Try a different state or refresh.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
