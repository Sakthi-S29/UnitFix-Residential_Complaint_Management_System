import React, { useState, useEffect } from 'react';
import '../../styles/ScheduleRepair.css';

const ScheduleRepair = () => {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [technician, setTechnician] = useState('');
  const [reply, setReply] = useState('');
  const [status, setStatus] = useState('In Progress');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchComplaints = async () => {
    try {
      const apartment = localStorage.getItem("apartment");
      if (!apartment) {
        setErrorMsg("Apartment information not found in localStorage.");
        return;
      }

      const encodedApartment = encodeURIComponent(apartment);
      const response = await fetch(`https://01obuwkezf.execute-api.us-east-1.amazonaws.com/apartment-complaints?apartment=${encodedApartment}`);
      const data = await response.json();

      if (response.ok) {
        setComplaints(Array.isArray(data) ? data : []);
      } else {
        setErrorMsg(data?.error || "Failed to load complaints.");
      }
    } catch (err) {
      console.error("Failed to fetch complaints:", err);
      setErrorMsg("Error loading complaints. Try again.");
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleSchedule = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    if (!selectedComplaint || !date || !time || !technician || !reply) {
      alert('Please fill in all required fields.');
      return;
    }

    const payload = {
      complaint_id: selectedComplaint.complaint_id,
      scheduled_date: date,
      scheduled_time: time,
      notes,
      technician,
      reply,
      new_status: status
    };

    try {
      setLoading(true);
      const res = await fetch('https://01obuwkezf.execute-api.us-east-1.amazonaws.com/schedule-repair', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await res.json();
      if (res.ok) {
        setSuccessMsg('✅ Repair scheduled and complaint status updated!');
        setSelectedComplaint(null);
        setDate('');
        setTime('');
        setNotes('');
        setTechnician('');
        setReply('');
        setStatus('In Progress');
        fetchComplaints();
      } else {
        setErrorMsg("❌ " + (result.error || "Something went wrong."));
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("❌ Unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-container">
      <h2>Schedule Repair</h2>

      {errorMsg && <p className="error-text">{errorMsg}</p>}
      {successMsg && <p className="success-text">{successMsg}</p>}

      <form onSubmit={handleSchedule} className="form-container">
        <label>
          Select Complaint:
          <select
            value={selectedComplaint?.complaint_id || ""}
            onChange={(e) => {
              const found = complaints.find(c => c.complaint_id === e.target.value);
              setSelectedComplaint(found || null);
            }}
            required
          >
            <option value="">-- Select --</option>
            {complaints.map(c => (
              <option key={c.complaint_id} value={c.complaint_id}>
                {c.subject} ({c.unit_id} - {c.submitted_by})
              </option>
            ))}
          </select>
        </label>

        <label>
          Choose Date:
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </label>

        <label>
          Choose Time:
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
        </label>

        <label>
          Technician Name:
          <input type="text" value={technician} onChange={(e) => setTechnician(e.target.value)} required />
        </label>

        <label>
          Reply / Resolution:
          <textarea value={reply} onChange={(e) => setReply(e.target.value)} required />
        </label>

        <label>
          Additional Notes (Optional):
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
        </label>

        <label>
          Status:
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Dismissed">Dismissed</option>
          </select>
        </label>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Submitting...' : 'Confirm Schedule'}
        </button>
      </form>

      {selectedComplaint && (
        <div className="complaint-preview-box">
          <h3>Complaint Preview</h3>
          <p><strong>Subject:</strong> {selectedComplaint.subject}</p>
          <p><strong>Unit:</strong> {selectedComplaint.unit_id}</p>
          <p><strong>Concern:</strong> {selectedComplaint.concern || "—"}</p>
          <p><strong>Status:</strong> {selectedComplaint.status}</p>
        </div>
      )}
    </div>
  );
};

export default ScheduleRepair;
