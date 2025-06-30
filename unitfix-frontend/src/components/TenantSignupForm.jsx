import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Auth } from 'aws-amplify';

const API_BASE = "https://01obuwkezf.execute-api.us-east-1.amazonaws.com";

const TenantSignupForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    apartment: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [apartments, setApartments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🔁 Fetch list of registered apartments
  useEffect(() => {
    const fetchApartments = async () => {
      try {
        const res = await fetch(`${API_BASE}/get-apartments`);
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data = await res.json();
        setApartments(data);
      } catch (err) {
        console.error('Failed to fetch apartments:', err);
      }
    };
    fetchApartments();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    const { name, apartment, email, password, confirmPassword } = formData;
    const err = {};

    if (!name) err.name = 'Name is required';
    if (!apartment) err.apartment = 'Please select an apartment';
    if (!email || !/\S+@\S+\.\S+/.test(email)) err.email = 'Valid email is required';
    if (!password || password.length < 8 || !/[A-Z]/.test(password) || !/[!@#$%^&*]/.test(password)) {
      err.password = 'Password must be 8+ chars, include uppercase, lowercase, and symbol';
    }
    if (password !== confirmPassword) err.confirmPassword = 'Passwords do not match';

    return err;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validate();
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }

    const { name, apartment, email, password } = formData;
    setIsSubmitting(true);
    setErrors({});

    try {
      // ✅ Step 1: Register user in Cognito
      await Auth.signUp({
        username: email,
        password,
        attributes: {
          email,
          name,
          'custom:apartment': apartment,
          'custom:role': 'tenant'
        }
      });

      // ✅ Step 2: Show success and navigate to confirm page
      alert("Account created. Please check your email to confirm.");
      navigate('/tenant-confirm', { state: { email } });

    } catch (err) {
      console.error('Signup error:', err);
      if (err.code === 'UsernameExistsException') {
        setErrors({ form: 'User already exists. Try logging in.' });
      } else if (err.code === 'InvalidPasswordException') {
        setErrors({ form: 'Password policy not met. Try a stronger password.' });
      } else {
        setErrors({ form: err.message || 'Signup failed. Please try again.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="register-form" onSubmit={handleSubmit}>
      <label className="form-label">Full Name</label>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        className="form-input"
      />
      {errors.name && <p className="error-text">{errors.name}</p>}

      <label className="form-label">Select Apartment</label>
      <select
        name="apartment"
        value={formData.apartment}
        onChange={handleChange}
        className="form-input"
      >
        <option value="">Select Apartment</option>
        {apartments.map((apt) => (
          <option key={apt.id} value={apt.id}>{apt.name}</option>
        ))}
      </select>
      {errors.apartment && <p className="error-text">{errors.apartment}</p>}

      <label className="form-label">Email Address</label>
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        className="form-input"
      />
      {errors.email && <p className="error-text">{errors.email}</p>}

      <label className="form-label">Password</label>
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        className="form-input"
      />
      {errors.password && <p className="error-text">{errors.password}</p>}

      <label className="form-label">Confirm Password</label>
      <input
        type="password"
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleChange}
        className="form-input"
      />
      {errors.confirmPassword && <p className="error-text">{errors.confirmPassword}</p>}

      <button type="submit" className="gradient-btn" disabled={isSubmitting}>
        {isSubmitting ? 'Signing Up...' : 'Sign Up'}
      </button>
      {errors.form && <p className="error-text">{errors.form}</p>}

      <p className="login-link">
        Already a user? <Link to="/tenant-login">Login</Link>
      </p>
    </form>
  );
};

export default TenantSignupForm;
