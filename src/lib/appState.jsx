/**
 * Application State — District 05 Surveillance
 * Centralized React Context for auth, role, roepnummer, and unit status.
 * FIREBASE INTEGRATION POINT — Can be extended with Firebase auth state listener
 */
import React, { createContext, useContext, useState, useCallback } from 'react';

const AppStateContext = createContext(null);

export function AppStateProvider({ children }) {
  const [user, setUser] = useState(null);
  const [activeRole, setActiveRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [roepnummer, setRoepnummerState] = useState(
    () => localStorage.getItem('d05_roepnummer') || ''
  );
  const [unitStatus, setUnitStatusState] = useState(
    () => localStorage.getItem('d05_unit_status') || 'beschikbaar'
  );

  const login = useCallback((userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setActiveRole(null);
    setIsAuthenticated(false);
    localStorage.removeItem('d05_auth_token');
    localStorage.removeItem('d05_active_role');
  }, []);

  const selectRole = useCallback((role) => {
    setActiveRole(role);
    localStorage.setItem('d05_active_role', role);
  }, []);

  const clearRole = useCallback(() => {
    setActiveRole(null);
    localStorage.removeItem('d05_active_role');
  }, []);

  const setRoepnummer = useCallback((value) => {
    setRoepnummerState(value);
    localStorage.setItem('d05_roepnummer', value);
  }, []);

  const setUnitStatus = useCallback((status) => {
    setUnitStatusState(status);
    localStorage.setItem('d05_unit_status', status);
    // FIREBASE INTEGRATION POINT — PATCH /api/units/:unitId/status
  }, []);

  return (
    <AppStateContext.Provider value={{
      user, activeRole, isAuthenticated,
      roepnummer, unitStatus,
      login, logout, selectRole, clearRole,
      setRoepnummer, setUnitStatus,
    }}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider');
  return ctx;
}