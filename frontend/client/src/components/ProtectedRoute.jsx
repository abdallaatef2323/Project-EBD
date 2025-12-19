import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function ProtectedRoute({ children, role }) {
  const { user } = useContext(AuthContext);

  // If no user, redirect to login
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // If role is specified, check if user has that role
  if (role) {
    // Admin-only route
    if (role === 'admin' && user.role !== 'admin') {
      return <Navigate to="/dashboard" replace />;
    }
    
    // Kiosk-only route (if needed later)
    if (role === 'kiosk' && user.role !== 'kiosk') {
      return <Navigate to="/admin" replace />;
    }
  }

  // All good, show the protected page
  return children;
}