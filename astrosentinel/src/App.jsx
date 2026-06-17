import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Alerts from './pages/Alerts';
import About from './pages/About';

// Page transition wrapper - fades in on route change
function PageTransition({ children }) {
  const location = useLocation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(false);
    const t = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(t);
  }, [location.pathname]);

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.3s ease-out',
        flex: 1,
      }}
    >
      {children}
    </div>
  );
}

function AppRoutes() {
  return (
    <>
      <Navbar />
      <PageTransition>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </PageTransition>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
