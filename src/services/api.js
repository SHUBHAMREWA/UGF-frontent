import axios from 'axios';
import { setupCaptchaInterceptor } from '../context/interceptorSetup';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true, // Required for sending cookies with cross-origin requests
  headers: {
    'Content-Type': 'application/json',
  },
});

setupCaptchaInterceptor(api);

export const donationAPI = {
  createDonation: async (data) => {
    return await api.post('/donations', data);
  },
  
  getDonations: async () => {
    return await api.get('/donations');
  },
  
  getCampaigns: async () => {
    return await api.get('/campaigns');
  },
  
  getDonationStats: async () => {
    return await api.get('/stats');
  }
}; 


export const captchaVerify = async ({ deviceId, captchaToken }) => {
  return axios.post("/api/captcha-verify", {
    deviceId,
    captchaToken,
  });
};