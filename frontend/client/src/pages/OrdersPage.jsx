import { useEffect, useState, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';

export default function OrdersPage() {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);

  const loadOrders = async () => {
    const res = await api.get('/orders');
    setOrders(res.data);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const updateStatus = async (id, status) => {
    await api.put(`/orders/${id}/status`, { status });
    loadOrders();
  };

  return (
    <div className="page">
      <div className="card">
        <h2>Orders</h2>

        {orders.length === 0 && <p>No orders found.</p>}

        {orders.map(o => (
          <div key={o._id} className="order-item">
            <div>
              <strong>{o.totalAmount} EGP</strong>
              <div>Status: {o.status}</div>
            </div>

            {user.role === 'kiosk' && o.status === 'pending' && (
              <button
                className="btn-danger"
                onClick={() => updateStatus(o._id, 'cancelled')}
              >
                Cancel
              </button>
            )}

            {user.role === 'admin' && o.status === 'pending' && (
              <button
                className="btn-success"
                onClick={() => updateStatus(o._id, 'approved')}
              >
                Approve
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
