import React, { useState } from 'react';
import TenantSidebar from '../../components/tenant/TenantSidebar';
import TenantHeader from '../../components/tenant/TenantHeader';
import MyComplaints from '../../components/tenant/MyComplaints';
import RaiseComplaint from '../../components/tenant/RaiseComplaint';
import ScheduledRepairs from '../../components/tenant/ScheduledRepairs';
import '../../styles/TenantDashboard.css';

const TenantDashboard = () => {
  const [selectedSection, setSelectedSection] = useState('myComplaints');

  const renderSection = () => {
    switch (selectedSection) {
      case 'myComplaints':
        return <MyComplaints />;
      case 'raiseComplaint':
        return <RaiseComplaint />;
      case 'scheduledRepairs':
        return <ScheduledRepairs />;
      default:
        return <MyComplaints />;
    }
  };

  return (
    <div className="tenant-dashboard-container">
      <TenantHeader />
      <div className="tenant-dashboard-main">
        <TenantSidebar selected={selectedSection} onSelect={setSelectedSection} />
        <div className="tenant-dashboard-content">{renderSection()}</div>
      </div>
    </div>
  );
};

export default TenantDashboard;
