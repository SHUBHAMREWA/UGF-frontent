import axios from "axios";
import Store from "../redux/store.js";

console.log("🔥 Interceptor system INITIALIZING...");

/**
 * 🔐 Global Request Interceptor Logic
 * This function can be applied to any axios instance to enforce captcha security.
 */
export const setupCaptchaInterceptor = (axiosInstance) => {
  // REQUEST INTERCEPTOR
  axiosInstance.interceptors.request.use(
    (config) => {
      // Whitelist: Skip interceptor for certain critical endpoints
      const whitelistedPaths = [
        '/captcha-verify',
        '/health',
        '/config/razorpay-key',
        '/users/profile',
        '/admin/auth/me',
        '/users/me',
        '/users/login',
        '/admin/auth/login',
        '/carousel',
        '/hero',
        '/testimonials',
        '/blog',
        '/gallery',
        '/programs',
        '/events',
        '/services',
        '/donations',
        '/tenders',
        '/content'
      ];
      
      const isWhitelisted = whitelistedPaths.some(path => config.url?.includes(path));
      
      if (isWhitelisted) {
        // Add device ID even for whitelisted requests (for tracking)
        const { deviceId } = Store.getState().captcha;
        if (deviceId) {
          config.headers['x-device-id'] = deviceId;
        }
        return config;
      }

      const { captchaRequired, captchaToken, deviceId } = Store.getState().captcha;

      // 1. Attach Device ID for backend tracking (if available)
      if (deviceId) {
        config.headers['x-device-id'] = deviceId;
      }

      // 2. If captcha is required but no token, DON'T block - let backend handle it
      // This prevents frontend timeout errors
      if (captchaRequired && !captchaToken) {
        console.warn("⚠️ Captcha required, but proceeding with request (backend will validate)");
      }

      // 3. Attach token if it exists (for backend verification)
      if (captchaToken) {
        config.headers['x-captcha-token'] = captchaToken;
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  // RESPONSE INTERCEPTOR
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      // Handle timeout errors gracefully
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        console.warn("⏱️ Request timed out - this is normal if server is slow");
        return Promise.reject({
          isTimeout: true,
          message: "Request timed out. Please try again."
        });
      }

      // If backend says captcha is required (status 403)
      if (error.response?.status === 403 && error.response?.data?.captchaRequired) {
        const { requestCount, threshold, message } = error.response.data;
        
        console.warn(`🛡️ Backend requested captcha verification.`);
        console.warn(`📊 Requests made: ${requestCount}/${threshold}`);
        
        // Trigger the captcha overlay by updating redux
        Store.dispatch({ type: 'security/setCaptchaRequired' });
        
        // Return a special error that components can handle
        return Promise.reject({
          captchaRequired: true,
          message: message || "Please complete captcha verification"
        });
      }
      
      return Promise.reject(error);
    }
  );
};

// Apply to the default axios instance
setupCaptchaInterceptor(axios);

console.log("✅ Default axios interceptor applied.");

