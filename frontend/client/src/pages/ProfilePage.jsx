import { useState, useContext } from 'react';
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

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post('/kiosks', form);
      setMessage('✅ Kiosk profile created successfully');
    } catch (err) {
      setMessage(err.response?.data?.message || '❌ Error creating kiosk');
    }
  };

  return (
    <div className="page">
      <div className="card">
        <h2>Profile</h2>

        {/* Always show user info */}
        <div className="profile-info">
          <p><strong>Email:</strong> {user?.email || 'Not logged in'}</p>
          <p><strong>Role:</strong> {user?.role || 'Unknown'}</p>
        </div>

        {/* If user has NO kiosk, show creation form */}
        {!user?.kioskId && user?.role === 'kiosk' ? (
          <div className="kiosk-form-section">
            <h3>Create Your Kiosk Profile</h3>
            <p>You need to create a kiosk profile to start using BNPL.</p>
            
            <form onSubmit={handleSubmit}>
              <input
                name="kioskName"
                placeholder="Kiosk Name"
                value={form.kioskName}
                onChange={handleChange}
                required
              />

              <input
                name="ownerName"
                placeholder="Owner Name"
                value={form.ownerName}
                onChange={handleChange}
                required
              />

              <input
                name="phone"
                placeholder="Phone Number"
                value={form.phone}
                onChange={handleChange}
                required
              />

              <input
                name="address"
                placeholder="Address"
                value={form.address}
                onChange={handleChange}
              />

              <button type="submit">Create Kiosk Profile</button>
            </form>
          </div>
        ) : (
          /* If user HAS kiosk, show profile message */
          <div className="profile-message">
            {user?.kioskId 
              ? `✅ Your kiosk profile is active (ID: ${user.kioskId})`
              : 'ℹ️ Your profile information is shown above.'
            }
          </div>
        )}

        {message && <div className="message">{message}</div>}
      </div>
    </div>
  );
}