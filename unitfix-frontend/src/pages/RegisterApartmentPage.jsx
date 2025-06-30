import React from 'react';
import '../styles/Register.css';
import Header from '../components/Header';
import ApartmentRegisterForm from '../components/ApartmentRegisterForm';

const RegisterApartmentPage = () => {
  return (
    <>
      <Header />
      <div className="auth-page">
        <div className="register-box">
          <ApartmentRegisterForm />
        </div>
      </div>
    </>
  );
};

export default RegisterApartmentPage;
