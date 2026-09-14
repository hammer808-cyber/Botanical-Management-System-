import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import GardenHub from './components/GardenHub';
import Treatment from './components/Treatment';
import Library from './components/Library';
import Chat from './components/Chat';
import GardenMap from './components/GardenMap';
import PlantDetail from './components/PlantDetail';
import Inventory from './components/Inventory';
import Rules from './components/Rules';
import Weeding from './components/Weeding';
import Settings from './components/Settings';
import GardenCalendar from './components/Calendar';
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

  return (
    <Router>
      <Toaster position="top-right" richColors />
      <Layout>
        <Routes>
          <Route path="/" element={<GardenHub />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/treatment" element={<Treatment />} />
          <Route path="/library" element={<Library />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/map" element={<GardenMap />} />
          <Route path="/plant/:id" element={<PlantDetail />} />
          <Route path="/rules" element={<Rules />} />
          <Route path="/weeding" element={<Weeding />} />
          <Route path="/calendar" element={<GardenCalendar />} />
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
