// src/components/dashboard/AdminHeader.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Auth } from 'aws-amplify';
import { useNavigate } from 'react-router-dom';
import '../../styles/AdminHeader.css';
import { useAuth } from '../../context/AuthContext'; // ✅ ADD THIS


const AdminHeader = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const { signOut } = useAuth(); // ✅ use your context to clean localStorage and state

  const handleLogout = async () => {
    try {
      await signOut();              // ✅ clears localStorage + user context
      localStorage.clear();         // ✅ safe fallback (if anything else was cached)
      navigate('/login');           // ✅ redirect to login
    } catch (error) {
      console.error('❌ Error signing out:', error);
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="admin-header">
      <div className="admin-header-left">
        <h2>UnitFix Admin Dashboard</h2>
      </div>
      <div className="admin-header-right" ref={dropdownRef}>
        <div className="profile-icon" onClick={toggleDropdown}>
          👤
        </div>
        {dropdownOpen && (
          <div className="dropdown-menu">
            <button onClick={() => alert('Profile page coming soon')}>My Profile</button>
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminHeader;
