import React from 'react';
import Header from '../components/Header';
import TenantSignupForm from '../components/TenantSignupForm';
import '../styles/Register.css';

const TenantSignupPage = () => {
  return (
    <>
      <Header />
      <div className="register-page">
        <div className="register-box">
          <h3>📝 Tenant Signup</h3>
          <p>Create your UnitFix tenant account to report and track complaints.</p>
          <TenantSignupForm />
        </div>
      </div>
    </>
  );
};

export default TenantSignupPage;
