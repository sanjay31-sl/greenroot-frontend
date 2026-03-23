import { useEffect, useState } from 'react';
import api from '../../api/axios';

export default function AdminUsers() {
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [filter, setFilter]   = useState('all');

  const load = () => {
    api.get('/admin/users').then(r => setUsers(r.data.users || [])).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const toggleStatus = async (id, current) => {
    const newStatus = current === 'active' ? 'suspended' : 'active';
    if (!window.confirm(`${newStatus === 'suspended' ? 'Suspend' : 'Activate'} this user?`)) return;
    try {
      await api.patch(`/admin/users/${id}/status`, { status: newStatus });
      load();
    } catch (err) {
      alert('Failed to update user status');
    }
  };

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
                        u.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || u.role === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="fade-in">
      <div className="section-title">
        <span style={{ background: '#b08ad4' }} />
        Users ({users.length})
      </div>

      <div className="search-bar" style={{ marginBottom: '1rem' }}>
        <input placeholder="🔍 Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} />
        <select value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="all">All Roles</option>
          <option value="customer">Customers</option>
          <option value="owner">Owners</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      {loading && <div className="empty">Loading users...</div>}
      {!loading && filtered.length === 0 && <div className="empty">No users found</div>}

      {filtered.map(u => (
        <div key={u._id} style={{
          background: 'var(--bark)', border: '1px solid var(--border)', borderRadius: 12,
          padding: '1rem', marginBottom: '.7rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.8rem' }}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontWeight: 700, fontSize: '1rem', fontFamily: 'var(--ff-head)',
              background: u.role === 'admin' ? '#4a3a8a' : u.role === 'owner' ? '#3a2e10' : 'var(--moss)',
              color: u.role === 'admin' ? '#b08ad4' : u.role === 'owner' ? 'var(--gold)' : 'var(--sage)',
            }}>
              {u.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '.95rem' }}>{u.name}</div>
              <div style={{ fontSize: '.8rem', color: 'var(--muted)' }}>{u.email}</div>
              {u.phone && <div style={{ fontSize: '.78rem', color: 'var(--muted)' }}>{u.phone}</div>}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem' }}>
            <span style={{
              padding: '.18rem .55rem', borderRadius: 5, fontSize: '.72rem', fontWeight: 600,
              background: u.role === 'admin' ? '#4a3a8a40' : u.role === 'owner' ? '#c9a84c18' : '#6b8f4e18',
              color: u.role === 'admin' ? '#b08ad4' : u.role === 'owner' ? 'var(--gold)' : 'var(--sage)',
            }}>{u.role}</span>

            <span style={{
              padding: '.18rem .55rem', borderRadius: 5, fontSize: '.72rem', fontWeight: 600,
              background: u.status === 'active' ? '#6b8f4e18' : '#8b451318',
              color: u.status === 'active' ? 'var(--sage)' : 'var(--terra)',
            }}>{u.status}</span>

            {u.role !== 'admin' && (
              <button
                onClick={() => toggleStatus(u._id, u.status)}
                className="btn-outline"
                style={{
                  fontSize: '.75rem',
                  borderColor: u.status === 'active' ? '#8b4513' : 'var(--leaf)',
                  color: u.status === 'active' ? 'var(--terra)' : 'var(--sage)',
                }}>
                {u.status === 'active' ? '🚫 Suspend' : '✅ Activate'}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
