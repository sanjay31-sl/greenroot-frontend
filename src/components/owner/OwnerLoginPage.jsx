import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function OwnerLoginPage() {
  const { login, register } = useAuth();
  const [tab, setTab]     = useState('login');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // login form
  const [lEmail, setLEmail] = useState('');
  const [lPass,  setLPass]  = useState('');

  // register form
  const [rName,  setRName]  = useState('');
  const [rEmail, setREmail] = useState('');
  const [rPass,  setRPass]  = useState('');
  const [rPhone, setRPhone] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!lEmail || !lPass) { setError('Please fill all fields'); return; }
    setError(''); setLoading(true);
    try {
      const user = await login(lEmail, lPass);
      if (user && user.role !== 'owner') {
        setError('This account is not an owner account. Please use customer login.');
      }
    } catch(err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!rName || !rEmail || !rPass) { setError('Please fill all fields'); return; }
    if (rPhone && rPhone.replace(/\D/g, '').length < 10) { setError('Phone number must be at least 10 digits'); return; }
    if (rPass.length < 6) { setError('Password must be at least 6 characters'); return; }
    setError(''); setLoading(true);
    try {
      await register(rName, rEmail, rPass, rPhone, 'owner');
    } catch(err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}>

        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span style={{ fontSize: '3rem', display: 'block' }}>🏡</span>
          <div style={{
            fontFamily: 'var(--ff-head)', fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-1px',
            background: 'linear-gradient(135deg, #c8a84b, #e8c97a)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>Owner Portal</div>
          <div style={{ color: 'var(--muted)', fontStyle: 'italic', fontSize: '.9rem', marginTop: '.3rem' }}>
            GreenRoot Nursery Management
          </div>
        </div>

        {/* Card */}
        <div className="auth-card">
          <div className="tab-row">
            <button className={`tab-btn ${tab === 'login' ? 'active' : ''}`} onClick={() => { setTab('login'); setError(''); }}>Sign In</button>
            <button className={`tab-btn ${tab === 'reg'   ? 'active' : ''}`} onClick={() => { setTab('reg');   setError(''); }}>Register</button>
          </div>

          {error && <div className="auth-err">{error}</div>}

          {/* LOGIN */}
          {tab === 'login' && (
            <form onSubmit={handleLogin}>
              <div className="fg">
                <label>Email</label>
                <input type="email" placeholder="owner@email.com" value={lEmail} onChange={e => setLEmail(e.target.value)} />
              </div>
              <div className="fg">
                <label>Password</label>
                <input type="password" placeholder="••••••••" value={lPass} onChange={e => setLPass(e.target.value)} />
              </div>
              <button className="btn-main" type="submit" disabled={loading}
                style={{ background: 'linear-gradient(135deg, #c8a84b, #e8c97a)', color: '#1a1a1a' }}>
                {loading ? 'Signing in...' : 'Sign In 🏡'}
              </button>
              <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '.85rem', color: 'var(--muted)' }}>
                New owner?{' '}
                <span style={{ color: '#c8a84b', cursor: 'pointer' }} onClick={() => { setTab('reg'); setError(''); }}>
                  Create account
                </span>
              </div>
              <div style={{ textAlign: 'center', marginTop: '0.5rem', fontSize: '.85rem', color: 'var(--muted)' }}>
                Are you a customer?{' '}
                <span style={{ color: 'var(--sage)', cursor: 'pointer' }} onClick={() => window.location.href = '/'}>
                  Customer login
                </span>
              </div>
            </form>
          )}

          {/* REGISTER */}
          {tab === 'reg' && (
            <form onSubmit={handleRegister}>
              <div className="fg">
                <label>Full Name</label>
                <input type="text" placeholder="Your name" value={rName} onChange={e => setRName(e.target.value)} />
              </div>
              <div className="fg">
                <label>Email</label>
                <input type="email" placeholder="owner@email.com" value={rEmail} onChange={e => setREmail(e.target.value)} />
              </div>
              <div className="fg">
                <label>Password</label>
                <input type="password" placeholder="min 6 characters" value={rPass} onChange={e => setRPass(e.target.value)} />
              </div>
              <div className="fg">
                <label>Phone</label>
                <input type="tel" placeholder="+91 9999999999" value={rPhone} onChange={e => setRPhone(e.target.value)} />
              </div>
              <button className="btn-main" type="submit" disabled={loading}
                style={{ background: 'linear-gradient(135deg, #c8a84b, #e8c97a)', color: '#1a1a1a' }}>
                {loading ? 'Creating...' : 'Create Owner Account 🌱'}
              </button>
              <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '.85rem', color: 'var(--muted)' }}>
                Already registered?{' '}
                <span style={{ color: '#c8a84b', cursor: 'pointer' }} onClick={() => { setTab('login'); setError(''); }}>
                  Sign in
                </span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
