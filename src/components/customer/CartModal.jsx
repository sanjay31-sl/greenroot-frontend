import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import api from '../../api/axios';

export default function CartModal({ onClose }) {
  const { cart, updateQty, removeFromCart, clearCart, total } = useCart();
  const toast = useToast();
  const [fulfilment, setFulfilment] = useState('delivery');
  const [address, setAddress]       = useState('');
  const [date, setDate]             = useState('');
  const [loading, setLoading]       = useState(false);

  const minDate = new Date().toISOString().split('T')[0];

  const handleOrder = async () => {
    if (!cart.length) { toast('Cart is empty', 'err'); return; }
    if (fulfilment === 'delivery' && !address) { toast('Enter delivery address', 'err'); return; }
    if (!date) { toast(`Select ${fulfilment} date`, 'err'); return; }

    setLoading(true);
    try {
      const items = cart.map(c => ({ plant: c.plantId, name: c.name, qty: c.qty, price: c.price }));
      const deliveryAddress = fulfilment === 'pickup'
        ? 'Pickup — GreenRoot Nursery, Chamundi Hills Road, Mysuru'
        : address;
      await api.post('/orders', { items, total, fulfilment, deliveryAddress, deliveryDate: date });
      clearCart();
      onClose();
      toast(fulfilment === 'delivery' ? 'Order placed! 🚚 Delivery confirmed' : 'Order placed! 🏪 Ready for pickup');
    } catch(err) {
      toast(err.response?.data?.message || 'Failed to place order', 'err');
    } finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-sheet">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
          <div style={{ fontFamily: 'var(--ff-head)', fontSize: '1.2rem', fontWeight: 700 }}>🛒 Your Cart</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '1.3rem' }}>✕</button>
        </div>

        {/* Items */}
        {cart.length === 0
          ? <div className="empty">Your cart is empty 🌱</div>
          : cart.map((item, i) => (
            <div key={item.plantId} className="cart-item">
              <span className="ci-emoji">{item.emoji}</span>
              <div className="ci-info">
                <div className="ci-name">{item.name}</div>
                <div className="ci-price">₹{item.price} × {item.qty} = ₹{item.price * item.qty}</div>
              </div>
              <div className="qty-row">
                <button className="qty-btn" onClick={() => updateQty(item.plantId, item.qty - 1)}>−</button>
                <span style={{ fontFamily: 'monospace', fontSize: '.9rem', minWidth: 20, textAlign: 'center' }}>{item.qty}</span>
                <button className="qty-btn" onClick={() => updateQty(item.plantId, item.qty + 1)}>+</button>
              </div>
              <button onClick={() => removeFromCart(item.plantId)}
                style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '1rem', padding: '.3rem' }}>✕</button>
            </div>
          ))
        }

        {cart.length > 0 && (
          <>
            {/* Total */}
            <div style={{ background: 'var(--soil)', borderRadius: 12, padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '.5rem 0 1rem' }}>
              <span style={{ color: 'var(--muted)', fontSize: '.9rem' }}>Subtotal</span>
              <span style={{ fontFamily: 'var(--ff-head)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--gold)' }}>₹{total}</span>
            </div>

            {/* Fulfilment choice */}
            <div style={{ fontSize: '.8rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: '.6rem' }}>Fulfilment</div>
            <div className="fulfilment-row">
              <button
                className={`fulfilment-btn ${fulfilment === 'delivery' ? 'active delivery' : ''}`}
                onClick={() => setFulfilment('delivery')}
              >
                🚚 Delivery
              </button>
              <button
                className={`fulfilment-btn ${fulfilment === 'pickup' ? 'active pickup' : ''}`}
                onClick={() => setFulfilment('pickup')}
              >
                🏪 Pickup
              </button>
            </div>

            {/* Delivery fields */}
            {fulfilment === 'delivery' && (
              <>
                <div className="fg" style={{ marginTop: '.5rem' }}>
                  <label>Delivery Address</label>
                  <textarea rows={2} placeholder="Enter your delivery address" value={address} onChange={e => setAddress(e.target.value)} />
                </div>
                <div className="fg">
                  <label>Delivery Date</label>
                  <input type="date" min={minDate} value={date} onChange={e => setDate(e.target.value)} />
                </div>
                <div style={{ background: 'var(--soil)', borderRadius: 8, padding: '.6rem .8rem', fontSize: '.8rem', color: 'var(--mint)', marginBottom: '.5rem' }}>
                  🚚 Free delivery on orders above ₹999
                </div>
              </>
            )}

            {/* Pickup fields */}
            {fulfilment === 'pickup' && (
              <>
                <div style={{ background: 'var(--soil)', borderRadius: 12, padding: '1rem', marginTop: '.5rem', marginBottom: '.8rem' }}>
                  <div style={{ fontSize: '.85rem', fontWeight: 600, color: 'var(--cream)', marginBottom: '.4rem' }}>📍 Pickup from Nursery</div>
                  <div style={{ fontSize: '.82rem', color: 'var(--muted)', lineHeight: 1.6 }}>
                    GreenRoot Nursery<br />
                    #14, Chamundi Hills Road, Mysuru<br />
                    ⏰ Mon–Sat: 8am – 8pm
                  </div>
                </div>
                <div className="fg">
                  <label>Pickup Date</label>
                  <input type="date" min={minDate} value={date} onChange={e => setDate(e.target.value)} />
                </div>
              </>
            )}

            <button className="btn-main" onClick={handleOrder} disabled={loading} style={{ marginTop: '.5rem' }}>
              {loading ? 'Placing order...' : 'Confirm Order'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
