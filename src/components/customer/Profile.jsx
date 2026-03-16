import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function Profile() {
  const { user, updateProfile, logout } = useAuth();
  const toast = useToast();
  const [name,    setName]    = useState(user?.name    || '');
  const [phone,   setPhone]   = useState(user?.phone   || '');
  const [address, setAddress] = useState(user?.address || '');
  const [saving,  setSaving]  = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({ name, phone, address });
      toast('Profile saved ✅');
    } catch(err) {
      toast(err.response?.data?.message || 'Save failed', 'err');
    } finally { setSaving(false); }
  };

  return (
    <div className="fade-in">
      <div className="section-title"><span />My Profile</div>
      <div className="card">
        <div className="card-h">Account Details</div>
        <form onSubmit={handleSave}>
          <div className="fg">
            <label>Full Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="fg">
            <label>Email</label>
            <input type="email" value={user?.email || ''} disabled style={{ opacity: .6 }} />
          </div>
          <div className="fg">
            <label>Phone</label>
            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 9999999999" />
          </div>
          <div className="fg">
            <label>Default Delivery Address</label>
            <textarea rows={2} value={address} onChange={e => setAddress(e.target.value)} placeholder="Your delivery address" />
          </div>
          <button className="save-btn" type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>

      <div className="card" style={{ marginTop: '1rem' }}>
        <div className="card-h">Account</div>
        <div style={{ fontSize: '.88rem', color: 'var(--muted)', marginBottom: '1rem' }}>
          Logged in as <b style={{ color: 'var(--cream)' }}>{user?.email}</b>
        </div>
        <button className="btn-outline" onClick={logout}>Logout</button>
      </div>
    </div>
  );
}
