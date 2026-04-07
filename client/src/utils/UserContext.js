import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_BASE = useMemo(() => process.env.REACT_APP_API_URL || 'http://localhost:8000', []);

  const normalizeUser = useCallback((userData) => {
    if (!userData) return null;
    return {
      email: userData.email || '',
      role: userData.role || null,
      name: userData.name || '',
      phone_number: userData.phone_number || '',
      given_names: userData.given_names || '',
      family_name: userData.family_name || '',
      gender: userData.gender ?? null,
      weight: userData.weight ?? '',
      height: userData.height ?? '',
      date_of_birth: userData.date_of_birth || '',
    };
  }, []);

  const refreshUser = useCallback(() => {
    setLoading(true);
    return fetch(`${API_BASE}/user/me`, {
      method: 'GET',
      credentials: 'include'
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Not authenticated');
        }
        return response.json();
      })
      .then(userData => {
        const normalized = normalizeUser(userData);
        setUser(normalized);
        setLoading(false);
        return normalized;
      })
      .catch(() => {
        setUser(null);
        setLoading(false);
        return null;
      });
  }, [API_BASE, normalizeUser]);

  const updateUserFields = useCallback((updates) => {
    setUser((previous) => {
      if (!previous) return previous;
      return { ...previous, ...updates };
    });
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  return (
    <UserContext.Provider value={{ user, setUser, loading, refreshUser, updateUserFields }}>
      {children}
    </UserContext.Provider>
  );
};
