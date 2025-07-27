// src/contexts/AuthContext.tsx
import React, { createContext, type ReactNode, useState, useEffect } from 'react';
import api from "../api/axios";

interface Auth {
  token: string | null;
  user: { username: string } | null;
  login: (u: string, p: string) => Promise<void>;
  logout: () => void;
}

// 🍎 Only one createContext here, with a safe default stub:
export const AuthContext = createContext<Auth>({
  token: null,
  user: null,
  login: async () => {},
  logout: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('jwt')
  );

  useEffect(() => {
    api.defaults.headers.common['Authorization'] = token
      ? `Bearer ${token}`
      : '';
  }, [token]);

  const login = async (username: string, password: string) => {
    const { data } = await api.post('token/', { username, password });
    setToken(data.access);
    localStorage.setItem('jwt', data.access);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('jwt');
  };

  return (
    <AuthContext.Provider value={{ token, user: null, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
