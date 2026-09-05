import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('stocksense_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('stocksense_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('stocksense_token');
      if (storedToken) {
        try {
          const res = await authService.getMe();
          if (res.user) {
            setUser(res.user);
            localStorage.setItem('stocksense_user', JSON.stringify(res.user));
          }
        } catch (err) {
          console.warn('[AuthContext] Session invalid or expired.');
          setUser(null);
          setToken(null);
          localStorage.removeItem('stocksense_token');
          localStorage.removeItem('stocksense_user');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authService.login(email, password);
    setToken(res.token);
    setUser(res.user);
    localStorage.setItem('stocksense_token', res.token);
    localStorage.setItem('stocksense_user', JSON.stringify(res.user));
    return res.user;
  };

  const register = async (name, email, password) => {
    const res = await authService.register(name, email, password);
    setToken(res.token);
    setUser(res.user);
    localStorage.setItem('stocksense_token', res.token);
    localStorage.setItem('stocksense_user', JSON.stringify(res.user));
    return res.user;
  };

  const logout = async () => {
    await authService.logout();
    setToken(null);
    setUser(null);
    localStorage.removeItem('stocksense_token');
    localStorage.removeItem('stocksense_user');
  };

  const updatePreferences = async (preferences) => {
    const res = await authService.updatePreferences(preferences);
    if (user) {
      const updated = { ...user, preferences: res.preferences };
      setUser(updated);
      localStorage.setItem('stocksense_user', JSON.stringify(updated));
    }
    return res.preferences;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token,
        login,
        register,
        logout,
        updatePreferences
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
