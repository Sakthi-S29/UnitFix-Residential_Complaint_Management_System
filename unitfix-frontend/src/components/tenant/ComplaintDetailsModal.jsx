import React, { useEffect } from 'react';
import '../../styles/MyComplaints.css';

const ComplaintDetailsModal = ({ complaint, onClose }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return '⏳';
      case 'resolved': return '✅';
      case 'in_progress': return '🔄';
      default: return '📋';
    }
  };

  const getTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'maintenance': return '🔧';
      case 'noise': return '🔊';
      case 'cleanliness': return '🧹';
      case 'security': return '🔒';
      case 'other': return '📝';
      default: return '📋';
    }
  };

  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString('en-US', { 
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
  };

  const { date, time } = formatDateTime(complaint.timestamp);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-section">
            <div className="title-with-icon">
              <span className="modal-type-icon">{getTypeIcon(complaint.type)}</span>
              <h2 className="modal-title">{complaint.subject}</h2>
            </div>
            <div className={`modal-status-badge ${complaint.status?.toLowerCase()}`}>
              <span className="status-icon">{getStatusIcon(complaint.status)}</span>
              <span className="status-text">{complaint.status}</span>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <span className="close-icon">×</span>
          </button>
        </div>

        <div className="modal-body">
          <div className="complaint-details-grid">
            <div className="detail-card">
              <div className="detail-header">
                <span className="detail-icon">📋</span>
                <h4>Complaint Type</h4>
              </div>
              <p className="detail-value">{complaint.type}</p>
            </div>

            <div className="detail-card">
              <div className="detail-header">
                <span className="detail-icon">📅</span>
                <h4>Date Submitted</h4>
              </div>
              <p className="detail-value">{date}</p>
              <p className="detail-subtext">at {time}</p>
            </div>

            <div className="detail-card">
              <div className="detail-header">
                <span className="detail-icon">🏷️</span>
                <h4>Status</h4>
              </div>
              <div className={`status-display ${complaint.status?.toLowerCase()}`}>
                <span className="status-icon">{getStatusIcon(complaint.status)}</span>
                <span className="status-text">{complaint.status}</span>
              </div>
            </div>
          </div>

          <div className="description-section">
            <div className="description-header">
              <span className="detail-icon">📝</span>
              <h4>Description</h4>
            </div>
            <div className="description-content">
              <p>{complaint.concern || 'No description provided.'}</p>
            </div>
          </div>

          {complaint.complaint_id && (
            <div className="complaint-id-section">
              <span className="id-label">Complaint ID:</span>
              <code className="complaint-id">{complaint.complaint_id}</code>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="modal-action-btn secondary" onClick={onClose}>
            Close
          </button>
          <button className="modal-action-btn primary">
            <span className="btn-icon">📞</span>
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetailsModal;