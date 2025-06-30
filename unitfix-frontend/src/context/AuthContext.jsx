import React, { createContext, useContext, useEffect, useState } from 'react';
import { Auth } from 'aws-amplify';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [apartment, setApartment] = useState(null);
  const [unitId, setUnitId] = useState(null);
  const [status, setStatus] = useState(null);
  const [tenants, setTenants] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Hydrate from localStorage on page load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedRole = localStorage.getItem('userRole');
    const storedApartment = localStorage.getItem('apartment');
    const storedUnitId = localStorage.getItem('unitId');
    const storedStatus = localStorage.getItem('status');
    const storedTenants = localStorage.getItem('tenants');

    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedRole) setUserRole(storedRole);
    if (storedApartment) setApartment(storedApartment);
    if (storedUnitId) setUnitId(storedUnitId);
    if (storedStatus) setStatus(storedStatus);
    if (storedTenants) setTenants(JSON.parse(storedTenants));

    setLoading(false);
  }, []);

  // ✅ When user logs in
  const setGlobalUser = (u) => {
    setUser(u);
    localStorage.setItem('user', JSON.stringify(u));

    const role = u?.attributes?.['custom:role'];
    const apt = u?.apartment || u?.attributes?.['custom:apartment'];
    const uid = u?.unit_id || null;
    const stat = u?.status || null;
    const tns = u?.tenants || null;

    setUserRole(role);
    setApartment(apt);
    setUnitId(uid);
    setStatus(stat);
    setTenants(tns);

    localStorage.setItem('userRole', role || '');
    localStorage.setItem('apartment', apt || '');
    localStorage.setItem('unitId', uid || '');
    localStorage.setItem('status', stat || '');
    localStorage.setItem('tenants', JSON.stringify(tns || []));
  };

  const setUserRoleFn = (role) => {
    setUserRole(role);
    localStorage.setItem('userRole', role || '');
  };

  const signOut = async () => {
    await Auth.signOut();
    setUser(null);
    setUserRole(null);
    setApartment(null);
    setUnitId(null);
    setStatus(null);
    setTenants(null);

    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    localStorage.removeItem('apartment');
    localStorage.removeItem('unitId');
    localStorage.removeItem('status');
    localStorage.removeItem('tenants');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userRole,
        apartment,
        unitId,
        status,
        tenants,
        loading,
        setGlobalUser,
        setUserRole: setUserRoleFn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
