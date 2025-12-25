import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { signin } = useAuth();

  useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Both email and password are required!');
      return;
    }

    try {
      console.log('Attempting signin with:', email);
      await signin(email, password);
      console.log('Signin successful, navigating to dashboard');
      navigate('/dashboard');
    } catch (err) {
      console.error('Signin error:', err);
      const errorMessage = err.response?.data?.error || err.message || 'Signin failed. Please try again.';
      setError(errorMessage);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box signin-box">
        <div className="auth-header">
          <div className="logo-large">📰</div>
          <h2>Welcome to Newsly</h2>
          <p>Sign in to your account</p>
        </div>

        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="password-input-group">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <button type="submit" className="auth-btn">Sign In</button>
        </form>

        <div className="auth-footer">
          <p>Don't have an account? <button className="link-btn" onClick={() => navigate('/signup')}>Sign Up</button></p>
        </div>
      </div>
    </div>
  );
}
