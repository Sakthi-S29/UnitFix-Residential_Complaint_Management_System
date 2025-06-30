// pages/TenantResetPasswordPage.jsx
import React from 'react';
import Header from '../components/Header';
import ResetPasswordForm from '../components/ResetPasswordForm';

const TenantResetPasswordPage = () => {
  return (
    <>
      <Header />
      <div className="register-page">
        <div className="register-box">
          <h2>🔐 Tenant Password Reset</h2>
          <p className="subtitle">Enter your tenant email to receive a reset code.</p>
          <ResetPasswordForm />
        </div>
      </div>
    </>
  );
};

export default TenantResetPasswordPage;
