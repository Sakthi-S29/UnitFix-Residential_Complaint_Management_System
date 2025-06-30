import React, { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { Auth } from 'aws-amplify';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/TenantHeader.css';

const TenantHeader = () => {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const { user, apartment, signOut } = useAuth();

  // ✅ Safe access
  const unitId = user?.unit_id || 'N/A';
  const email = user?.attributes?.email || 'N/A';
  const apartmentName = apartment || 'My Apartment';

  const handleLogout = async () => {
    try {
      await Auth.signOut();
      await signOut();
      navigate('/tenant-login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <header className="tenant-header">
      {/* Left: Logo + Apartment Info */}
      <div
        className="tenant-logo"
        onClick={() => navigate('/dashboard-tenant')}
        style={{
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          fontSize: '24px',
          fontWeight: 'bold',
          color: 'white'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span role="img" aria-label="logo" style={{ marginRight: '8px' }}>🏠</span>
          <span className="hover-underline">UnitFix</span>
        </div>
        <span style={{ fontSize: '14px', color: '#ccc', marginLeft: '32px' }}>
          🏢 {apartmentName}
        </span>
      </div>

      {/* Right: Profile Details + Menu */}
      <div className="profile-wrapper">
        <div className="tenant-info-block">
          <div className="tenant-line">📧 <span>{email}</span></div>
          <div className="tenant-line">🏢 <span>{apartmentName}</span></div>
          <div className="tenant-line">🧱 Unit: <span>{unitId}</span></div>
        </div>

        <FaUserCircle
          className="profile-icon"
          onClick={() => setShowMenu((prev) => !prev)}
        />

        {showMenu && (
          <div className="dropdown-menu">
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </header>
  );
};

export default TenantHeader;
