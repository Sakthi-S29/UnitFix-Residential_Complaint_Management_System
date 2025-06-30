import React, { useEffect, useState } from 'react';
import ComplaintCard from './ComplaintCard';
import ComplaintDetailsModal from './ComplaintDetailsModal';
import { useAuth } from '../../context/AuthContext';
import '../../styles/MyComplaints.css';

const MyComplaints = () => {
  const { user, apartment } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [visibleCount, setVisibleCount] = useState(4);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams({
          // email: user?.attributes?.email || '',
          unit_id: user?.unit_id || '',
          apartment: apartment || ''
        });

        const response = await fetch(
          `https://01obuwkezf.execute-api.us-east-1.amazonaws.com/get-complaints?${queryParams}`
        );

        const data = await response.json();

        if (response.ok && Array.isArray(data)) {
          setComplaints(data);
        } else {
          console.warn('Unexpected data structure:', data);
        }
      } catch (err) {
        console.error('Error fetching complaints:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [user, apartment]);

  const filtered = complaints
    .filter((c) => c.subject?.toLowerCase().includes(search.toLowerCase()))
    .filter((c) => filter === 'ALL' || c.status?.toUpperCase() === filter);

  const visibleComplaints = filtered.slice(0, visibleCount);

  const getStatusCount = (status) => {
    return complaints.filter(c => status === 'ALL' || c.status?.toUpperCase() === status).length;
  };

  const gridStyles = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem',
    padding: '1rem 0',
    width: '100%'
  };

  return (
    <div className="complaints-container">
      <div className="complaints-header">
        <div className="header-content">
          <h2 className="page-title">
            <span className="title-icon">📋</span>
            My Complaints
          </h2>
          <div className="stats-row">
            <div className="stat-chip">
              <span className="stat-number">{complaints.length}</span>
              <span className="stat-label">Total</span>
            </div>
            <div className="stat-chip pending">
              <span className="stat-number">{getStatusCount('PENDING')}</span>
              <span className="stat-label">Pending</span>
            </div>
            <div className="stat-chip resolved">
              <span className="stat-number">{getStatusCount('RESOLVED')}</span>
              <span className="stat-label">Resolved</span>
            </div>
          </div>
        </div>

        <div className="filters-section">
          <div className="search-wrapper">
            <div className="search-input-container">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search complaints..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          <div className="filter-wrapper">
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="filter-select"
            >
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>
        </div>
      </div>

      <div className="complaints-content">
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading complaints...</p>
          </div>
        ) : visibleComplaints.length > 0 ? (
          <div className="complaint-grid" style={gridStyles}>
            {visibleComplaints.map((c) => (
              <ComplaintCard 
                key={c.complaint_id} 
                complaint={c} 
                onClick={() => setSelectedComplaint(c)}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h3>No complaints found</h3>
            <p>
              {search || filter !== 'ALL' 
                ? 'Try adjusting your search or filter criteria' 
                : 'You haven\'t submitted any complaints yet'
              }
            </p>
          </div>
        )}
      </div>

      {!loading && visibleCount < filtered.length && (
        <div className="load-more-section">
          <button 
            className="load-more-btn" 
            onClick={() => setVisibleCount((v) => v + 4)}
          >
            <span>Load More</span>
            <span className="load-more-icon">↓</span>
          </button>
        </div>
      )}

      {selectedComplaint && (
        <ComplaintDetailsModal
          complaint={selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
        />
      )}
    </div>
  );
};

export default MyComplaints;
