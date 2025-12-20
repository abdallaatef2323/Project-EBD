import { NavLink, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <nav className="navbar">
      <h2 className="logo">Tamwilna</h2>

      <div className="nav-links">
        {user.role === 'kiosk' && (
          <>
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/products">Products</NavLink>
            <NavLink to="/cart">Cart</NavLink>
            <NavLink to="/orders">Orders</NavLink>
            <NavLink to="/profile">Profile</NavLink>
          </>
        )}

        {user.role === 'admin' && (
          <>
            <NavLink to="/products">Products</NavLink>
            <NavLink to="/orders">Orders</NavLink>
            <NavLink to="/admin">Admin</NavLink>
          </>
        )}
      </div>

      <button className="btn-logout" onClick={() => { logout(); navigate('/login'); }}>
        Logout
      </button>
    </nav>
  );
}
