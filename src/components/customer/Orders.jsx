import { useEffect, useState } from 'react';
import { useToast } from '../../context/ToastContext';
import api from '../../api/axios';

const STEPS = ['pending', 'processing', 'shipped', 'delivered'];

function OrderCard({ order, onCancel }) {
  const cur = STEPS.indexOf(order.status);
  const isPickup = order.fulfilment === 'pickup';
  const itemNames = order.items?.map(i => i.name).filter(Boolean).join(', ') || '';
  const date = new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="order-item">
      <div className="oi-header">
        <div>
          <div className="oi-id">#{order._id?.slice(-6).toUpperCase()}</div>
          <div className="oi-meta">{date}</div>
          {itemNames && <div className="oi-items">🌿 {itemNames}</div>}
        </div>
        <span className={`badge b-${order.status}`}>{order.status}</span>
      </div>

      {/* Tracking bar */}
      <div className="track-bar">
        {STEPS.map((s, i) => (
          <div key={s} className={`track-step ${i < cur ? 'done' : i === cur ? 'active' : ''}`} />
        ))}
      </div>
      <div className="track-labels">
        <span>Placed</span><span>Processing</span><span>Shipped</span><span>Delivered</span>
      </div>

      <div className="oi-footer">
        <span className="oi-meta">{isPickup ? '🏪 Pickup' : `🚚 ${order.deliveryAddress || '—'}`}</span>
        <span className="oi-total">₹{order.total}</span>
      </div>

      {order.status === 'pending' && (
        <button
          className="btn-outline"
          style={{ marginTop: '.6rem', fontSize: '.8rem' }}
          onClick={() => onCancel(order._id)}
        >
          Cancel Order
        </button>
      )}
    </div>
  );
}

export default function Orders() {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const loadOrders = () => {
    api.get('/orders/my').then(r => setOrders(r.data.orders || [])).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { loadOrders(); }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this order?')) return;
    try {
      await api.patch(`/orders/${id}/cancel`);
      toast('Order cancelled');
      loadOrders();
    } catch(err) {
      toast(err.response?.data?.message || 'Cannot cancel', 'err');
    }
  };

  return (
    <div className="fade-in">
      <div className="section-title"><span />My Orders</div>
      {loading && <div className="empty">Loading orders...</div>}
      {!loading && orders.length === 0 && <div className="empty">No orders yet 🌱</div>}
      {orders.map(o => <OrderCard key={o._id} order={o} onCancel={handleCancel} />)}
    </div>
  );
}
