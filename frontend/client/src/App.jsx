import { useState } from 'react';

function App() {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });

  // Login function - uses YOUR email
  const handleLogin = (e) => {
    e.preventDefault();
    const { email, password } = loginForm;
    
    // Check if admin (contains "admin" in email)
    const isAdmin = email.toLowerCase().includes('admin');
    
    setUser({
      email: email, // YOUR EMAIL
      role: isAdmin ? 'admin' : 'kiosk',
      name: email.split('@')[0],
      kioskId: isAdmin ? null : 'K' + Math.floor(1000 + Math.random() * 9000)
    });
    
    alert(`Logged in as ${email} (${isAdmin ? 'Admin' : 'Kiosk'})`);
  };

  // Logout
  const handleLogout = () => {
    setUser(null);
    setLoginForm({ email: '', password: '' });
  };

  // Products
  const products = [
    { id: 1, name: 'Cigarettes Pack', price: 40 },
    { id: 2, name: 'Potato Chips', price: 10 },
    { id: 3, name: 'Mineral Water', price: 5 },
  ];

  // Add to cart
  const addToCart = (product) => {
    setCart([...cart, product]);
    alert(`Added ${product.name} to cart!`);
  };

  // Place order
  const placeOrder = () => {
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    alert(`BNPL Order placed for ${total} EGP! Email sent to ${user.email}`);
    setCart([]);
  };

  // If not logged in, show LOGIN PAGE
  if (!user) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px'
      }}>
        <div style={{
          background: 'white',
          padding: '40px',
          borderRadius: '15px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          width: '100%',
          maxWidth: '400px'
        }}>
          <h2 style={{ textAlign: 'center', marginBottom: '10px' }}>🔐 Tamwilna Login</h2>
          <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px' }}>
            Enter YOUR email and password
          </p>
          
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '15px' }}>
              <input
                type="email"
                placeholder="Your Email"
                value={loginForm.email}
                onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '16px'
                }}
                required
              />
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <input
                type="password"
                placeholder="Your Password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '16px'
                }}
                required
              />
            </div>
            
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '14px',
                background: '#198754',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Login with MY Email
            </button>
          </form>
          
          <div style={{ marginTop: '25px', padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
            <p style={{ marginBottom: '10px', fontSize: '14px', color: '#666' }}>
              <strong>Note:</strong> 
              {` If your email contains "admin" (like admin@company.com), you'll login as Admin. Otherwise as Kiosk.`}
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button 
                onClick={() => setLoginForm({ email: 'ahmed_admin@tamwilna.com', password: '123456' })}
                style={{
                  padding: '8px 12px',
                  background: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                Try Admin Email
              </button>
              <button 
                onClick={() => setLoginForm({ email: 'mohamed_kiosk@shop.com', password: '123456' })}
                style={{
                  padding: '8px 12px',
                  background: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                Try Kiosk Email
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // MAIN APP (after login)
  return (
    <div style={{ minHeight: '100vh', background: '#f5f7fa' }}>
      {/* NAVBAR */}
      <nav style={{
        background: '#2c3e50',
        color: 'white',
        padding: '15px 30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h2 style={{ margin: 0 }}>Tamwilna</h2>
        
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 'bold' }}>{user.email}</div>
            <div style={{ fontSize: '12px', background: user.role === 'admin' ? '#dc3545' : '#28a745', padding: '2px 8px', borderRadius: '10px', display: 'inline-block' }}>
              {user.role.toUpperCase()}
            </div>
          </div>
          <div style={{ background: 'white', color: '#333', padding: '5px 10px', borderRadius: '20px' }}>
            🛒 {cart.length} items
          </div>
          <button
            onClick={handleLogout}
            style={{
              background: '#dc3545',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* WELCOME MESSAGE */}
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '10px',
          marginBottom: '20px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          borderLeft: '4px solid #007bff'
        }}>
          <h2 style={{ margin: '0 0 10px 0' }}>
            👋 Welcome, {user.name}!
          </h2>
          <p style={{ margin: 0, color: '#666' }}>
            You are logged in as <strong>{user.role}</strong> using email: <strong>{user.email}</strong>
          </p>
          {user.kioskId && <p>Your Kiosk ID: <strong>{user.kioskId}</strong></p>}
        </div>

        {/* DASHBOARD */}
        <div style={{
          background: 'white',
          padding: '25px',
          borderRadius: '10px',
          marginBottom: '20px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginTop: 0 }}>📊 Dashboard</h3>
          
          {user.role === 'admin' ? (
            // ADMIN VIEW
            <div>
              <p>As Admin, you can:</p>
              <div style={{ display: 'flex', gap: '10px', marginTop: '15px', flexWrap: 'wrap' }}>
                <button style={buttonStyles.primary}>View All Kiosks</button>
                <button style={buttonStyles.success}>Approve Orders</button>
                <button style={buttonStyles.primary}>Manage Credit Limits</button>
                <button style={buttonStyles.warning}>Generate Reports</button>
              </div>
              <div style={{ marginTop: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
                <p><strong>Admin Features:</strong></p>
                <ul style={{ margin: '10px 0 0 20px' }}>
                  <li>Manage kiosk registrations</li>
                  <li>Approve/reject BNPL orders</li>
                  <li>Set credit limits</li>
                  <li>View system analytics</li>
                </ul>
              </div>
            </div>
          ) : (
            // KIOSK VIEW
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginTop: '15px' }}>
                <div style={statCardStyle}>
                  <div style={{ fontSize: '14px', color: '#666' }}>Credit Limit</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold' }}>5,000 EGP</div>
                </div>
                <div style={statCardStyle}>
                  <div style={{ fontSize: '14px', color: '#666' }}>Outstanding</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc3545' }}>1,200 EGP</div>
                </div>
                <div style={statCardStyle}>
                  <div style={{ fontSize: '14px', color: '#666' }}>Available</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>3,800 EGP</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* PRODUCTS */}
        <div style={{
          background: 'white',
          padding: '25px',
          borderRadius: '10px',
          marginBottom: '20px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginTop: 0 }}>🛍️ Products</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px', marginTop: '15px' }}>
            {products.map(product => (
              <div key={product.id} style={productCardStyle}>
                <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{product.name}</div>
                <div style={{ fontSize: '18px', color: '#198754', marginBottom: '10px' }}>{product.price} EGP</div>
                <button
                  onClick={() => addToCart(product)}
                  style={buttonStyles.primary}
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* CART */}
        <div style={{
          background: 'white',
          padding: '25px',
          borderRadius: '10px',
          marginBottom: '20px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginTop: 0 }}>🛒 Your Cart ({cart.length} items)</h3>
          
          {cart.length === 0 ? (
            <p style={{ color: '#666' }}>Your cart is empty. Add products from above.</p>
          ) : (
            <>
              <div style={{ margin: '20px 0' }}>
                {cart.map((item, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '10px',
                    borderBottom: '1px solid #eee'
                  }}>
                    <span>{item.name}</span>
                    <span>{item.price} EGP</span>
                  </div>
                ))}
              </div>
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '15px',
                background: '#f8f9fa',
                borderRadius: '8px',
                marginTop: '20px'
              }}>
                <div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                    Total: {cart.reduce((sum, item) => sum + item.price, 0)} EGP
                  </div>
                  <div style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
                    BNPL - Pay within 30 days
                  </div>
                </div>
                <button
                  onClick={placeOrder}
                  style={buttonStyles.success}
                  disabled={cart.length === 0}
                >
                  Place BNPL Order
                </button>
              </div>
            </>
          )}
        </div>

        {/* ORDERS */}
        <div style={{
          background: 'white',
          padding: '25px',
          borderRadius: '10px',
          marginBottom: '20px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginTop: 0 }}>📋 Recent Orders</h3>
          <div style={{ marginTop: '15px' }}>
            <div style={orderItemStyle}>
              <div>
                <strong>Order #001</strong>
                <div style={{ fontSize: '14px', color: '#666' }}>Total: 150 EGP</div>
              </div>
              <div>
                <span style={statusStyle.approved}>✅ Approved</span>
                <button style={{ ...buttonStyles.danger, marginLeft: '10px', fontSize: '12px' }}>
                  Cancel
                </button>
              </div>
            </div>
            <div style={orderItemStyle}>
              <div>
                <strong>Order #002</strong>
                <div style={{ fontSize: '14px', color: '#666' }}>Total: 80 EGP</div>
              </div>
              <div>
                <span style={statusStyle.pending}>⏳ Pending</span>
                {user.role === 'admin' && (
                  <button style={{ ...buttonStyles.success, marginLeft: '10px', fontSize: '12px' }}>
                    Approve
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Styles
const buttonStyles = {
  primary: {
    background: '#007bff',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  success: {
    background: '#28a745',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  danger: {
    background: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  warning: {
    background: '#ffc107',
    color: '#212529',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px'
  }
};

const statCardStyle = {
  background: '#f8f9fa',
  padding: '20px',
  borderRadius: '8px',
  textAlign: 'center'
};

const productCardStyle = {
  border: '1px solid #e0e0e0',
  padding: '15px',
  borderRadius: '8px',
  textAlign: 'center'
};

const orderItemStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '15px',
  borderBottom: '1px solid #eee'
};

const statusStyle = {
  approved: {
    background: '#d4edda',
    color: '#155724',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 'bold'
  },
  pending: {
    background: '#fff3cd',
    color: '#856404',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 'bold'
  }
};

export default App;