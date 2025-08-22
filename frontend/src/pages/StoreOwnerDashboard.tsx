import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { storesAPI, ratingsAPI } from '../services/api';
import { 
  Store, 
  Star, 
  Users, 
  LogOut,
  User,
  Building2,
  TrendingUp
} from 'lucide-react';
import type { Store as StoreType, Rating } from '../types';

const StoreOwnerDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [myStores, setMyStores] = useState<StoreType[]>([]);
  const [storeRatings, setStoreRatings] = useState<{ [key: string]: Rating[] }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedStore, setSelectedStore] = useState<StoreType | null>(null);

  useEffect(() => {
    fetchMyStores();
  }, []);

  const fetchMyStores = async () => {
    try {
      setLoading(true);
      const storesData = await storesAPI.getMyStores();
      setMyStores(storesData);
      
      if (storesData.length > 0) {
        setSelectedStore(storesData[0]);
        await fetchStoreRatings(storesData[0].id);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch stores');
    } finally {
      setLoading(false);
    }
  };

  const fetchStoreRatings = async (storeId: string) => {
    try {
      const ratingsData = await ratingsAPI.getByStore(storeId);
      setStoreRatings(prev => ({ ...prev, [storeId]: ratingsData }));
    } catch (err: any) {
      console.error('Failed to fetch store ratings:', err);
    }
  };

  const handleStoreSelect = async (store: StoreType) => {
    setSelectedStore(store);
    if (!storeRatings[store.id]) {
      await fetchStoreRatings(store.id);
    }
  };

  const getAverageRating = (ratings: Rating[]) => {
    if (ratings.length === 0) return 'No ratings';
    const average = ratings.reduce((sum, rating) => sum + rating.ratingValue, 0) / ratings.length;
    return average.toFixed(1);
  };

  const getRatingDistribution = (ratings: Rating[]) => {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    ratings.forEach(rating => {
      distribution[rating.ratingValue as keyof typeof distribution]++;
    });
    return distribution;
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
              <p className="app-subtitle">Store Owner Dashboard</p>
            </div>
            <div className="header-actions">
              <div className="role-badge">
                <Building2 className="h-4 w-4" />
                <span>Store Owner</span>
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
              <p className="app-subtitle">Store Owner Dashboard</p>
            </div>
            <div className="header-actions">
              <div className="role-badge">
                <Building2 className="h-4 w-4" />
                <span>Store Owner</span>
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
            <p className="app-subtitle">Store Owner Dashboard</p>
          </div>
          <div className="header-actions">
            <div className="role-badge">
              <Building2 className="h-4 w-4" />
              <span>Store Owner</span>
            </div>
            <button onClick={handleLogout} className="logout-button">
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        {myStores.length === 0 ? (
          <div className="user-info-card">
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <Store className="h-12 w-12" style={{ color: '#9ca3af', margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                No stores found
              </h3>
              <p style={{ color: '#6b7280' }}>
                You don't have any stores assigned to your account.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Store Selection */}
            <div className="user-info-card">
              <div className="card-title">
                <Store className="h-5 w-5" />
                <span>Select Store</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {myStores.map((store) => (
                  <button
                    key={store.id}
                    onClick={() => handleStoreSelect(store)}
                    style={{
                      padding: '0.5rem 1rem',
                      border: selectedStore?.id === store.id ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                      borderRadius: '0.375rem',
                      background: selectedStore?.id === store.id ? '#eff6ff' : 'white',
                      color: selectedStore?.id === store.id ? '#1e40af' : '#374151',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {store.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Store Analytics */}
            {selectedStore && (
              <>
                <div className="actions-grid" style={{ marginBottom: '2rem' }}>
                  <div className="action-card">
                    <div className="action-content">
                      <div className="action-icon blue">
                        <Star className="h-6 w-6" />
                      </div>
                      <div className="action-text">
                        <h4>{getAverageRating(storeRatings[selectedStore.id] || [])}</h4>
                        <p>Average Rating</p>
                      </div>
                    </div>
                  </div>
                  <div className="action-card">
                    <div className="action-content">
                      <div className="action-icon green">
                        <Users className="h-6 w-6" />
                      </div>
                      <div className="action-text">
                        <h4>{storeRatings[selectedStore.id]?.length || 0}</h4>
                        <p>Total Ratings</p>
                      </div>
                    </div>
                  </div>
                  <div className="action-card">
                    <div className="action-content">
                      <div className="action-icon yellow">
                        <Store className="h-6 w-6" />
                      </div>
                      <div className="action-text">
                        <h4>{selectedStore.name}</h4>
                        <p>Store Name</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rating Distribution */}
                <div className="user-info-card">
                  <div className="card-title">
                    <TrendingUp className="h-5 w-5" />
                    <span>Rating Distribution</span>
                  </div>
                  <div style={{ display: 'grid', gap: '0.5rem' }}>
                    {[5, 4, 3, 2, 1].map((rating) => {
                      const count = getRatingDistribution(storeRatings[selectedStore.id] || [])[rating as keyof ReturnType<typeof getRatingDistribution>];
                      const total = storeRatings[selectedStore.id]?.length || 0;
                      const percentage = total > 0 ? (count / total) * 100 : 0;
                      
                      return (
                        <div key={rating} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', minWidth: '60px' }}>
                            <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>
                              {rating}★
                            </span>
                          </div>
                          <div style={{ flex: 1, background: '#f1f5f9', borderRadius: '0.25rem', height: '8px', overflow: 'hidden' }}>
                            <div 
                              style={{ 
                                width: `${percentage}%`, 
                                height: '100%', 
                                background: '#f59e0b',
                                transition: 'width 0.3s ease'
                              }} 
                            />
                          </div>
                          <span style={{ fontSize: '0.875rem', color: '#64748b', minWidth: '40px', textAlign: 'right' }}>
                            {count}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* User Ratings List */}
                <div className="user-info-card">
                  <div className="card-title">
                    <Users className="h-5 w-5" />
                    <span>User Ratings ({storeRatings[selectedStore.id]?.length || 0})</span>
                  </div>
                  {storeRatings[selectedStore.id]?.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                      No ratings yet for this store.
                    </div>
                  ) : (
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                            <th style={{ textAlign: 'left', padding: '0.75rem', fontWeight: '600' }}>User</th>
                            <th style={{ textAlign: 'left', padding: '0.75rem', fontWeight: '600' }}>Rating</th>
                            <th style={{ textAlign: 'left', padding: '0.75rem', fontWeight: '600' }}>Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {storeRatings[selectedStore.id]?.map((rating) => (
                            <tr key={rating.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                              <td style={{ padding: '0.75rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                  <User className="h-4 w-4" style={{ color: '#9ca3af' }} />
                                  <span>{rating.user?.name || 'Unknown User'}</span>
                                </div>
                              </td>
                              <td style={{ padding: '0.75rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                  <Star className="h-4 w-4" style={{ color: '#f59e0b' }} />
                                  <span>{rating.ratingValue}★</span>
                                </div>
                              </td>
                              <td style={{ padding: '0.75rem', color: '#64748b', fontSize: '0.875rem' }}>
                                {new Date(rating.createdAt).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default StoreOwnerDashboard; 