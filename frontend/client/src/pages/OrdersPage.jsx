import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get('/orders').then(res => setOrders(res.data));
  }, []);

  return (
    <div>
      <h2>Orders</h2>
      <ul>
        {orders.map(o => (
          <li key={o._id}>
            {o.totalAmount} EGP — {o.status}
          </li>
        ))}
      </ul>
    </div>
  );
}
