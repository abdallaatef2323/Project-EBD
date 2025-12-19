import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function AdminDashboardPage() {
  const [kiosks, setKiosks] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeKiosk, setActiveKiosk] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadKiosks();
  }, []);

  const loadKiosks = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Try real API
      const res = await api.get('/kiosks');
      setKiosks(res.data);
    } catch (err) {
      console.error('API failed, using mock data:', err.message);
      setError('Backend not connected. Showing demo data.');
      
      // Fallback mock data
      setKiosks([
        { 
          _id: '1', 
          kioskName: 'Downtown Kiosk', 
          ownerName: 'Ahmed Mohamed', 
          phone: '0123456789', 
          outstandingBalance: 1200, 
          creditLimit: 5000, 
          status: 'pending' 
        },
        { 
          _id: '2', 
          kioskName: 'Mall Kiosk', 
          ownerName: 'Sara Ali', 
          phone: '0112233445', 
          outstandingBalance: 800, 
          creditLimit: 3000, 
          status: 'approved' 
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const changeKioskStatus = async (id, status) => {
    try {
      await api.put(`/kiosks/${id}/status`, { status });
      alert(`Kiosk ${status}`);
      loadKiosks();
    } catch (err) {
      alert(`Failed: ${err.message}. Simulating update.`);
      // Update locally
      setKiosks(kiosks.map(k => 
        k._id === id ? { ...k, status } : k
      ));
    }
  };

  const loadOrders = async (kioskId) => {
    try {
      const res = await api.get(`/orders/kiosk/${kioskId}`);
      setOrders(res.data);
      setActiveKiosk(kioskId);
    } catch (err) {
      console.error('Failed to load orders:', err);
      // Mock orders
      setOrders([
        { 
          _id: '101', 
          totalAmount: 450, 
          status: 'pending', 
          dueDate: new Date().toISOString() 
        }
      ]);
      setActiveKiosk(kioskId);
    }
  };

  const changeOrderStatus = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      alert(`Order ${status}`);
      loadOrders(activeKiosk);
    } catch (err) {
      alert(`Failed: ${err.message}. Simulating update.`);
      setOrders(orders.map(o => 
        o._id === orderId ? { ...o, status } : o
      ));
    }
  };

  if (loading) return <div>Loading kiosks...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Admin Dashboard</h1>
      
      {error && (
        <div style={{ 
          background: '#fff3cd', 
          color: '#856404', 
          padding: '10px', 
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          ⚠️ {error}
        </div>
      )}

      <h2>Kiosks</h2>
      <div style={{ overflowX: 'auto', marginBottom: '30px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
          <thead>
            <tr style={{ background: '#f8f9fa' }}>
              <th style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>Name</th>
              <th style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>Owner</th>
              <th style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>Phone</th>
              <th style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>Credit</th>
              <th style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>Status</th>
              <th style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>Actions</th>
              <th style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>Orders</th>
            </tr>
          </thead>
          <tbody>
            {kiosks.map(k => (
              <tr key={k._id}>
                <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{k.kioskName}</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{k.ownerName}</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{k.phone}</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                  {k.outstandingBalance} / {k.creditLimit}
                </td>
                <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                  <span style={{ 
                    padding: '4px 8px', 
                    borderRadius: '4px',
                    background: k.status === 'approved' ? '#d4edda' : '#fff3cd',
                    color: k.status === 'approved' ? '#155724' : '#856404'
                  }}>
                    {k.status}
                  </span>
                </td>
                <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                  <button 
                    onClick={() => changeKioskStatus(k._id, 'approved')}
                    style={{ marginRight: '5px', padding: '5px 10px' }}
                  >
                    Approve
                  </button>
                  <button 
                    onClick={() => changeKioskStatus(k._id, 'rejected')}
                    style={{ background: '#dc3545', color: 'white', padding: '5px 10px' }}
                  >
                    Reject
                  </button>
                </td>
                <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                  <button onClick={() => loadOrders(k._id)}>
                    View Orders
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {orders.length > 0 && (
        <>
          <h2>Orders for Kiosk #{activeKiosk}</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
              <thead>
                <tr style={{ background: '#f8f9fa' }}>
                  <th style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>Total</th>
                  <th style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>Status</th>
                  <th style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>Due Date</th>
                  <th style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o._id}>
                    <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{o.totalAmount} EGP</td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{o.status}</td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                      {new Date(o.dueDate).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                      <button 
                        onClick={() => changeOrderStatus(o._id, 'approved')}
                        style={{ marginRight: '5px', padding: '5px 10px' }}
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => changeOrderStatus(o._id, 'rejected')}
                        style={{ background: '#dc3545', color: 'white', padding: '5px 10px' }}
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}