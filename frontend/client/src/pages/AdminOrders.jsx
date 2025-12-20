import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get('/orders/all')
      .then(res => setOrders(res.data));
  }, []);

  const updateStatus = async (id, status) => {
    await api.put(`/orders/${id}/status`, { status });
    setOrders(prev =>
      prev.map(o => o._id === id ? { ...o, status } : o)
    );
  };

  return (
    <div>
      <h2>BNPL Orders</h2>

      <table>
        <thead>
          <tr>
            <th>Kiosk</th>
            <th>Total</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <tr key={o._id}>
              <td>{o.kiosk?.kioskName}</td>
              <td>{o.totalAmount}</td>
              <td>{o.status}</td>
              <td>
                <button onClick={() => updateStatus(o._id, 'approved')}>
                  Approve
                </button>
                <button onClick={() => updateStatus(o._id, 'rejected')}>
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
