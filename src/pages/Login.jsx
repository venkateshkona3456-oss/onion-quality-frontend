import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
function Login({ onLogin }) {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:8080/api/auth/login', form);
      localStorage.setItem('onionUser', JSON.stringify(res.data));
      onLogin(res.data);
      navigate('/dashboard');
    } catch (err) {
      setError('Username లేదా password తప్పు.');
    }
  };
  const handleGoogleSuccess = (credentialResponse) => {
  const decoded = jwtDecode(credentialResponse.credential);
  const googleUser = {
    username: decoded.email,
    fullName: decoded.name,
  };
  localStorage.setItem('onionUser', JSON.stringify(googleUser));
  onLogin(googleUser);
  navigate('/dashboard');
};

  return (
    <div className="login-shell">
      <div className="login-card">
        <div className="login-icon">🧅</div>
        <h1>Onion Quality AI</h1>
        <p className="subtitle">Smart Quality Assessment for Transparent Onion Procurement</p>
        <form onSubmit={handleSubmit} className="form" style={{ marginTop: 20 }}>
          <label>
            Username
            <input name="username" value={form.username} onChange={handleChange} required />
          </label>
          <label>
            Password
            <input name="password" type="password" value={form.password} onChange={handleChange} required />
          </label>
          {error && <p className="error">{error}</p>}
          <button type="submit" className="btn-primary">Login to Procurement Portal</button>
        </form>
        <div style={{ margin: '16px 0', textAlign: 'center', color: '#8A6D3B', fontSize: 13 }}>or</div>
<div style={{ display: 'flex', justifyContent: 'center' }}>
  <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => setError('Google login విఫలమైంది.')} />
</div>
        
      </div>
      
    </div>
  );
}

export default Login;