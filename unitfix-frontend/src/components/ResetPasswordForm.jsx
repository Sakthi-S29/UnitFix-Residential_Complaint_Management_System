import React, { useState } from 'react';
import { Auth } from 'aws-amplify';
import { useNavigate } from 'react-router-dom';

const ResetPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError('Email is required');
      return;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Enter a valid email');
      return;
    }

    try {
      setLoading(true);
      await Auth.forgotPassword(email);
      setError('');
      setSuccess('📩 If the email is registered, a reset code has been sent.');

      // Store email for confirm page
      localStorage.setItem('resetEmail', email);

      // Auto-redirect after 1.5 sec
      // In ResetPasswordForm.jsx

setTimeout(() => {
  if (window.location.pathname.includes('tenant')) {
    navigate('/tenant-reset-password-confirm'); // ✅ redirect for tenant
  } else {
    navigate('/reset-password-confirm'); // ✅ redirect for owner
  }
}, 1500);

    } catch (err) {
      console.error('Forgot password error:', err);
      setSuccess('');
      setError(err.message || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="register-form">
      <input
        type="email"
        placeholder="Email Address"
        className="form-input"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      {error && <small style={{ color: 'red' }}>{error}</small>}
      {success && <small style={{ color: '#00e8d0' }}>{success}</small>}

      <button type="submit" className="gradient-btn" disabled={loading}>
        {loading ? 'Sending...' : 'Send Reset Link'}
      </button>
    </form>
  );
};

export default ResetPasswordForm;
