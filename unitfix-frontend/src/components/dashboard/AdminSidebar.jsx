import React from 'react';
import {
  FaInbox,
  FaPlus,
  FaPaperPlane,
  FaEdit,
  FaTools,
  FaCheckCircle,
} from 'react-icons/fa';
import '../../styles/AdminSidebar.css';

const AdminSidebar = ({ selected, onSelect }) => {
  const navItems = [
    { key: 'inbox', icon: <FaInbox />, label: 'Complaints' },
    { key: 'addTenant', icon: <FaPlus />, label: 'Add Tenant' },
    { key: 'manageUnits', icon: <FaPaperPlane />, label: 'Manage Units' },
    { key: 'manageTenants', icon: <FaEdit />, label: 'Manage Tenants' },
    { key: 'scheduleRepair', icon: <FaTools />, label: 'Schedule Repair' },
    { key: 'completed', icon: <FaCheckCircle />, label: 'Completed' },
  ];

  return (
    <aside className="admin-sidebar">
      <h2 className="sidebar-title">MENU</h2>
      <ul className="sidebar-nav">
        {navItems.map((item) => (
          <li
            key={item.key}
            className={`nav-item ${selected === item.key ? 'active' : ''}`}
            onClick={() => onSelect(item.key)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default AdminSidebar;
