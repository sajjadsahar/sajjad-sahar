import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserAuth } from '../types.js';
import { loginAdmin as apiLogin, verifyAdminAuth } from '../services/api.js';

interface AuthContextType {
  user: UserAuth | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (usernameOrEmail: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserAuth | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('sajjad_portfolio_jwt'));
  const [loading, setLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    const savedToken = localStorage.getItem('sajjad_portfolio_jwt');
    if (!savedToken) {
      setUser(null);
      setToken(null);
      setLoading(false);
      return;
    }

    try {
      const data = await verifyAdminAuth();
      setUser(data.user);
      setToken(savedToken);
    } catch {
      localStorage.removeItem('sajjad_portfolio_jwt');
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (usernameOrEmail: string, password: string) => {
    const data = await apiLogin(usernameOrEmail, password);
    localStorage.setItem('sajjad_portfolio_jwt', data.token);
    setToken(data.token);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem('sajjad_portfolio_jwt');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        loading,
        login,
        logout,
        refreshUser
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
