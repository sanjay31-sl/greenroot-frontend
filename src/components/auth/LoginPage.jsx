import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const { login, register } = useAuth();
  const [tab, setTab]     = useState('login');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // login form state
  const [lEmail, setLEmail] = useState('');
  const [lPass,  setLPass]  = useState('');

  // register form state
  const [rName,  setRName]  = useState('');
  const [rEmail, setREmail] = useState('');
  const [rPass,  setRPass]  = useState('');
  const [rPhone, setRPhone] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!lEmail || !lPass) { setError('Please fill all fields'); return; }
    setError(''); setLoading(true);
    try {
      await login(lEmail, lPass);
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
      await register(rName, rEmail, rPass, rPhone, 'customer');
    } catch(err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}>

        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span style={{ fontSize: '3rem', display: 'block', animation: 'sway 4s ease-in-out infinite' }}>🌿</span>
          <div style={{
            fontFamily: 'var(--ff-head)', fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-1px',
            background: 'linear-gradient(135deg,var(--sage),var(--gold))',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>GreenRoot</div>
          <div style={{ color: 'var(--muted)', fontStyle: 'italic', fontSize: '.9rem', marginTop: '.3rem' }}>
            Your neighbourhood plant nursery
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
                <input type="email" placeholder="your@email.com" value={lEmail} onChange={e => setLEmail(e.target.value)} />
              </div>
              <div className="fg">
                <label>Password</label>
                <input type="password" placeholder="••••••••" value={lPass} onChange={e => setLPass(e.target.value)} />
              </div>
              <button className="btn-main" type="submit" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In 🌿'}
              </button>
              <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '.85rem', color: 'var(--muted)' }}>
                New here?{' '}
                <span style={{ color: 'var(--sage)', cursor: 'pointer' }} onClick={() => { setTab('reg'); setError(''); }}>
                  Create account
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
                <input type="email" placeholder="your@email.com" value={rEmail} onChange={e => setREmail(e.target.value)} />
              </div>
              <div className="fg">
                <label>Password</label>
                <input type="password" placeholder="min 6 characters" value={rPass} onChange={e => setRPass(e.target.value)} />
              </div>
              <div className="fg">
                <label>Phone</label>
                <input type="tel" placeholder="+91 9999999999" value={rPhone} onChange={e => setRPhone(e.target.value)} />
              </div>
              <button className="btn-main" type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Account 🌱'}
              </button>
              <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '.85rem', color: 'var(--muted)' }}>
                Already registered?{' '}
                <span style={{ color: 'var(--sage)', cursor: 'pointer' }} onClick={() => { setTab('login'); setError(''); }}>
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
