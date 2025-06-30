import React, { useEffect, useState } from "react";
import "../../styles/Complaints.css";
import { useAuth } from '../../context/AuthContext';

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const { apartment, loading: authLoading, user } = useAuth();

  const fetchComplaints = async (apartmentName) => {
    setLoading(true);
    try {
      const encodedApartment = encodeURIComponent(apartmentName);
      const res = await fetch(
        `https://01obuwkezf.execute-api.us-east-1.amazonaws.com/apartment-complaints?apartment=${encodedApartment}`
      );
      const data = await res.json();
      setComplaints(data);
    } catch (err) {
      console.error("Error fetching complaints:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;

    if (user && apartment) {
      fetchComplaints(apartment);
    } else {
      console.warn("User not logged in or apartment missing");
      setLoading(false);
    }
  }, [authLoading, user, apartment]);

  const handleAttachmentClick = async (complaintId) => {
    try {
      const res = await fetch("https://01obuwkezf.execute-api.us-east-1.amazonaws.com/get-attachment-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ complaint_id: complaintId }),
      });

      const data = await res.json();
      if (res.ok) {
        window.open(data.url, "_blank");
      } else {
        alert("❌ Failed to load attachment.");
      }
    } catch (err) {
      console.error("Attachment error:", err);
      alert("❌ Error retrieving attachment.");
    }
  };

  return (
    <div className="complaints-container">
      <div className="complaint-list">
        <h2>📥 Inbox</h2>
        {loading ? (
          <p>Loading complaints...</p>
        ) : !apartment ? (
          <p>Apartment information missing. Please re-login.</p>
        ) : complaints.length === 0 ? (
          <p>No complaints found for apartment "{apartment}".</p>
        ) : (
          complaints.map((c) => (
            <div
              key={c.complaint_id}
              className={`complaint-card ${
                selectedComplaint?.complaint_id === c.complaint_id ? "active" : ""
              }`}
              onClick={() => setSelectedComplaint(c)}
            >
              <div className="complaint-header">
                <h4>{c.subject}</h4>
                <span>{c.status}</span>
              </div>
              <p>{c.concern.slice(0, 60)}...</p>
              <div className="complaint-meta">
                <small>
                  Unit {c.unit_id} • {c.anonymous ? "Anonymous" : c.submitted_by}
                </small>
                <small>{new Date(c.timestamp).toLocaleDateString()}</small>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="complaint-details">
        {selectedComplaint ? (
          <div>
            <h3>{selectedComplaint.subject}</h3>
            <p>
              <strong>Tenant:</strong>{" "}
              {selectedComplaint.anonymous ? "Anonymous" : selectedComplaint.submitted_by}
            </p>
            <p>
              <strong>Unit:</strong> {selectedComplaint.unit_id}
            </p>
            <p>
              <strong>Status:</strong> {selectedComplaint.status}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(selectedComplaint.timestamp).toLocaleDateString()}
            </p>
            <p>
              <strong>Type:</strong> {selectedComplaint.type}
            </p>
            <p>{selectedComplaint.concern}</p>

            {selectedComplaint.attachment_url && (
              <p>
                <strong>Attachment:</strong>{" "}
                <button
                  onClick={() => handleAttachmentClick(selectedComplaint.complaint_id)}
                  className="view-attachment-button"
                >
                  View Attachment
                </button>
              </p>
            )}
          </div>
        ) : (
          <div className="empty-state">
            <p>Select a complaint to view details</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Complaints;
