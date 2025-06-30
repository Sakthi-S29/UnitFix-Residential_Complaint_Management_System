import React, { useState } from 'react';
import { Auth } from 'aws-amplify';
import { useNavigate } from 'react-router-dom';

const TenantResetPasswordConfirm = () => {
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const email = localStorage.getItem('resetEmail');
  const navigate = useNavigate();

  const handleConfirm = async (e) => {
    e.preventDefault();
    if (!code || !newPassword) {
      setError('All fields are required');
      return;
    }

    try {
      setLoading(true);
      await Auth.forgotPasswordSubmit(email, code, newPassword);
      setError('');
      console.log('✅ Password reset confirmed');
      navigate('/tenant-login'); // ✅ FIXED: Redirects to tenant login
    } catch (err) {
      console.error('Error confirming password reset:', err);
      setError(err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleConfirm} className="register-form">
      <h3>🔐 Confirm New Password</h3>
      <p className="form-subtitle">Enter the code sent to your email and set a new password.</p>

      <input
        type="text"
        placeholder="Confirmation Code"
        className="form-input"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="New Password"
        className="form-input"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button type="submit" className="gradient-btn" disabled={loading}>
        {loading ? 'Confirming...' : 'Confirm Password'}
      </button>
    </form>
  );
};

export default TenantResetPasswordConfirm;
