import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RequireAuth = ({ children, allowedRole }) => {
  const { user, userRole, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/');
      } else if (allowedRole && userRole !== allowedRole) {
        navigate('/');
      }
    }
  }, [loading, user, userRole, allowedRole, navigate]);

  if (loading) return <p>Loading...</p>;

  return user ? children : null;
};

export default RequireAuth;
