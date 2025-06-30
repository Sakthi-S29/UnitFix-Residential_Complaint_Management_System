import React, { useState } from 'react';
import { Auth } from 'aws-amplify';
import { useNavigate, Link } from 'react-router-dom';

const ConfirmResetPasswordForm = () => {
  const [email, setEmail] = useState(localStorage.getItem('resetEmail') || '');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !code || !newPassword || !confirmPassword) {
      setError('All fields are required');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      await Auth.forgotPasswordSubmit(email, code, newPassword);
      setSuccess(true);
      setError('');
      localStorage.removeItem('resetEmail');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#e8fdf8] px-4">
      <div className="bg-[#1e1e2f] text-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h3 className="text-2xl font-bold text-[#00e8d0] mb-2">🔐 Reset Your Password</h3>
        <p className="form-subtitle mb-4">Enter the verification code sent to your email and set a new password.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="field-wrapper">
            <label htmlFor="email" className="field-label">Email Address</label>
            <input
              id="email"
              type="email"
              className="form-input"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="field-wrapper">
            <label htmlFor="code" className="field-label">Verification Code</label>
            <input
              id="code"
              type="text"
              className="form-input"
              placeholder="Enter Code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>

          <div className="field-wrapper">
            <label htmlFor="newPassword" className="field-label">New Password</label>
            <input
              id="newPassword"
              type="password"
              className="form-input"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div className="field-wrapper">
            <label htmlFor="confirmPassword" className="field-label">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              className="form-input"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {error && <p className="error-text">{error}</p>}
          {success && <p className="text-green-400">✅ Password successfully reset! Redirecting...</p>}

          <button type="submit" className="gradient-btn w-full" disabled={loading}>
            {loading ? 'Resetting...' : 'Confirm Reset'}
          </button>

          <p style={{ marginTop: '1rem' }}>
            Back to{' '}
            <Link to="/login" className="text-[#00e8d0] hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ConfirmResetPasswordForm;
