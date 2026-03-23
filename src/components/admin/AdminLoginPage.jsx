import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

export default function AdminLoginPage() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.user.role !== 'admin') {
        setError('Access denied. Admins only.');
        return;
      }
      localStorage.setItem('gr_token', res.data.token);
      localStorage.setItem('gr_user', JSON.stringify(res.data.user));
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page" style={{ background: 'linear-gradient(160deg, #0a0a0f 0%, #0f0f1a 40%, #1a1208 100%)' }}>
      <div className="auth-card" style={{ borderColor: '#3a3060' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.8rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '.5rem' }}>🛡️</div>
          <div style={{ fontFamily: 'var(--ff-head)', fontSize: '1.6rem', fontWeight: 700, color: '#b08ad4' }}>Admin Panel</div>
          <div style={{ fontSize: '.85rem', color: 'var(--muted)', marginTop: '.3rem' }}>GreenRoot Management</div>
        </div>

        {error && <div className="auth-err">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="fg">
            <label>Email</label>
            <input type="email" placeholder="admin@greenroot.com" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="fg">
            <label>Password</label>
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn-main" disabled={loading}
            style={{ background: 'linear-gradient(135deg, #4a3a8a, #6a5acd)' }}>
            {loading ? 'Signing in...' : '🔐 Sign In as Admin'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.2rem', fontSize: '.8rem', color: 'var(--muted)' }}>
          <a href="/" style={{ color: 'var(--sage)', textDecoration: 'none' }}>← Back to Customer App</a>
          &nbsp;·&nbsp;
          <a href="/owner" style={{ color: 'var(--gold)', textDecoration: 'none' }}>Owner Portal</a>
        </div>
      </div>
    </div>
  );
}
