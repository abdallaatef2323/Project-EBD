import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function AdminKiosksTable() {
  const [kiosks, setKiosks] = useState([]);

  const load = () =>
    api.get('/kiosks').then(res => setKiosks(res.data));

  useEffect(load, []);

  const updateStatus = async (id, status) => {
    await api.put(`/kiosks/${id}/status`, { status });
    load();
  };

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Owner</th>
          <th>Credit</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {kiosks.map(k => (
          <tr key={k._id}>
            <td>{k.kioskName}</td>
            <td>{k.ownerName}</td>
            <td>{k.outstandingBalance}/{k.creditLimit}</td>
            <td>{k.status}</td>
            <td>
              <button onClick={() => updateStatus(k._id, 'approved')}>
                Approve
              </button>
              <button onClick={() => updateStatus(k._id, 'rejected')}>
                Reject
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
