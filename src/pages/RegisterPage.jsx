import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import './RegisterPage.css';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await api.post('/auth/register', { email, password });
      navigate('/login');
    } catch (err) {
      setError('Registration failed. Email may already be taken.');
    }
  };

  
 return (
    <div className="register-page">
      <div className="register-container">
        {error && <p className="error-message">{error}</p>}
        <div className="input-group">
          <input 
            className="register-input"
            placeholder="Email" 
            type="email"
            value={email} 
            onChange={e => setEmail(e.target.value)} 
          />
        </div>
        <div className="input-group">
          <input 
            className="register-input"
            placeholder="Password" 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
          />
        </div>
        <button className="register-button" onClick={handleRegister}>Register</button>
        <p className="Login-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}