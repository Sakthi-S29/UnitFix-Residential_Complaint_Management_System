// components/TenantSignup.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const TenantSignup = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/tenant-login');  // 🔁 Update route as needed
  };

  return (
    <div className="card">
      <h3>Tenant Login</h3>
      <p>Access your unit-specific complaint portal.</p>
      <button className="gradient-btn" onClick={handleClick}>
        Go to Tenant Login
      </button>
    </div>
  );
};

export default TenantSignup;
