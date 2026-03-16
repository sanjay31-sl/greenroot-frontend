import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LoginPage   from './components/auth/LoginPage';
import CustomerApp from './components/customer/CustomerApp';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ color: 'var(--muted)', padding: '2rem', textAlign: 'center' }}>Loading...</div>;
  return user ? children : <Navigate to="/" replace />;
}

export default function App() {
  const { user } = useAuth();
  return (
    <BrowserRouter>
      <div id="toast" className="toast"></div>
      <Routes>
        <Route path="/"
          element={user ? <Navigate to="/app" replace /> : <LoginPage />}
        />
        <Route path="/app/*"
          element={
            <PrivateRoute>
              <CustomerApp />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
