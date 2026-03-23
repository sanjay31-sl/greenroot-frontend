import { useEffect, useState } from 'react';
import api from '../../api/axios';

const STEPS = ['pending', 'processing', 'shipped', 'delivered'];

export default function AdminOrders() {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState('all');

  useEffect(() => {
    api.get('/admin/stats').then(() => {}).catch(() => {});
    // Fetch all orders via nursery endpoint (admin sees all)
    api.get('/orders/all').then(r => setOrders(r.data.orders || []))
      .catch(() => {
        // fallback: try nursery orders
        api.get('/orders/nursery').then(r => setOrders(r.data.orders || [])).catch(() => {});
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  return (
    <div className="fade-in">
      <div className="section-title">
        <span style={{ background: '#b08ad4' }} />
        All Orders ({orders.length})
      </div>

      <div className="search-bar" style={{ marginBottom: '1rem' }}>
        <select value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {loading && <div className="empty">Loading orders...</div>}
      {!loading && filtered.length === 0 && <div className="empty">No orders found</div>}

      {filtered.map(o => {
        const cur = STEPS.indexOf(o.status);
        const date = new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
        const itemNames = o.items?.map(i => i.name).filter(Boolean).join(', ') || '';

        return (
          <div key={o._id} className="order-item" style={{ background: 'var(--bark)', border: '1px solid var(--border)' }}>
            <div className="oi-header">
              <div>
                <div className="oi-id">#{o._id?.slice(-6).toUpperCase()}</div>
                <div className="oi-meta">{date}</div>
                {itemNames && <div className="oi-items">🌿 {itemNames}</div>}
                {o.user && (
                  <div style={{ fontSize: '.78rem', color: '#b08ad4', marginTop: '.2rem' }}>
                    👤 {o.user?.name || 'Customer'}
                  </div>
                )}
              </div>
              <span className={`badge b-${o.status}`}>{o.status}</span>
            </div>

            {o.status !== 'cancelled' && (
              <>
                <div className="track-bar">
                  {STEPS.map((s, i) => (
                    <div key={s} className={`track-step ${i < cur ? 'done' : i === cur ? 'active' : ''}`} />
                  ))}
                </div>
                <div className="track-labels">
                  <span>Placed</span><span>Processing</span><span>Shipped</span><span>Delivered</span>
                </div>
              </>
            )}

            <div className="oi-footer" style={{ marginTop: '.6rem' }}>
              <span className="oi-meta">
                {o.fulfilment === 'pickup' ? '🪴 Pickup' : `🚚 ${o.deliveryAddress || '—'}`}
              </span>
              <span className="oi-total">₹{o.total}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
