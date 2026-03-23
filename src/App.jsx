import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';

import CustomerApp    from './components/customer/CustomerApp';
import OwnerLoginPage from './components/owner/OwnerLoginPage';
import OwnerDashboard from './components/owner/OwnerDashboard';
import AdminLoginPage from './components/admin/AdminLoginPage';
import AdminDashboard from './components/admin/AdminDashboard';

function CustomerLoginShell() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab]         = useState('signin');
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [password, setPass]   = useState('');
  const [phone, setPhone]     = useState('');
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      let user;
      if (tab === 'signin') {
        user = await login(email, password);
      } else {
        user = await register(name, email, password, phone, 'customer');
      }
      if (user.role === 'admin') navigate('/admin/dashboard');
      else if (user.role === 'owner') navigate('/owner/dashboard');
      else navigate('/app');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div style={{ textAlign: 'center', marginBottom: '1.8rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '.5rem', animation: 'sway 3s ease-in-out infinite', display: 'inline-block' }}>🌿</div>
          <div style={{ fontFamily: 'var(--ff-head)', fontSize: '1.8rem', fontWeight: 700 }}>GreenRoot</div>
          <div style={{ fontSize: '.85rem', color: 'var(--muted)', marginTop: '.3rem' }}>Your local plant nursery</div>
        </div>

        <div className="tab-row">
          <button className={`tab-btn ${tab === 'signin' ? 'active' : ''}`} onClick={() => { setTab('signin'); setError(''); }}>Sign In</button>
          <button className={`tab-btn ${tab === 'register' ? 'active' : ''}`} onClick={() => { setTab('register'); setError(''); }}>Register</button>
        </div>

        {error && <div className="auth-err">{error}</div>}

        <form onSubmit={handleSubmit}>
          {tab === 'register' && (
            <div className="fg">
              <label>Full Name</label>
              <input type="text" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} required />
            </div>
          )}
          <div className="fg">
            <label>Email</label>
            <input type="email" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="fg">
            <label>Password</label>
            <input type="password" placeholder="Password" value={password} onChange={e => setPass(e.target.value)} required />
          </div>
          {tab === 'register' && (
            <div className="fg">
              <label>Phone (optional)</label>
              <input type="tel" placeholder="Phone number" value={phone} onChange={e => setPhone(e.target.value)} />
            </div>
          )}
          <button type="submit" className="btn-main" disabled={loading}>
            {loading ? 'Please wait...' : tab === 'signin' ? '🌿 Sign In' : '🌱 Create Account'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.2rem', fontSize: '.8rem', color: 'var(--muted)' }}>
          <a href="/owner" style={{ color: 'var(--gold)', textDecoration: 'none' }}>Owner Portal</a>
          &nbsp;·&nbsp;
          <a href="/admin" style={{ color: '#b08ad4', textDecoration: 'none' }}>Admin</a>
        </div>
      </div>
    </div>
  );
}

function CustomerRoute() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/" replace />;
  if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
  if (user.role === 'owner') return <Navigate to="/owner/dashboard" replace />;
  return <CustomerApp />;
}

function OwnerRoute() {
  const token = localStorage.getItem('gr_token');
  const user  = JSON.parse(localStorage.getItem('gr_user') || '{}');
  if (!token || user.role !== 'owner') return <Navigate to="/owner" replace />;
  return <OwnerDashboard />;
}

function AdminRoute() {
  const token = localStorage.getItem('gr_token');
  const user  = JSON.parse(localStorage.getItem('gr_user') || '{}');
  if (!token || user.role !== 'admin') return <Navigate to="/admin" replace />;
  return <AdminDashboard />;
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <Routes>
              <Route path="/"                element={<CustomerLoginShell />} />
              <Route path="/app"             element={<CustomerRoute />} />
              <Route path="/owner"           element={<OwnerLoginPage />} />
              <Route path="/owner/dashboard" element={<OwnerRoute />} />
              <Route path="/admin"           element={<AdminLoginPage />} />
              <Route path="/admin/dashboard" element={<AdminRoute />} />
              <Route path="*"               element={<Navigate to="/" replace />} />
            </Routes>
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
