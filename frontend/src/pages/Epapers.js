import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { epaperService } from '../services/api';
import Navbar from '../components/Navbar';
import './Epapers.css';

export default function Epapers() {
  const [epapers, setEpapers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }

    fetchEpapers();
  }, [user, navigate]);

  const fetchEpapers = async () => {
    try {
      setLoading(true);
      const response = await epaperService.getAllEpapers();
      setEpapers(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load epapers');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="epapers-page">
      <Navbar />

      <div className="navbar-epapers">
        <div className="navbar-header">
          <h1 className="navbar-title">Browse E-Papers</h1>
          <p className="subtext">Choose your favorite newspaper to read today</p>
        </div>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading e-papers...</p>
        </div>
      ) : (
        <div className="section-box">
          <div className="topbar">
            <button className="back-dashboard" onClick={() => navigate('/dashboard')}>
              ← Back to Dashboard
            </button>
          </div>
          <h2 className="section-heading">Featured E-Papers</h2>
          <div className="grid">
            {Object.values(epapers).map((paper) => (
              <div
                key={paper.id}
                className="card"
                onClick={() => navigate(`/epaper/${paper.id}`)}
              >
                <div className="card-image">
                  <img 
                    src={`${process.env.PUBLIC_URL}${paper.image}`}
                    alt={paper.name} 
                    style={{width: '100%', height: '100%', objectFit: 'cover'}}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y1ZjVmNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iNDAiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7wn5OwPC90ZXh0Pjwvc3ZnPg==';
                    }}
                  />
                </div>
                <h3 className="card-title">{paper.name}</h3>
                <p className="card-language">{paper.language}</p>
                <button className="card-btn">Read Now</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
