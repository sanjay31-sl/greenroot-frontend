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
    toast('Added to cart 🌿');
  };

  return (
    <div style={{ padding: '1rem' }}>
      <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'var(--gold)', cursor: 'pointer', fontSize: '1rem', marginBottom: '1rem' }}>
        ← Back
      </button>
      <div style={{ background: 'var(--card)', borderRadius: 16, padding: '1.5rem' }}>
        <div style={{ fontSize: '4rem', textAlign: 'center', marginBottom: '1rem' }}>{plant.emoji || '🌿'}</div>
        <h2 style={{ color: 'var(--gold)', marginBottom: 4 }}>{plant.name}</h2>
        {plant.scientificName && <p style={{ color: 'var(--muted)', fontStyle: 'italic', marginBottom: 8 }}>{plant.scientificName}</p>}
        <p style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--gold)', marginBottom: 8 }}>₹{plant.price}</p>
        <p style={{ color: 'var(--muted)', marginBottom: 4 }}>Stock: {plant.stock} available</p>
        {plant.nurseryName && <p style={{ color: 'var(--muted)', marginBottom: 8 }}>🏡 {plant.nurseryName}</p>}
        {plant.description && <p style={{ marginBottom: 8 }}>{plant.description}</p>}
        {plant.careTips && (
          <div style={{ background: 'var(--bg)', borderRadius: 8, padding: '0.75rem', marginBottom: '1rem' }}>
            <strong>Care Tips:</strong> {plant.careTips}
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
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [selected, setSelected] = useState(null);
  const { addToCart } = useCart();
  const toast = useToast();

  useEffect(() => {
    fetchPlants();
  }, [search, category]);

  const fetchPlants = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (category) params.category = category;
      const res = await api.get('/plants', { params });
      setPlants(res.data.plants || []);
    } catch {
      setPlants([]);
    } finally {
      setLoading(false);
    }
  };

  if (selected) return <PlantDetail plant={selected} onBack={() => setSelected(null)} />;

  return (
    <div style={{ padding: '1rem' }}>
      <h2 style={{ color: 'var(--gold)', marginBottom: '1rem' }}>🌿 Shop</h2>
      <input
        className="input"
        placeholder="Search plants..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ marginBottom: '0.75rem', width: '100%' }}
      />
      <select
        className="input"
        value={category}
        onChange={e => setCategory(e.target.value)}
        style={{ marginBottom: '1rem', width: '100%' }}
      >
        <option value="">All Categories</option>
        <option value="indoor">Indoor</option>
        <option value="outdoor">Outdoor</option>
        <option value="succulent">Succulent</option>
        <option value="herb">Herb</option>
        <option value="flowering">Flowering</option>
        <option value="tree">Tree</option>
      </select>

      {loading ? (
        <p style={{ color: 'var(--muted)', textAlign: 'center' }}>Loading plants...</p>
      ) : plants.length === 0 ? (
        <p style={{ color: 'var(--muted)', textAlign: 'center' }}>No plants found</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
          {plants.map(plant => (
            <div
              key={plant._id}
              style={{ background: 'var(--card)', borderRadius: 12, padding: '1rem', cursor: 'pointer' }}
              onClick={() => setSelected(plant)}
            >
              <div style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: 8 }}>{plant.emoji || '🌿'}</div>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>{plant.name}</div>
              <div style={{ color: 'var(--gold)', fontWeight: 700, marginBottom: 4 }}>₹{plant.price}</div>
              <div style={{ color: 'var(--muted)', fontSize: '0.8rem', marginBottom: 8 }}>Stock: {plant.stock}</div>
              <button
                className="btn-main sm"
                style={{ width: '100%' }}
                disabled={plant.stock === 0}
                onClick={e => {
                  e.stopPropagation();
                  addToCart(plant, 1);
                  toast('Added to cart 🌿');
                }}
              >
                {plant.stock === 0 ? 'Out of Stock' : '+ Add to Cart'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
