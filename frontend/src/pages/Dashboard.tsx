import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  Users, 
  Store, 
  Star, 
  Settings, 
  LogOut, 
  Plus, 
  Search, 
  BarChart3,
  UserCheck,
  ShoppingBag
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  const handleNavigation = (href: string) => {
    navigate(href);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'STORE_OWNER':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'NORMAL_USER':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return <Users className="h-5 w-5" />;
      case 'STORE_OWNER':
        return <Store className="h-5 w-5" />;
      case 'NORMAL_USER':
        return <UserCheck className="h-5 w-5" />;
      default:
        return <UserCheck className="h-5 w-5" />;
    }
  };

  const getQuickActions = () => {
    switch (user?.role) {
      case 'ADMIN':
        return [
          {
            title: 'Manage Users',
            description: 'View, create, and manage all users',
            icon: <Users className="h-6 w-6" />,
            href: '/admin',
            color: 'blue'
          },
          {
            title: 'Manage Stores',
            description: 'View, create, and manage all stores',
            icon: <Store className="h-6 w-6" />,
            href: '/admin',
            color: 'green'
          },
          {
            title: 'Analytics Dashboard',
            description: 'View system statistics and reports',
            icon: <BarChart3 className="h-6 w-6" />,
            href: '/admin',
            color: 'purple'
          }
        ];
      case 'STORE_OWNER':
        return [
          {
            title: 'My Stores',
            description: 'View and manage your stores',
            icon: <Store className="h-6 w-6" />,
            href: '/store-owner',
            color: 'blue'
          },
          {
            title: 'Store Ratings',
            description: 'View ratings and feedback for your stores',
            icon: <Star className="h-6 w-6" />,
            href: '/store-owner',
            color: 'yellow'
          },
          {
            title: 'Analytics',
            description: 'View store performance metrics',
            icon: <BarChart3 className="h-6 w-6" />,
            href: '/store-owner',
            color: 'purple'
          }
        ];
      case 'NORMAL_USER':
        return [
          {
            title: 'Browse Stores',
            description: 'View and search all stores',
            icon: <Search className="h-6 w-6" />,
            href: '/stores',
            color: 'blue'
          },
          {
            title: 'My Ratings',
            description: 'View and manage your ratings',
            icon: <Star className="h-6 w-6" />,
            href: '/stores',
            color: 'yellow'
          },
          {
            title: 'Change Password',
            description: 'Update your account password',
            icon: <Settings className="h-6 w-6" />,
            href: '/dashboard',
            color: 'gray'
          }
        ];
      default:
        return [];
    }
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-container">
          <div className="header-left">
            <div>
              <div className="app-title">Store Rating App</div>
              <div className="app-subtitle">Welcome to your dashboard</div>
            </div>
            <div className="header-divider"></div>
            <div className="role-badge">
              {getRoleIcon(user?.role || '')}
              <span>{user?.role?.replace('_', ' ')}</span>
            </div>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        {/* Welcome Section */}
        <div className="welcome-section">
          <h2 className="welcome-title">
            Welcome back, {user?.name}!
          </h2>
          <p className="welcome-subtitle">
            Here's what you can do with your {user?.role?.toLowerCase().replace('_', ' ')} account.
          </p>
        </div>

        {/* User Info Card */}
        <div className="user-info-card">
          <div className="card-title">
            <UserCheck className="h-5 w-5" />
            <span>Account Information</span>
          </div>
          <div className="user-grid">
            <div className="user-field">
              <span className="field-label">Full Name</span>
              <span className="field-value">{user?.name}</span>
            </div>
            <div className="user-field">
              <span className="field-label">Email Address</span>
              <span className="field-value">{user?.email}</span>
            </div>
            <div className="user-field">
              <span className="field-label">Account Role</span>
              <div className="role-badge">
                {getRoleIcon(user?.role || '')}
                <span>{user?.role?.replace('_', ' ')}</span>
              </div>
            </div>
            <div className="user-field">
              <span className="field-label">Address</span>
              <span className="field-value">{user?.address}</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h3 className="actions-title">Quick Actions</h3>
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

        {/* Role-specific Information */}
        {user?.role === 'ADMIN' && (
          <div className="user-info-card">
            <div className="card-title">
              <BarChart3 className="h-5 w-5" />
              <span>System Overview</span>
            </div>
            <p style={{ color: '#64748b', marginBottom: '1rem' }}>
              Manage the entire store rating system and view key metrics
            </p>
            <div className="actions-grid">
              <div className="action-card" onClick={() => handleNavigation('/admin')}>
                <div className="action-content">
                  <div className="action-icon blue">
                    <Users className="h-6 w-6" />
                  </div>
                  <div className="action-text">
                    <h4>7</h4>
                    <p>Total Users</p>
                  </div>
                </div>
              </div>
              <div className="action-card" onClick={() => handleNavigation('/admin')}>
                <div className="action-content">
                  <div className="action-icon green">
                    <Store className="h-6 w-6" />
                  </div>
                  <div className="action-text">
                    <h4>4</h4>
                    <p>Total Stores</p>
                  </div>
                </div>
              </div>
              <div className="action-card" onClick={() => handleNavigation('/admin')}>
                <div className="action-content">
                  <div className="action-icon yellow">
                    <Star className="h-6 w-6" />
                  </div>
                  <div className="action-text">
                    <h4>12</h4>
                    <p>Total Ratings</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {user?.role === 'STORE_OWNER' && (
          <div className="user-info-card">
            <div className="card-title">
              <Store className="h-5 w-5" />
              <span>Your Stores</span>
            </div>
            <p style={{ color: '#64748b', lineHeight: '1.6' }}>
              Manage your stores and view ratings from customers. Monitor customer feedback and improve your services based on ratings.
            </p>
          </div>
        )}

        {user?.role === 'NORMAL_USER' && (
          <div className="user-info-card">
            <div className="card-title">
              <Search className="h-5 w-5" />
              <span>Rate Stores</span>
            </div>
            <p style={{ color: '#64748b', lineHeight: '1.6' }}>
              Discover stores, read reviews, and share your own ratings to help others make informed decisions. Your feedback helps improve the community and assists other users in finding great places.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 