import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Store, 
  Star, 
  LogOut,
  User,
  Building2,
  TrendingUp
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const getQuickActions = () => {
    if (!user) return [];

    switch (user.role) {
      case 'ADMIN':
        return [
          {
            title: 'Admin Dashboard',
            description: 'Manage users, stores, and system analytics',
            href: '/admin',
            icon: <Users className="h-6 w-6" />,
            color: 'blue'
          }
        ];
      case 'STORE_OWNER':
        return [
          {
            title: 'Store Owner Dashboard',
            description: 'View store analytics and user feedback',
            href: '/store-owner',
            icon: <Store className="h-6 w-6" />,
            color: 'green'
          }
        ];
      case 'NORMAL_USER':
        return [
          {
            title: 'Browse Stores',
            description: 'View and rate stores',
            href: '/stores',
            icon: <Star className="h-6 w-6" />,
            color: 'yellow'
          }
        ];
      default:
        return [];
    }
  };

  const handleNavigation = (href: string) => {
    navigate(href);
  };

  const handleLogout = () => {
    logout();
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return <User className="h-4 w-4" />;
      case 'STORE_OWNER':
        return <Building2 className="h-4 w-4" />;
      case 'NORMAL_USER':
        return <User className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-container">
          <div>
            <h1 className="app-title">Store Rating System</h1>
            <p className="app-subtitle">Welcome back, {user?.name}!</p>
          </div>
          <div className="header-actions">
            <div className="role-badge">
              {getRoleIcon(user?.role || '')}
              <span>{user?.role?.replace('_', ' ') || 'User'}</span>
            </div>
            <button onClick={handleLogout} className="logout-button">
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="welcome-section">
          <h2 className="welcome-title">Dashboard</h2>
          <p className="welcome-subtitle">Choose an action to get started</p>
        </div>

        <div className="actions-grid">
          {getQuickActions().map((action, index) => (
            <div 
              key={index} 
              className="action-card" 
              onClick={() => handleNavigation(action.href)}
              style={{ cursor: 'pointer' }}
            >
              <div className="action-content">
                <div className={`action-icon ${action.color}`}>
                  {action.icon}
                </div>
                <div className="action-text">
                  <h4>{action.title}</h4>
                  <p>{action.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 