import { useEffect, useState } from 'react';
import api from '../../api/axios';

export default function AdminNurseries() {
  const [nurseries, setNurseries] = useState([]);
  const [loading, setLoading]     = useState(true);

  const load = () => {
    api.get('/admin/nurseries').then(r => setNurseries(r.data.nurseries || [])).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const approve = async (id) => {
    try {
      await api.patch(`/admin/nurseries/${id}/approve`);
      load();
    } catch { alert('Failed to approve'); }
  };

  const deleteNursery = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/admin/nurseries/${id}`);
      load();
    } catch { alert('Failed to delete'); }
  };

  const pending  = nurseries.filter(n => n.status === 'pending');
  const approved = nurseries.filter(n => n.status === 'approved');

  return (
    <div className="fade-in">
      <div className="section-title">
        <span style={{ background: '#b08ad4' }} />
        Nurseries ({nurseries.length})
      </div>

      {loading && <div className="empty">Loading nurseries...</div>}

      {!loading && pending.length > 0 && (
        <>
          <div style={{ fontSize: '.8rem', color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: '.6rem' }}>
            ⏳ Pending Approval ({pending.length})
          </div>
          {pending.map(n => <NurseryCard key={n._id} nursery={n} onApprove={approve} onDelete={deleteNursery} />)}
          <div style={{ marginBottom: '1rem' }} />
        </>
      )}

      {!loading && approved.length > 0 && (
        <>
          <div style={{ fontSize: '.8rem', color: 'var(--sage)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: '.6rem' }}>
            ✅ Approved ({approved.length})
          </div>
          {approved.map(n => <NurseryCard key={n._id} nursery={n} onApprove={approve} onDelete={deleteNursery} />)}
        </>
      )}

      {!loading && nurseries.length === 0 && <div className="empty">No nurseries yet</div>}
    </div>
  );
}

function NurseryCard({ nursery: n, onApprove, onDelete }) {
  return (
    <div style={{
      background: 'var(--bark)', border: `1px solid ${n.status === 'pending' ? '#c9a84c40' : 'var(--border)'}`,
      borderRadius: 12, padding: '1rem', marginBottom: '.7rem'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontFamily: 'var(--ff-head)', fontWeight: 700, fontSize: '1rem' }}>🏡 {n.name}</div>
          <div style={{ fontSize: '.82rem', color: 'var(--muted)', marginTop: '.3rem', lineHeight: 1.6 }}>
            {n.address && <span>📍 {n.address}<br /></span>}
            {n.phone && <span>📞 {n.phone}<br /></span>}
            {n.owner && <span>👤 {n.owner.name} ({n.owner.email})</span>}
          </div>
          {n.description && (
            <div style={{ fontSize: '.82rem', color: 'var(--mint)', marginTop: '.4rem' }}>{n.description}</div>
          )}
        </div>
        <span style={{
          padding: '.18rem .55rem', borderRadius: 5, fontSize: '.72rem', fontWeight: 600,
          background: n.status === 'approved' ? '#6b8f4e18' : '#c9a84c18',
          color: n.status === 'approved' ? 'var(--sage)' : 'var(--gold)',
        }}>{n.status}</span>
      </div>

      <div style={{ display: 'flex', gap: '.6rem', marginTop: '.8rem' }}>
        {n.status === 'pending' && (
          <button onClick={() => onApprove(n._id)} className="btn-main"
            style={{ width: 'auto', padding: '.45rem 1rem', fontSize: '.82rem', marginTop: 0 }}>
            ✅ Approve
          </button>
        )}
        <button onClick={() => onDelete(n._id, n.name)} className="btn-outline"
          style={{ fontSize: '.78rem', borderColor: '#8b4513', color: 'var(--terra)' }}>
          🗑️ Delete
        </button>
      </div>
    </div>
  );
}
