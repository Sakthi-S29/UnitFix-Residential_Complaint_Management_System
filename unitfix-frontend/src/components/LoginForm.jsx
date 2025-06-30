import React, { useState } from 'react';
import { Auth } from 'aws-amplify';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginForm = () => {
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
      const user = await Auth.signIn(email, password);
      const role = user?.attributes?.['custom:role'];

      if (!user.attributes.email_verified) {
        setCognitoError('Please verify your email before logging in.');
        return;
      }

      setGlobalUser(user);
      setUserRole(role);

      if (role === 'owner') navigate('/dashboard-owner');
      else setCognitoError('This login form is only for apartment managers (owners).');
    } catch (err) {
      console.error('❌ Login error:', err);
      setCognitoError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>🔑 Apartment Manager Login</h3>
      <p className="form-subtitle">Access your dashboard and manage apartment issues.</p>

      <div className="field-wrapper">
        <label htmlFor="email">Email Address</label>
        <input id="email" type="email" className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} />
        {errors.email && <p className="error-text">{errors.email}</p>}
      </div>

      <div className="field-wrapper">
        <label htmlFor="password">Password</label>
        <input id="password" type="password" className="form-input" value={password} onChange={(e) => setPassword(e.target.value)} />
        {errors.password && <p className="error-text">{errors.password}</p>}
        <div className="forgot-password">
          <Link to="/reset-password" className="forgot-password-link">Forgot Password?</Link>
        </div>
      </div>

      {cognitoError && <p className="error-text">{cognitoError}</p>}

      <button type="submit" className="gradient-btn" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>

      <p style={{ marginTop: '1rem' }}>
        Don’t have an account? <Link to="/register-apartment">Register Here</Link>
      </p>
    </form>
  );
};

export default LoginForm;
