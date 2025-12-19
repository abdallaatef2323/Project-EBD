import { NavLink, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <h2 className="logo">Tamwilna</h2>

      {user && (
        <div className="nav-links">
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/products">Products</NavLink>
          <NavLink to="/cart">Cart</NavLink>
          <NavLink to="/orders">Orders</NavLink>
          <NavLink to="/profile">Profile</NavLink>
          
          {/* ADMIN ONLY: Link to Admin Dashboard */}
          {user.role === 'admin' && (
            <NavLink to="/admin">Admin Panel</NavLink>
          )}
        </div>
      )}

      {user ? (
        <div className="user-info">
          <span style={{ marginRight: '15px' }}>
            {user.email} <strong>({user.role})</strong>
          </span>
          <button onClick={handleLogout} className="btn-logout">Logout</button>
        </div>
      ) : (
        <NavLink to="/" className="btn-login">Login</NavLink>
      )}
    </nav>
  );
}