import ReCAPTCHA from "react-google-recaptcha";
import { useDispatch, useSelector } from "react-redux";
import "./CaptchOverlay.css";
import axios from "axios";
import { setCaptchaToken, captchaSuccess, captchaFailed } from "../redux/slices/captchaSlice.js";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function CaptchaOverlay() {
  const dispatch = useDispatch();
  const { captchaRequired, deviceId } = useSelector((s) => s.captcha);
  const [verifying, setVerifying] = useState(false);
  const [errorInfo, setErrorInfo] = useState(null);
  const [keyError, setKeyError] = useState(false);

  const siteKey = process.env.REACT_APP_RECAPTCHA_SITE_KEY;
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  // Debug logging
  useEffect(() => {
    console.log("🔑 ReCAPTCHA Site Key:", siteKey ? `${siteKey.substring(0, 10)}...` : "MISSING!");
    if (!siteKey) {
      setKeyError(true);
      console.error("❌ REACT_APP_RECAPTCHA_SITE_KEY is not set in .env file!");
    }
  }, [siteKey]);

  if (!captchaRequired) return null;

  const handleCaptchaChange = async (token) => {
    if (token) {
      console.log("🛠️ Verifying captcha with backend...");
      setVerifying(true);
      setErrorInfo(null);
      
      try {
        // We use a clean axios post to avoid interceptor interference for this call
        const response = await axios.post(`${API_URL}/captcha-verify`, {
          captchaToken: token
        }, {
          headers: { 'x-device-id': deviceId }
        });

        if (response.data.success) {
          console.log("✅ Backend verified captcha. Access restored!");
          dispatch(setCaptchaToken(token));
          dispatch(captchaSuccess());
          toast.success("Verification successful! You can continue browsing.");
        } else {
          throw new Error("Verification failed on server");
        }
      } catch (err) {
        console.error("❌ Captcha verification failed:", err);
        const errorMsg = err.response?.data?.message || err.message || "Verification failed";
        setErrorInfo(errorMsg);
        toast.error("Captcha verification failed. Please try again.");
        dispatch(captchaFailed());
      } finally {
        setVerifying(false);
      }
    } else {
      dispatch(captchaFailed());
    }
  };

  return (
    <div className="captcha-overlay">
      <div className="captcha-modal">
        <h3>🛡️ Security Verification Required</h3>
        <p style={{ fontSize: '0.9rem', color: '#555', marginBottom: '1rem', lineHeight: '1.5' }}>
          We've detected <strong>unusual activity</strong> from your session.<br/>
          Please complete this quick verification to continue.
        </p>
        
        {errorInfo && (
          <div style={{ 
            padding: '0.8rem', 
            background: '#fee', 
            border: '1px solid #fcc',
            borderRadius: '6px',
            marginBottom: '1rem',
            fontSize: '0.85rem',
            color: '#c33'
          }}>
            ⚠️ {errorInfo}
          </div>
        )}

        {verifying ? (
          <div className="verifying-loader" style={{ 
            padding: '2rem',
            textAlign: 'center',
            color: '#666'
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>⏳</div>
            Verifying...
          </div>
        ) : keyError || !siteKey ? (
          <div style={{ 
            padding: '1.5rem',
            textAlign: 'center',
            color: '#c33',
            background: '#fee',
            borderRadius: '8px',
            border: '1px solid #fcc'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚠️</div>
            <strong>ReCAPTCHA Configuration Error</strong>
            <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
              Site key is missing. Please check REACT_APP_RECAPTCHA_SITE_KEY in .env file.
            </p>
          </div>
        ) : (
          <ReCAPTCHA
            sitekey={siteKey}
            onChange={handleCaptchaChange}
            onErrored={() => {
              console.error("❌ ReCAPTCHA failed to load");
              setErrorInfo("ReCAPTCHA failed to load. Please refresh the page.");
            }}
          />
        )}
        
        <p style={{ 
          fontSize: '0.75rem', 
          color: '#999', 
          marginTop: '1rem',
          textAlign: 'center'
        }}>
          This helps us protect our service from automated abuse.
        </p>
      </div>
    </div>
  );
}
