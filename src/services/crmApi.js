import axios from 'axios';
import { apiClient } from './authService';
import { setupCaptchaInterceptor } from '../context/interceptorSetup';

// Create CRM-specific axios instance
const crmApi = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // Required for sending cookies with cross-origin requests
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000 // 30 seconds timeout
});

setupCaptchaInterceptor(crmApi);

// Add admin token to requests
crmApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle token expiration
crmApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear admin token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// CRM Authentication - Use regular admin login (same as regular admin)
export const crmLogin = async (credentials) => {
  const response = await apiClient.post('/admin/auth/login', credentials);
  return response.data;
};

// CRM Donations
export const getCRMDonations = async (params = {}) => {
  const response = await apiClient.get('/crm/donations', { params });
  return response.data;
};

export const getCRMDonation = async (id) => {
  const response = await apiClient.get(`/crm/donations/${id}`);
  return response.data;
};

export const createCRMDonation = async (donationData) => {
  const response = await apiClient.post('/crm/donations', donationData);
  return response.data;
};

export const updateCRMDonation = async (id, donationData) => {
  const response = await apiClient.put(`/crm/donations/${id}`, donationData);
  return response.data;
};

export const deleteCRMDonation = async (id) => {
  const response = await apiClient.delete(`/crm/donations/${id}`);
  return response.data;
};

export const getCRMDonationStats = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.search) params.append('search', filters.search);
  if (filters.method) params.append('method', filters.method);
  if (filters.status) params.append('status', filters.status);
  if (filters.startDate) params.append('startDate', filters.startDate);
  if (filters.endDate) params.append('endDate', filters.endDate);
  if (filters.projectId) params.append('projectId', filters.projectId);
  if (filters.categoryId) params.append('categoryId', filters.categoryId);
  
  const queryString = params.toString();
  const url = `/crm/donations/stats${queryString ? `?${queryString}` : ''}`;
  const response = await apiClient.get(url);
  return response.data;
};

export const exportCRMDonations = async (filters) => {
  const response = await apiClient.post('/crm/donations/export', { filters }, {
    responseType: 'blob'
  });
  return response;
};

// CRM Donors
export const getCRMDonors = async (params = {}) => {
  const response = await apiClient.get('/crm/donors', { params });
  return response.data;
};

export const getCRMDonor = async (id) => {
  const response = await apiClient.get(`/crm/donors/${id}`);
  return response.data;
};

export const createCRMDonor = async (donorData) => {
  const response = await apiClient.post('/crm/donors', donorData);
  return response.data;
};

export const updateCRMDonor = async (id, donorData) => {
  const response = await apiClient.put(`/crm/donors/${id}`, donorData);
  return response.data;
};

export const deleteCRMDonor = async (id) => {
  const response = await apiClient.delete(`/crm/donors/${id}`);
  return response.data;
};

export const searchCRMDonors = async (query) => {
  const response = await apiClient.get('/crm/donors/search', { params: { q: query } });
  return response.data;
};

// CRM Categories
export const getCRMCategories = async (params = {}) => {
  const response = await apiClient.get('/crm/categories', { params });
  return response.data;
};

export const getCRMCategory = async (id) => {
  const response = await apiClient.get(`/crm/categories/${id}`);
  return response.data;
};

export const createCRMCategory = async (categoryData) => {
  const response = await apiClient.post('/crm/categories', categoryData);
  return response.data;
};

export const updateCRMCategory = async (id, categoryData) => {
  const response = await apiClient.put(`/crm/categories/${id}`, categoryData);
  return response.data;
};

export const deleteCRMCategory = async (id) => {
  const response = await apiClient.delete(`/crm/categories/${id}`);
  return response.data;
};

// CRM Receipts
export const getCRMReceiptTemplate = async () => {
  const response = await apiClient.get('/crm/receipts/template');
  return response.data;
};

export const getCRMReceiptSequence = async () => {
  const response = await apiClient.get('/crm/receipts/sequence');
  return response.data;
};

export const updateCRMReceiptTemplate = async (templateData) => {
  const response = await apiClient.put('/crm/receipts/template', templateData);
  return response.data;
};

export const generateCRMReceiptNumber = async () => {
  const response = await apiClient.post('/crm/receipts/generate-number');
  return response.data;
};

export const issueCRMReceipt = async (donationId) => {
  const response = await apiClient.post(`/crm/receipts/issue/${donationId}`);
  return response.data;
};

export const emailCRMReceipt = async (donationId, email = null) => {
  const response = await apiClient.post(`/crm/receipts/email/${donationId}`, { email });
  return response.data;
};

export const downloadCRMReceipt = async (receiptNo) => {
  try {
    const response = await apiClient.get(`/crm/receipts/download/${receiptNo}`, {
      responseType: 'blob',
      validateStatus: function (status) {
        // Accept all status codes so we can handle errors manually
        return status >= 200 && status < 500;
      }
    });
    
    // Check if response is an error (blob will contain JSON error)
    if (response.status >= 400) {
      // Convert blob to text and parse JSON error
      const errorText = await response.data.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: 'Failed to download receipt' };
      }
      const error = new Error(errorData.message || 'Failed to download receipt');
      error.response = { status: response.status, data: errorData };
      throw error;
    }
    
    return response;
  } catch (error) {
    // If it's already our formatted error, rethrow it
    if (error.response) {
      throw error;
    }
    // Otherwise, it's a network error or other issue
    throw error;
  }
};

export const generateCRMReceiptHTML = async (donationId) => {
  const response = await apiClient.get(`/crm/receipts/html/${donationId}`);
  return response.data;
};

// CRM Projects
export const getCRMProjects = async (params = {}) => {
  const response = await apiClient.get('/crm/projects', { params });
  return response.data;
};

// CRM Campaigns  
export const getCRMCampaigns = async (params = {}) => {
  const response = await apiClient.get('/crm/campaigns', { params });
  return response.data;
};

// CRM Auth helpers - Use regular admin auth
export const getCRMUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const getCRMToken = () => {
  return localStorage.getItem('token');
};

export const isCRMLoggedIn = () => {
  // Check both token AND user data (user is set after successful login)
  // With cookie-based auth, we rely on cookies being sent automatically with requests
  const token = getCRMToken();
  const user = getCRMUser();
  
  // If we have either a token OR user data, consider logged in
  // The actual API calls will verify authentication with cookies or bearer token
  return !!(token || user);
};

export const logoutCRM = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export default crmApi;
