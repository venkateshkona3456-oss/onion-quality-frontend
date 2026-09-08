import { useState } from 'react';
import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import NewAssessment from './pages/NewAssessment';
import UploadImage from './pages/UploadImage';
import Report from './pages/Report';
import History from './pages/History';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import './App.css';

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('onionUser');
    return saved ? JSON.parse(saved) : null;
  });

  if (!user) {
    return (
      <BrowserRouter>
        <Login onLogin={setUser} />
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <div className="shell">
        <aside className="sidebar">
          <div className="brand">
            <span className="brand-icon">🧅</span>
            <div>
              <div className="brand-name">Onion Quality AI</div>
              <div className="brand-tag">GOV TECH PORTAL</div>
            </div>
          </div>
          <nav className="side-nav">
            <NavLink to="/dashboard" className="side-link">Dashboard</NavLink>
            <NavLink to="/" end className="side-link">New Assessment</NavLink>
            <NavLink to="/history" className="side-link">History</NavLink>
            <NavLink to="/analytics" className="side-link">Analytics</NavLink>
          </nav>
         <div className="inspector-box">
  <div className="inspector-avatar">
    {(user.fullName || user.username || '?').slice(0, 2).toUpperCase()}
  </div>
  <div>
    <div className="inspector-name">{user.fullName || user.username}</div>
    <div className="inspector-id">Center ID: #ND-402</div>
  </div>
  <button
    onClick={() => { localStorage.removeItem('onionUser'); setUser(null); }}
    className="logout-btn"
  >
    Logout
  </button>
</div>
            
          
        </aside>
        <div className="main-area">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/" element={<NewAssessment />} />
            <Route path="/upload/:id" element={<UploadImage />} />
            <Route path="/report/:id" element={<Report />} />
            <Route path="/history" element={<History />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;