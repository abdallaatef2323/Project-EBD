import { useEffect, useState, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const { user } = useContext(AuthContext);

  // Load orders
  const loadOrders = async () => {
    const res = await api.get('/orders');
    setOrders(res.data);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // Cancel order
  const cancelOrder = async (id) => {
    await api.put(`/orders/${id}/cancel`);
    loadOrders();
  };

  // Approve order
  const approveOrder = async (id) => {
    await api.put(`/orders/${id}/approve`);
    loadOrders();
  };

  return (
    <div className="page">
      <div className="card">
        <h2>Orders</h2>

        {orders.length === 0 && <p>No orders yet.</p>}

        {orders.map(order => (
          <div key={order._id} className="order-item">
            {/* Your display format */}
            <strong>{order.totalAmount} EGP</strong>
            <span className={`status ${order.status}`}>{order.status}</span>

            {/* Friend's action buttons */}
            {user && user.role === 'kiosk' && order.status === 'pending' && (
              <button className="btn-danger" onClick={() => cancelOrder(order._id)}>
                Cancel
              </button>
            )}

            {user && user.role === 'admin' && order.status === 'pending' && (
              <button className="btn-success" onClick={() => approveOrder(order._id)}>
                Approve
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}