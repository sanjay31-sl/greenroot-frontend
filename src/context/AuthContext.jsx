import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('gr_user');
    if (stored) setUser(JSON.parse(stored));
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('gr_token', data.token);
    localStorage.setItem('gr_user',  JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const register = async (name, email, password, phone, role = 'customer') => {
    const { data } = await api.post('/auth/register', { name, email, password, phone, role });
    localStorage.setItem('gr_token', data.token);
    localStorage.setItem('gr_user',  JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('gr_token');
    localStorage.removeItem('gr_user');
    setUser(null);
  };

  const updateProfile = async (payload) => {
    const { data } = await api.put('/auth/profile', payload);
    const updated = { ...user, ...data.user };
    localStorage.setItem('gr_user', JSON.stringify(updated));
    setUser(updated);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
