import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import Header from '../components/Header';
import '../styles/Register.css';

const TenantConfirmSignUp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const emailFromState = location.state?.email || '';

  const [email, setEmail] = useState(emailFromState);
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');

  const handleConfirm = async (e) => {
    e.preventDefault();
    try {
      await Auth.confirmSignUp(email, code);
      alert('✅ Email confirmed! You can now log in.');
      navigate('/tenant-login');
    } catch (err) {
      console.error(err);
      setMessage(err.message || 'Confirmation failed.');
    }
  };

  return (
    <>
      <Header />
      <div className="auth-page">
        <div className="register-box">
          <form onSubmit={handleConfirm}>
            <h3>🔐 Confirm Your Email (Tenant)</h3>
            <p className="form-subtitle">Enter the verification code sent to your email.</p>

            <div className="field-wrapper">
              <label htmlFor="email" className="field-label">Email Address</label>
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="field-wrapper">
              <label htmlFor="code" className="field-label">Verification Code</label>
              <input
                id="code"
                type="text"
                className="form-input"
                placeholder="Verification Code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </div>

            {message && <p className="error-text">{message}</p>}

            <button type="submit" className="gradient-btn">Confirm</button>

            <p style={{ marginTop: '1rem' }}>
              Already confirmed?{' '}
              <Link to="/tenant-login" style={{ color: '#00e8d0', textDecoration: 'none' }}>
                Go to Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default TenantConfirmSignUp;
