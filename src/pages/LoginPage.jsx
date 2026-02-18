import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import './LoginPage.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.access_token);
      navigate('/todos');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {error && <p className="error-message">{error}</p>}
        <div className="input-group">
          <input 
            className="login-input"
            placeholder="Email" 
            type="email"
            value={email} 
            onChange={e => setEmail(e.target.value)} 
          />
        </div>
        <div className="input-group">
          <input 
            className="login-input"
            placeholder="Password" 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
          />
        </div>
        <button className="login-button" onClick={handleLogin}>Login</button>
        <p className="register-link">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}