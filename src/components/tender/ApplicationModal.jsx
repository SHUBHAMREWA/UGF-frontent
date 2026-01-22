import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Check, Mail, FileText } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import api from '../../utils/api';
import { setupCaptchaInterceptor } from '../../context/interceptorSetup';
import authService from '../../services/authService';
import { uploadFileToFirebase, uploadPDFToFirebase, uploadImageToFirebase } from '../../utils/firebaseStorage';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import './ApplicationModal.css';
const ApplicationModal = ({ tender, onClose, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    applicantType: '',
    fullName: '',
    mobile: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    aadhaarNo: '',
    panNo: '',
    companyName: '',
    companyRegNo: '',
    gstNo: '',
    yearEstablished: ''
  });
  const [documents, setDocuments] = useState({});
  const [errors, setErrors] = useState({});
  const [declarations, setDeclarations] = useState({
    detailsTrue: false,
    termsAccepted: false
  });
  const [applicationId, setApplicationId] = useState(null);
  const [emailVerification, setEmailVerification] = useState({
    email: '',
    otp: '',
    otpSent: false,
    verified: false,
    sendingOtp: false,
    verifyingOtp: false
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleDocumentChange = (docName, file) => {
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${docName} file size must be less than 5MB`);
        return;
      }
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        toast.error(`${docName} must be PDF, JPG, or PNG`);
        return;
      }
      setDocuments(prev => ({ ...prev, [docName]: file }));
    }
  };

  const validateStep = (stepNum) => {
    const newErrors = {};
    
    if (stepNum === 1) {
      if (!formData.applicantType) {
        newErrors.applicantType = 'Please select applicant type';
      }
    } else if (stepNum === 2) {
      if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
      if (!formData.mobile.match(/^[0-9]{10}$/)) newErrors.mobile = 'Valid 10-digit mobile number required';
      if (!formData.email.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)) newErrors.email = 'Valid email required';
      if (!formData.address.trim()) newErrors.address = 'Address is required';
      if (!formData.city.trim()) newErrors.city = 'City is required';
      if (!formData.state.trim()) newErrors.state = 'State is required';
      if (!formData.pincode.match(/^[0-9]{6}$/)) newErrors.pincode = 'Valid 6-digit pincode required';
    } else if (stepNum === 3) {
      if (!formData.aadhaarNo.match(/^[0-9]{12}$/)) newErrors.aadhaarNo = 'Valid 12-digit Aadhaar number required';
      if (!formData.panNo.match(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)) newErrors.panNo = 'Valid PAN number required (e.g., ABCDE1234F)';
    } else if (stepNum === 4 && formData.applicantType === 'Company') {
      if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required';
      if (!formData.companyRegNo.trim()) newErrors.companyRegNo = 'Company registration number is required';
    } else if (stepNum === 5) {
      tender.requiredDocuments.forEach(doc => {
        if (!documents[doc]) {
          newErrors[`doc_${doc}`] = `${doc} is required`;
        }
      });
    } else if (stepNum === 6) {
      if (!declarations.detailsTrue) newErrors.detailsTrue = 'Please confirm all details are true';
      if (!declarations.termsAccepted) newErrors.termsAccepted = 'Please accept terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendOTP = async () => {
    if (!formData.email || !formData.email.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)) {
      toast.error('Please enter a valid email address first');
      return;
    }

    try {
      setEmailVerification(prev => ({ ...prev, sendingOtp: true, email: formData.email }));
      await authService.sendOTP({ email: formData.email, mobileNumber: '' });
      setEmailVerification(prev => ({ ...prev, otpSent: true, sendingOtp: false }));
      toast.success('OTP sent to your email. Please check your inbox.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP. Please try again.');
      setEmailVerification(prev => ({ ...prev, sendingOtp: false }));
    }
  };

  const handleVerifyOTP = async () => {
    if (!emailVerification.otp) {
      toast.error('Please enter the OTP');
      return;
    }

    try {
      setEmailVerification(prev => ({ ...prev, verifyingOtp: true }));
      const response = await authService.verifyOTP({ 
        email: formData.email, 
        otp: emailVerification.otp 
      });
      
      if (response && response.verified !== false) {
        setEmailVerification(prev => ({ ...prev, verified: true, verifyingOtp: false }));
        toast.success('Email verified successfully!');
      } else {
        toast.error('Invalid or expired OTP. Please try again.');
        setEmailVerification(prev => ({ ...prev, verifyingOtp: false }));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to verify OTP. Please try again.');
      setEmailVerification(prev => ({ ...prev, verifyingOtp: false }));
    }
  };

  const handleNext = () => {
    if (step === 2 && !emailVerification.verified) {
      toast.error('Please verify your email before proceeding');
      return;
    }
    if (validateStep(step)) {
      const maxStep = formData.applicantType === 'Company' ? 7 : 6;
      setStep(prev => Math.min(prev + 1, maxStep));
    }
  };

  const handleBack = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!emailVerification.verified) {
      toast.error('Please verify your email before submitting');
      return;
    }
    const finalStep = formData.applicantType === 'Company' ? 6 : 5;
    if (!validateStep(finalStep)) return;

    try {
      setLoading(true);
      
      // Upload all documents to Firebase Storage
      const uploadedDocuments = [];
      for (const docName of tender.requiredDocuments) {
        const file = documents[docName];
        if (file) {
          try {
            toast.info(`Uploading ${docName}...`);
            
            // Determine if it's a PDF or image
            const isPDF = file.type === 'application/pdf';
            const folder = `applications/${isPDF ? 'documents' : 'images'}`;
            
            // Upload to Firebase Storage
            const uploadResult = await uploadFileToFirebase(file, folder);
            
            uploadedDocuments.push({
              documentName: docName,
              fileName: file.name,
              filePath: uploadResult.url,
              fileSize: file.size
            });
          } catch (uploadError) {
            console.error(`Error uploading ${docName}:`, uploadError);
            toast.error(`Failed to upload ${docName}. Please try again.`);
            throw uploadError;
          }
        } else {
          // Document is required but not provided
          toast.error(`Please upload ${docName}`);
          throw new Error(`Missing required document: ${docName}`);
        }
      }

      // Prepare application data with Firebase Storage URLs
      const applicationData = {
        tenderId: tender._id,
        applicantType: formData.applicantType,
        fullName: formData.fullName,
        mobile: formData.mobile,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        aadhaarNo: formData.aadhaarNo,
        panNo: formData.panNo.toUpperCase(),
        requiredDocuments: tender.requiredDocuments,
        uploadedDocuments: uploadedDocuments
      };

      if (formData.applicantType === 'Company') {
        applicationData.companyName = formData.companyName;
        applicationData.companyRegNo = formData.companyRegNo;
        if (formData.gstNo) applicationData.gstNo = formData.gstNo.toUpperCase();
        if (formData.yearEstablished) applicationData.yearEstablished = formData.yearEstablished;
      }

      // Use axios directly without auth interceptor for public route
      const axiosPublic = axios.create({
        baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
        withCredentials: true
      });
      
      setupCaptchaInterceptor(axiosPublic);

      const response = await axiosPublic.post('/applications', applicationData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        setApplicationId(response.data.application.applicationId);
        setStep(7);
        onSuccess();
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error(error.response?.data?.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="application-modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="application-modal-content"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <Card className="max-w-2xl w-full max-h-[90vh] flex flex-col">
          <CardHeader className="bg-primary text-primary-foreground rounded-t-lg">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold">Apply for Tender</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-primary-foreground hover:bg-primary-foreground/20"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-6 overflow-y-auto flex-1">
            {step < 7 && (
              <div className="step-indicator">
                <div className={`step ${step >= 1 ? 'active' : ''}`}>1</div>
                <div className={`step ${step >= 2 ? 'active' : ''}`}>2</div>
                <div className={`step ${step >= 2.5 ? 'active' : ''}`}>✓</div>
                <div className={`step ${step >= 3 ? 'active' : ''}`}>3</div>
                {formData.applicantType === 'Company' && (
                  <div className={`step ${step >= 4 ? 'active' : ''}`}>4</div>
                )}
                <div className={`step ${step >= (formData.applicantType === 'Company' ? 5 : 4) ? 'active' : ''}`}>
                  {formData.applicantType === 'Company' ? '5' : '4'}
                </div>
                <div className={`step ${step >= (formData.applicantType === 'Company' ? 6 : 5) ? 'active' : ''}`}>
                  {formData.applicantType === 'Company' ? '6' : '5'}
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="form-step">
                <h3>Applicant Type</h3>
                <div className="radio-group">
                  <label className={`radio-option ${formData.applicantType === 'Individual' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="applicantType"
                      value="Individual"
                      checked={formData.applicantType === 'Individual'}
                      onChange={handleInputChange}
                    />
                    <span>Individual</span>
                  </label>
                  <label className={`radio-option ${formData.applicantType === 'Company' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="applicantType"
                      value="Company"
                      checked={formData.applicantType === 'Company'}
                      onChange={handleInputChange}
                    />
                    <span>Company</span>
                  </label>
                </div>
                {errors.applicantType && <span className="error-text">{errors.applicantType}</span>}
              </div>
            )}

            {step === 2 && (
              <div className="form-step">
                <h3>Personal Information</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Full Name (as per PAN Card) *</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className={errors.fullName ? 'error' : ''}
                    />
                    {errors.fullName && <span className="error-text">{errors.fullName}</span>}
                  </div>
                  <div className="form-group">
                    <label>Mobile Number *</label>
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      maxLength="10"
                      className={errors.mobile ? 'error' : ''}
                    />
                    {errors.mobile && <span className="error-text">{errors.mobile}</span>}
                  </div>
                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={errors.email ? 'error' : ''}
                    />
                    {errors.email && <span className="error-text">{errors.email}</span>}
                  </div>
                  <div className="form-group full-width">
                    <label>Full Address *</label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows="3"
                      className={errors.address ? 'error' : ''}
                    />
                    {errors.address && <span className="error-text">{errors.address}</span>}
                  </div>
                  <div className="form-group">
                    <label>City *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={errors.city ? 'error' : ''}
                    />
                    {errors.city && <span className="error-text">{errors.city}</span>}
                  </div>
                  <div className="form-group">
                    <label>State *</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className={errors.state ? 'error' : ''}
                    />
                    {errors.state && <span className="error-text">{errors.state}</span>}
                  </div>
                  <div className="form-group">
                    <label>Pincode *</label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      maxLength="6"
                      className={errors.pincode ? 'error' : ''}
                    />
                    {errors.pincode && <span className="error-text">{errors.pincode}</span>}
                  </div>
                </div>
              </div>
            )}

            {step === 2.5 && (
              <div className="form-step">
                <h3>Email Verification</h3>
                <p className="step-description">Please verify your email address to continue with the application.</p>
                <div className="email-verification-section">
                  <div className="form-group">
                    <label>Email Address</label>
                    <div className="email-display">
                      <Mail className="h-5 w-5 text-primary" />
                      <span>{formData.email}</span>
                      {emailVerification.verified && (
                        <span className="flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                          <Check className="h-4 w-4" /> Verified
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {!emailVerification.verified && (
                    <>
                      {!emailVerification.otpSent ? (
                        <Button
                          type="button"
                          onClick={handleSendOTP}
                          disabled={emailVerification.sendingOtp || !formData.email}
                          className="w-full"
                        >
                          {emailVerification.sendingOtp ? 'Sending...' : 'Send OTP'}
                        </Button>
                      ) : (
                        <>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Enter OTP *</label>
                            <input
                              type="text"
                              value={emailVerification.otp}
                              onChange={(e) => setEmailVerification(prev => ({ ...prev, otp: e.target.value }))}
                              placeholder="Enter 6-digit OTP"
                              maxLength="6"
                              className="w-full px-4 py-3 text-center text-xl font-semibold tracking-widest border border-input rounded-lg focus:ring-2 focus:ring-ring"
                            />
                            <p className="text-xs text-muted-foreground text-center">
                              OTP sent to {formData.email}. Please check your inbox.
                            </p>
                          </div>
                          <div className="flex gap-3">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={handleSendOTP}
                              disabled={emailVerification.sendingOtp}
                              className="flex-1"
                            >
                              Resend OTP
                            </Button>
                            <Button
                              type="button"
                              onClick={handleVerifyOTP}
                              disabled={emailVerification.verifyingOtp || !emailVerification.otp}
                              className="flex-1"
                            >
                              {emailVerification.verifyingOtp ? 'Verifying...' : 'Verify OTP'}
                            </Button>
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="form-step">
                <h3>Identity Details</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Aadhaar Number *</label>
                    <input
                      type="text"
                      name="aadhaarNo"
                      value={formData.aadhaarNo}
                      onChange={handleInputChange}
                      maxLength="12"
                      className={errors.aadhaarNo ? 'error' : ''}
                    />
                    {errors.aadhaarNo && <span className="error-text">{errors.aadhaarNo}</span>}
                  </div>
                  <div className="form-group">
                    <label>PAN Number *</label>
                    <input
                      type="text"
                      name="panNo"
                      value={formData.panNo}
                      onChange={handleInputChange}
                      maxLength="10"
                      className={errors.panNo ? 'error' : ''}
                      style={{ textTransform: 'uppercase' }}
                    />
                    {errors.panNo && <span className="error-text">{errors.panNo}</span>}
                  </div>
                </div>
              </div>
            )}

            {step === 4 && formData.applicantType === 'Company' && (
              <div className="form-step">
                <h3>Company Details</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Company Name *</label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      className={errors.companyName ? 'error' : ''}
                    />
                    {errors.companyName && <span className="error-text">{errors.companyName}</span>}
                  </div>
                  <div className="form-group">
                    <label>Registration Number *</label>
                    <input
                      type="text"
                      name="companyRegNo"
                      value={formData.companyRegNo}
                      onChange={handleInputChange}
                      className={errors.companyRegNo ? 'error' : ''}
                    />
                    {errors.companyRegNo && <span className="error-text">{errors.companyRegNo}</span>}
                  </div>
                  <div className="form-group">
                    <label>GST Number (Optional)</label>
                    <input
                      type="text"
                      name="gstNo"
                      value={formData.gstNo}
                      onChange={handleInputChange}
                      style={{ textTransform: 'uppercase' }}
                    />
                  </div>
                  <div className="form-group">
                    <label>Year of Establishment</label>
                    <input
                      type="text"
                      name="yearEstablished"
                      value={formData.yearEstablished}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            )}

            {step === (formData.applicantType === 'Company' ? 5 : 4) && (
              <div className="form-step">
                <h3>Document Upload</h3>
                <p className="step-description">Please upload the required documents (PDF, JPG, or PNG, max 5MB each)</p>
                <div className="document-uploads">
                  {tender.requiredDocuments.map((docName, index) => (
                    <div key={index} className="document-upload-item">
                      <label className="block text-sm font-medium text-foreground mb-2">{docName} *</label>
                      <div className="file-input-wrapper relative">
                        <input
                          type="file"
                          id={`file-input-${index}`}
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleDocumentChange(docName, e.target.files[0])}
                          className="file-input absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div
                          className="file-input-display"
                          onClick={(e) => {
                            e.stopPropagation();
                            document.getElementById(`file-input-${index}`)?.click();
                          }}
                        >
                          {documents[docName] ? (
                            <span className="file-name flex items-center justify-center gap-2 text-green-600 font-medium">
                              <Check className="h-4 w-4" />
                              {documents[docName].name}
                            </span>
                          ) : (
                            <span className="file-placeholder flex items-center justify-center gap-2 text-muted-foreground">
                              <Upload className="h-4 w-4" />
                              Choose File
                            </span>
                          )}
                        </div>
                      </div>
                      {errors[`doc_${docName}`] && (
                        <span className="error-text">{errors[`doc_${docName}`]}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === (formData.applicantType === 'Company' ? 6 : 5) && (
              <div className="form-step">
                <h3>Declaration</h3>
                <div className="declarations">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={declarations.detailsTrue}
                      onChange={(e) => setDeclarations(prev => ({ ...prev, detailsTrue: e.target.checked }))}
                    />
                    <span>I declare that all details provided are true and correct *</span>
                  </label>
                  {errors.detailsTrue && <span className="error-text">{errors.detailsTrue}</span>}
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={declarations.termsAccepted}
                      onChange={(e) => setDeclarations(prev => ({ ...prev, termsAccepted: e.target.checked }))}
                    />
                    <span>I agree to the terms and conditions *</span>
                  </label>
                  {errors.termsAccepted && <span className="error-text">{errors.termsAccepted}</span>}
                </div>
              </div>
            )}

            {step === 7 && (
              <div className="success-step text-center py-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Application Submitted Successfully!</h3>
                <p className="text-muted-foreground mb-6">Your application has been submitted. Please note your Application ID for future reference.</p>
                <div className="bg-muted p-6 rounded-lg mb-6">
                  <div className="text-sm text-muted-foreground mb-2">Application ID</div>
                  <div className="text-2xl font-bold text-primary font-mono">{applicationId}</div>
                </div>
                <Button onClick={onClose} size="lg" className="w-full">
                  Close
                </Button>
              </div>
            )}
          </CardContent>

          {step < 7 && (
            <div className="flex items-center justify-between gap-3 p-6 border-t bg-muted/30" onClick={(e) => e.stopPropagation()}>
              {step > 1 && step !== 2.5 && (
                <Button 
                  variant="outline" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBack();
                  }} 
                  disabled={loading}
                >
                  Back
                </Button>
              )}
              {step === 1 && <div />}
              <div className="flex-1" />
              {step === 2 ? (
                <Button 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (validateStep(2)) {
                      setStep(2.5);
                    }
                  }} 
                  disabled={loading}
                  className="ml-auto"
                >
                  Next
                </Button>
              ) : step === 2.5 ? (
                <Button 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (emailVerification.verified) {
                      setStep(3);
                    } else {
                      toast.error('Please verify your email before proceeding');
                    }
                  }} 
                  disabled={loading || !emailVerification.verified}
                  className="ml-auto"
                >
                  Continue
                </Button>
              ) : step < (formData.applicantType === 'Company' ? 6 : 5) ? (
                <Button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }} 
                  disabled={loading} 
                  className="ml-auto"
                >
                  Next
                </Button>
              ) : (
                <Button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSubmit();
                  }} 
                  disabled={loading} 
                  className="ml-auto"
                >
                  {loading ? 'Submitting...' : 'Submit Application'}
                </Button>
              )}
            </div>
          )}
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ApplicationModal
