import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import AppLayout from '../components/layout/AppLayout';

// Landing Page
import LandingPage from '../pages/LandingPage';

// Provider Portal
import ProviderPortal from '../pages/ProviderPortal';

// Customer Pages
import CustomerDashboard from '../pages/customer/CustomerDashboard';
import EmergencyFuelRequest from '../pages/customer/EmergencyFuelRequest';
import RoadsideAssistanceRequest from '../pages/customer/RoadsideAssistanceRequest';
import LiveOrderTracking from '../pages/customer/LiveOrderTracking';
import VehicleProfileSettings from '../pages/customer/VehicleProfileSettings';
import WalletSubscriptions from '../pages/customer/WalletSubscriptions';
import PricingPlans from '../pages/customer/PricingPlans';
import OrderHistory from '../pages/customer/OrderHistory';

// Responder Pages
import ResponderDashboard from '../pages/responder/ResponderDashboard';
import EarningsPerformance from '../pages/responder/EarningsPerformance';
import VerificationPage from '../pages/responder/VerificationPage';

// Admin Pages
import GlobalOperationsCommand from '../pages/admin/GlobalOperationsCommand';
import RevenueCommandCenter from '../pages/admin/RevenueCommandCenter';
import FleetBusinessPortal from '../pages/admin/FleetBusinessPortal';
import OrdersManagement from '../pages/admin/OrdersManagement';
import ProviderManagement from '../pages/admin/ProviderManagement';
import ServiceAreaManagement from '../pages/admin/ServiceAreaManagement';
import AdminAnalytics from '../pages/admin/AdminAnalytics';
import CollaboratorsManagement from '../pages/admin/CollaboratorsManagement';
import AdminFeedback from '../pages/admin/AdminFeedback';
import AdminContactCenter from '../pages/admin/AdminContactCenter';
import AdminOperationsCenter from '../pages/admin/AdminOperationsCenter';

// Support Pages
import EmergencySafetyHub from '../pages/support/EmergencySafetyHub';
import HelpCenter from '../pages/support/HelpCenter';

import SecureAccess from '../pages/auth/SecureAccess';

export default function AppRoutes() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const role = useAuthStore((state) => state.role);

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/provider-portal" element={<ProviderPortal />} />
        <Route path="/login" element={<SecureAccess />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  // Routing structures for authenticated users
  return (
    <Routes>
      <Route path="/login" element={<Navigate to="/dashboard" replace />} />
      {/* Landing page & Provider portal are accessible to logged-in users too */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/provider-portal" element={<ProviderPortal />} />
      
      {/* Layout wrapper for protected dashboard workspace routes */}
      <Route element={<AppLayout />}>
        {role === 'admin' ? (
          <>
            <Route path="/dashboard" element={<GlobalOperationsCommand />} />
            <Route path="/admin/orders" element={<OrdersManagement />} />
            <Route path="/admin/providers" element={<ProviderManagement />} />
            <Route path="/revenue" element={<RevenueCommandCenter />} />
            <Route path="/admin/analytics" element={<AdminAnalytics />} />
            <Route path="/admin/collaborators" element={<CollaboratorsManagement />} />
            <Route path="/admin/feedback" element={<AdminFeedback />} />
            <Route path="/admin/contact-center" element={<AdminContactCenter />} />
            <Route path="/admin/operations" element={<AdminOperationsCenter />} />
            <Route path="/admin/service-areas" element={<ServiceAreaManagement />} />
            <Route path="/fleet" element={<FleetBusinessPortal />} />
          </>
        ) :role === 'responder' ? (
          <>
            <Route path="/dashboard" element={<ResponderDashboard />} />
            <Route path="/earnings" element={<EarningsPerformance />} />
            <Route path="/verification" element={<VerificationPage />} />
          </>
        ) : (
          // Customer Role
          <>
            <Route path="/dashboard" element={<CustomerDashboard />} />
            <Route path="/fuel-request" element={<EmergencyFuelRequest />} />
            <Route path="/orders" element={<OrderHistory />} />
            <Route path="/roadside-request" element={<RoadsideAssistanceRequest />} />
            <Route path="/tracking" element={<LiveOrderTracking />} />
            <Route path="/settings" element={<VehicleProfileSettings />} />
            <Route path="/wallet" element={<WalletSubscriptions />} />
            <Route path="/pricing" element={<PricingPlans />} />
            <Route path="/safety-hub" element={<EmergencySafetyHub />} />
            <Route path="/help" element={<HelpCenter />} />
          </>
        )}
        {/* Redirect for other unmatched routes */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}

