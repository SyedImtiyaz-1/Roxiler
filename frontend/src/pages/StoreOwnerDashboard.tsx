import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { storesAPI, ratingsAPI } from '../services/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';
import { 
  Store, 
  Star, 
  Users, 
  LogOut, 
  Search, 
  BarChart3,
  ArrowLeft,
  User,
  Calendar
} from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Store as StoreType, Rating } from '../types';

const StoreOwnerDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [myStores, setMyStores] = useState<StoreType[]>([]);
  const [storeRatings, setStoreRatings] = useState<{ [key: string]: Rating[] }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedStore, setSelectedStore] = useState<StoreType | null>(null);

  useEffect(() => {
    fetchStoreData();
  }, []);

  const fetchStoreData = async () => {
    try {
      setLoading(true);
      const stores = await storesAPI.getMyStores();
      setMyStores(stores);

      // Fetch ratings for each store
      const ratingsData: { [key: string]: Rating[] } = {};
      for (const store of stores) {
        try {
          const ratings = await ratingsAPI.getByStore(store.id);
          ratingsData[store.id] = ratings;
        } catch (err) {
          ratingsData[store.id] = [];
        }
      }
      setStoreRatings(ratingsData);

      // Set first store as selected by default
      if (stores.length > 0) {
        setSelectedStore(stores[0]);
      }
    } catch (err: any) {
      setError('Failed to load store data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const getAverageRating = (ratings: Rating[]) => {
    if (ratings.length === 0) return 0;
    const sum = ratings.reduce((acc, rating) => acc + rating.ratingValue, 0);
    return (sum / ratings.length).toFixed(1);
  };

  const getRatingDistribution = (ratings: Rating[]) => {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    ratings.forEach(rating => {
      distribution[rating.ratingValue as keyof typeof distribution]++;
    });
    return distribution;
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
            <p>Loading your stores...</p>
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
              <div className="app-title">Store Owner Dashboard</div>
              <div className="app-subtitle">Manage your stores and view ratings</div>
            </div>
            <div className="header-divider"></div>
            <div className="role-badge">
              <Store className="h-4 w-4" />
              <span>STORE OWNER</span>
            </div>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        {error && (
          <Alert variant="destructive" style={{ marginBottom: '1rem' }}>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Welcome Section */}
        <div className="welcome-section">
          <h2 className="welcome-title">Welcome back, {user?.name}!</h2>
          <p className="welcome-subtitle">Manage your stores and monitor customer feedback</p>
        </div>

        {myStores.length === 0 ? (
          <div className="user-info-card">
            <div className="card-title">
              <Store className="h-5 w-5" />
              <span>No Stores Found</span>
            </div>
            <p style={{ color: '#64748b', lineHeight: '1.6' }}>
              You don't have any stores yet. Contact the administrator to add stores to your account.
            </p>
          </div>
        ) : (
          <>
            {/* Store Selection */}
            <div className="user-info-card">
              <div className="card-title">
                <Store className="h-5 w-5" />
                <span>Your Stores</span>
              </div>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {myStores.map((store) => (
                  <button
                    key={store.id}
                    onClick={() => setSelectedStore(store)}
                    style={{
                      padding: '0.75rem 1rem',
                      border: selectedStore?.id === store.id ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                      borderRadius: '0.375rem',
                      background: selectedStore?.id === store.id ? '#eff6ff' : 'white',
                      color: selectedStore?.id === store.id ? '#1e40af' : '#374151',
                      cursor: 'pointer',
                      fontWeight: selectedStore?.id === store.id ? '600' : '500',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {store.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Store Analytics */}
            {selectedStore && (
              <>
                <div className="user-info-card">
                  <div className="card-title">
                    <BarChart3 className="h-5 w-5" />
                    <span>{selectedStore.name} - Analytics</span>
                  </div>
                  
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
                  <div style={{ marginBottom: '2rem' }}>
                    <h4 style={{ marginBottom: '1rem', color: '#1e293b', fontWeight: '600' }}>
                      Rating Distribution
                    </h4>
                    <div style={{ display: 'grid', gap: '0.5rem' }}>
                      {[5, 4, 3, 2, 1].map((rating) => {
                        const count = getRatingDistribution(storeRatings[selectedStore.id] || [])[rating as keyof ReturnType<typeof getRatingDistribution>];
                        const total = storeRatings[selectedStore.id]?.length || 0;
                        const percentage = total > 0 ? (count / total) * 100 : 0;
                        
                        return (
                          <div key={rating} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', minWidth: '60px' }}>
                              <span style={{ fontWeight: '600' }}>{rating}</span>
                              <Star className="h-4 w-4" style={{ color: '#f59e0b' }} />
                            </div>
                            <div style={{ flex: 1, background: '#f1f5f9', borderRadius: '0.25rem', height: '8px' }}>
                              <div 
                                style={{ 
                                  width: `${percentage}%`, 
                                  height: '100%', 
                                  background: '#3b82f6', 
                                  borderRadius: '0.25rem' 
                                }}
                              />
                            </div>
                            <span style={{ minWidth: '40px', textAlign: 'right', fontSize: '0.875rem', color: '#64748b' }}>
                              {count}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* User Ratings List */}
                <div className="user-info-card">
                  <div className="card-title">
                    <Users className="h-5 w-5" />
                    <span>Users Who Rated {selectedStore.name}</span>
                  </div>
                  
                  {storeRatings[selectedStore.id]?.length === 0 ? (
                    <p style={{ color: '#64748b', textAlign: 'center', padding: '2rem' }}>
                      No ratings yet for this store.
                    </p>
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
                                  <User className="h-4 w-4" style={{ color: '#64748b' }} />
                                  <span>{rating.user?.name || 'Unknown User'}</span>
                                </div>
                              </td>
                              <td style={{ padding: '0.75rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                  {[...Array(5)].map((_, i) => (
                                    <Star 
                                      key={i} 
                                      className="h-4 w-4" 
                                      style={{ 
                                        color: i < rating.ratingValue ? '#f59e0b' : '#e2e8f0',
                                        fill: i < rating.ratingValue ? '#f59e0b' : 'none'
                                      }} 
                                    />
                                  ))}
                                  <span style={{ marginLeft: '0.5rem', fontWeight: '600' }}>
                                    {rating.ratingValue}/5
                                  </span>
                                </div>
                              </td>
                              <td style={{ padding: '0.75rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#64748b' }}>
                                  <Calendar className="h-4 w-4" />
                                  <span>{new Date(rating.createdAt).toLocaleDateString()}</span>
                                </div>
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