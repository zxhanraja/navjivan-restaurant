

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useData } from '../context/DataContext';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session, isSessionLoading } = useData();

  if (isSessionLoading) {
    return (
        <div className="fixed inset-0 bg-coffee-dark flex items-center justify-center z-[100]">
          <p className="text-coffee-gold text-lg font-display tracking-widest">Verifying session...</p>
        </div>
    );
  }

  if (!session) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
