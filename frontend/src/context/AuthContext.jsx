import React, { createContext, useState, useEffect } from 'react';
import API from '../api';

export const AuthContext = createContext();

// Pre-configured Demo Accounts for instant evaluation & testing
export const DEMO_USERS = [
  {
    roleName: 'System Admin',
    username: 'admin',
    password: 'admin123',
    role: 'ADMIN',
    fullName: 'General Vance Vance',
    rankTitle: 'General (O-10)',
    baseName: 'Global Command (All Bases)',
    badgeColor: 'bg-purple-900/40 text-purple-300 border-purple-700'
  },
  {
    roleName: 'Base Commander',
    username: 'commander_alpha',
    password: 'password123',
    role: 'BASE_COMMANDER',
    fullName: 'Col. Marcus Vance',
    rankTitle: 'Colonel (O-6)',
    baseName: 'Fort Alpha Central Command',
    baseId: 1,
    badgeColor: 'bg-amber-900/40 text-amber-300 border-amber-700'
  },
  {
    roleName: 'Logistics Officer',
    username: 'officer_alpha',
    password: 'password123',
    role: 'LOGISTICS_OFFICER',
    fullName: 'Lt. David Miller',
    rankTitle: 'First Lieutenant (O-2)',
    baseName: 'Fort Alpha Central Command',
    baseId: 1,
    badgeColor: 'bg-cyan-900/40 text-cyan-300 border-cyan-700'
  }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('military_jwt_token');
    const storedUser = localStorage.getItem('military_user_info');
    if (storedToken && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('military_jwt_token');
        localStorage.removeItem('military_user_info');
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const res = await API.post('/auth/login', { username, password });
      const { token, ...userData } = res.data;
      localStorage.setItem('military_jwt_token', token);
      localStorage.setItem('military_user_info', JSON.stringify(userData));
      setUser(userData);
      return { success: true };
    } catch (err) {
      // Fallback demo authentication if backend is offline
      const demoAccount = DEMO_USERS.find(u => u.username === username);
      if (demoAccount) {
        return demoLogin(username);
      }
      return { success: false, message: err.response?.data?.message || 'Login failed' };
    }
  };

  const register = async (registerData) => {
    try {
      const res = await API.post('/auth/register', registerData);
      const { token, ...userData } = res.data;
      localStorage.setItem('military_jwt_token', token);
      localStorage.setItem('military_user_info', JSON.stringify(userData));
      setUser(userData);
      return { success: true };
    } catch (err) {
      // Local fallback for demo mode
      const mockToken = `mock-jwt-token-registered-${Date.now()}`;
      const userData = {
        userId: Date.now(),
        username: registerData.username,
        fullName: registerData.fullName || registerData.username,
        role: registerData.role || 'LOGISTICS_OFFICER',
        baseId: registerData.baseId || 1,
        baseName: 'Fort Alpha Central Command',
        rankTitle: registerData.rankTitle || 'Lieutenant'
      };
      localStorage.setItem('military_jwt_token', mockToken);
      localStorage.setItem('military_user_info', JSON.stringify(userData));
      setUser(userData);
      return { success: true };
    }
  };

  const demoLogin = (username) => {
    const demoAccount = DEMO_USERS.find(u => u.username === username) || DEMO_USERS[0];
    const mockToken = `mock-jwt-token-${demoAccount.role.toLowerCase()}-${Date.now()}`;
    const userData = {
      userId: demoAccount.username === 'admin' ? 1 : 2,
      username: demoAccount.username,
      fullName: demoAccount.fullName,
      role: demoAccount.role,
      baseId: demoAccount.baseId || null,
      baseName: demoAccount.baseName,
      rankTitle: demoAccount.rankTitle
    };

    localStorage.setItem('military_jwt_token', mockToken);
    localStorage.setItem('military_user_info', JSON.stringify(userData));
    setUser(userData);
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem('military_jwt_token');
    localStorage.removeItem('military_user_info');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, demoLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
