import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { usersAPI, storesAPI, ratingsAPI } from '../services/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';
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
  ShoppingBag,
  Filter,
  Edit,
  Trash2,
  Eye,
  ArrowLeft,
  X,
  Save,
  Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import type { User, Store as StoreType, Rating } from '../types';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'white',
        borderRadius: '0.5rem',
        padding: '2rem',
        maxWidth: '500px',
        width: '90%',
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1e293b' }}>{title}</h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: '0.25rem',
              color: '#64748b'
            }}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'stores'>('dashboard');
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
  const [users, setUsers] = useState<User[]>([]);
  const [stores, setStores] = useState<StoreType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Filter states
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [storeSearchTerm, setStoreSearchTerm] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('');

  // Modal states
  const [showUserModal, setShowUserModal] = useState(false);
  const [showStoreModal, setShowStoreModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingStore, setEditingStore] = useState<StoreType | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  // Form states
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    address: '',
    password: '',
    role: 'NORMAL_USER' as 'NORMAL_USER' | 'ADMIN' | 'STORE_OWNER'
  });

  const [storeForm, setStoreForm] = useState({
    name: '',
    address: '',
    ownerId: ''
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, usersData, storesData] = await Promise.all([
        usersAPI.getDashboardStats(),
        usersAPI.getAll(),
        storesAPI.getAll()
      ]);
      
      setStats(statsData);
      setUsers(usersData);
      setStores(storesData);
    } catch (err: any) {
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      user.address.toLowerCase().includes(userSearchTerm.toLowerCase());
    const matchesRole = !userRoleFilter || user.role === userRoleFilter;
    return matchesSearch && matchesRole;
  });

  const filteredStores = stores.filter(store => {
    return store.name.toLowerCase().includes(storeSearchTerm.toLowerCase()) ||
           store.address.toLowerCase().includes(storeSearchTerm.toLowerCase());
  });

  const handleLogout = () => {
    logout();
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-100 text-red-800';
      case 'STORE_OWNER':
        return 'bg-blue-100 text-blue-800';
      case 'NORMAL_USER':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return <Users className="h-4 w-4" />;
      case 'STORE_OWNER':
        return <Store className="h-4 w-4" />;
      case 'NORMAL_USER':
        return <UserCheck className="h-4 w-4" />;
      default:
        return <UserCheck className="h-4 w-4" />;
    }
  };

  // User CRUD Operations
  const handleCreateUser = () => {
    setEditingUser(null);
    setUserForm({
      name: '',
      email: '',
      address: '',
      password: '',
      role: 'NORMAL_USER'
    });
    setShowUserModal(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setUserForm({
      name: user.name,
      email: user.email,
      address: user.address,
      password: '',
      role: user.role
    });
    setShowUserModal(true);
  };

  const handleViewUser = (user: User) => {
    setEditingUser(user);
    setUserForm({
      name: user.name,
      email: user.email,
      address: user.address,
      password: '',
      role: user.role
    });
    setShowUserModal(true);
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      await usersAPI.delete(userId);
      setSuccessMessage('User deleted successfully!');
      await fetchDashboardData();
    } catch (err: any) {
      setError('Failed to delete user. Please try again.');
    }
  };

  const handleSaveUser = async () => {
    try {
      setModalLoading(true);
      setError('');
      setSuccessMessage('');

      if (editingUser) {
        // Update existing user
        const updateData: any = {
          name: userForm.name,
          email: userForm.email,
          address: userForm.address,
          role: userForm.role
        };
        if (userForm.password) {
          updateData.password = userForm.password;
        }
        await usersAPI.update(editingUser.id, updateData);
        setSuccessMessage('User updated successfully!');
      } else {
        // Create new user
        await usersAPI.create(userForm);
        setSuccessMessage('User created successfully!');
      }

      setShowUserModal(false);
      await fetchDashboardData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save user. Please try again.');
    } finally {
      setModalLoading(false);
    }
  };

  // Store CRUD Operations
  const handleCreateStore = () => {
    setEditingStore(null);
    setStoreForm({
      name: '',
      address: '',
      ownerId: ''
    });
    setShowStoreModal(true);
  };

  const handleEditStore = (store: StoreType) => {
    setEditingStore(store);
    setStoreForm({
      name: store.name,
      address: store.address,
      ownerId: store.ownerId || ''
    });
    setShowStoreModal(true);
  };

  const handleViewStore = (store: StoreType) => {
    setEditingStore(store);
    setStoreForm({
      name: store.name,
      address: store.address,
      ownerId: store.ownerId || ''
    });
    setShowStoreModal(true);
  };

  const handleDeleteStore = async (storeId: string) => {
    if (!window.confirm('Are you sure you want to delete this store? This action cannot be undone.')) {
      return;
    }

    try {
      await storesAPI.delete(storeId);
      setSuccessMessage('Store deleted successfully!');
      await fetchDashboardData();
    } catch (err: any) {
      setError('Failed to delete store. Please try again.');
    }
  };

  const handleSaveStore = async () => {
    try {
      setModalLoading(true);
      setError('');
      setSuccessMessage('');

      if (editingStore) {
        // Update existing store
        await storesAPI.update(editingStore.id, storeForm);
        setSuccessMessage('Store updated successfully!');
      } else {
        // Create new store
        await storesAPI.create(storeForm);
        setSuccessMessage('Store created successfully!');
      }

      setShowStoreModal(false);
      await fetchDashboardData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save store. Please try again.');
    } finally {
      setModalLoading(false);
    }
  };

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
            <p>Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-container">
          <div className="header-left">
            <Link to="/dashboard" className="logout-button" style={{ textDecoration: 'none' }}>
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </Link>
            <div className="header-divider"></div>
            <div>
              <div className="app-title">Admin Dashboard</div>
              <div className="app-subtitle">System Administrator Panel</div>
            </div>
            <div className="header-divider"></div>
            <div className="role-badge">
              <Users className="h-4 w-4" />
              <span>ADMIN</span>
            </div>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="dashboard-content">
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            borderBottom: '1px solid #e2e8f0',
            marginBottom: '2rem'
          }}>
            <button
              onClick={() => setActiveTab('dashboard')}
              style={{
                padding: '0.75rem 1.5rem',
                border: 'none',
                background: activeTab === 'dashboard' ? '#3b82f6' : 'transparent',
                color: activeTab === 'dashboard' ? 'white' : '#64748b',
                borderRadius: '0.375rem 0.375rem 0 0',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('users')}
              style={{
                padding: '0.75rem 1.5rem',
                border: 'none',
                background: activeTab === 'users' ? '#3b82f6' : 'transparent',
                color: activeTab === 'users' ? 'white' : '#64748b',
                borderRadius: '0.375rem 0.375rem 0 0',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              Manage Users
            </button>
            <button
              onClick={() => setActiveTab('stores')}
              style={{
                padding: '0.75rem 1.5rem',
                border: 'none',
                background: activeTab === 'stores' ? '#3b82f6' : 'transparent',
                color: activeTab === 'stores' ? 'white' : '#64748b',
                borderRadius: '0.375rem 0.375rem 0 0',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              Manage Stores
            </button>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" style={{ marginBottom: '1rem' }}>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {successMessage && (
          <div style={{ 
            background: '#dcfce7', 
            border: '1px solid #bbf7d0', 
            color: '#166534', 
            padding: '0.75rem', 
            borderRadius: '0.375rem', 
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Save className="h-4 w-4" />
            {successMessage}
          </div>
        )}

        {/* Dashboard Overview */}
        {activeTab === 'dashboard' && (
          <div>
            <div className="welcome-section">
              <h2 className="welcome-title">System Overview</h2>
              <p className="welcome-subtitle">Manage the entire store rating system</p>
            </div>

            {/* Statistics Cards */}
            <div className="actions-grid" style={{ marginBottom: '2rem' }}>
              <div className="action-card">
                <div className="action-content">
                  <div className="action-icon blue">
                    <Users className="h-6 w-6" />
                  </div>
                  <div className="action-text">
                    <h4>{stats.totalUsers}</h4>
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
                    <h4>{stats.totalStores}</h4>
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
                    <h4>{stats.totalRatings}</h4>
                    <p>Total Ratings</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="user-info-card">
              <div className="card-title">
                <BarChart3 className="h-5 w-5" />
                <span>Quick Actions</span>
              </div>
              <div className="actions-grid">
                <div className="action-card" onClick={() => setActiveTab('users')}>
                  <div className="action-content">
                    <div className="action-icon blue">
                      <Users className="h-6 w-6" />
                    </div>
                    <div className="action-text">
                      <h4>Manage Users</h4>
                      <p>Add, edit, and manage all users</p>
                    </div>
                  </div>
                </div>
                <div className="action-card" onClick={() => setActiveTab('stores')}>
                  <div className="action-content">
                    <div className="action-icon green">
                      <Store className="h-6 w-6" />
                    </div>
                    <div className="action-text">
                      <h4>Manage Stores</h4>
                      <p>Add, edit, and manage all stores</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Management */}
        {activeTab === 'users' && (
          <div>
            <div className="welcome-section">
              <h2 className="welcome-title">Manage Users</h2>
              <p className="welcome-subtitle">Add, edit, and manage all users in the system</p>
            </div>

            {/* Search and Filter */}
            <div className="user-info-card">
              <div className="card-title">
                <Filter className="h-5 w-5" />
                <span>Search & Filter</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="form-label">Search Users</label>
                  <input
                    type="text"
                    placeholder="Search by name, email, or address..."
                    value={userSearchTerm}
                    onChange={(e) => setUserSearchTerm(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">Filter by Role</label>
                  <select
                    value={userRoleFilter}
                    onChange={(e) => setUserRoleFilter(e.target.value)}
                    className="form-input"
                  >
                    <option value="">All Roles</option>
                    <option value="ADMIN">Admin</option>
                    <option value="STORE_OWNER">Store Owner</option>
                    <option value="NORMAL_USER">Normal User</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Users List */}
            <div className="user-info-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div className="card-title">
                  <Users className="h-5 w-5" />
                  <span>Users ({filteredUsers.length})</span>
                </div>
                <button
                  onClick={handleCreateUser}
                  className="login-button"
                  style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                >
                  <Plus className="h-4 w-4" style={{ marginRight: '0.5rem' }} />
                  Add User
                </button>
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
                            <button 
                              className="logout-button" 
                              style={{ padding: '0.25rem 0.5rem' }}
                              onClick={() => handleViewUser(user)}
                              title="View User"
                            >
                              <Eye className="h-3 w-3" />
                            </button>
                            <button 
                              className="logout-button" 
                              style={{ padding: '0.25rem 0.5rem' }}
                              onClick={() => handleEditUser(user)}
                              title="Edit User"
                            >
                              <Edit className="h-3 w-3" />
                            </button>
                            <button 
                              className="logout-button" 
                              style={{ 
                                padding: '0.25rem 0.5rem',
                                background: '#ef4444',
                                color: 'white',
                                borderColor: '#ef4444'
                              }}
                              onClick={() => handleDeleteUser(user.id)}
                              title="Delete User"
                            >
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

        {/* Stores Management */}
        {activeTab === 'stores' && (
          <div>
            <div className="welcome-section">
              <h2 className="welcome-title">Manage Stores</h2>
              <p className="welcome-subtitle">Add, edit, and manage all stores in the system</p>
            </div>

            {/* Search */}
            <div className="user-info-card">
              <div className="card-title">
                <Search className="h-5 w-5" />
                <span>Search Stores</span>
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Search by name or address..."
                  value={storeSearchTerm}
                  onChange={(e) => setStoreSearchTerm(e.target.value)}
                  className="form-input"
                />
              </div>
            </div>

            {/* Stores List */}
            <div className="user-info-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div className="card-title">
                  <Store className="h-5 w-5" />
                  <span>Stores ({filteredStores.length})</span>
                </div>
                <button
                  onClick={handleCreateStore}
                  className="login-button"
                  style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                >
                  <Plus className="h-4 w-4" style={{ marginRight: '0.5rem' }} />
                  Add Store
                </button>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <th style={{ textAlign: 'left', padding: '0.75rem', fontWeight: '600' }}>Name</th>
                      <th style={{ textAlign: 'left', padding: '0.75rem', fontWeight: '600' }}>Address</th>
                      <th style={{ textAlign: 'left', padding: '0.75rem', fontWeight: '600' }}>Owner</th>
                      <th style={{ textAlign: 'left', padding: '0.75rem', fontWeight: '600' }}>Avg Rating</th>
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
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Star className="h-4 w-4" style={{ color: '#f59e0b' }} />
                            <span>{store._count?.ratings || 0} ratings</span>
                          </div>
                        </td>
                        <td style={{ padding: '0.75rem' }}>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button 
                              className="logout-button" 
                              style={{ padding: '0.25rem 0.5rem' }}
                              onClick={() => handleViewStore(store)}
                              title="View Store"
                            >
                              <Eye className="h-3 w-3" />
                            </button>
                            <button 
                              className="logout-button" 
                              style={{ padding: '0.25rem 0.5rem' }}
                              onClick={() => handleEditStore(store)}
                              title="Edit Store"
                            >
                              <Edit className="h-3 w-3" />
                            </button>
                            <button 
                              className="logout-button" 
                              style={{ 
                                padding: '0.25rem 0.5rem',
                                background: '#ef4444',
                                color: 'white',
                                borderColor: '#ef4444'
                              }}
                              onClick={() => handleDeleteStore(store.id)}
                              title="Delete Store"
                            >
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

      {/* User Modal */}
      <Modal
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        title={editingUser ? (editingUser.id ? 'Edit User' : 'View User') : 'Create New User'}
      >
        <div style={{ display: 'grid', gap: '1rem' }}>
          <div>
            <label className="form-label">Full Name</label>
            <input
              type="text"
              value={userForm.name}
              onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
              className="form-input"
              disabled={!!(editingUser && !editingUser.id)}
              placeholder="Enter full name"
            />
          </div>
          <div>
            <label className="form-label">Email</label>
            <input
              type="email"
              value={userForm.email}
              onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
              className="form-input"
              disabled={!!(editingUser && !editingUser.id)}
              placeholder="Enter email address"
            />
          </div>
          <div>
            <label className="form-label">Address</label>
            <input
              type="text"
              value={userForm.address}
              onChange={(e) => setUserForm({ ...userForm, address: e.target.value })}
              className="form-input"
              disabled={!!(editingUser && !editingUser.id)}
              placeholder="Enter address"
            />
          </div>
          <div>
            <label className="form-label">Password {editingUser && editingUser.id && '(leave blank to keep current)'}</label>
            <input
              type="password"
              value={userForm.password}
              onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
              className="form-input"
              placeholder={editingUser && editingUser.id ? "Enter new password (optional)" : "Enter password"}
            />
          </div>
          <div>
            <label className="form-label">Role</label>
            <select
              value={userForm.role}
              onChange={(e) => setUserForm({ ...userForm, role: e.target.value as 'NORMAL_USER' | 'ADMIN' | 'STORE_OWNER' })}
              className="form-input"
              disabled={!!(editingUser && !editingUser.id)}
            >
              <option value="NORMAL_USER">Normal User</option>
              <option value="STORE_OWNER">Store Owner</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button
              onClick={handleSaveUser}
              disabled={modalLoading || !!(editingUser && !editingUser.id)}
              className="login-button"
              style={{ flex: 1 }}
            >
              {modalLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" style={{ marginRight: '0.5rem' }} />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" style={{ marginRight: '0.5rem' }} />
                  {editingUser && !editingUser.id ? 'View Only' : 'Save User'}
                </>
              )}
            </button>
            <button
              onClick={() => setShowUserModal(false)}
              className="logout-button"
              style={{ flex: 1 }}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      {/* Store Modal */}
      <Modal
        isOpen={showStoreModal}
        onClose={() => setShowStoreModal(false)}
        title={editingStore ? (editingStore.id ? 'Edit Store' : 'View Store') : 'Create New Store'}
      >
        <div style={{ display: 'grid', gap: '1rem' }}>
          <div>
            <label className="form-label">Store Name</label>
            <input
              type="text"
              value={storeForm.name}
              onChange={(e) => setStoreForm({ ...storeForm, name: e.target.value })}
              className="form-input"
              disabled={!!(editingStore && !editingStore.id)}
              placeholder="Enter store name"
            />
          </div>
          <div>
            <label className="form-label">Address</label>
            <input
              type="text"
              value={storeForm.address}
              onChange={(e) => setStoreForm({ ...storeForm, address: e.target.value })}
              className="form-input"
              disabled={!!(editingStore && !editingStore.id)}
              placeholder="Enter store address"
            />
          </div>
          <div>
            <label className="form-label">Store Owner</label>
            <select
              value={storeForm.ownerId}
              onChange={(e) => setStoreForm({ ...storeForm, ownerId: e.target.value })}
              className="form-input"
              disabled={!!(editingStore && !editingStore.id)}
            >
              <option value="">Select Store Owner</option>
              {users.filter(u => u.role === 'STORE_OWNER').map(user => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button
              onClick={handleSaveStore}
              disabled={modalLoading || !!(editingStore && !editingStore.id)}
              className="login-button"
              style={{ flex: 1 }}
            >
              {modalLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" style={{ marginRight: '0.5rem' }} />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" style={{ marginRight: '0.5rem' }} />
                  {editingStore && !editingStore.id ? 'View Only' : 'Save Store'}
                </>
              )}
            </button>
            <button
              onClick={() => setShowStoreModal(false)}
              className="logout-button"
              style={{ flex: 1 }}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminDashboard; 