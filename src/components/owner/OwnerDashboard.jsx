import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import OwnerNursery   from './OwnerNursery';
import OwnerInventory from './OwnerInventory';
import OwnerOrders    from './OwnerOrders';

export default function OwnerDashboard() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState('nursery');

  const tabs = [
    { id: 'nursery',   label: '🏡 My Nursery' },
    { id: 'inventory', label: '🌿 Inventory' },
    { id: 'orders',    label: '📦 Orders' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>

      {/* Top Bar */}
      <div style={{
        background: 'var(--surface)', borderBottom: '1px solid var(--border)',
        padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '1.5rem' }}>🏡</span>
          <div>
            <div style={{ fontFamily: 'var(--ff-head)', fontWeight: 800, fontSize: '1.1rem',
              background: 'linear-gradient(135deg, #c8a84b, #e8c97a)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Owner Portal
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Welcome, {user?.name}</div>
          </div>
        </div>
        <button onClick={logout} style={{
          background: 'transparent', border: '1px solid var(--border)',
          color: 'var(--muted)', padding: '0.4rem 1rem', borderRadius: 8, cursor: 'pointer', fontSize: '0.85rem'
        }}>Logout</button>
      </div>

      {/* Tab Nav */}
      <div style={{
        display: 'flex', gap: '0.5rem', padding: '1rem 1.5rem',
        background: 'var(--surface)', borderBottom: '1px solid var(--border)',
        overflowX: 'auto',
      }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: '0.5rem 1.2rem', borderRadius: 20, border: 'none', cursor: 'pointer',
            fontWeight: 600, fontSize: '0.875rem', whiteSpace: 'nowrap',
            background: tab === t.id ? 'linear-gradient(135deg, #c8a84b, #e8c97a)' : 'var(--bg)',
            color: tab === t.id ? '#1a1a1a' : 'var(--muted)',
            transition: 'all 0.2s',
          }}>{t.label}</button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
        {tab === 'nursery'   && <OwnerNursery />}
        {tab === 'inventory' && <OwnerInventory />}
        {tab === 'orders'    && <OwnerOrders />}
      </div>
    </div>
  );
}
