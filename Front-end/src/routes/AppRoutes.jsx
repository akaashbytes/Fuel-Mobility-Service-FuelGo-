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

// Responder Pages
import ResponderDashboard from '../pages/responder/ResponderDashboard';
import EarningsPerformance from '../pages/responder/EarningsPerformance';

// Admin Pages
import GlobalOperationsCommand from '../pages/admin/GlobalOperationsCommand';
import RevenueCommandCenter from '../pages/admin/RevenueCommandCenter';
import FleetBusinessPortal from '../pages/admin/FleetBusinessPortal';

// Support Pages
import EmergencySafetyHub from '../pages/support/EmergencySafetyHub';
import HelpCenter from '../pages/support/HelpCenter';

export default function AppRoutes() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const role = useAuthStore((state) => state.role);

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/provider-portal" element={<ProviderPortal />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  // Routing structures for authenticated users
  return (
    <Routes>
      {/* Landing page & Provider portal are accessible to logged-in users too */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/provider-portal" element={<ProviderPortal />} />
      
      {/* Layout wrapper for protected dashboard workspace routes */}
      <Route element={<AppLayout />}>
        {role === 'admin' ? (
          <>
            <Route path="/dashboard" element={<GlobalOperationsCommand />} />
            <Route path="/revenue" element={<RevenueCommandCenter />} />
            <Route path="/fleet" element={<FleetBusinessPortal />} />
          </>
        ) : role === 'responder' ? (
          <>
            <Route path="/dashboard" element={<ResponderDashboard />} />
            <Route path="/earnings" element={<EarningsPerformance />} />
          </>
        ) : (
          // Customer Role
          <>
            <Route path="/dashboard" element={<CustomerDashboard />} />
            <Route path="/fuel-request" element={<EmergencyFuelRequest />} />
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
