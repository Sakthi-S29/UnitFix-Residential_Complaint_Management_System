// pages/dashboard/AdminDashboard.jsx
import React, { useState } from "react";
import AdminHeader from "../../components/dashboard/AdminHeader";
import AdminSidebar from "../../components/dashboard/AdminSidebar";
import AddTenant from "../../components/dashboard/AddTenant"; // ✅ Import the actual component
import "../../styles/AdminDashboard.css";
import ManageTenants from '../../components/dashboard/ManageTenants'; // ✅ Add this
import ManageUnits from "../../components/dashboard/ManageUnits";  // ⬅️ Import it
import Complaints from "../../components/dashboard/Complaints";
import ScheduleRepair from '../../pages/dashboard/ScheduleRepair'; // ✅ Add this
import ScheduledRepairs from '../../components/dashboard/ScheduledRepairs';

const AdminDashboard = () => {
  const [selectedSection, setSelectedSection] = useState("inbox");

  const renderContent = () => {
  switch (selectedSection) {
    case"inbox":
      return <Complaints />;
    case "addTenant":
      return <AddTenant />;
    case "manageTenants":
      return <ManageTenants />;
    case "manageUnits":
      return <ManageUnits />;
    case "scheduleRepair":
      return <ScheduleRepair />;
    case "completed":
      return <ScheduledRepairs />;

    default:
      return (
        <div className="section-container">
          <h2>Welcome to the Admin Dashboard</h2>
          <p>Section selected: {selectedSection}</p>
          <p>This content will be updated once all modules are integrated.</p>
        </div>
      );
  }
};


  return (
    <div className="admin-dashboard-container">
      <AdminHeader />
      <div className="admin-dashboard-main">
        <AdminSidebar selected={selectedSection} onSelect={setSelectedSection} />
        <div className="admin-dashboard-content">{renderContent()}</div>
      </div>
    </div>
  );
};

export default AdminDashboard;
