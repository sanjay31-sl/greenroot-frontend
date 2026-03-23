import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import AdminUsers from './AdminUsers';
import AdminNurseries from './AdminNurseries';
import AdminPlants from './AdminPlants';
import AdminOrders from './AdminOrders';

const TABS = [
  { id: 'stats',     label: '📊 Overview' },
  { id: 'users',     label: '👥 Users' },
  { id: 'nurseries', label: '🏡 Nurseries' },
  { id: 'plants',    label: '🌿 Plants' },
  { id: 'orders',    label: '📦 Orders' },
];

export default function AdminDashboard() {
  const [tab, setTab]     = useState('stats');
  const [stats, setStats] = useState(null);
  const navigate          = useNavigate();
  const user              = JSON.parse(localStorage.getItem('gr_user') || '{}');

  useEffect(() => {
    if (!localStorage.getItem('gr_token') || user.role !== 'admin') {
      navigate('/admin');
    }
    api.get('/admin/stats').then(r => setStats(r.data)).catch(() => {});
  }, []);

  const logout = () => {
    localStorage.removeItem('gr_token');
    localStorage.removeItem('gr_user');
    navigate('/admin');
  };

  return (
    <div className="dash">
      {/* Topbar */}
      <div className="topbar" style={{ borderBottomColor: '#3a3060' }}>
        <div className="tb-brand">
          <span>🛡️</span>
          <span style={{ color: '#b08ad4' }}>GreenRoot Admin</span>
        </div>
        <div className="tb-right">
          <span style={{ fontSize: '.82rem', color: 'var(--muted)' }}>{user.name}</span>
          <div className="avatar" style={{ background: '#4a3a8a', color: '#b08ad4' }}>
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <button onClick={logout} className="btn-outline" style={{ fontSize: '.8rem' }}>Logout</button>
        </div>
      </div>

      {/* Nav tabs */}
      <div className="navtabs" style={{ borderBottomColor: '#3a3060' }}>
        {TABS.map(t => (
          <button key={t.id} className={`nav-tab ${tab === t.id ? 'active' : ''}`}
            style={tab === t.id ? { color: '#b08ad4', borderBottomColor: '#b08ad4' } : {}}
            onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="main-content">
        {tab === 'stats' && <OverviewTab stats={stats} />}
        {tab === 'users' && <AdminUsers />}
        {tab === 'nurseries' && <AdminNurseries />}
        {tab === 'plants' && <AdminPlants />}
        {tab === 'orders' && <AdminOrders />}
      </div>
    </div>
  );
}

function OverviewTab({ stats }) {
  if (!stats) return <div className="empty">Loading stats...</div>;
  return (
    <div className="fade-in">
      <div className="section-title">
        <span style={{ background: '#b08ad4' }} />
        Dashboard Overview
      </div>

      <div className="stats-row" style={{ gridTemplateColumns: 'repeat(2,1fr)' }}>
        <div className="stat" data-icon="👥">
          <div className="sv" style={{ color: '#b08ad4' }}>{stats.users}</div>
          <div className="sl">Total Users</div>
        </div>
        <div className="stat" data-icon="🏡">
          <div className="sv" style={{ color: 'var(--gold)' }}>{stats.nurseries}</div>
          <div className="sl">Nurseries</div>
        </div>
        <div className="stat" data-icon="📦">
          <div className="sv" style={{ color: 'var(--sage)' }}>{stats.orders}</div>
          <div className="sl">Total Orders</div>
        </div>
        <div className="stat" data-icon="💰">
          <div className="sv" style={{ color: 'var(--terra)' }}>₹{stats.revenue}</div>
          <div className="sl">Revenue</div>
        </div>
      </div>

      <div className="card" style={{ borderColor: '#3a3060', marginTop: '1rem' }}>
        <div className="card-h" style={{ color: '#b08ad4' }}>🛡️ Admin Controls</div>
        <p style={{ fontSize: '.9rem', color: 'var(--muted)', lineHeight: 1.7 }}>
          Use the tabs above to manage the platform:
          <br />• <strong style={{ color: 'var(--cream)' }}>Users</strong> — view all customers and owners, suspend/activate accounts
          <br />• <strong style={{ color: 'var(--cream)' }}>Nurseries</strong> — approve or reject nursery registrations
          <br />• <strong style={{ color: 'var(--cream)' }}>Plants</strong> — view all plants across all nurseries
          <br />• <strong style={{ color: 'var(--cream)' }}>Orders</strong> — monitor all customer orders
        </p>
      </div>
    </div>
  );
}
