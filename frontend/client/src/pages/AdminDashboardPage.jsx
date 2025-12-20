import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function AdminDashboardPage() {
  const [kiosks, setKiosks] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedKiosk, setSelectedKiosk] = useState(null);

  useEffect(() => {
    loadKiosks();
  }, []);

  const loadKiosks = async () => {
    const res = await api.get('/kiosks');
    setKiosks(res.data);
  };

  const approveKiosk = async (id, status) => {
    await api.put(`/kiosks/${id}/status`, { status });
    loadKiosks();
  };

  const viewOrders = async (kioskId) => {
    const res = await api.get(`/orders/kiosk/${kioskId}`);
    setOrders(res.data);
    setSelectedKiosk(kioskId);
  };

  const approveOrder = async (orderId) => {
    await api.put(`/orders/${orderId}/status`, { status: 'approved' });
    viewOrders(selectedKiosk);
  };

  return (
    <div className="page">
      <h1>Admin Dashboard</h1>

      <table className="table">
        <thead>
          <tr>
            <th>Kiosk</th>
            <th>Owner</th>
            <th>Credit</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {kiosks.map(k => (
            <tr key={k._id}>
              <td>{k.kioskName}</td>
              <td>{k.ownerName}</td>
              <td>{k.outstandingBalance} / {k.creditLimit}</td>
              <td>{k.status}</td>
              <td>
                <button onClick={() => viewOrders(k._id)}>View Orders</button>

                {k.status === 'pending' && (
                  <>
                    <button className="btn-success" onClick={() => approveKiosk(k._id, 'approved')}>
                      Approve
                    </button>
                    <button className="btn-danger" onClick={() => approveKiosk(k._id, 'rejected')}>
                      Reject
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {orders.length > 0 && (
        <>
          <h2>Orders</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Total</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o._id}>
                  <td>{o.totalAmount} EGP</td>
                  <td>{o.status}</td>
                  <td>
                    {o.status === 'placed' && (
                      <button className="btn-success" onClick={() => approveOrder(o._id)}>
                        Approve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
