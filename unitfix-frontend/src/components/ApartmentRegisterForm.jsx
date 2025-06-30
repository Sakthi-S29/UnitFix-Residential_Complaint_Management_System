import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import { useNavigate } from 'react-router-dom';
const ApartmentRegisterForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    apartment: '',
    address: '',
    phone: '',
    password: ''
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^\S+@\S+\.\S+$/;
    const phoneRegex = /^[0-9]{10}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;

    if (!formData.name.trim()) newErrors.name = 'Name is required.';
    if (!emailRegex.test(formData.email)) newErrors.email = 'Enter a valid email.';
    if (!formData.apartment.trim()) newErrors.apartment = 'Apartment name is required.';
    if (!formData.address.trim()) newErrors.address = 'Address is required.';
    if (!phoneRegex.test(formData.phone)) newErrors.phone = 'Phone must be 10 digits.';
    if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        'Password must be 8+ characters, include uppercase, lowercase, and a symbol.';
    }

    return newErrors;
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  const validationErrors = validate();
  if (Object.keys(validationErrors).length === 0) {
    try {
      const { name, email, password } = formData;
      
      // 👤 Sign up using AWS Cognito
      const user = await Auth.signUp({
        username: email,
        password,
        attributes: {
          name,
          email,
          'custom:role': 'owner',
          'custom:apartment': formData.apartment, // 👈 based on your user pool schema
        },
        autoSignIn: {
          enabled: true,
        },
      });

      console.log('✅ Cognito SignUp successful:', user);

      // You may want to redirect or show confirmation code input screen
      alert('Registration successful! Please check your email for the verification code.');
      navigate('/confirm', { state: { email: formData.email } });

    } catch (err) {
      console.error('❌ Cognito SignUp error:', err);
      alert(err.message || 'An error occurred during signup');
    }
  } else {
    setErrors(validationErrors);
  }
};


  return (
    <>
      <h2>🏢 Register Your Apartment</h2>
      <p className="subtitle">Become a part of UnitFix and manage complaints efficiently.</p>

      <form className="register-form" onSubmit={handleSubmit}>
        <input name="name" type="text" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
        {errors.name && <small style={{ color: 'red' }}>{errors.name}</small>}

        <input name="email" type="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required />
        {errors.email && <small style={{ color: 'red' }}>{errors.email}</small>}

        <input name="apartment" type="text" placeholder="Apartment Name" value={formData.apartment} onChange={handleChange} required />
        {errors.apartment && <small style={{ color: 'red' }}>{errors.apartment}</small>}

        <input name="address" type="text" placeholder="Address" value={formData.address} onChange={handleChange} required />
        {errors.address && <small style={{ color: 'red' }}>{errors.address}</small>}

        <input name="phone" type="tel" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required />
        {errors.phone && <small style={{ color: 'red' }}>{errors.phone}</small>}
<div className="field-wrapper">
  <label className="field-label">
    Password
    <span className="hint-text"> (8+ chars, uppercase, lowercase & symbol)</span>
  </label>
  <input
    name="password"
    type="password"
    className="form-input"
    placeholder="Password"
    value={formData.password}
    onChange={handleChange}
    required
  />
  {errors.password && <p className="error-text">{errors.password}</p>}
</div>


        <button type="submit" className="gradient-btn">Register Apartment</button>
      </form>

      <p className="login-link">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </>
  );
};

export default ApartmentRegisterForm;
