import { useEffect, useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import api from '../../api/axios';

function PlantDetail({ plant, onBack }) {
  const { addToCart } = useCart();
  const toast = useToast();
  const [qty, setQty] = useState(1);

  const handleAdd = () => {
    addToCart(plant, qty);
    toast(`${plant.name} added to cart 🛒`);
    onBack();
  };

  return (
    <div className="fade-in">
      <button className="btn-outline green" onClick={onBack} style={{ marginBottom: '1rem' }}>
        ← Back to shop
      </button>
      <div className="detail-hero">{plant.emoji || '🌿'}</div>
      <div className="card" style={{ marginTop: '1rem' }}>
        <span className="cat-badge">{plant.category}</span>
        <div style={{ fontFamily: 'var(--ff-head)', fontSize: '1.4rem', fontWeight: 700, margin: '.4rem 0 .1rem' }}>{plant.name}</div>
        <div style={{ fontStyle: 'italic', color: 'var(--muted)', marginBottom: '.4rem' }}>{plant.scientificName}</div>
        <div style={{ fontSize: '.8rem', color: 'var(--sage)', marginBottom: '.8rem' }}>
          🌿 Sold by <b>{plant.nurseryName || 'GreenRoot Nursery'}</b>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '.8rem' }}>
          <span style={{ fontSize: '1.4rem', color: 'var(--gold)', fontFamily: 'monospace', fontWeight: 700 }}>₹{plant.price}</span>
          <span className={plant.stock > 10 ? 'in-stock' : plant.stock > 0 ? 'low-stock' : 'out-stock'}>
            {plant.stock > 0 ? `${plant.stock} in stock` : 'Out of Stock'}
          </span>
        </div>
        <div style={{ fontSize: '.9rem', color: 'var(--text)', lineHeight: 1.6, marginBottom: '.8rem' }}>{plant.description}</div>
        {plant.careTips && (
          <div style={{ background: 'var(--soil)', borderRadius: 10, padding: '.8rem', fontSize: '.85rem', color: 'var(--mint)' }}>
            🌿 <b>Care Tips:</b> {plant.careTips}
          </div>
        )}
        <div className="qty-row" style={{ marginTop: '1rem' }}>
          <button className="qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
          <span style={{ fontFamily: 'monospace', fontSize: '1.1rem', minWidth: 30, textAlign: 'center' }}>{qty}</span>
          <button className="qty-btn" onClick={() => setQty(q => q + 1)}>+</button>
<button
  className="btn-main sm"
  style={{ flex: 1 }}
  disabled={plant.stock === 0}
  onClick={handleAdd}
>
  {plant.stock === 0 ? 'Out of Stock' : '+ Add to Cart'}
</button>
<button
  className="btn-main sm"
  style={{ flex: 1, background: 'var(--gold)', color: '#1a1a1a' }}
  disabled={plant.stock === 0}
  onClick={handleAdd}
>
  {plant.stock === 0 ? 'Out of Stock' : '🛒 Buy Now'}
</button>
        </div>
      </div>
    </div>
  );
}

export default function Shop() {
  const [plants, setPlants]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort]         = useState('');
  const [detail, setDetail]     = useState(null);

  useEffect(() => {
    api.get('/plants').then(r => {
      setPlants(r.data.plants || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  // Filter + sort
  let filtered = plants.filter(p =>
    (!search   || p.name.toLowerCase().includes(search.toLowerCase())) &&
    (!category || p.category === category)
  );
  if (sort === 'price-asc')  filtered = [...filtered].sort((a,b) => a.price - b.price);
  if (sort === 'price-desc') filtered = [...filtered].sort((a,b) => b.price - a.price);
  if (sort === 'name')       filtered = [...filtered].sort((a,b) => a.name.localeCompare(b.name));

  // Group by nursery
  const groups = filtered.reduce((acc, p) => {
    const n = p.nurseryName || 'GreenRoot Nursery';
    if (!acc[n]) acc[n] = [];
    acc[n].push(p);
    return acc;
  }, {});

  if (detail) return <PlantDetail plant={detail} onBack={() => setDetail(null)} />;

  return (
    <div className="fade-in">
      <div className="section-title"><span />Our Plants</div>

      {/* Search + filter */}
      <div className="search-bar">
        <input
          type="text" placeholder="🔍 Search plants..."
          value={search} onChange={e => setSearch(e.target.value)}
        />
        <select value={category} onChange={e => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          <option value="indoor">Indoor</option>
          <option value="outdoor">Outdoor</option>
          <option value="succulent">Succulents</option>
          <option value="herb">Herbs</option>
          <option value="flowering">Flowering</option>
          <option value="tree">Trees</option>
        </select>
        <select value={sort} onChange={e => setSort(e.target.value)}>
          <option value="">Sort by</option>
          <option value="price-asc">Price ↑</option>
          <option value="price-desc">Price ↓</option>
          <option value="name">Name A-Z</option>
        </select>
      </div>

      {loading && <div className="empty">Loading plants...</div>}

      {!loading && filtered.length === 0 && <div className="empty">No plants found 🌱</div>}

      {/* Grouped by nursery */}
      {Object.entries(groups).map(([nursery, items]) => (
        <div key={nursery} style={{ marginBottom: '1.5rem' }}>
          <div className="nursery-header" style={{ display: 'flex', alignItems: 'center', gap: '.7rem', padding: '.6rem .8rem', background: 'linear-gradient(135deg,var(--moss),var(--bark))', borderRadius: 12, marginBottom: '.8rem', border: '1px solid rgba(107,143,78,.3)' }}>
            <span style={{ fontSize: '1.3rem' }}>🌿</span>
            <div>
              <div style={{ fontFamily: 'var(--ff-head)', fontSize: '1rem', fontWeight: 700, color: 'var(--cream)' }}>{nursery}</div>
              <div style={{ fontSize: '.75rem', color: 'var(--mint)' }}>{items.length} plant{items.length > 1 ? 's' : ''} available</div>
            </div>
          </div>

          <div className="plant-grid">
            {items.map(p => (
              <div key={p._id} className="plant-card" onClick={() => setDetail(p)}>
                <div className="plant-emoji">{p.emoji || '🌿'}</div>
                <div className="plant-body">
                  <span className="cat-badge">{p.category}</span>
                  <div className="plant-name">{p.name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '.5rem' }}>
                    <span className="plant-price">₹{p.price}</span>
                    <span className={p.stock > 10 ? 'in-stock' : p.stock > 0 ? 'low-stock' : 'out-stock'}>
                      {p.stock > 0 ? `${p.stock} left` : 'Out of Stock'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ borderBottom: '1px solid var(--border)', marginTop: '1rem' }} />
        </div>
      ))}
    </div>
  );
}
