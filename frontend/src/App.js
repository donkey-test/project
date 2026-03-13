import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './lib/auth';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Scanner from './pages/Scanner';
import Benchmark from './pages/Benchmark';
import Dataset from './pages/Dataset';
import Model from './pages/Model';
import AdminLogin from './pages/AdminLogin';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen mosaic-bg">
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/scanner" element={<Scanner />} />
              <Route
                path="/benchmark"
                element={
                  <ProtectedRoute>
                    <Benchmark />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dataset"
                element={
                  <ProtectedRoute>
                    <Dataset />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/model"
                element={
                  <ProtectedRoute>
                    <Model />
                  </ProtectedRoute>
                }
              />
            </Route>
            <Route path="/admin/login" element={<AdminLogin />} />
          </Routes>
          <Toaster 
            position="top-right" 
            toastOptions={{
              style: {
                background: '#1A3C2B',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '2px',
              },
            }}
          />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
