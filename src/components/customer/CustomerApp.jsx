import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import Home    from './Home';
import Shop    from './Shop';
import Orders  from './Orders';
import Profile from './Profile';
import CartModal from './CartModal';

const TABS = [
  { id: 'home',    label: '🏠 Home' },
  { id: 'shop',    label: '🌺 Shop' },
  { id: 'orders',  label: '📦 Orders' },
  { id: 'profile', label: '👤 Profile' },
];

export default function CustomerApp() {
  const { user, logout } = useAuth();
  const { count }        = useCart();
  const [tab, setTab]    = useState('home');
  const [cartOpen, setCartOpen] = useState(false);
  const firstName = (user?.name || 'Customer').split(' ')[0];

  return (
    <div className="dash fade-in">
      {/* Topbar */}
      <div className="topbar">
        <div className="tb-brand" style={{ '--accent': 'var(--sage)' }}>
          🌿 <span>GreenRoot</span>
        </div>
        <div className="tb-right">
          <button
            className="btn-main sm gold"
            onClick={() => setCartOpen(true)}
            style={{ position: 'relative' }}
          >
            🛒 Cart {count > 0 && <span style={{ marginLeft: '.3rem' }}>({count})</span>}
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
            <div className="avatar">{firstName[0].toUpperCase()}</div>
            <span style={{ fontFamily: 'var(--ff-head)', fontSize: '.9rem', color: 'var(--cream)', maxWidth: 90, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {firstName}
            </span>
          </div>
          <button className="btn-outline" onClick={logout}>Logout</button>
        </div>
      </div>

      {/* Nav tabs */}
      <div className="navtabs">
        {TABS.map(t => (
          <button
            key={t.id}
            className={`nav-tab ${tab === t.id ? 'active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="main-content">
        {tab === 'home'    && <Home    onShop={() => setTab('shop')} />}
        {tab === 'shop'    && <Shop />}
        {tab === 'orders'  && <Orders />}
        {tab === 'profile' && <Profile />}
      </div>

      {/* Cart modal */}
      {cartOpen && <CartModal onClose={() => setCartOpen(false)} />}
    </div>
  );
}
