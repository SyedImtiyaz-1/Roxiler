import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { storesAPI, ratingsAPI } from '../services/api';
import { 
  Store, 
  Star, 
  Search, 
  MapPin, 
  User, 
  LogOut,
  Loader2
} from 'lucide-react';
import type { Store as StoreType, Rating } from '../types';

const StoreList: React.FC = () => {
  const { user } = useAuth();
  const [stores, setStores] = useState<StoreType[]>([]);
  const [filteredStores, setFilteredStores] = useState<StoreType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [userRatings, setUserRatings] = useState<{ [key: string]: Rating }>({});
  const [ratingLoading, setRatingLoading] = useState<{ [key: string]: boolean }>({});
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      setLoading(true);
      const storesData = await storesAPI.getAll();
      setStores(storesData);
      setFilteredStores(storesData);
      
      // Fetch user's ratings for all stores
      const ratingsData = await ratingsAPI.getMyRatings();
      const ratingsMap: { [key: string]: Rating } = {};
      ratingsData.forEach((rating: Rating) => {
        ratingsMap[rating.storeId] = rating;
      });
      setUserRatings(ratingsMap);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch stores');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filtered = stores.filter(store =>
      store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.address.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStores(filtered);
  }, [searchTerm, stores]);

  const handleRating = async (storeId: string, ratingValue: number) => {
    try {
      setRatingLoading(prev => ({ ...prev, [storeId]: true }));
      
      const existingRating = userRatings[storeId];
      
      if (existingRating) {
        // Update existing rating
        await ratingsAPI.update(existingRating.id, { ratingValue });
        setSuccessMessage(`Rating updated to ${ratingValue} stars!`);
      } else {
        // Create new rating
        await ratingsAPI.create({ storeId, ratingValue });
        setSuccessMessage(`Rating submitted: ${ratingValue} stars!`);
      }
      
      // Refresh ratings
      const ratingsData = await ratingsAPI.getMyRatings();
      const ratingsMap: { [key: string]: Rating } = {};
      ratingsData.forEach((rating: Rating) => {
        ratingsMap[rating.storeId] = rating;
      });
      setUserRatings(ratingsMap);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit rating');
    } finally {
      setRatingLoading(prev => ({ ...prev, [storeId]: false }));
    }
  };

  const renderStars = (currentRating: number, interactive: boolean = false, storeId?: string) => {
    return (
      <div style={{ display: 'flex', gap: '0.25rem' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => interactive && storeId && handleRating(storeId, star)}
            disabled={!interactive || ratingLoading[storeId || '']}
            style={{
              background: 'none',
              border: 'none',
              cursor: interactive ? 'pointer' : 'default',
              color: star <= currentRating ? '#f59e0b' : '#d1d5db',
              fontSize: '1.25rem',
              padding: '0.125rem',
              transition: 'color 0.2s ease',
              opacity: ratingLoading[storeId || ''] ? 0.5 : 1
            }}
            onMouseEnter={(e) => {
              if (interactive) {
                e.currentTarget.style.color = '#f59e0b';
              }
            }}
            onMouseLeave={(e) => {
              if (interactive) {
                e.currentTarget.style.color = star <= currentRating ? '#f59e0b' : '#d1d5db';
              }
            }}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div className="header-container">
            <div>
              <h1 className="app-title">Store Rating System</h1>
              <p className="app-subtitle">Browse and Rate Stores</p>
            </div>
            <div className="header-actions">
              <div className="role-badge">
                <User className="h-4 w-4" />
                <span>User</span>
              </div>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <div className="loading-spinner"></div>
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
            <p className="app-subtitle">Browse and Rate Stores</p>
          </div>
          <div className="header-actions">
            <div className="role-badge">
              <User className="h-4 w-4" />
              <span>User</span>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="success-message">
            {successMessage}
          </div>
        )}

        <div className="user-info-card">
          <div className="card-title">
            <Search className="h-5 w-5" />
            <span>Search Stores</span>
          </div>
          <input
            type="text"
            placeholder="Search stores by name or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input"
          />
        </div>

        <div className="stores-grid">
          {filteredStores.map((store) => {
            const userRating = userRatings[store.id];
            const isRatingLoading = ratingLoading[store.id];
            
            return (
              <div key={store.id} className="user-info-card" style={{ cursor: 'default' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.5rem' }}>
                      {store.name}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.875rem' }}>
                      <MapPin className="h-4 w-4" />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {store.address}
                      </span>
                    </div>
                  </div>
                  <div className="role-badge">
                    {store._count?.ratings ? `${store._count.ratings} ratings` : 'New'}
                  </div>
                </div>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {/* Store Owner Info */}
                  <div style={{ padding: '0.75rem', background: '#f8fafc', borderRadius: '0.375rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <User className="h-4 w-4" style={{ color: '#9ca3af' }} />
                      <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
                        Owner: {store.owner?.name || 'Unknown Owner'}
                      </span>
                    </div>
                  </div>
                  {/* User Rating Section */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                        Your Rating
                      </span>
                      {userRating && (
                        <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                          Click to change
                        </span>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      {renderStars(userRating?.ratingValue || 0, true, store.id)}
                      {isRatingLoading && (
                        <Loader2 className="h-4 w-4" style={{ animation: 'spin 1s linear infinite', color: '#3b82f6' }} />
                      )}
                    </div>
                    {userRating && (
                      <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
                        You rated this store {userRating.ratingValue}★
                      </p>
                    )}
                  </div>
                  {/* Rating Instructions */}
                  {!userRating && (
                    <div style={{ 
                      padding: '0.75rem', 
                      background: '#eff6ff', 
                      border: '1px solid #bfdbfe', 
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                      color: '#1e40af'
                    }}>
                      💡 Click on the stars above to rate this store (1-5 stars)
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filteredStores.length === 0 && !loading && (
          <div className="user-info-card">
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <Store className="h-12 w-12" style={{ color: '#9ca3af', margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                No stores found
              </h3>
              <p style={{ color: '#6b7280' }}>
                {searchTerm ? 'Try adjusting your search terms.' : 'No stores are available at the moment.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreList; 