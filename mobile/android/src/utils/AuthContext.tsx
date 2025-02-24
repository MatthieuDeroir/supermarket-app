import React, { createContext, useContext, useState, useEffect } from 'react';
import { getToken, saveToken, deleteToken } from '../utils/authStorage';

interface AuthContextType {
  isAuth: boolean;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuth, setIsAuth] = useState<boolean>(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await getToken();
      setIsAuth(!!token);
    };
    checkAuth();
  }, []);

  const login = async (token: string) => {
    await saveToken(token);
    setIsAuth(true);
  };

  const logout = async () => {
    await deleteToken();
    setIsAuth(false);
  };

  return (
    <AuthContext.Provider value={{ isAuth, login, logout }}>
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
