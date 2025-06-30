import React from 'react';
import '../../styles/MyComplaints.css';

const ComplaintCard = ({ complaint, onClick }) => {
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

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  return (
    <div className="complaint-card" onClick={onClick}>
      <div className="card-header">
        <div className="complaint-title">
          <span className="type-icon">{getTypeIcon(complaint.type)}</span>
          <h3 className="subject">{complaint.subject}</h3>
        </div>
        <div className={`status-badge ${complaint.status?.toLowerCase()}`}>
          <span className="status-icon">{getStatusIcon(complaint.status)}</span>
          <span className="status-text">{complaint.status}</span>
        </div>
      </div>
      
      <div className="card-body">
        <div className="complaint-meta">
          <div className="meta-item">
            <span className="meta-label">Type</span>
            <span className="meta-value">{complaint.type}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Submitted</span>
            <span className="meta-value">{formatDate(complaint.timestamp)}</span>
          </div>
        </div>
        
        {complaint.concern && (
          <div className="complaint-preview">
            <p className="concern-text">
              {complaint.concern.length > 100 
                ? `${complaint.concern.substring(0, 100)}...` 
                : complaint.concern
              }
            </p>
          </div>
        )}
      </div>
      
      <div className="card-footer">
        <div className="view-details">
          <span>View Details</span>
          <span className="arrow-icon">→</span>
        </div>
      </div>
    </div>
  );
};

export default ComplaintCard;