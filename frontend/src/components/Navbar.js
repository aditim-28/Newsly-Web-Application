import './Navbar.css';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = async () => {
    await logout();
    navigate('/signin');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality
  };

  return (
    <div>
      <div className="top-navbar">
        <div className="navbar-container">
          <div style={{ textAlign: 'center', fontSize: '0.95rem', color: '#666', width: '100%' }}>
            Stay updated with news from across India in your language
          </div>
        </div>
      </div>

      <nav className="main-navbar">
        <div className="navbar-container">
          <div className="navbar-content">
            <div className="logo-container" onClick={() => navigate('/')}>
              <span className="logo-icon">📰</span>
              <span className="logo-text">Newsly</span>
            </div>

            <form className="search-form" onSubmit={handleSearch}>
              <input
                type="text"
                className="search-box"
                placeholder="Search news..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="search-btn">Search</button>
            </form>

            <div className="nav-links">
              {user && (
                <>
                  <span className="user-greeting">Welcome, {user.name}!</span>
                  <button className="nav-button logout-btn" onClick={handleLogout}>
                    <FiLogOut /> Logout
                  </button>
                </>
              )}
              {!user && (
                <>
                  <button className="nav-button" onClick={() => navigate('/signin')}>
                    Sign In
                  </button>
                  <button className="nav-button signup-btn" onClick={() => navigate('/signup')}>
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
