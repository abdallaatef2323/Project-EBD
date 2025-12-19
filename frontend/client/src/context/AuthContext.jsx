import { createContext, useState } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    // Check if email contains 'admin' for admin role
    const isAdmin = email.includes('admin') || email === 'admin@tamwilna.com';
    
    if (isAdmin) {
      setUser({
        email,
        role: 'admin',
        name: 'System Administrator',
        permissions: ['manage_kiosks', 'approve_orders', 'view_all']
      });
    } else {
      setUser({
        email,
        role: 'kiosk',
        name: 'Kiosk Operator',
        kioskId: 'K' + Math.floor(1000 + Math.random() * 9000),
        creditLimit: 5000,
        outstandingBalance: 1200
      });
    }
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}