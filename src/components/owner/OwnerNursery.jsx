import { useState, useEffect } from 'react';
import api from '../../api/axios';

export default function OwnerNursery() {
  const [nursery, setNursery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [success, setSuccess] = useState('');
  const [error,   setError]   = useState('');

const [form, setForm] = useState({
  name: '', address: '', phone: '', openTime: '07:00', closeTime: '21:00', description: ''
});

  useEffect(() => {
    api.get('/nurseries/my')
      .then(r => {
        if (r.data.nursery) {
          setNursery(r.data.nursery);
          setForm(r.data.nursery);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!form.name || !form.address || !form.phone) {
      setError('Name, address and phone are required'); return;
    }
    setSaving(true); setError(''); setSuccess('');
    try {
      if (nursery) {
        const r = await api.put('/nurseries/my', form);
        setNursery(r.data.nursery);
      } else {
        const r = await api.post('/nurseries/my', form);
        setNursery(r.data.nursery);
      }
      setSuccess('Nursery saved successfully! ✅');
    } catch(err) {
      setError(err.response?.data?.message || 'Failed to save');
    } finally { setSaving(false); }
  };

  if (loading) return <div style={{ color: 'var(--muted)', textAlign: 'center', padding: '2rem' }}>Loading...</div>;

  return (
    <div>
      <h2 style={{ fontFamily: 'var(--ff-head)', fontSize: '1.5rem', marginBottom: '1.5rem' }}>
        🏡 My Nursery
      </h2>

      {error   && <div style={{ background: '#3a1a1a', color: '#ff6b6b', padding: '0.75rem 1rem', borderRadius: 8, marginBottom: '1rem' }}>{error}</div>}
      {success && <div style={{ background: '#1a3a1a', color: '#6bff6b', padding: '0.75rem 1rem', borderRadius: 8, marginBottom: '1rem' }}>{success}</div>}

      <div style={{ background: 'var(--surface)', borderRadius: 16, padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

        <div className="fg">
          <label>Nursery Name *</label>
          <input type="text" placeholder="e.g. Green Paradise Nursery"
            value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
        </div>

        <div className="fg">
          <label>Address *</label>
          <input type="text" placeholder="e.g. 123 Garden Road, Mysuru"
            value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
        </div>

        <div className="fg">
          <label>Phone *</label>
          <input type="tel" placeholder="e.g. 9999999999"
            value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
        </div>

        <div className="fg">
      <label>Open Time</label>
<input type="time" value={form.openTime} onChange={e => setForm({...form, openTime: e.target.value})} />
</div>
<div className="fg">
<label>Close Time</label>
<input type="time" value={form.closeTime} onChange={e => setForm({...form, closeTime: e.target.value})} />

        </div>

        <div className="fg">
          <label>Description</label>
          <textarea placeholder="Tell customers about your nursery..."
            value={form.description} onChange={e => setForm({...form, description: e.target.value})}
            style={{ minHeight: 100, resize: 'vertical', background: 'var(--bg)', border: '1px solid var(--border)',
              borderRadius: 8, padding: '0.75rem', color: 'var(--text)', fontFamily: 'inherit', fontSize: '0.9rem' }}
          />
        </div>

        <button onClick={handleSave} disabled={saving} style={{
          background: 'linear-gradient(135deg, #c8a84b, #e8c97a)', color: '#1a1a1a',
          border: 'none', borderRadius: 10, padding: '0.85rem', fontWeight: 700,
          fontSize: '1rem', cursor: 'pointer', marginTop: '0.5rem'
        }}>
          {saving ? 'Saving...' : nursery ? 'Update Nursery 🏡' : 'Create Nursery 🌱'}
        </button>
      </div>
    </div>
  );
}
