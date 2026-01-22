import React, { useState } from 'react';
import './VolunteerForm.css';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';
import api from '../utils/api';

const VolunteerForm = () => {
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: '',
    age: '',
    gender: '',
    contactNumber: '',
    email: '',
    address: '',
    
    // ID Verification
    idProof: null,
    
    // Volunteering Preferences
    district: '',
    areasOfInterest: [],
    skills: [],
    previousExperience: '',
    
    // Motivation
    motivation: '',
    goals: '',
    
    // Emergency Contact
    emergencyName: '',
    emergencyRelationship: '',
    emergencyContact: ''
  });

  const maharashtraDistricts = [
    'Ahmednagar', 'Akola', 'Amravati', 'Aurangabad', 'Beed', 'Bhandara', 
    'Buldhana', 'Chandrapur', 'Dhule', 'Gadchiroli', 'Gondia', 'Hingoli', 
    'Jalgaon', 'Jalna', 'Kolhapur', 'Latur', 'Mumbai City', 'Mumbai Suburban', 
    'Nagpur', 'Nanded', 'Nandurbar', 'Nashik', 'Osmanabad', 'Palghar', 'Parbhani', 
    'Pune', 'Raigad', 'Ratnagiri', 'Sangli', 'Satara', 'Sindhudurg', 'Solapur', 
    'Thane', 'Wardha', 'Washim', 'Yavatmal','Other'
  ];
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('File details:', {
        type: file.type,
        size: file.size,
        name: file.name
      });
      
      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type.toLowerCase())) {
        setErrors(prev => ({
          ...prev,
          idProof: 'Please upload a valid JPEG, JPG or PNG image'
        }));
        return;
      }
      
      // Create a new File object with explicit MIME type
      const fileWithMimeType = new File([file], file.name, {
        type: file.type,
        lastModified: file.lastModified,
      });
      
      setFormData(prev => ({
        ...prev,
        idProof: fileWithMimeType
      }));
      
      // Clear error if file is valid
      setErrors(prev => ({
        ...prev,
        idProof: null
      }));
    }
  };

  const handleMultiSelect = (e) => {
    const { name, options } = e.target;
    const values = Array.from(options)
      .filter(option => option.selected)
      .map(option => option.value);
    
    setFormData(prev => ({
      ...prev,
      [name]: values
    }));
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    return phoneRegex.test(phone);
  };

  const validateStep = (step) => {
    const newErrors = {};

    switch(step) {
      case 1:
        if (!formData.fullName) newErrors.fullName = 'Name is required';
        if (!formData.age || isNaN(formData.age) || Number(formData.age) < 18) {
          newErrors.age = 'Age must be at least 18';
        }
        if (!formData.email) {
          newErrors.email = 'Email is required';
        } else if (!validateEmail(formData.email)) {
          newErrors.email = 'Invalid email format';
        }
        if (!formData.contactNumber) {
          newErrors.contactNumber = 'Contact number is required';
        } else if (!validatePhone(formData.contactNumber)) {
          newErrors.contactNumber = 'Invalid phone number format';
        }
        if (!formData.address) newErrors.address = 'Address is required';
        break;
      case 2:
        if (!formData.idProof) newErrors.idProof = 'ID proof is required';
        break;
      case 3:
        if (!formData.district) newErrors.district = 'District is required';
        if (formData.areasOfInterest.length === 0) newErrors.areasOfInterest = 'Select at least one area';
        break;
      case 4:
        if (!formData.motivation) newErrors.motivation = 'Motivation is required';
        break;
      case 5:
        if (!formData.emergencyName) newErrors.emergencyName = 'Emergency contact name is required';
        if (!formData.emergencyContact) {
          newErrors.emergencyContact = 'Emergency contact number is required';
        } else if (!validatePhone(formData.emergencyContact)) {
          newErrors.emergencyContact = 'Invalid emergency contact number format';
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateStep(currentStep)) {
      try {
        setIsSubmitting(true);
        setSubmitStatus({ type: '', message: '' });

        const formDataToSend = new FormData();
        
        // Handle file separately
        if (formData.idProof) {
          formDataToSend.append('idProof', formData.idProof);
          console.log('Uploading file:', formData.idProof.type); // Debug log
        }

        // Append other form fields
        Object.entries(formData).forEach(([key, value]) => {
          if (key !== 'idProof') { // Skip idProof as it's handled above
            if (Array.isArray(value)) {
              formDataToSend.append(key, JSON.stringify(value));
            } else if (value !== null) {
              formDataToSend.append(key, value);
            }
          }
        });

        const response = await api.post( '/volunteers', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        setSubmitStatus({
          type: 'success',
          message: 'Registration submitted successfully! We will contact you soon.'
        });

        // Reset form
        setFormData({
          fullName: '',
          age: '',
          gender: '',
          contactNumber: '',
          email: '',
          address: '',
          idProof: null,
          district: '',
          areasOfInterest: [],
          skills: [],
          previousExperience: '',
          motivation: '',
          goals: '',
          emergencyName: '',
          emergencyRelationship: '',
          emergencyContact: ''
        });
        setCurrentStep(1);

      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Something went wrong. Please try again.';
        setSubmitStatus({
          type: 'error',
          message: errorMessage
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background py-16 md:py-24 px-6">
      <div className="max-w-[1280px] mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Volunteer Registration Form</h2>
          <p className="text-muted-foreground">Join us in making a difference</p>
        </div>
        
        {submitStatus.message && (
          <div className={`mb-6 p-4 rounded-lg text-center font-medium ${
            submitStatus.type === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {submitStatus.message}
          </div>
        )}

        <div className="step-indicator mb-8">
          {["Personal Info", "ID Verification", "Preferences", "Motivation", "Emergency Contact"].map((label, idx) => (
            <React.Fragment key={label}>
              <div className={`step${currentStep === idx + 1 ? ' active' : ''}${currentStep > idx + 1 ? ' completed' : ''}`}>
                <div className="step-circle">
                  {currentStep > idx + 1 ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                </div>
                <div className="step-label">{label}</div>
              </div>
              {idx < 4 && <div className="step-connector" />}
            </React.Fragment>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Full Name *</label>
                <Input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                />
                {errors.fullName && <span className="text-sm text-destructive">{errors.fullName}</span>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Age *</label>
                <Input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  placeholder="Enter your age"
                />
                {errors.age && <span className="text-sm text-destructive">{errors.age}</span>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Gender</label>
                <select 
                  name="gender" 
                  value={formData.gender} 
                  onChange={handleInputChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Contact Number *</label>
                <Input
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  placeholder="Enter your contact number"
                />
                {errors.contactNumber && <span className="text-sm text-destructive">{errors.contactNumber}</span>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email Address *</label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email address"
                />
                {errors.email && <span className="text-sm text-destructive">{errors.email}</span>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Address *</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter your address"
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
                {errors.address && <span className="text-sm text-destructive">{errors.address}</span>}
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>ID Verification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Upload ID Proof *</label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
                {errors.idProof && <span className="text-sm text-destructive">{errors.idProof}</span>}
                {formData.idProof && (
                  <p className="text-sm text-muted-foreground">Selected: {formData.idProof.name}</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Volunteering Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">District *</label>
                <select 
                  name="district" 
                  value={formData.district} 
                  onChange={handleInputChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">Select District</option>
                  {maharashtraDistricts.map((district) => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
                {errors.district && <span className="text-sm text-destructive">{errors.district}</span>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Areas of Interest *</label>
                <select
                  multiple
                  name="areasOfInterest"
                  value={formData.areasOfInterest}
                  onChange={handleMultiSelect}
                  className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="community">Community Service</option>
                  <option value="education">Education</option>
                  <option value="environment">Environment</option>
                  <option value="health">Health</option>
                </select>
                <p className="text-xs text-muted-foreground">Hold Ctrl (Windows) or Cmd (Mac) to select multiple options</p>
                {errors.areasOfInterest && <span className="text-sm text-destructive">{errors.areasOfInterest}</span>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Previous Experience</label>
                <textarea
                  name="previousExperience"
                  value={formData.previousExperience}
                  onChange={handleInputChange}
                  placeholder="Describe your previous volunteering experience"
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 4 && (
          <Card>
            <CardHeader>
              <CardTitle>Motivation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Why do you want to volunteer with us? *</label>
                <textarea
                  name="motivation"
                  value={formData.motivation}
                  onChange={handleInputChange}
                  placeholder="Tell us about your motivation to volunteer"
                  className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
                {errors.motivation && <span className="text-sm text-destructive">{errors.motivation}</span>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">What do you hope to achieve?</label>
                <textarea
                  name="goals"
                  value={formData.goals}
                  onChange={handleInputChange}
                  placeholder="Share your goals and expectations"
                  className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 5 && (
          <Card>
            <CardHeader>
              <CardTitle>Emergency Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Emergency Contact Name *</label>
                <Input
                  type="text"
                  name="emergencyName"
                  value={formData.emergencyName}
                  onChange={handleInputChange}
                  placeholder="Enter emergency contact name"
                />
                {errors.emergencyName && <span className="text-sm text-destructive">{errors.emergencyName}</span>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Relationship</label>
                <Input
                  type="text"
                  name="emergencyRelationship"
                  value={formData.emergencyRelationship}
                  onChange={handleInputChange}
                  placeholder="e.g., Father, Mother, Spouse"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Emergency Contact Number *</label>
                <Input
                  type="tel"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleInputChange}
                  placeholder="Enter emergency contact number"
                />
                {errors.emergencyContact && <span className="text-sm text-destructive">{errors.emergencyContact}</span>}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-between mt-6 gap-4">
          {currentStep > 1 && (
            <Button 
              type="button" 
              onClick={handlePrevious}
              disabled={isSubmitting}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
          )}
          <div className="flex-1" />
          {currentStep < 5 ? (
            <Button 
              type="button" 
              onClick={handleNext}
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button 
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
              {!isSubmitting && <CheckCircle2 className="w-4 h-4" />}
            </Button>
          )}
        </div>
      </form>
      </div>
    </div>
  );
};

export default VolunteerForm; 