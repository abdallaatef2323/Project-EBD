import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function ProfilePage() {
  const [kiosk, setKiosk] = useState(null);

  useEffect(() => {
    api.get('/kiosks/me').then(res => setKiosk(res.data));
  }, []);

  if (!kiosk) return <p>Loading...</p>;

  return (
    <div>
      <h1>Profile</h1>
      <p>Kiosk Name: {kiosk.kioskName}</p>
      <p>Owner: {kiosk.ownerName}</p>
      <p>Phone: {kiosk.phone}</p>
    </div>
  );
}
