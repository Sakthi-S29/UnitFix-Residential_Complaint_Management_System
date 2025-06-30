import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children, role }) => {
  const { user, loading, userRole } = useAuth();

  if (loading) return <p>Loading...</p>;

  if (!user || (role && role !== userRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;
