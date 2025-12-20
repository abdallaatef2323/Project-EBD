import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function DashboardPage() {
  const [kiosk, setKiosk] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/kiosks/me')
      .then(res => setKiosk(res.data))
      .catch(() => setKiosk(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="page"><div className="card">Loading...</div></div>;
  }

  if (!kiosk) {
    return (
      <div className="page">
        <div className="card">
          <h2>No kiosk profile</h2>
          <p>Please create your kiosk profile first.</p>
        </div>
      </div>
    );
  }

  const available = kiosk.creditLimit - kiosk.outstandingBalance;

  return (
    <div className="page">
      <div className="card">
        <h2>📊 Dashboard</h2>

        <p><strong>Kiosk:</strong> {kiosk.kioskName}</p>
        <p><strong>Status:</strong> {kiosk.status}</p>

        <div className="stat-grid">
          <div className="stat-card">
            <h4>Credit Limit</h4>
            <p>{kiosk.creditLimit} EGP</p>
          </div>

          <div className="stat-card red">
            <h4>Outstanding</h4>
            <p>{kiosk.outstandingBalance} EGP</p>
          </div>

          <div className="stat-card green">
            <h4>Available</h4>
            <p>{available} EGP</p>
          </div>
        </div>
      </div>
    </div>
  );
}
