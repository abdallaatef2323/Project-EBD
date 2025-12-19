import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function AdminKiosksTable() {
  const [kiosks, setKiosks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/kiosks')
      .then(res => {
        setKiosks(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading kiosks...</p>;

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Kiosk Name</th>
          <th>Owner</th>
          <th>Phone</th>
          <th>Credit Limit</th>
          <th>Outstanding</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {kiosks.map(k => (
          <tr key={k._id}>
            <td>{k.kioskName}</td>
            <td>{k.ownerName}</td>
            <td>{k.phone}</td>
            <td>{k.creditLimit}</td>
            <td>{k.outstandingBalance}</td>
            <td>{k.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
