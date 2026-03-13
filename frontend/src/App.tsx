import React from 'react';
import { BrowserRouter, Routes, Route, useLocation, Outlet } from 'react-router-dom';
import { ScanProvider } from './context/ScanContext';
import Navigation from './components/Navigation';
import AdminGuard from './components/AdminGuard';

// Pages
import Dashboard from './pages/Dashboard';
import Scanner from './pages/Scanner';
import ThreatFeed from './pages/ThreatFeed';
import Reports from './pages/Reports';
import AdminLogin from './pages/admin/AdminLogin';
import Benchmark from './pages/admin/Benchmark';
import Dataset from './pages/admin/Dataset';
import Model from './pages/admin/Model';

const Layout: React.FC = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/admin/login';

  return (
    <>
      {!isLoginPage && <Navigation />}
      <Outlet />
    </>
  );
};

function App() {
  return (
    <ScanProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            {/* Public Routes */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/scanner" element={<Scanner />} />
            <Route path="/threats" element={<ThreatFeed />} />
            <Route path="/reports" element={<Reports />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/benchmark"
              element={
                <AdminGuard>
                  <Benchmark />
                </AdminGuard>
              }
            />
            <Route
              path="/admin/dataset"
              element={
                <AdminGuard>
                  <Dataset />
                </AdminGuard>
              }
            />
            <Route
              path="/admin/model"
              element={
                <AdminGuard>
                  <Model />
                </AdminGuard>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </ScanProvider>
  );
}

export default App;
