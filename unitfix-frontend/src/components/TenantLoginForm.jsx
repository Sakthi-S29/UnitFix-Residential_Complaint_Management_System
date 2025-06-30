import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import { useAuth } from '../context/AuthContext';

const API_BASE = "https://01obuwkezf.execute-api.us-east-1.amazonaws.com";

const TenantLoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [cognitoError, setCognitoError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { setGlobalUser, setUserRole } = useAuth();

  const validate = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(email)) newErrors.email = 'Enter a valid email';
    if (!password) newErrors.password = 'Password is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setCognitoError('');

    try {
      // Step 1: Sign in
      const user = await Auth.signIn(email, password);
      const role = user?.attributes?.['custom:role'];

      if (!user.attributes.email_verified) {
        setCognitoError('Please verify your email before logging in.');
        return;
      }

      if (role !== 'tenant') {
        setCognitoError('This portal is for tenants only.');
        return;
      }

      // Step 2: Get JWT token for DynamoDB call
      const session = await Auth.currentSession();
      const token = session.getIdToken().getJwtToken();

      // Step 3: Fetch apartment/unit info
      const response = await fetch(`${API_BASE}/get-tenant-apartment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!data?.apartment_id) {
        setCognitoError('Your apartment was not found. Contact your owner.');
        return;
      }

      // Step 4: Add tenant record to DynamoDB (idempotent)
      await fetch(`${API_BASE}/add-tenant-record`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token
        },
        body: JSON.stringify({
          email,
          name: user.attributes.name,
          apartment_id: data.apartment_id
        })
      });

      // Step 5: Store in context
      setGlobalUser({
        ...user,
        apartment: data.apartment_id,
        unit_id: data.unit_id,
        status: data.status,
        tenants: data.tenants
      });

      setUserRole(role);
      navigate('/dashboard-tenant');

    } catch (err) {
      console.error('❌ Tenant login failed:', err);
      if (err.code === 'UserNotConfirmedException') {
        setCognitoError('Please confirm your email before logging in.');
      } else {
        setCognitoError(err.message || 'Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="register-form">
      <h3>🧍 Tenant Login</h3>
      <p className="form-subtitle">Access your apartment portal with your credentials.</p>

      <div className="field-wrapper">
        <label htmlFor="tenant-email">Email Address</label>
        <input
          id="tenant-email"
          type="email"
          className="form-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {errors.email && <p className="error-text">{errors.email}</p>}
      </div>

      <div className="field-wrapper">
        <label htmlFor="tenant-password">Password</label>
        <input
          id="tenant-password"
          type="password"
          className="form-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errors.password && <p className="error-text">{errors.password}</p>}
        <div className="forgot-password">
          <Link to="/tenant-reset-password" className="forgot-password-link">Forgot Password?</Link>
        </div>
      </div>

      {cognitoError && <p className="error-text">{cognitoError}</p>}

      <button type="submit" className="gradient-btn" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>

      <p style={{ marginTop: '1rem' }}>
        Don’t have an account? <Link to="/tenant-signup">Sign up</Link>
      </p>
    </form>
  );
};

export default TenantLoginForm;
