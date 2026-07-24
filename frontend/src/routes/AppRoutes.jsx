import React, { Suspense, lazy } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

import AppShell from '../components/layout/AppShell';
import Loader from '../components/common/Loader';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';

const HomePage = lazy(() => import('../features/home/pages/HomePage'));
const LoginPage = lazy(() => import('../features/auth/pages/LoginPage'));
const RegisterPage = lazy(() => import('../features/auth/pages/RegisterPage'));
const DashboardPage = lazy(() => import('../features/dashboard/pages/DashboardPage'));
const CreateTripPage = lazy(() => import('../features/trips/pages/CreateTripPage'));
const MyTripsPage = lazy(() => import('../features/trips/pages/MyTripsPage'));
const TripDetailsPage = lazy(() => import('../features/trips/pages/TripDetailsPage'));
const ProfilePage = lazy(() => import('../features/profile/pages/ProfilePage'));
const NotFoundPage = lazy(() => import('../features/errors/pages/NotFoundPage'));

function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Loader label="Loading page..." />
    </div>
  );
}

export default function AppRoutes() {
  const location = useLocation();

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes location={location} key={location.pathname}>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        <Route element={<AppShell><Navigate to="/dashboard" replace /></AppShell>} path="/redirect" />

        <Route path="/" element={<AppShell><HomePage /></AppShell>} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<AppShell><DashboardPage /></AppShell>} />
          <Route path="/create-trip" element={<AppShell><CreateTripPage /></AppShell>} />
          <Route path="/trips" element={<AppShell><MyTripsPage /></AppShell>} />
          <Route path="/trips/:tripId" element={<AppShell><TripDetailsPage /></AppShell>} />
          <Route path="/profile" element={<AppShell><ProfilePage /></AppShell>} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
