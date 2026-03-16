import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

function OrderItem({ order }) {
  const steps = ['pending', 'processing', 'shipped', 'delivered'];
  const cur = steps.indexOf(order.status);
  const isPickup = order.fulfilment === 'pickup';
  const itemNames = order.items?.map(i => i.name).filter(Boolean).join(', ') || '';

  return (
    <div className="order-item">
      <div className="oi-header">
        <div>
          <div className="oi-id">#{order._id?.slice(-6).toUpperCase()}</div>
          <div className="oi-meta">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
          {itemNames && <div className="oi-items">🌿 {itemNames}</div>}
        </div>
        <span className={`badge b-${order.status}`}>{order.status}</span>
      </div>
      <div className="track-bar">
        {steps.map((s, i) => <div key={s} className={`track-step ${i < cur ? 'done' : i === cur ? 'active' : ''}`} />)}
      </div>
      <div className="track-labels"><span>Placed</span><span>Processing</span><span>Shipped</span><span>Delivered</span></div>
      <div className="oi-footer">
        <span className="oi-meta">{isPickup ? '🏪 Pickup' : `🚚 ${order.deliveryAddress || '—'}`}</span>
        <span className="oi-total">₹{order.total}</span>
      </div>
    </div>
  );
}

export default function Home({ onShop }) {
  const { user } = useAuth();
  const [orders, setOrders]     = useState([]);
  const [counts, setCounts]     = useState({ orders: 0 });
  const [plantCount, setPlantCount] = useState(0);
  const firstName = (user?.name || 'there').split(' ')[0];

  useEffect(() => {
    // Fetch orders
    api.get('/orders/my').then(r => {
      setOrders(r.data.orders || []);
      setCounts({ orders: r.data.total || 0 });
    }).catch(() => {});

    // Fetch real plant count
    api.get('/plants').then(r => {
      setPlantCount((r.data.plants || []).length);
    }).catch(() => {});
  }, []);

  return (
    <div className="fade-in">
      {/* Greeting */}
      <div style={{ marginBottom: '1.2rem' }}>
        <div style={{ fontFamily: 'var(--ff-head)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--cream)' }}>
          Hello, <span style={{ color: 'var(--sage)' }}>{firstName}</span> 👋
        </div>
        <div style={{ fontSize: '.85rem', color: 'var(--muted)', marginTop: '.2rem', fontStyle: 'italic' }}>
          Welcome to GreenRoot Nursery
        </div>
      </div>

      {/* Stats */}
      <div className="stats-row">
        <div className="stat" data-icon="📦">
          <div className="sv" style={{ color: 'var(--sage)' }}>{counts.orders}</div>
          <div className="sl">My Orders</div>
        </div>
        <div className="stat" data-icon="🌿">
          <div className="sv" style={{ color: 'var(--gold)' }}>{plantCount > 0 ? plantCount : '—'}</div>
          <div className="sl">Plants Available</div>
        </div>
      </div>

      {/* Latest order */}
      <div className="card">
        <div className="card-h">Latest Order</div>
        {orders.length > 0
          ? <OrderItem order={orders[0]} />
          : <div className="empty">No orders yet — start shopping! 🌱</div>
        }
      </div>

      {/* Shop CTA */}
      <div className="card" onClick={onShop}
        style={{ background: 'linear-gradient(135deg,#2a3a1a,var(--bark))', cursor: 'pointer' }}>
        <div style={{ fontFamily: 'var(--ff-head)', fontSize: '1.1rem', marginBottom: '.3rem' }}>🌺 Explore our plants</div>
        <div style={{ color: 'var(--mint)', fontSize: '.9rem', fontStyle: 'italic' }}>Browse indoor, outdoor, succulents & more →</div>
      </div>
    </div>
  );
}
