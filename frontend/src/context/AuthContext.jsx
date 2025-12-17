import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/auth.service';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const ADMIN_EMAIL = "admin@gmail.com"; 

  const checkAdmin = (userData) => {
    if (!userData) return null;
    if (userData.email === ADMIN_EMAIL) {
      return { ...userData, role: 'admin' };
    }
    return { ...userData, role: 'user' }; 
  };

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    const userWithRole = checkAdmin(currentUser);
    setUser(userWithRole);
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const data = await authService.login(credentials);
      const userWithRole = checkAdmin(data.user);
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(userWithRole));
      
      setUser(userWithRole);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Login failed' };
    }
  };

  const register = async (userData) => {
    try {
      const data = await authService.register(userData);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Registration failed' };
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated: !!user }}>
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