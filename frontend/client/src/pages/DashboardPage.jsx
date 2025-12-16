import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function DashboardPage() {
  const [kiosk, setKiosk] = useState(null);

  useEffect(() => {
    api.get('/kiosks/me').then(res => setKiosk(res.data));
  }, []);

  if (!kiosk) return <p>Loading...</p>;

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Outstanding Balance: {kiosk.outstandingBalance} EGP</p>
      <p>Credit Limit: {kiosk.creditLimit} EGP</p>
    </div>
  );
}
