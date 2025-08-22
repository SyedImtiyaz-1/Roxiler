import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import StoreOwnerDashboard from './pages/StoreOwnerDashboard';
import StoreList from './pages/StoreList';
import './index.css';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles?: string[] }> = ({ 
  children, 
  allowedRoles 
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-content">
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div className="animate-spin" style={{ 
              border: '4px solid #f3f4f6', 
              borderTop: '4px solid #3b82f6', 
              borderRadius: '50%', 
              width: '40px', 
              height: '40px', 
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1rem'
            }}></div>
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

// Main App Content
const AppContent: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      
      {/* Main Dashboard */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />

      {/* Admin Routes */}
      <Route 
        path="/admin/*" 
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />

      {/* Store Owner Routes */}
      <Route 
        path="/store-owner/*" 
        element={
          <ProtectedRoute allowedRoles={['STORE_OWNER']}>
            <StoreOwnerDashboard />
          </ProtectedRoute>
        } 
      />

      {/* Normal User Routes */}
      <Route 
        path="/stores" 
        element={
          <ProtectedRoute allowedRoles={['NORMAL_USER']}>
            <StoreList />
          </ProtectedRoute>
        } 
      />

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

// Main App Component
const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
};

export default App;
