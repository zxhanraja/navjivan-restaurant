


import React from 'react';
// FIX: Changed import to wildcard to bypass potential module resolution issues for react-router-dom.
import * as ReactRouterDOM from 'react-router-dom';
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
    // FIX: Changed to use namespaced import.
    return <ReactRouterDOM.Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
