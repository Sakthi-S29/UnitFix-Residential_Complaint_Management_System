import React from 'react';
import Header from '../components/Header';
import TenantLoginForm from '../components/TenantLoginForm';
import '../styles/Register.css';

const TenantLoginPage = () => {
  return (
    <>
      <Header />
      <div className="register-page">
        <div className="register-box">
          <TenantLoginForm />
        </div>
      </div>
    </>
  );
};

export default TenantLoginPage;
