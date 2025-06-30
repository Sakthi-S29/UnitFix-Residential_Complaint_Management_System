import React, { useEffect, useState } from 'react';
import '../../styles/ScheduledRepairs.css';
import { useAuth } from '../../context/AuthContext';

const ScheduledRepairsOwner = () => {
  const [repairs, setRepairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { apartment } = useAuth();

  const fetchRepairs = async () => {
    if (!apartment) {
      console.error("Apartment not found in context.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`https://01obuwkezf.execute-api.us-east-1.amazonaws.com/get-scheduled-repairs-owner?apartment=${encodeURIComponent(apartment)}`);
      const data = await res.json();
      setRepairs(data);
    } catch (err) {
      console.error("Failed to fetch scheduled repairs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepairs();
  }, []);

  return (
    <div className="section-container">
      <h2>Scheduled Repairs</h2>
      {loading ? (
        <p>Loading...</p>
      ) : repairs.length === 0 ? (
        <p>No scheduled repairs found for your apartment.</p>
      ) : (
        <ul className="scheduled-repair-list">
          {repairs.map((repair) => (
            <li key={repair.repair_id} className="scheduled-repair-item">
              <strong>{repair.subject}</strong> — Unit {repair.unit_id} ({repair.tenant})<br />
              <span>Date: {repair.scheduled_date} | Time: {repair.scheduled_time}</span><br />
              <span>Status: {repair.status || "Scheduled"}</span><br />
              <span>Technician: {repair.technician || "TBD"}</span><br />
              <span>Notes: {repair.notes || "N/A"}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ScheduledRepairsOwner;
