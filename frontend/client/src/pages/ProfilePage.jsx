import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';

export default function ProfilePage() {
  const { user } = useContext(AuthContext);

  const [form, setForm] = useState({
    kioskName: '',
    ownerName: '',
    phone: '',
    address: '',
  });

  const [kiosk, setKiosk] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get('/kiosks/me')
      .then(res => setKiosk(res.data))
      .catch(() => {});
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post('/kiosks', form);
      setMessage('✅ Kiosk profile created. Waiting for admin approval.');
    } catch (err) {
      setMessage(err.response?.data?.message || '❌ Error creating kiosk');
    }
  };

  return (
    <div className="page">
      <div className="card">
        <h2>Profile</h2>

        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>

        {kiosk ? (
          <div className="profile-message">
            <p><strong>Kiosk Name:</strong> {kiosk.kioskName}</p>
            <p><strong>Status:</strong> {kiosk.status}</p>
            <p><strong>Credit Limit:</strong> {kiosk.creditLimit} EGP</p>
            <p><strong>Used Credit:</strong> {kiosk.outstandingBalance} EGP</p>
            <p><strong>Phone:</strong> {kiosk.phone}</p>
            <p><strong>Address:</strong> {kiosk.address}</p>
          </div>
        ) : (
          <>
            <h3>Create Kiosk Profile</h3>
            <form onSubmit={handleSubmit}>
              <input
                name="kioskName"
                placeholder="Kiosk Name"
                onChange={handleChange}
                required
              />
              <input
                name="ownerName"
                placeholder="Owner Name"
                onChange={handleChange}
                required
              />
              <input
                name="phone"
                placeholder="Phone"
                onChange={handleChange}
                required
              />
              <input
                name="address"
                placeholder="Address"
                onChange={handleChange}
              />
              <button type="submit">Create Kiosk</button>
            </form>
          </>
        )}

        {message && <p>{message}</p>}
      </div>
    </div>
  );
}
