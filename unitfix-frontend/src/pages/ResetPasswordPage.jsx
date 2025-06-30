// pages/ResetPasswordPage.jsx
import React from 'react';
import '../styles/Register.css';
import Header from '../components/Header';
import ResetPasswordForm from '../components/ResetPasswordForm';

const ResetPasswordPage = () => {
  return (
    <>
      <Header />
      <div className="register-page">
        <div className="register-box">
          <h2>🔐 Reset Your Password</h2>
          <p className="subtitle">Enter your registered email to receive a reset link.</p>
          <ResetPasswordForm />
        </div>
      </div>
    </>
  );
};

export default ResetPasswordPage;
