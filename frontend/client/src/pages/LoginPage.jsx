import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await login(email, password);
      
      // Navigate based on role
      if (email.includes('admin')) {
        navigate('/admin'); // Admin goes to admin panel
      } else {
        navigate('/dashboard'); // Kiosk goes to dashboard
      }
    } catch {
      alert('Login failed. Try admin@tamwilna.com (admin) or any email (kiosk)');
    }
  };

  const quickLogin = (type) => {
    if (type === 'admin') {
      setEmail('admin@tamwilna.com');
      setPassword('admin123');
    } else {
      setEmail('kiosk@example.com');
      setPassword('kiosk123');
    }
  };

  return (
    <div className="page">
      <div className="card">
        <h2>Login</h2>
        
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <button type="submit">Login</button>
        </form>
        
        <div style={{ marginTop: '20px' }}>
          <p>Quick login:</p>
          <button onClick={() => quickLogin('admin')} style={{ marginRight: '10px' }}>
            Login as Admin
          </button>
          <button onClick={() => quickLogin('kiosk')}>
            Login as Kiosk
          </button>
        </div>
      </div>
    </div>
  );
}