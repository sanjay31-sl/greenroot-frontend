import { useState, useEffect } from 'react';
import api from '../../api/axios';

const CATEGORIES = ['indoor', 'outdoor', 'succulent', 'herb', 'flowering', 'tree'];

const emptyForm = {
  name: '', scientificName: '', price: '', stock: '',
  category: 'indoor', emoji: '🌿', description: '', careTips: ''
};

export default function OwnerInventory() {
  const [plants,  setPlants]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editId,   setEditId]   = useState(null);
  const [form, setForm] = useState(emptyForm);

  const fetchPlants = () => {
    api.get('/plants/mine')
      .then(r => setPlants(r.data.plants || []))
      .catch(() => setPlants([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPlants(); }, []);

  const openAdd = () => {
    setForm(emptyForm); setEditId(null);
    setError(''); setSuccess(''); setShowForm(true);
  };

  const openEdit = (p) => {
    setForm({
      name: p.name, scientificName: p.scientificName || '',
      price: p.price, stock: p.stock, category: p.category,
      emoji: p.emoji || '🌿', description: p.description || '', careTips: p.careTips || ''
    });
    setEditId(p._id); setError(''); setSuccess(''); setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.price || !form.stock) {
      setError('Name, price and stock are required'); return;
    }
    setSaving(true); setError(''); setSuccess('');
    try {
      if (editId) {
        await api.put(`/plants/${editId}`, form);
        setSuccess('Plant updated! ✅');
      } else {
        await api.post('/plants', form);
        setSuccess('Plant added! ✅');
      }
      fetchPlants();
      setShowForm(false);
    } catch(err) {
      setError(err.response?.data?.message || 'Failed to save');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this plant?')) return;
    try {
      await api.delete(`/plants/${id}`);
      fetchPlants();
    } catch { alert('Failed to delete'); }
  };

  if (loading) return <div style={{ color: 'var(--muted)', textAlign: 'center', padding: '2rem' }}>Loading...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontFamily: 'var(--ff-head)', fontSize: '1.5rem' }}>🌿 Inventory</h2>
        <button onClick={openAdd} style={{
          background: 'linear-gradient(135deg, #c8a84b, #e8c97a)', color: '#1a1a1a',
          border: 'none', borderRadius: 10, padding: '0.6rem 1.2rem',
          fontWeight: 700, cursor: 'pointer'
        }}>+ Add Plant</button>
      </div>

      {error   && <div style={{ background: '#3a1a1a', color: '#ff6b6b', padding: '0.75rem 1rem', borderRadius: 8, marginBottom: '1rem' }}>{error}</div>}
      {success && <div style={{ background: '#1a3a1a', color: '#6bff6b', padding: '0.75rem 1rem', borderRadius: 8, marginBottom: '1rem' }}>{success}</div>}

      {/* Add/Edit Form */}
      {showForm && (
        <div style={{ background: 'var(--surface)', borderRadius: 16, padding: '1.5rem', marginBottom: '1.5rem', border: '1px solid var(--border)' }}>
          <h3 style={{ marginBottom: '1rem' }}>{editId ? 'Edit Plant' : 'Add New Plant'}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="fg">
              <label>Plant Name *</label>
              <input type="text" placeholder="e.g. Money Plant"
                value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            </div>
            <div className="fg">
              <label>Scientific Name</label>
              <input type="text" placeholder="e.g. Epipremnum aureum"
                value={form.scientificName} onChange={e => setForm({...form, scientificName: e.target.value})} />
            </div>
            <div className="fg">
              <label>Price (₹) *</label>
              <input type="number" placeholder="e.g. 299"
                value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
            </div>
            <div className="fg">
              <label>Stock *</label>
              <input type="number" placeholder="e.g. 50"
                value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} />
            </div>
            <div className="fg">
              <label>Category</label>
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}
                style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8,
                  padding: '0.75rem', color: 'var(--text)', fontSize: '0.9rem' }}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="fg">
              <label>Emoji</label>
              <input type="text" placeholder="🌿"
                value={form.emoji} onChange={e => setForm({...form, emoji: e.target.value})} />
            </div>
          </div>
          <div className="fg" style={{ marginTop: '1rem' }}>
            <label>Description</label>
            <textarea placeholder="Describe the plant..."
              value={form.description} onChange={e => setForm({...form, description: e.target.value})}
              style={{ minHeight: 80, resize: 'vertical', background: 'var(--bg)', border: '1px solid var(--border)',
                borderRadius: 8, padding: '0.75rem', color: 'var(--text)', fontFamily: 'inherit', fontSize: '0.9rem', width: '100%' }}
            />
          </div>
          <div className="fg" style={{ marginTop: '1rem' }}>
            <label>Care Tips</label>
            <textarea placeholder="e.g. Water twice a week, indirect sunlight..."
              value={form.careTips} onChange={e => setForm({...form, careTips: e.target.value})}
              style={{ minHeight: 80, resize: 'vertical', background: 'var(--bg)', border: '1px solid var(--border)',
                borderRadius: 8, padding: '0.75rem', color: 'var(--text)', fontFamily: 'inherit', fontSize: '0.9rem', width: '100%' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button onClick={handleSave} disabled={saving} style={{
              background: 'linear-gradient(135deg, #c8a84b, #e8c97a)', color: '#1a1a1a',
              border: 'none', borderRadius: 10, padding: '0.75rem 1.5rem', fontWeight: 700, cursor: 'pointer'
            }}>{saving ? 'Saving...' : editId ? 'Update Plant' : 'Add Plant'}</button>
            <button onClick={() => setShowForm(false)} style={{
              background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--muted)',
              borderRadius: 10, padding: '0.75rem 1.5rem', cursor: 'pointer'
            }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Plants List */}
      {plants.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌱</div>
          <div>No plants yet. Click "Add Plant" to get started!</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {plants.map(p => (
            <div key={p._id} style={{
              background: 'var(--surface)', borderRadius: 12, padding: '1rem 1.25rem',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              border: '1px solid var(--border)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '2rem' }}>{p.emoji || '🌿'}</span>
                <div>
                  <div style={{ fontWeight: 700 }}>{p.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{p.category} • Stock: {p.stock}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ fontWeight: 700, color: '#c8a84b' }}>₹{p.price}</div>
                <button onClick={() => openEdit(p)} style={{
                  background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)',
                  borderRadius: 8, padding: '0.4rem 0.8rem', cursor: 'pointer', fontSize: '0.8rem'
                }}>Edit</button>
                <button onClick={() => handleDelete(p._id)} style={{
                  background: '#3a1a1a', border: 'none', color: '#ff6b6b',
                  borderRadius: 8, padding: '0.4rem 0.8rem', cursor: 'pointer', fontSize: '0.8rem'
                }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
