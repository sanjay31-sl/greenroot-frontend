import { useState, useEffect } from 'react';
import api from '../../api/axios';

const STATUSES = ['pending', 'processing', 'shipped', 'delivered'];

const statusColor = {
  pending:    { bg: '#3a2a1a', color: '#f4a261' },
  processing: { bg: '#1a2a3a', color: '#4fc3f7' },
  shipped:    { bg: '#2a1a3a', color: '#ce93d8' },
  delivered:  { bg: '#1a3a1a', color: '#6bff6b' },
};

export default function OwnerOrders() {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  const fetchOrders = () => {
    api.get('/orders/nursery')
      .then(r => setOrders(r.data.orders || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, []);

  const nextStatus = (current) => {
    const idx = STATUSES.indexOf(current);
    return idx < STATUSES.length - 1 ? STATUSES[idx + 1] : null;
  };

  const handleUpdate = async (orderId, status) => {
    setUpdating(orderId);
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      fetchOrders();
    } catch { alert('Failed to update status'); }
    finally { setUpdating(null); }
  };

  if (loading) return <div style={{ color: 'var(--muted)', textAlign: 'center', padding: '2rem' }}>Loading...</div>;

  return (
    <div>
      <h2 style={{ fontFamily: 'var(--ff-head)', fontSize: '1.5rem', marginBottom: '1.5rem' }}>
        📦 Customer Orders
      </h2>

      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
          <div>No orders yet. Orders will appear here when customers place them.</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {orders.map(o => {
            const next = nextStatus(o.status);
            const sc = statusColor[o.status] || statusColor.pending;
            return (
              <div key={o._id} style={{
                background: 'var(--surface)', borderRadius: 16, padding: '1.25rem',
                border: '1px solid var(--border)'
              }}>
                {/* Order Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                      Order #{o._id.slice(-6).toUpperCase()}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--muted)', marginTop: '0.2rem' }}>
                      {new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                  <span style={{
                    padding: '0.3rem 0.8rem', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700,
                    background: sc.bg, color: sc.color, textTransform: 'capitalize'
                  }}>{o.status}</span>
                </div>

                {/* Customer Info */}
                <div style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '0.75rem' }}>
                  👤 {o.user?.name || 'Customer'} • {o.user?.phone || ''}
                  {o.deliveryAddress && (
                    <div>📍 {o.deliveryAddress}</div>
                  )}
                  <div>🚚 {o.fulfilmentType === 'pickup' ? 'Pickup' : 'Delivery'}</div>
                </div>

                {/* Items */}
                <div style={{ marginBottom: '0.75rem' }}>
                  {o.items?.map((item, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '0.25rem 0' }}>
                      <span>{item.plant?.emoji || '🌿'} {item.plant?.name || 'Plant'} × {item.quantity}</span>
                      <span style={{ color: '#c8a84b' }}>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                {/* Total + Action */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
                  <div style={{ fontWeight: 700, color: '#c8a84b' }}>Total: ₹{o.totalAmount}</div>
                  {next && (
                    <button
                      onClick={() => handleUpdate(o._id, next)}
                      disabled={updating === o._id}
                      style={{
                        background: 'linear-gradient(135deg, #c8a84b, #e8c97a)', color: '#1a1a1a',
                        border: 'none', borderRadius: 8, padding: '0.5rem 1rem',
                        fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem'
                      }}>
                      {updating === o._id ? 'Updating...' : `Mark as ${next} →`}
                    </button>
                  )}
                  {!next && (
                    <span style={{ fontSize: '0.85rem', color: '#6bff6b' }}>✅ Delivered</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
