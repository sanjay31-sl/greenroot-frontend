import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LoginPage      from './components/auth/LoginPage';
import CustomerApp    from './components/customer/CustomerApp';
import OwnerLoginPage from './components/owner/OwnerLoginPage';
import OwnerDashboard from './components/owner/OwnerDashboard';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ color: 'var(--muted)', padding: '2rem', textAlign: 'center' }}>Loading...</div>;
  return user ? children : <Navigate to="/" replace />;
}

function OwnerRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ color: 'var(--muted)', padding: '2rem', textAlign: 'center' }}>Loading...</div>;
  if (!user) return <Navigate to="/owner" replace />;
  if (user.role !== 'owner') return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  const { user } = useAuth();
  return (
    <BrowserRouter>
      <div id="toast" className="toast"></div>
      <Routes>
        {/* Customer routes */}
        <Route path="/"
          element={user && user.role === 'customer' ? <Navigate to="/app" replace /> : <LoginPage />}
        />
        <Route path="/app/*"
          element={
            <PrivateRoute>
              <CustomerApp />
            </PrivateRoute>
          }
        />

        {/* Owner routes */}
        <Route path="/owner"
          element={user && user.role === 'owner' ? <Navigate to="/owner/dashboard" replace /> : <OwnerLoginPage />}
        />
        <Route path="/owner/dashboard/*"
          element={
            <OwnerRoute>
              <OwnerDashboard />
            </OwnerRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
