import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { usersAPI, storesAPI } from '../services/api';
import { 
  Users, 
  Store, 
  Star, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  LogOut,
  User,
  Building2,
  TrendingUp
} from 'lucide-react';
import type { User as UserType, Store as StoreType, DashboardStats } from '../types';

const AdminDashboard: React.FC = () => {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'stores'>('dashboard');
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [users, setUsers] = useState<UserType[]>([]);
  const [stores, setStores] = useState<StoreType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [storeSearchTerm, setStoreSearchTerm] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [stats, usersData, storesData] = await Promise.all([
        usersAPI.getDashboardStats(),
        usersAPI.getAll(),
        storesAPI.getAll()
      ]);
      setDashboardStats(stats);
      setUsers(usersData);
      setStores(storesData);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                         user.address.toLowerCase().includes(userSearchTerm.toLowerCase());
    const matchesRole = userRoleFilter === 'all' || user.role === userRoleFilter;
    return matchesSearch && matchesRole;
  });

  const filteredStores = stores.filter(store => {
    return store.name.toLowerCase().includes(storeSearchTerm.toLowerCase()) ||
           store.address.toLowerCase().includes(storeSearchTerm.toLowerCase());
  });

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return <User className="h-3 w-3" />;
      case 'STORE_OWNER':
        return <Building2 className="h-3 w-3" />;
      case 'NORMAL_USER':
        return <User className="h-3 w-3" />;
      default:
        return <User className="h-3 w-3" />;
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div className="header-container">
            <div>
              <h1 className="app-title">Store Rating System</h1>
              <p className="app-subtitle">Admin Dashboard</p>
            </div>
            <div className="header-actions">
              <div className="role-badge">
                <User className="h-4 w-4" />
                <span>Admin</span>
              </div>
              <button onClick={handleLogout} className="logout-button">
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div className="header-container">
            <div>
              <h1 className="app-title">Store Rating System</h1>
              <p className="app-subtitle">Admin Dashboard</p>
            </div>
            <div className="header-actions">
              <div className="role-badge">
                <User className="h-4 w-4" />
                <span>Admin</span>
              </div>
              <button onClick={handleLogout} className="logout-button">
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <div className="error-message">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-container">
          <div>
            <h1 className="app-title">Store Rating System</h1>
            <p className="app-subtitle">Admin Dashboard</p>
          </div>
          <div className="header-actions">
            <div className="role-badge">
              <User className="h-4 w-4" />
              <span>Admin</span>
            </div>
            <button onClick={handleLogout} className="logout-button">
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="tab-navigation">
          <button
            className={`tab-button ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <TrendingUp className="h-4 w-4" />
            Dashboard
          </button>
          <button
            className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <Users className="h-4 w-4" />
            Manage Users
          </button>
          <button
            className={`tab-button ${activeTab === 'stores' ? 'active' : ''}`}
            onClick={() => setActiveTab('stores')}
          >
            <Store className="h-4 w-4" />
            Manage Stores
          </button>
        </div>

        {activeTab === 'dashboard' && dashboardStats && (
          <div>
            <div className="actions-grid">
              <div className="action-card">
                <div className="action-content">
                  <div className="action-icon blue">
                    <Users className="h-6 w-6" />
                  </div>
                  <div className="action-text">
                    <h4>{dashboardStats.totalUsers}</h4>
                    <p>Total Users</p>
                  </div>
                </div>
              </div>
              <div className="action-card">
                <div className="action-content">
                  <div className="action-icon green">
                    <Store className="h-6 w-6" />
                  </div>
                  <div className="action-text">
                    <h4>{dashboardStats.totalStores}</h4>
                    <p>Total Stores</p>
                  </div>
                </div>
              </div>
              <div className="action-card">
                <div className="action-content">
                  <div className="action-icon yellow">
                    <Star className="h-6 w-6" />
                  </div>
                  <div className="action-text">
                    <h4>{dashboardStats.totalRatings}</h4>
                    <p>Total Ratings</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div>
            <div className="user-info-card">
              <div className="card-title">
                <Users className="h-5 w-5" />
                <span>Users ({filteredUsers.length})</span>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <input
                      type="text"
                      placeholder="Search users by name, email, or address..."
                      value={userSearchTerm}
                      onChange={(e) => setUserSearchTerm(e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <select
                    value={userRoleFilter}
                    onChange={(e) => setUserRoleFilter(e.target.value)}
                    className="form-input"
                    style={{ width: 'auto' }}
                  >
                    <option value="all">All Roles</option>
                    <option value="ADMIN">Admin</option>
                    <option value="STORE_OWNER">Store Owner</option>
                    <option value="NORMAL_USER">Normal User</option>
                  </select>
                </div>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <th style={{ textAlign: 'left', padding: '0.75rem', fontWeight: '600' }}>Name</th>
                      <th style={{ textAlign: 'left', padding: '0.75rem', fontWeight: '600' }}>Email</th>
                      <th style={{ textAlign: 'left', padding: '0.75rem', fontWeight: '600' }}>Address</th>
                      <th style={{ textAlign: 'left', padding: '0.75rem', fontWeight: '600' }}>Role</th>
                      <th style={{ textAlign: 'left', padding: '0.75rem', fontWeight: '600' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '0.75rem' }}>{user.name}</td>
                        <td style={{ padding: '0.75rem' }}>{user.email}</td>
                        <td style={{ padding: '0.75rem' }}>{user.address}</td>
                        <td style={{ padding: '0.75rem' }}>
                          <div className="role-badge">
                            {getRoleIcon(user.role)}
                            <span>{user.role.replace('_', ' ')}</span>
                          </div>
                        </td>
                        <td style={{ padding: '0.75rem' }}>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button className="logout-button" style={{ padding: '0.25rem 0.5rem' }}>
                              <Eye className="h-3 w-3" />
                            </button>
                            <button className="logout-button" style={{ padding: '0.25rem 0.5rem' }}>
                              <Edit className="h-3 w-3" />
                            </button>
                            <button className="logout-button" style={{ padding: '0.25rem 0.5rem' }}>
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'stores' && (
          <div>
            <div className="user-info-card">
              <div className="card-title">
                <Store className="h-5 w-5" />
                <span>Stores ({filteredStores.length})</span>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <input
                  type="text"
                  placeholder="Search stores by name or address..."
                  value={storeSearchTerm}
                  onChange={(e) => setStoreSearchTerm(e.target.value)}
                  className="form-input"
                />
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <th style={{ textAlign: 'left', padding: '0.75rem', fontWeight: '600' }}>Name</th>
                      <th style={{ textAlign: 'left', padding: '0.75rem', fontWeight: '600' }}>Address</th>
                      <th style={{ textAlign: 'left', padding: '0.75rem', fontWeight: '600' }}>Owner</th>
                      <th style={{ textAlign: 'left', padding: '0.75rem', fontWeight: '600' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStores.map((store) => (
                      <tr key={store.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '0.75rem' }}>{store.name}</td>
                        <td style={{ padding: '0.75rem' }}>{store.address}</td>
                        <td style={{ padding: '0.75rem' }}>{store.owner?.name || 'Unknown'}</td>
                        <td style={{ padding: '0.75rem' }}>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button className="logout-button" style={{ padding: '0.25rem 0.5rem' }}>
                              <Eye className="h-3 w-3" />
                            </button>
                            <button className="logout-button" style={{ padding: '0.25rem 0.5rem' }}>
                              <Edit className="h-3 w-3" />
                            </button>
                            <button className="logout-button" style={{ padding: '0.25rem 0.5rem' }}>
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard; 