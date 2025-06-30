import React from 'react';
import LoginForm from '../components/LoginForm';
import '../styles/Register.css'; // Use the same file that has .register-page styling
import Header from '../components/Header';

const LoginPage = () => {
  return (
    <>
      <Header />
    <div className="auth-page"> {/* Reuse the same centering layout */}
      <div className="register-box">
        <LoginForm />
      </div>
    </div>
    </>
  );
};

export default LoginPage;
