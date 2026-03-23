import { useEffect, useState } from 'react';
import api from '../../api/axios';

export default function AdminPlants() {
  const [plants, setPlants]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');

  useEffect(() => {
    api.get('/plants').then(r => setPlants(r.data.plants || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = plants.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.nurseryName || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fade-in">
      <div className="section-title">
        <span style={{ background: '#b08ad4' }} />
        All Plants ({plants.length})
      </div>

      <div className="search-bar" style={{ marginBottom: '1rem' }}>
        <input placeholder="🔍 Search by plant or nursery..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {loading && <div className="empty">Loading plants...</div>}
      {!loading && filtered.length === 0 && <div className="empty">No plants found</div>}

      <div className="plant-grid">
        {filtered.map(p => (
          <div key={p._id} className="plant-card" style={{ cursor: 'default' }}>
            <div className="plant-emoji">{p.emoji || '🌿'}</div>
            <div className="plant-body">
              <div className="cat-badge">{p.category}</div>
              <div className="plant-name">{p.name}</div>
              <div className="plant-nursery">🏡 {p.nurseryName}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '.4rem' }}>
                <div className="plant-price">₹{p.price}</div>
                <span className={p.stock > 5 ? 'in-stock' : p.stock > 0 ? 'low-stock' : 'out-stock'}>
                  {p.stock > 0 ? `${p.stock} left` : 'Out of stock'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
