import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [kiosk, setKiosk] = useState(null);

  useEffect(() => {
    // Try both endpoints
    api.get('/dashboard')
      .then(res => setData(res.data))
      .catch(() => {}); // Silent fail

    api.get('/kiosks/me')
      .then(res => setKiosk(res.data))
      .catch(() => setKiosk(false));
  }, []);

  return (
    <div className="page">
      <div className="card">
        <h2>Dashboard</h2>

        {kiosk === false && (
          <div className="alert">
            No kiosk found. Please contact admin.
          </div>
        )}

        {data && (
          <div>
            <p>Total Orders: {data.totalOrders}</p>
            <p>Credit Used: {data.creditUsed} EGP</p>
            <p>Credit Limit: {data.creditLimit} EGP</p>
          </div>
        )}

        {kiosk && (
          <div>
            <p>Outstanding Balance: {kiosk.outstandingBalance} EGP</p>
            <p>Credit Limit: {kiosk.creditLimit} EGP</p>
          </div>
        )}
      </div>
    </div>
  );
}