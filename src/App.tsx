import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import GardenHub from './components/GardenHub';
import PlantsPage from './components/PlantsPage';
import CarePage from './components/CarePage';
import Chat from './components/Chat';
import PlantDetail from './components/PlantDetail';
import Settings from './components/Settings';
import Plots from './components/Plots';
import PlotDetail from './components/PlotDetail';
import Financials from './components/Financials';
import ErrorBoundary from './components/ErrorBoundary';

import { FirebaseProvider, useFirebase } from './contexts/FirebaseContext';
import { AccessibilityProvider } from './contexts/AccessibilityContext';
import { ProgressProvider } from './contexts/ProgressContext';
import Login from './components/Login';

import { Toaster } from 'sonner';

function AppContent() {
  const { user, loading } = useFirebase();

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-container-lowest flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  // Served from the /Botanical-Management-System-/ subpath on GitHub Pages;
  // basename keeps client-side routes under it. import.meta.env.BASE_URL is
  // '/Botanical-Management-System-/' in the Pages build ('/' in dev).
  const basename = import.meta.env.BASE_URL.replace(/\/+$/, '') || '/';

  return (
    <Router basename={basename}>
      <Toaster position="top-right" richColors />
      <Layout>
        <Routes>
          <Route path="/" element={<GardenHub />} />
          {/* Consolidated: Plants = My Plants + Discover + Companions */}
          <Route path="/plants" element={<PlantsPage />} />
          <Route path="/inventory" element={<PlantsPage initialTab="mine" />} />
          <Route path="/library" element={<PlantsPage initialTab="discover" />} />
          <Route path="/companions" element={<PlantsPage initialTab="companions" />} />
          {/* Consolidated: Care = Treatments + Weeding + Schedule */}
          <Route path="/care" element={<CarePage />} />
          <Route path="/treatment" element={<CarePage initialTab="treatments" />} />
          <Route path="/weeding" element={<CarePage initialTab="weeding" />} />
          <Route path="/calendar" element={<CarePage initialTab="schedule" />} />
          {/* Rules now lives inside Settings */}
          <Route path="/rules" element={<Navigate to="/settings" replace />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/plant/:id" element={<PlantDetail />} />
          <Route path="/plots" element={<Plots />} />
          <Route path="/financials" element={<Financials />} />
          <Route path="/plots/:plotId" element={
            <ErrorBoundary>
              <PlotDetail />
            </ErrorBoundary>
          } />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default function App() {
  return (
    <FirebaseProvider>
      <AccessibilityProvider>
        <ProgressProvider>
          <AppContent />
        </ProgressProvider>
      </AccessibilityProvider>
    </FirebaseProvider>
  );
}
