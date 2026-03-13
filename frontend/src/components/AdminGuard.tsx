import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface AdminGuardProps {
  children: React.ReactNode;
}

const AdminGuard: React.FC<AdminGuardProps> = ({ children }) => {
  const location = useLocation();
  const isAdmin = sessionStorage.getItem('sx_admin') === '1';

  if (!isAdmin) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default AdminGuard;
