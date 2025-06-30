import React, { useState } from "react";

const ReplyPanel = ({ selectedComplaint }) => {
  const [technician, setTechnician] = useState("");
  const [reply, setReply] = useState("");
  const [status, setStatus] = useState(selectedComplaint.status || "Open");

  const handleSend = () => {
    console.log("Reply Sent:", { technician, reply });
    alert("Reply submitted successfully!");
  };

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    alert(`Status updated to "${newStatus}"`);
  };

  return (
    <div className="reply-panel">
      {selectedComplaint.repairScheduled && (
        <div style={{ marginBottom: "1rem", backgroundColor: "#f8f9fa", padding: "0.8rem", borderRadius: "5px" }}>
          <strong>Repair Scheduled:</strong> {selectedComplaint.repairDate} at {selectedComplaint.repairTime}
        </div>
      )}

      <h4>Assign to Technician</h4>
      <input
        type="text"
        value={technician}
        onChange={(e) => setTechnician(e.target.value)}
        placeholder="Technician name"
      />

      <h4>Reply / Resolution</h4>
      <textarea
        rows={4}
        value={reply}
        onChange={(e) => setReply(e.target.value)}
        placeholder="Enter your message or resolution notes"
      />
      <button onClick={handleSend}>Send</button>

      <h4>Status: 
  <span className={`badge ${
    status === "Open"
      ? "badge-open"
      : status === "In Progress"
      ? "badge-warning"
      : status === "Resolved"
      ? "badge-success"
      : "badge-danger"
  }`}>
    {status}
  </span>
</h4>

      <div className="status-buttons">
        <button
          onClick={() => handleStatusChange("In Progress")}
          style={{ background: status === "In Progress" ? "#ffc107" : "" }}
        >
          In Progress
        </button>
        <button
          onClick={() => handleStatusChange("Resolved")}
          style={{ background: status === "Resolved" ? "#28a745" : "" }}
        >
          Mark as Resolved
        </button>
        <button
          onClick={() => handleStatusChange("Dismissed")}
          style={{ background: status === "Dismissed" ? "#dc3545" : "" }}
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};

export default ReplyPanel;
