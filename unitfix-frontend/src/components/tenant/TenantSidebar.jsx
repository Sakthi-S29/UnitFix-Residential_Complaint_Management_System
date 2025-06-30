import React from 'react';
import { FaClipboardList, FaPlusCircle, FaWrench } from 'react-icons/fa';
import '../../styles/TenantSidebar.css';

const TenantSidebar = ({ selected, onSelect }) => {
  const navItems = [
    { key: 'myComplaints', icon: <FaClipboardList />, label: 'My Complaints' },
    { key: 'raiseComplaint', icon: <FaPlusCircle />, label: 'Raise Complaint' },
    { key: 'scheduledRepairs', icon: <FaWrench />, label: 'Scheduled Repairs' },
  ];

  return (
    <aside className="tenant-sidebar">
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

export default TenantSidebar;
