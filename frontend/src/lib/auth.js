import React, { createContext, useContext, useState, useEffect } from 'react';
import { verifyAdmin } from './api';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('sentinelx_token');
    if (storedToken) {
      setToken(storedToken);
      verifyAdmin()
        .then((res) => {
          if (res.data.valid) {
            setUser(res.data.user);
          } else {
            localStorage.removeItem('sentinelx_token');
          }
        })
        .catch(() => {
          localStorage.removeItem('sentinelx_token');
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = (newToken, newUser) => {
    localStorage.setItem('sentinelx_token', newToken);
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('sentinelx_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAdmin: user?.role === 'admin',
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
