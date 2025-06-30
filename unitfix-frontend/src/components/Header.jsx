// src/components/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';

const Header = () => {
  return (
    <header className="app-header">
      <Link to="/" className="brand-title"> UnitFix</Link>
    </header>
  );
};

export default Header;
