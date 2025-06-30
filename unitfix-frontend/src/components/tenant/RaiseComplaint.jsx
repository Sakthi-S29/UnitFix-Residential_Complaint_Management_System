import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import '../../styles/RaiseComplaint.css';

const RaiseComplaint = () => {
  const { apartment, user } = useAuth();

  const [formData, setFormData] = useState({
    subject: '',
    type: '',
    concern: '',
    anonymous: false,
    file: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else if (type === 'file') {
      setFormData({ ...formData, file: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const readFileAsBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result.split(',')[1]; // remove metadata prefix
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      let fileBase64 = '';
      let fileName = '';
      if (formData.file) {
        fileBase64 = await readFileAsBase64(formData.file);
        fileName = formData.file.name;
      }

      const payload = {
        subject: formData.subject,
        type: formData.type,
        concern: formData.concern,
        anonymous: formData.anonymous,
        apartment: apartment || '',
        unit_id: user?.unit_id || '',
        submitted_by: user?.attributes?.email || '',
        file_data: fileBase64,
        file_name: fileName,
      };

      const response = await fetch('https://01obuwkezf.execute-api.us-east-1.amazonaws.com/submit-complaint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('✅ Complaint submitted successfully!');
        setFormData({
          subject: '',
          type: '',
          concern: '',
          anonymous: false,
          file: null,
        });
      } else {
        setMessage('❌ Failed to submit complaint. Try again.');
      }
    } catch (err) {
      console.error('Submit error:', err);
      setMessage('❌ Something went wrong. Try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="complaint-container">
      <h2>Raise a New Complaint</h2>
      <form className="complaint-form" onSubmit={handleSubmit}>
        <label>Subject</label>
        <input type="text" name="subject" value={formData.subject} onChange={handleChange} required />

        <label>Complaint Type</label>
        <select name="type" value={formData.type} onChange={handleChange} required>
          <option value="">Select Type</option>
          <option>Maintenance</option>
          <option>Noise</option>
          <option>Harassment</option>
          <option>Other</option>
        </select>

        <label>Concern</label>
        <textarea name="concern" rows="5" value={formData.concern} onChange={handleChange} required />

        <label>
          <input type="checkbox" name="anonymous" checked={formData.anonymous} onChange={handleChange} />
          Submit as Anonymous
        </label>

        <label>Attachments</label>
        <input type="file" name="file" onChange={handleChange} />

        <div className="form-actions">
          <button type="button" onClick={() => setFormData({
            subject: '',
            type: '',
            concern: '',
            anonymous: false,
            file: null,
          })}>Cancel</button>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>

        {message && (
          <p style={{ marginTop: '1rem', color: message.startsWith('✅') ? 'green' : 'red' }}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default RaiseComplaint;
