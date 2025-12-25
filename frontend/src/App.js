import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import Epapers from './pages/Epapers';
import ViewPaper from './pages/ViewPaper';
import RegionalNews from './pages/RegionalNews';
import About from './pages/About';
import Contact from './pages/Contact';
import './App.css';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading-page">Loading...</div>;
  }

  return user ? children : <Navigate to="/signin" />;
}

function AppRoutes() {
  const { user, loading } = useAuth();
  const isAuthenticated = !!user;

  if (loading) {
    return <div className="loading-page">Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/epaper"
        element={
          <ProtectedRoute>
            <Epapers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/epaper/:paperId"
        element={
          <ProtectedRoute>
            <ViewPaper />
          </ProtectedRoute>
        }
      />
      <Route
        path="/regional-news"
        element={
          <ProtectedRoute>
            <RegionalNews />
          </ProtectedRoute>
        }
      />
      <Route path="/about" element={<About isAuthenticated={isAuthenticated} />} />
      <Route path="/contact" element={<Contact isAuthenticated={isAuthenticated} />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
