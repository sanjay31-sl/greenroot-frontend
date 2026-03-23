import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';

import LoginPage      from './components/customer/LoginPage';
import CustomerApp    from './components/customer/CustomerApp';
import OwnerLoginPage from './components/owner/OwnerLoginPage';
import OwnerDashboard from './components/owner/OwnerDashboard';
import AdminLoginPage from './components/admin/AdminLoginPage';
import AdminDashboard from './components/admin/AdminDashboard';

function CustomerRoute() {
  const { user, token } = useAuth();
  if (!token || !user) return <Navigate to="/" />;
  if (user.role !== 'customer') return <Navigate to="/" />;
  return <CustomerApp />;
}

function OwnerRoute() {
  const token = localStorage.getItem('gr_token');
  const user  = JSON.parse(localStorage.getItem('gr_user') || '{}');
  if (!token || user.role !== 'owner') return <Navigate to="/owner" />;
  return <OwnerDashboard />;
}

function AdminRoute() {
  const token = localStorage.getItem('gr_token');
  const user  = JSON.parse(localStorage.getItem('gr_user') || '{}');
  if (!token || user.role !== 'admin') return <Navigate to="/admin" />;
  return <AdminDashboard />;
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <Routes>
              {/* Customer */}
              <Route path="/"         element={<LoginPage />} />
              <Route path="/app"      element={<CustomerRoute />} />

              {/* Owner */}
              <Route path="/owner"           element={<OwnerLoginPage />} />
              <Route path="/owner/dashboard" element={<OwnerRoute />} />

              {/* Admin */}
              <Route path="/admin"           element={<AdminLoginPage />} />
              <Route path="/admin/dashboard" element={<AdminRoute />} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
