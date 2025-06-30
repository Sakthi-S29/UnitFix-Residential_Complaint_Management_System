import React, { useEffect, useState } from 'react';
import '../../styles/ScheduledRepairsTenant.css';
import { useAuth } from '../../context/AuthContext';

const ScheduledRepairs = () => {
  const [repairs, setRepairs] = useState([]);
  const [loading, setLoading] = useState(true);

  const { apartment, unitId } = useAuth();

  const fetchRepairs = async () => {
    if (!unitId || !apartment) {
      console.error("Missing unitId or apartment from context.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `https://01obuwkezf.execute-api.us-east-1.amazonaws.com/get-scheduled-repairs?unit_id=${encodeURIComponent(
          unitId
        )}&apartment=${encodeURIComponent(apartment)}`
      );
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
    <div className="scheduled-repairs-container">
      <h2>Scheduled Repairs</h2>
      {loading ? (
        <p>Loading...</p>
      ) : repairs.length === 0 ? (
        <p>No scheduled repairs.</p>
      ) : (
        <div className="repairs-list">
          {repairs.map((repair) => (
            <div key={repair.repair_id} className="repair-card">
              <h3>{repair.subject}</h3>
              <p><strong>Date:</strong> {repair.scheduled_date}</p>
              <p><strong>Time:</strong> {repair.scheduled_time}</p>
              <p><strong>Technician:</strong> {repair.technician}</p>
              <p><strong>Reply:</strong> {repair.reply}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ScheduledRepairs;
