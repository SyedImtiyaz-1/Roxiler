import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const Signup: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { signup } = useAuth();
  const navigate = useNavigate();

  // Validation functions
  const validateName = (name: string) => {
    return name.length >= 20 && name.length <= 60;
  };

  const validateAddress = (address: string) => {
    return address.length <= 400;
  };

  const validatePassword = (password: string) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasValidLength = password.length >= 8 && password.length <= 16;
    return hasUpperCase && hasSpecialChar && hasValidLength;
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const getPasswordStrength = (password: string) => {
    const checks = {
      length: password.length >= 8 && password.length <= 16,
      uppercase: /[A-Z]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    return checks;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(''); // Clear error when user starts typing
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!validateName(formData.name)) {
      setError('Name must be between 20 and 60 characters.');
      return;
    }

    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!validateAddress(formData.address)) {
      setError('Address must be 400 characters or less.');
      return;
    }

    if (!validatePassword(formData.password)) {
      setError('Password must be 8-16 characters with 1 uppercase letter and 1 special character.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      await signup(formData.name, formData.email, formData.address, formData.password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const passwordChecks = getPasswordStrength(formData.password);

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Create Account</h1>
        <p className="login-subtitle">
          Sign up to start rating stores
        </p>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="error-message">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="name" className="form-label">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your full name (20-60 characters)"
              value={formData.name}
              onChange={handleInputChange}
              className="form-input"
              required
            />
            <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
              {formData.name.length}/60 characters
            </p>
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleInputChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="address" className="form-label">Address</label>
            <input
              id="address"
              name="address"
              type="text"
              placeholder="Enter your address (max 400 characters)"
              value={formData.address}
              onChange={handleInputChange}
              className="form-input"
              required
            />
            <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
              {formData.address.length}/400 characters
            </p>
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <div className="password-container">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password (8-16 chars, 1 uppercase, 1 special)"
                value={formData.password}
                onChange={handleInputChange}
                className="form-input"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            
            {/* Password strength indicator */}
            {formData.password && (
              <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: '#f8fafc', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.75rem', color: '#374151', marginBottom: '0.5rem', fontWeight: '600' }}>
                  Password Requirements:
                </div>
                <div style={{ display: 'grid', gap: '0.25rem', fontSize: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    {passwordChecks.length ? 
                      <CheckCircle className="h-3 w-3" style={{ color: '#10b981' }} /> : 
                      <XCircle className="h-3 w-3" style={{ color: '#ef4444' }} />
                    }
                    <span style={{ color: passwordChecks.length ? '#10b981' : '#6b7280' }}>
                      8-16 characters
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    {passwordChecks.uppercase ? 
                      <CheckCircle className="h-3 w-3" style={{ color: '#10b981' }} /> : 
                      <XCircle className="h-3 w-3" style={{ color: '#ef4444' }} />
                    }
                    <span style={{ color: passwordChecks.uppercase ? '#10b981' : '#6b7280' }}>
                      1 uppercase letter
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    {passwordChecks.special ? 
                      <CheckCircle className="h-3 w-3" style={{ color: '#10b981' }} /> : 
                      <XCircle className="h-3 w-3" style={{ color: '#ef4444' }} />
                    }
                    <span style={{ color: passwordChecks.special ? '#10b981' : '#6b7280' }}>
                      1 special character
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
            <div className="password-container">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="form-input"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                title={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="loading-spinner"></div>
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="signup-link">
          <p>
            Already have an account?{' '}
            <Link to="/login">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup; 