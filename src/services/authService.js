import axios from 'axios';
import { setupCaptchaInterceptor } from '../context/interceptorSetup';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create a dedicated axios instance with proper configuration
export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 30000 // 30 seconds timeout
});

// Add token to all requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Debug: Log all outgoing requests
    console.log('🚀 API Request:');
    console.log('  URL:', config.baseURL + config.url);
    console.log('  Method:', config.method?.toUpperCase());
    console.log('  Headers:', JSON.stringify(config.headers, null, 2));
    console.log('  Data:', JSON.stringify(config.data, null, 2));
    
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
apiClient.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

// Apply captcha interceptor
setupCaptchaInterceptor(apiClient);

const authService = {
  async login(credentials) {
    try {
      console.log('🔐 AuthService - Login attempt with credentials:', credentials);
      console.log('🔐 Email:', credentials.email);
      console.log('🔐 Password exists:', !!credentials.password);
      console.log('🔐 Password length:', credentials.password?.length);
      
      // Explicitly create the payload object
      const payload = {
        email: credentials.email,
        password: credentials.password
      };
      
      console.log('🔐 Payload being sent:', payload);
      console.log('🔐 Payload JSON:', JSON.stringify(payload));
      
      // Try admin login first, then regular user login
      try {
        console.log('📡 Trying admin login endpoint: /admin/auth/login');
        const response = await apiClient.post('/admin/auth/login', payload);
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }
        return response.data;
      } catch (adminError) {
        console.log('❌ Admin login failed, trying regular user login');
        console.log('Admin error:', adminError.response?.data?.message);
        
        // If admin login fails, try regular user login
        console.log('📡 Trying regular user login endpoint: /users/login');
        const response = await apiClient.post('/users/login', payload);
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }
        return response.data;
      }
    } catch (error) {
      console.error('❌ Both login attempts failed:', error.response?.data);
      throw error;
    }
  },

  async getCurrentUser() {
    try {
      // Try admin profile first, then regular user profile
      try {
        const response = await apiClient.get('/admin/auth/me');
        return response.data.user;
      } catch (adminError) {
        // If admin profile fails, try regular user profile
        const response = await apiClient.get('/users/profile');
        return response.data;
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  },

  logout() {
    localStorage.removeItem('token');
  },

  isAuthenticated() {
    return !!localStorage.getItem('token');
  },

  async sendOTP(data) {
    try {
      const response = await apiClient.post('/users/send-otp', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async verifyOTP(data) {
    try {
      const response = await apiClient.post('/users/verify-otp', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async register(userData) {
    try {
      const response = await apiClient.post('/users/register', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getDonationHistory() {
    try {
      const response = await apiClient.get('/donations/history');
      return response.data;
    } catch (error) {
      console.error('Error fetching donation history:', error);
      return [];
    }
  },

  async updateProfile(profileData) {
    try {
      const response = await apiClient.put('/users/profile', profileData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async googleLogin(tokenId) {
    try {
      console.log('🔐 AuthService - Google login attempt');
      const response = await apiClient.post('/users/google-login', { tokenId });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      console.error('❌ Google login failed:', error.response?.data);
      throw error;
    }
  }
};

export default authService; 