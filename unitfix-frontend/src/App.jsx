import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import RegisterApartmentPage from './pages/RegisterApartmentPage';
import LoginPage from './pages/LoginPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import TenantLoginPage from './pages/TenantLoginPage';
import TenantSignupPage from './pages/TenantSignupPage';
import ConfirmSignupPage from './pages/ConfirmSignupPage';
import ConfirmResetPasswordForm from './pages/ConfirmResetPasswordForm';
import TenantConfirmSignUp from './pages/TenantConfirmSignUp';
import TenantResetPasswordPage from './pages/TenantResetPasswordPage';
import TenantResetPasswordConfirm from './pages/TenantResetPasswordConfirm';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import ScheduleRepair from './pages/dashboard/ScheduleRepair';
import TenantDashboard from './pages/tenant/TenantDashboard';
import { Amplify } from 'aws-amplify';
import awsconfig from './aws-exports';
import ProtectedRoute from './components/ProtectedRoute'; // ✅ Updated

Amplify.configure(awsconfig);

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<WelcomePage />} />
        <Route path="/register-apartment" element={<RegisterApartmentPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/tenant-login" element={<TenantLoginPage />} />
        <Route path="/tenant-signup" element={<TenantSignupPage />} />
        <Route path="/confirm" element={<ConfirmSignupPage />} />
        <Route path="/reset-password-confirm" element={<ConfirmResetPasswordForm />} />
        <Route path="/tenant-confirm" element={<TenantConfirmSignUp />} />
        <Route path="/tenant-reset-password" element={<TenantResetPasswordPage />} />
        <Route path="/tenant-reset-password-confirm" element={<TenantResetPasswordConfirm />} />

        {/* Protected Routes with Role-Based Access */}
        <Route
          path="/dashboard-owner"
          element={
            <ProtectedRoute allowedRole="owner">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard-owner/schedule-repair"
          element={
            <ProtectedRoute allowedRole="owner">
              <ScheduleRepair />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard-tenant"
          element={
            <ProtectedRoute allowedRole="tenant">
              <TenantDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
