import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { storesAPI, ratingsAPI } from '../services/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';
import { 
  Search, 
  Star, 
  MapPin, 
  User, 
  Filter,
  SortAsc,
  SortDesc,
  Loader2,
  ShoppingBag,
  ArrowLeft,
  Heart
} from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Store, Rating } from '../types';

const StoreList: React.FC = () => {
  const { user } = useAuth();
  const [stores, setStores] = useState<Store[]>([]);
  const [filteredStores, setFilteredStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'rating'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [userRatings, setUserRatings] = useState<{ [key: string]: Rating }>({});
  const [ratingLoading, setRatingLoading] = useState<{ [key: string]: boolean }>({});
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchStores();
    if (user) {
      fetchUserRatings();
    }
  }, [user]);

  useEffect(() => {
    filterAndSortStores();
  }, [stores, searchTerm, sortBy, sortOrder]);

  const fetchStores = async () => {
    try {
      setLoading(true);
      const response = await storesAPI.getAll();
      setStores(response);
    } catch (err: any) {
      setError('Failed to load stores. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserRatings = async () => {
    try {
      const response = await ratingsAPI.getMyRatings();
      const ratingsMap: { [key: string]: Rating } = {};
      response.forEach((rating: Rating) => {
        ratingsMap[rating.storeId] = rating;
      });
      setUserRatings(ratingsMap);
    } catch (err) {
      // Silently fail - user might not have any ratings
    }
  };

  const filterAndSortStores = () => {
    let filtered = stores.filter(store => {
      const matchesSearch = 
        store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.address.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });

    // Sort stores
    filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      if (sortBy === 'name') {
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
      } else {
        // For now, sort by name since we don't have average rating in the type
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredStores(filtered);
  };

  const handleRating = async (storeId: string, rating: number) => {
    try {
      setRatingLoading(prev => ({ ...prev, [storeId]: true }));
      setError('');
      setSuccessMessage('');
      
      const existingRating = userRatings[storeId];
      if (existingRating) {
        // Update existing rating
        await ratingsAPI.update(existingRating.id, { ratingValue: rating });
        setSuccessMessage(`Rating updated to ${rating} stars!`);
      } else {
        // Create new rating
        await ratingsAPI.create({ storeId, ratingValue: rating });
        setSuccessMessage(`Rating submitted: ${rating} stars!`);
      }

      // Refresh stores and user ratings
      await fetchStores();
      await fetchUserRatings();
    } catch (err: any) {
      setError('Failed to submit rating. Please try again.');
    } finally {
      setRatingLoading(prev => ({ ...prev, [storeId]: false }));
    }
  };

  const renderStars = (rating: number, interactive = false, storeId?: string) => {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={interactive && storeId ? () => handleRating(storeId, star) : undefined}
            disabled={!interactive || (storeId ? ratingLoading[storeId] : false)}
            style={{
              background: 'none',
              border: 'none',
              cursor: interactive ? 'pointer' : 'default',
              padding: '0',
              transition: 'transform 0.2s ease',
              transform: interactive ? 'scale(1)' : 'scale(1)',
            }}
            onMouseEnter={(e) => {
              if (interactive) {
                e.currentTarget.style.transform = 'scale(1.1)';
              }
            }}
            onMouseLeave={(e) => {
              if (interactive) {
                e.currentTarget.style.transform = 'scale(1)';
              }
            }}
          >
            <Star 
              className="h-5 w-5" 
              style={{ 
                color: star <= rating ? '#f59e0b' : '#e2e8f0',
                fill: star <= rating ? '#f59e0b' : 'none'
              }}
            />
          </button>
        ))}
      </div>
    );
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
            <p>Loading stores...</p>
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <ShoppingBag className="h-8 w-8" style={{ color: '#3b82f6' }} />
              <div>
                <div className="app-title">Browse Stores</div>
                <div className="app-subtitle">Find and rate your favorite stores</div>
              </div>
            </div>
          </div>
          <div className="role-badge">
            {filteredStores.length} stores found
          </div>
        </div>
      </div>

      <div className="dashboard-content">
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
            <Heart className="h-4 w-4" />
            {successMessage}
          </div>
        )}

        {/* Search and Filter Section */}
        <div className="user-info-card">
          <div className="card-title">
            <Search className="h-5 w-5" style={{ color: '#3b82f6' }} />
            <span>Search & Filter</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div>
              <label className="form-label">Search Stores</label>
              <input
                type="text"
                placeholder="Search by name or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input"
              />
            </div>
            
            <div>
              <label className="form-label">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'rating')}
                className="form-input"
              >
                <option value="name">Name</option>
                <option value="rating">Rating</option>
              </select>
            </div>

            <div>
              <label className="form-label">Sort Order</label>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="form-input"
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  cursor: 'pointer'
                }}
              >
                <span>{sortOrder === 'asc' ? 'Ascending' : 'Descending'}</span>
                {sortOrder === 'asc' ? (
                  <SortAsc className="h-4 w-4" />
                ) : (
                  <SortDesc className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Stores Grid */}
        {filteredStores.length === 0 ? (
          <div className="user-info-card">
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <Search className="h-16 w-16" style={{ color: '#d1d5db', margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.5rem' }}>
                No stores found
              </h3>
              <p style={{ color: '#64748b', maxWidth: '28rem', margin: '0 auto' }}>
                Try adjusting your search terms or filters to find what you're looking for.
              </p>
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
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
        )}
      </div>
    </div>
  );
};

export default StoreList; 