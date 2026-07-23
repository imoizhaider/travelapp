import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { authService } from '../services/auth.service';
import { AUTH_EVENTS } from '../services/api';
import { TOKEN_KEY } from '../lib/constants';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [loading, setLoading] = useState(Boolean(token));
  const mountedRef = useRef(true);

  const clearAuth = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setUser(null);
      return;
    }

    let cancelled = false;

    authService
      .me()
      .then((response) => {
        if (cancelled || !mountedRef.current) return;
        setUser(response.data.user);
      })
      .catch(() => {
        if (cancelled || !mountedRef.current) return;
        clearAuth();
      })
      .finally(() => {
        if (!cancelled && mountedRef.current) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [token, clearAuth]);

  useEffect(() => {
    const handleUnauthorized = () => {
      if (mountedRef.current) clearAuth();
    };

    window.addEventListener(AUTH_EVENTS.UNAUTHORIZED, handleUnauthorized);
    return () => window.removeEventListener(AUTH_EVENTS.UNAUTHORIZED, handleUnauthorized);
  }, [clearAuth]);

  const login = useCallback(async (payload) => {
    const response = await authService.login(payload);
    localStorage.setItem(TOKEN_KEY, response.data.token);
    setToken(response.data.token);
    setUser(response.data.user);
    return response.data;
  }, []);

  const register = useCallback(async (payload) => {
    const response = await authService.register(payload);
    localStorage.setItem(TOKEN_KEY, response.data.token);
    setToken(response.data.token);
    setUser(response.data.user);
    return response.data;
  }, []);

  const logout = useCallback(() => {
    clearAuth();
  }, [clearAuth]);

  const value = useMemo(() => ({ user, token, loading, login, register, logout }), [user, token, loading, login, register, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};