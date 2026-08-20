import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService, userService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem('fresheye_token');
    const savedUser = localStorage.getItem('fresheye_user');
    const savedTheme = localStorage.getItem('fresheye_theme');

    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Failed to parse saved user');
      }
    }
    setLoading(false);
  }, []);

  const toggleTheme = useCallback(() => {
    const newDark = !isDark;
    setIsDark(newDark);
    if (newDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('fresheye_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('fresheye_theme', 'light');
    }
  }, [isDark]);

  const login = async (credentials) => {
    const result = await authService.login(credentials);
    if (result.success) {
      setToken(result.data.token);
      setUser(result.data.user);
      localStorage.setItem('fresheye_token', result.data.token);
      localStorage.setItem('fresheye_user', JSON.stringify(result.data.user));
    }
    return result;
  };

  const register = async (userData) => {
    const result = await authService.register(userData);
    if (result.success) {
      setToken(result.data.token);
      setUser(result.data.user);
      localStorage.setItem('fresheye_token', result.data.token);
      localStorage.setItem('fresheye_user', JSON.stringify(result.data.user));
    }
    return result;
  };

  const logout = async () => {
    await authService.logout();
    setToken(null);
    setUser(null);
    localStorage.removeItem('fresheye_token');
    localStorage.removeItem('fresheye_user');
  };

  const updateUser = (userData) => {
    setUser(prev => ({ ...prev, ...userData }));
    localStorage.setItem('fresheye_user', JSON.stringify({ ...user, ...userData }));
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      isAuthenticated: !!token,
      isDark,
      login,
      register,
      logout,
      toggleTheme,
      updateUser,
    }}>
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

export default AuthContext;
