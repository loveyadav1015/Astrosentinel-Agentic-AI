import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Alerts from './pages/Alerts';
import About from './pages/About';
import Chatbot from './components/Chatbot'; // Import your chatbot
import { fetchNeoData } from './utils/nasaApi'; // Import your NASA API utility

// Page transition wrapper
function PageTransition({ children }) {
  const location = useLocation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(false);
    const timer = setTimeout(() => setVisible(true), 20);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.25s ease-out', flex: 1 }}>
      {children}
    </div>
  );
}

function AppRoutes() {
  const [telemetry, setTelemetry] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Fetch live space data when the application mounts
  useEffect(() => {
    fetchNeoData()
      .then((data) => {
        setTelemetry(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load tracking metrics:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex flex-col min-h-screen relative">
      {/* Persistent UI elements across routes */}
      <Navbar />

      <PageTransition>
        <Routes>
          <Route path="/" element={<Landing />} />
          {/* 2. Pass live telemetry data down to pages that need it */}
          <Route path="/dashboard" element={<Dashboard telemetry={telemetry} loading={loading} />} />
          <Route path="/alerts" element={<Alerts telemetry={telemetry} loading={loading} />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </PageTransition>

      {/* 3. Global Floating AI Chatbot (Stays alive across page jumps) */}
      <Chatbot neoData={telemetry} />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}