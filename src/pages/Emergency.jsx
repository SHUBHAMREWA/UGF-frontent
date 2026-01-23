import React, { useState, useEffect } from 'react';
import { FaPhone, FaMapMarkerAlt, FaClock, FaUserPlus,  FaEye, FaStar, FaShare, FaShieldAlt, FaMedal, FaUserCheck, FaCamera,  FaHeart, FaLeaf, FaPaw, FaDog, FaCat, FaDove, FaExclamationCircle, FaChevronLeft, FaChevronRight, FaCheckCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import authService from '../services/authService';
import api from '../utils/api';
import './Emergency.css';
import { Button } from '../components/ui/button';
import PageLoader from '../components/PageLoader';
import ImageLoader from '../components/ImageLoader';

const Emergency = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [error, setError] = useState('');
  const [selectedService, setSelectedService] = useState('all');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDetailsForm, setShowDetailsForm] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [detailsForm, setDetailsForm] = useState({
    name: '',
    email: '',
    contact: '',
    purpose: ''
  });
  const [registrationOtpSent, setRegistrationOtpSent] = useState(false);
  const [registrationOtp, setRegistrationOtp] = useState('');
  const [registrationEmailVerified, setRegistrationEmailVerified] = useState(false);
  const [sendingRegistrationOtp, setSendingRegistrationOtp] = useState(false);
  const [verifyingRegistrationOtp, setVerifyingRegistrationOtp] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [registrationStep, setRegistrationStep] = useState(1); // 1: Service Selection, 2: Form Details
  const [selectedServicesForRegistration, setSelectedServicesForRegistration] = useState([]);
  
  // For enquiry form
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [filters, setFilters] = useState({
    district: '',
    taluka: '',
    pincode: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobileNumber: '',
    services: [],
    location: '',
    availability: '24x7',
    district: '',
    taluka: '',
    pincode: '',
    work: '',
    secondaryMobileNumber: '',
    passportPhoto: null,
    idCard: null,
    educationalCertificate: null,
    experienceDocument: null,
    otherDocuments: null,
    isGovernmentEmployee: false,
    experience: '',
    specializations: []
  });


  // Maharashtra Districts and Talukas Data
  const maharashtraData = {
    "Ahmednagar": ["Akole", "Jamkhed", "Karjat", "Kopargaon", "Nagar", "Nevasa", "Parner", "Pathardi", "Rahata", "Rahuri", "Sangamner", "Shevgaon", "Shrigonda", "Shrirampur"],
    "Akola": ["Akola", "Balapur", "Barshitakli", "Murtizapur", "Patur", "Telhara"],
    "Amravati": ["Amravati", "Anjangaon Surji", "Achalpur", "Chandur Bazar", "Chandur Railway", "Daryapur", "Dhamangaon Railway", "Morshi", "Nandgaon Khandeshwar", "Teosa", "Warud"],
    "Aurangabad": ["Aurangabad", "Vaijapur", "Gangapur", "Kannad", "Khuldabad", "Paithan", "Phulambri", "Sillod", "Soegaon"],
    "Beed": ["Ambejogai", "Ashti", "Beed", "Dharur", "Georai", "Kaij", "Majalgaon", "Parli", "Patoda", "Shirur (Kasar)", "Wadwani"],
    "Bhandara": ["Bhandara", "Lakhandur", "Mohadi", "Pauni", "Sakoli", "Tumsar"],
    "Buldhana": ["Buldhana", "Chikhli", "Deulgaon Raja", "Jalgaon Jamod", "Khamgaon", "Lonar", "Malkapur", "Mehkar", "Motala", "Nandura", "Sangrampur", "Shegaon"],
    "Chandrapur": ["Ballarpur", "Bhadravati", "Brahmapuri", "Chandrapur", "Chimur", "Gondpipri", "Jiwati", "Korpana", "Mul", "Nagbhid", "Pombhurna", "Rajura", "Saoli", "Sindewahi", "Warora"],
    "Dhule": ["Dhule", "Sakri", "Shirpur", "Shindkheda"],
    "Gadchiroli": ["Aheri", "Armori", "Bhamragad", "Chamorshi", "Dhanora", "Etapalli", "Gadchiroli", "Kurkheda", "Mulchera", "Sironcha"],
    "Gondia": ["Amgaon", "Arjuni Morgaon", "Deori", "Gondia", "Goregaon", "Sadak Arjuni", "Salekasa", "Tirora"],
    "Hingoli": ["Aundha Nagnath", "Basmath", "Hingoli", "Kalamnuri", "Sengaon"],
    "Jalgaon": ["Amalner", "Bhadgaon", "Bhusawal", "Bodwad", "Chalisgaon", "Chopda", "Dharangaon", "Erandol", "Jalgaon", "Jamner", "Muktainagar", "Pachora", "Parola", "Raver", "Yawal"],
    "Jalna": ["Ambad", "Badnapur", "Bhokardan", "Ghansawangi", "Jafrabad", "Jalna", "Mantha", "Partur"],
    "Kolhapur": ["Ajara", "Bhudargad", "Chandgad", "Gadhinglaj", "Hatkanangale", "Kagal", "Karvir", "Panhala", "Radhanagari", "Shahuwadi", "Shirol"],
    "Latur": ["Ahmadpur", "Ausa", "Chakur", "Deoni", "Jalkot", "Latur", "Nilanga", "Renapur", "Shirur Anantpal", "Udgir"],
    "Mumbai City": ["Mumbai City"],
    "Mumbai Suburban": ["Kurla", "Andheri", "Borivali"],
    "Nagpur": ["Hingna", "Kamptee", "Katol", "Nagpur (Rural)", "Nagpur (Urban)", "Narkhed", "Parseoni", "Ramtek", "Saoner", "Umred"],
    "Nanded": ["Ardhapur", "Bhokar", "Biloli", "Deglur", "Dharmabad", "Hadgaon", "Himayatnagar", "Kandhar", "Kinwat", "Loha", "Mahur", "Mudkhed", "Mukhed", "Naigaon", "Nanded"],
    "Nandurbar": ["Akkalkuwa", "Akrani", "Nandurbar", "Navapur", "Shahada", "Taloda"],
    "Nashik": ["Baglan", "Chandwad", "Deola", "Dindori", "Igatpuri", "Malegaon", "Nandgaon", "Nashik", "Niphad", "Peint", "Sinnar", "Trimbak", "Yeola"],
    "Osmanabad": ["Bhoom", "Kalamb", "Lohara", "Omerga", "Osmanabad", "Paranda", "Tuljapur", "Washi"],
    "Palghar": ["Dahanu", "Jawhar", "Mokhada", "Palghar", "Talasari", "Vasai", "Vikramgad", "Wada"],
    "Parbhani": ["Gangakhed", "Jintur", "Manwath", "Palam", "Parbhani", "Pathri", "Purna", "Sailu", "Sonpeth"],
    "Pune": ["Ambegaon", "Baramati", "Bhor", "Daund", "Haveli", "Indapur", "Junnar", "Khed", "Mawal", "Mulshi", "Pune City", "Purandar", "Shirur", "Velhe"],
    "Raigad": ["Alibag", "Karjat", "Khalapur", "Mahad", "Mangaon", "Mhasala", "Murud", "Panvel", "Pen", "Poladpur", "Roha", "Shrivardhan", "Sudhagad", "Tala", "Uran"],
    "Ratnagiri": ["Chiplun", "Dapoli", "Guhagar", "Khed", "Lanja", "Mandangad", "Ratnagiri", "Rajapur", "Sangameshwar"],
    "Sangli": ["Atpadi", "Jat", "Kadegaon", "Kavathe Mahankal", "Khanapur", "Miraj", "Palus", "Shirala", "Tasgaon", "Walwa"],
    "Satara": ["Jaoli", "Karad", "Khatav", "Koregaon", "Mahabaleshwar", "Man", "Patan", "Phaltan", "Satara", "Wai"],
    "Sindhudurg": ["Devgad", "Dodamarg", "Kankavli", "Kudal", "Malvan", "Sawantwadi", "Vaibhavwadi", "Vengurla"],
    "Solapur": ["Akkalkot", "Barshi", "Karmala", "Madha", "Malshiras", "Mangalwedha", "Mohol", "Pandharpur", "Sangole", "Solapur North", "Solapur South"],
    "Thane": ["Ambernath", "Bhiwandi", "Kalyan", "Murbad", "Shahapur", "Thane", "Ulhasnagar"],
    "Wardha": ["Arvi", "Ashti", "Deoli", "Hinganghat", "Karanja", "Samudrapur", "Seloo", "Wardha"],
    "Washim": ["Karanja", "Mangrulpir", "Malegaon", "Manora", "Risod", "Washim"],
    "Yavatmal": ["Arni", "Babhulgaon", "Darwha", "Digras", "Ghatanji", "Kalamb", "Kelapur", "Mahagaon", "Maregaon", "Ner", "Pandharkawda", "Pusad", "Ralegaon", "Umarkhed", "Wani", "Yavatmal"]
  };

  const [availableServices, setAvailableServices] = useState([]);
  const [selectedServicesDetails, setSelectedServicesDetails] = useState([]);
  const [loadingServiceDetails, setLoadingServiceDetails] = useState(false);

  const availabilityOptions = [
    { key: '24x7', label: '24x7 Available' },
    { key: 'day_time', label: 'Day Time Only' },
    { key: 'night_time', label: 'Night Time Only' },
    { key: 'weekends', label: 'Weekends Only' },
    { key: 'on_call', label: 'On Call Basis' }
  ];

  const navigate = useNavigate();

  useEffect(() => {
    fetchServices();
    fetchContacts();
    // Restore form data from localStorage if returning from Terms page
    const savedFormData = localStorage.getItem('erf_registration_form');
    if (savedFormData) {
      try {
        const parsed = JSON.parse(savedFormData);
        setFormData(prev => ({ ...prev, ...parsed }));
        // Check if we're returning from Terms page
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('fromTerms') === 'true') {
          setShowRegistrationForm(true);
          urlParams.delete('fromTerms');
          window.history.replaceState({}, '', window.location.pathname);
        }
      } catch (e) {
        console.error('Error restoring form data:', e);
      }
    }
  }, []);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    if (showRegistrationForm && Object.keys(formData).length > 0) {
      const dataToSave = {
        name: formData.name,
        email: formData.email,
        mobileNumber: formData.mobileNumber,
        services: formData.services,
        location: formData.location,
        availability: formData.availability,
        district: formData.district,
        taluka: formData.taluka,
        pincode: formData.pincode,
        work: formData.work,
        secondaryMobileNumber: formData.secondaryMobileNumber,
        experience: formData.experience,
        isGovernmentEmployee: formData.isGovernmentEmployee,
        specializations: formData.specializations
      };
      localStorage.setItem('erf_registration_form', JSON.stringify(dataToSave));
    }
  }, [formData, showRegistrationForm]);

  const fetchServices = async () => {
    try {
      const response = await api.get('/services/public');
      if (response.data.success) {
        setAvailableServices(response.data.services);
      }
    } catch (error) {
      console.error('Failed to fetch services:', error);
      // Fallback to empty array if API fails
      setAvailableServices([]);
    }
  };

  // Fetch full service details when services are selected
  const fetchSelectedServicesDetails = async (serviceKeys) => {
    try {
      setLoadingServiceDetails(true);
      setError('');
      const response = await api.get('/services/admin');
      if (response.data.success) {
        const details = response.data.services.filter(s => serviceKeys.includes(s.key));
        setSelectedServicesDetails(details);
        console.log('Fetched service details with form configuration:', details);
      }
    } catch (error) {
      console.error('Failed to fetch service details:', error);
      setSelectedServicesDetails([]);
      setError('Failed to load service configurations. Please try again.');
    } finally {
      setLoadingServiceDetails(false);
    }
  };

  const fetchContacts = async () => {
    try {
      const response = await api.get('/emergency-contacts/public');
      if (response.data.success) {
        setContacts(response.data.contacts);
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

 

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleDistrictChange = (e) => {
    const { value } = e.target;
    setFilters(prev => ({
      ...prev,
      district: value,
      taluka: '' // Reset taluka when district changes
    }));
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleFormDistrictChange = (e) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      district: value,
      taluka: '' // Reset taluka when district changes
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check email verification
    if (!registrationEmailVerified) {
      setError('Please verify your email address before submitting');
      return;
    }

    // Check terms acceptance
    if (!acceptedTerms) {
      setError('You must accept the Terms & Conditions to register');
      return;
    }

    setIsSubmitting(true);
    setError('');
    
    try {
      const formDataToSend = new FormData();
      
        // Add all form fields to FormData
        Object.keys(formData).forEach(key => {
          if (['passportPhoto', 'idCard', 'educationalCertificate', 'experienceDocument'].includes(key)) {
            if (formData[key]) {
              formDataToSend.append(key, formData[key]);
            }
          } else if (key === 'otherDocuments') {
            if (formData[key] && Array.isArray(formData[key])) {
              formData[key].forEach((file, index) => {
                formDataToSend.append(`otherDocuments`, file);
              });
            }
          } else if (key.startsWith('serviceDoc_')) {
            // Service-specific documents
            if (formData[key]) {
              formDataToSend.append(key, formData[key]);
            }
          } else if (key.startsWith('serviceField_')) {
            // Service-specific fields
            formDataToSend.append(key, formData[key]);
          } else if (key === 'services' || key === 'specializations') {
            formDataToSend.append(key, JSON.stringify(formData[key]));
          } else {
            formDataToSend.append(key, formData[key]);
          }
        });

      const response = await api.post('/emergency-contacts/register', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.data.success) {
        setRegistrationSuccess(true);
        setFormData({
          name: '',
          email: '',
          mobileNumber: '',
          services: [],
          location: '',
          availability: '24x7',
          district: '',
          taluka: '',
          pincode: '',
          work: '',
          secondaryMobileNumber: '',
          passportPhoto: null,
          idCard: null,
          educationalCertificate: null,
          experienceDocument: null,
          otherDocuments: null,
          isGovernmentEmployee: false,
          experience: '',
          specializations: []
        });
        setRegistrationEmailVerified(false);
        setRegistrationOtpSent(false);
        setRegistrationOtp('');
        setAcceptedTerms(false);
        setShowRegistrationForm(false);
        // Clear saved form data
        localStorage.removeItem('erf_registration_form');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShowDetails = (contact) => {
    setSelectedContact(contact);
    setShowDetailsForm(true);
    // Reset form state
    setDetailsForm({ name: '', email: '', contact: '', purpose: '' });
    setOtpSent(false);
    setOtp('');
    setEmailVerified(false);
  };

  const handleSendOTP = async () => {
    if (!detailsForm.email) {
      setError('Please enter your email address first');
      return;
    }

    try {
      setSendingOtp(true);
      setError('');
      // Send OTP with email only (mobileNumber can be empty for enquiry forms)
      await authService.sendOTP({ email: detailsForm.email, mobileNumber: '' });
      setOtpSent(true);
      alert('OTP sent to your email. Please check your inbox.');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp) {
      setError('Please enter the OTP');
      return;
    }

    try {
      setVerifyingOtp(true);
      setError('');
      // Verify OTP using the auth service
      const response = await authService.verifyOTP({ 
        email: detailsForm.email, 
        otp: otp 
      });
      
      if (response && response.success !== false) {
        setEmailVerified(true);
        alert('Email verified successfully!');
      } else {
        setError('Invalid or expired OTP. Please try again.');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to verify OTP. Please try again.');
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleSendRegistrationOTP = async () => {
    if (!formData.email) {
      setError('Please enter your email address first');
      return;
    }

    try {
      setSendingRegistrationOtp(true);
      setError('');
      await authService.sendOTP({ email: formData.email, mobileNumber: '' });
      setRegistrationOtpSent(true);
      alert('OTP sent to your email. Please check your inbox.');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setSendingRegistrationOtp(false);
    }
  };

  const handleVerifyRegistrationOTP = async () => {
    if (!registrationOtp) {
      setError('Please enter the OTP');
      return;
    }

    try {
      setVerifyingRegistrationOtp(true);
      setError('');
      const response = await authService.verifyOTP({ 
        email: formData.email, 
        otp: registrationOtp
      });
      
      if (response && response.success !== false) {
        setRegistrationEmailVerified(true);
        alert('Email verified successfully!');
      } else {
        setError('Invalid or expired OTP. Please try again.');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to verify OTP. Please try again.');
    } finally {
      setVerifyingRegistrationOtp(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setError('');
      const response = await authService.googleLogin(credentialResponse.credential);
      
      if (response && response.token) {
        // Use user data from Google login response directly
        const user = response.user || response;
        
        // Auto-fill form with Google account details
        setDetailsForm(prev => ({
          ...prev,
          name: user.name || '',
          email: user.email || '',
          contact: user.mobileNumber || ''
        }));
        
        // Mark email as verified (Google emails are verified)
        setEmailVerified(true);
        setOtpSent(false);
        setOtp('');
      } else {
        setError('Failed to get user data from Google login');
      }
    } catch (err) {
      console.error('Google login error:', err);
      setError(err.response?.data?.message || 'Google login failed. Please try again.');
    }
  };

  const handleGoogleError = () => {
    setError('Google login failed. Please try again.');
  };

  const handleDetailsSubmit = async (e) => {
    e.preventDefault();
    
    // Ensure email is verified before submitting
    if (!emailVerified) {
      setError('Please verify your email address before submitting');
      return;
    }

    try {
      // Submit enquiry to database
      const enquiryData = {
        enquirerName: detailsForm.name,
        enquirerEmail: detailsForm.email,
        enquirerContact: detailsForm.contact,
        enquirerPurpose: detailsForm.purpose,
        aryaMitraId: selectedContact._id
      };

      const response = await api.post('/arya-mitra-enquiries/submit', enquiryData);
      
      if (response.data.success) {
        // Update the contacts array to show full details for this contact
        setContacts(prevContacts => 
          prevContacts.map(contact => 
            contact._id === selectedContact._id 
              ? { ...contact, showFullDetails: true }
              : contact
          )
        );
        
        // Close the form modal
        setShowDetailsForm(false);
        setSelectedContact(null);
        setDetailsForm({ name: '', email: '', contact: '', purpose: '' });
        setOtpSent(false);
        setOtp('');
        setEmailVerified(false);
        
        // Show success message
        alert('Enquiry submitted successfully! You can now view the full contact details.');
      }
    } catch (error) {
      console.error('Error submitting enquiry:', error);
      setError(error.response?.data?.message || 'Failed to submit enquiry. Please try again.');
    }
  };

  const handleShare = async (contact) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Wildlife Animal Emergency Response Force (WAERF) - ${contact.name}`,
          text: `Contact ${contact.name} for emergency services in ${contact.location}`,
          url: window.location.href
        });
      } else {
        // Fallback to copying to clipboard
        const text = `Wildlife Animal Emergency Response Force (WAERF): ${contact.name}\nLocation: ${contact.location}\nServices: ${contact.services.join(', ')}`;
        await navigator.clipboard.writeText(text);
        alert('Contact information copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleRating = async (contact, rating) => {
    try {
      await api.post(`/emergency-contacts/${contact._id}/rate`, { rating });
      // Refresh contacts to get updated ratings
      fetchContacts();
    } catch (error) {
      console.error('Error rating contact:', error);
    }
  };

  const getBadgeIcon = (badge) => {
    switch (badge) {
      case 'government_verified':
        return <FaShieldAlt className="badge-icon government" title="Government Verified" />;
      case 'government':
        return <FaShieldAlt className="badge-icon government" title="Government" />;
      case 'ugf_verified':
        return <FaMedal className="badge-icon verified" title="UGF Verified" />;
      case 'sn_arya_mitra':
        return <FaMedal className="badge-icon verified" title="WAERF Verified" />;
      default:
        return <FaUserCheck className="badge-icon unverified" title="Unverified" />;
    }
  };

  const getBadgeLabel = (badge) => {
    switch (badge) {
      case 'government_verified':
        return 'Government Verified';
      case 'government':
        return 'Government';
      case 'ugf_verified':
        return 'UGF Verified';
      case 'sn_arya_mitra':
        return 'WAERF';
      default:
        return 'Unverified';
    }
  };

  const filteredContacts = contacts.filter(contact => {
    // Filter by service
    if (selectedService !== 'all' && !contact.services.includes(selectedService)) {
      return false;
    }
    
    // Filter by district
    if (filters.district && contact.district !== filters.district) {
      return false;
    }
    
    // Filter by taluka
    if (filters.taluka && contact.taluka !== filters.taluka) {
      return false;
    }
    
    // Filter by pincode
    if (filters.pincode && contact.pincode !== filters.pincode) {
      return false;
    }
    
    return true;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedContacts = filteredContacts.slice(startIndex, endIndex);

  // Reset to page 1 when service filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedService]);

  // Get animal icon based on service
  const getAnimalIcon = (service) => {
    if (service.includes('snake')) return <FaExclamationCircle className="animal-icon" style={{ transform: 'rotate(45deg)' }} />;
    if (service.includes('dog') || service.includes('animal')) return <FaDog className="animal-icon" />;
    if (service.includes('cat')) return <FaCat className="animal-icon" />;
    if (service.includes('bird') || service.includes('wildlife')) return <FaDove className="animal-icon" />;
    return <FaPaw className="animal-icon" />;
  };

  // Get availability status color
  const getAvailabilityStatus = (availability) => {
    if (availability === '24x7' || availability === 'day_time') return 'available'; // Green
    if (availability === 'night_time' || availability === 'on_call') return 'busy'; // Orange
    return 'offline'; // Grey
  };

  if (loading) {
    return <PageLoader subtitle="Loading ERF Volunteers..." />;
  }

  return (
    <div className="emergency-container forest-theme" style={{ background: 'linear-gradient(180deg, #FFF6E1 0%, #F4CF85 30%, #A7DCC2 60%, #2F5035 100%)' }}>
      {/* Forest Background Elements */}
      <div className="forest-background">
        {/* Tall Forest Silhouettes */}
        <div className="forest-silhouettes">
          <svg className="forest-svg" viewBox="0 0 1200 400" preserveAspectRatio="none">
            <path d="M0,400 L50,300 L100,350 L150,250 L200,320 L250,200 L300,280 L350,180 L400,260 L450,150 L500,240 L550,130 L600,220 L650,110 L700,200 L750,90 L800,180 L850,70 L900,160 L950,50 L1000,140 L1050,30 L1100,120 L1150,20 L1200,100 L1200,400 Z" fill="#2F5035" opacity="0.06" />
            <path d="M0,400 L100,320 L200,340 L300,280 L400,300 L500,250 L600,270 L700,220 L800,240 L900,190 L1000,210 L1100,160 L1200,180 L1200,400 Z" fill="#2F5035" opacity="0.05" />
          </svg>
        </div>

        {/* Animal Silhouettes */}
        <div className="animal-silhouettes">
          <motion.div 
            className="animal-silhouette deer"
            animate={{ y: [0, -10, 0], opacity: [0.02, 0.04, 0.02] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="animal-silhouette bird"
            animate={{ x: [0, 20, 0], y: [0, -15, 0], opacity: [0.02, 0.03, 0.02] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="animal-silhouette snake"
            animate={{ x: [0, 15, 0], opacity: [0.02, 0.03, 0.02] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* Large Animal Silhouettes in Background */}
        <motion.div
          className="large-animal-silhouette deer-large"
          animate={{
            y: [0, -20, 0],
            opacity: [0.08, 0.12, 0.08],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="large-animal-silhouette dog-large"
          animate={{
            x: [0, 15, 0],
            opacity: [0.08, 0.12, 0.08],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
        <motion.div
          className="large-animal-silhouette bird-large"
          animate={{
            x: [0, 25, 0],
            y: [0, -30, 0],
            opacity: [0.08, 0.12, 0.08],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4,
          }}
        />
        <motion.div
          className="large-animal-silhouette cat-large"
          animate={{
            x: [0, -20, 0],
            opacity: [0.08, 0.12, 0.08],
          }}
          transition={{
            duration: 11,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
        <motion.div
          className="large-animal-silhouette snake-large"
          animate={{
            x: [0, 20, 0],
            opacity: [0.08, 0.12, 0.08],
          }}
          transition={{
            duration: 13,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3,
          }}
        />

        {/* Soft Golden Dust (Firefly-like) */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={`firefly-${i}`}
            className="firefly-particle"
            style={{
              left: `${10 + i * 6}%`,
              top: `${15 + (i % 3) * 30}%`,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [0.8, 1.5, 0.8],
              y: [0, -30, 0],
            }}
            transition={{
              duration: 3 + i * 0.3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.2,
            }}
          />
        ))}
      </div>

      {/* Header Section */}
      <div className="emergency-header forest-header">
        <div className="header-content-wrapper">
          <div className="emergency-hero">
            {/* Sunrays from Top Center */}
            <div className="sunrays-container">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={`ray-${i}`}
                  className="sunray"
                  style={{
                    transform: `rotate(${i * 30}deg)`,
                    transformOrigin: 'center top',
                  }}
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.1,
                  }}
                />
              ))}
            </div>

            {/* Soft Golden Ambient Glow */}
            <motion.div
              className="ambient-glow"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.4, 0.6, 0.4],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Paw Print Pattern (Very Faint) */}
            <div className="paw-print-pattern">
              {[...Array(8)].map((_, i) => (
                <div
                  key={`paw-${i}`}
                  className="paw-print"
                  style={{
                    left: `${10 + i * 12}%`,
                    top: `${20 + (i % 2) * 40}%`,
                    opacity: 0.03,
                  }}
                >
                  <FaPaw style={{ fontSize: '24px', color: '#2F5035' }} />
                </div>
              ))}
            </div>

            {/* Rescuer Illustration on Right */}
            <div className="rescuer-illustration">
              <motion.div
                className="illustration-container"
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <div className="rescuer-icon">
                  <FaHeart className="main-icon" />
                  <FaPaw className="paw-icon" />
                </div>
              </motion.div>
            </div>

            <h1 className="forest-title">
              <FaPaw className="title-icon" />
              Emergency Response Force (ERF)
            </h1>
            <p className="forest-tagline">
              "In the heart of the forest, every life matters. We stand as guardians, ready to answer the call of those who cannot speak."
            </p>
            <p className="forest-subtitle">Connect with verified animal rescuers and compassionate volunteers dedicated to saving lives.</p>
          </div>
          
          <div className="emergency-actions">
            <motion.button 
              className="register-btn forest-btn"
              onClick={() => setShowRegistrationForm(true)}
              whileHover={{ scale: 1.05, boxShadow: '0 8px 24px rgba(27, 94, 32, 0.4)' }}
              whileTap={{ scale: 0.95 }}
            >
              <FaUserPlus /> Register as Emergency Response Force
            </motion.button>
          </div>
        </div>
      </div>

      {registrationSuccess && (
        <div className="success-message">
          <h3>Registration Submitted Successfully!</h3>
          <p>Thank you for registering as an Emergency Response Force (ERF) volunteer. You are now automatically logged in. We will review your application and notify you via email.</p>
          <button onClick={() => setRegistrationSuccess(false)}>Close</button>
        </div>
      )}

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => setError('')}>Close</button>
        </div>
      )}

      <div className="emergency-content">
        <motion.div 
          className="filter-section forest-filter"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Leaf Particle Animation on Hover */}
          <div className="filter-leaf-particles">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={`filter-leaf-${i}`}
                className="filter-leaf"
                style={{
                  left: `${15 + i * 15}%`,
                  top: `${20 + (i % 2) * 60}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  rotate: [0, 15, -15, 0],
                  opacity: [0, 0.4, 0],
                }}
                transition={{
                  duration: 8 + i,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.8,
                }}
              >
                <FaLeaf style={{ fontSize: '10px', color: '#4CAF50' }} />
              </motion.div>
            ))}
          </div>

          <div className="filter-group">
            <label>
              <FaLeaf className="filter-icon" /> Service:
            </label>
            <select 
              value={selectedService} 
              onChange={(e) => {
                setSelectedService(e.target.value);
                setCurrentPage(1);
              }}
              className="forest-select"
            >
              <option value="all">All Services</option>
              {availableServices.map(service => (
                <option key={service.key} value={service.key}>
                  {service.label}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>
              <FaLeaf className="filter-icon" /> District:
            </label>
            <select 
              name="district"
              value={filters.district} 
              onChange={handleDistrictChange}
              className="forest-select"
            >
              <option value="">All Districts</option>
              {Object.keys(maharashtraData).map(district => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>
              <FaLeaf className="filter-icon" /> Taluka:
            </label>
            <select 
              name="taluka"
              value={filters.taluka} 
              onChange={handleFilterChange}
              className="forest-select"
            >
              <option value="">All Talukas</option>
              {filters.district && maharashtraData[filters.district] ? (
                maharashtraData[filters.district].map(taluka => (
                  <option key={taluka} value={taluka}>
                    {taluka}
                  </option>
                ))
              ) : (
                <option value="">Select a district first</option>
              )}
            </select>
          </div>

          <div className="filter-group">
            <label>
              <FaLeaf className="filter-icon" /> Pincode:
            </label>
            <input
              type="text"
              name="pincode"
              value={filters.pincode}
              onChange={handleFilterChange}
              placeholder="Enter pincode"
              maxLength="6"
              className="forest-input"
            />
          </div>
        </motion.div>

        <div className="contacts-grid forest-grid">
          {paginatedContacts.length > 0 ? (
            paginatedContacts.map((contact, index) => {
              const availabilityStatus = getAvailabilityStatus(contact.availability);
              return (
                <motion.div
                  key={index}
                  className="contact-card forest-card"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ 
                    y: -8,
                    boxShadow: '0 12px 32px rgba(244, 207, 133, 0.3)',
                  }}
                >
                  {/* Leaf Corners */}
                  <div className="leaf-corner top-left">
                    <FaLeaf style={{ fontSize: '16px', color: '#4CAF50', opacity: 0.3 }} />
                  </div>
                  <div className="leaf-corner top-right">
                    <FaLeaf style={{ fontSize: '16px', color: '#4CAF50', opacity: 0.3 }} />
                  </div>
                  <div className="leaf-corner bottom-left">
                    <FaLeaf style={{ fontSize: '16px', color: '#4CAF50', opacity: 0.3 }} />
                  </div>
                  <div className="leaf-corner bottom-right">
                    <FaLeaf style={{ fontSize: '16px', color: '#4CAF50', opacity: 0.3 }} />
                  </div>

                  {/* Drifting Leaves on Card */}
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={`card-leaf-${i}`}
                      className="card-drifting-leaf"
                      style={{
                        left: `${20 + i * 30}%`,
                        top: `${10 + i * 40}%`,
                      }}
                      animate={{
                        y: [0, -30, 0],
                        x: [0, i % 2 === 0 ? 15 : -15, 0],
                        rotate: [0, 180, 0],
                        opacity: [0, 0.2, 0],
                      }}
                      transition={{
                        duration: 10 + i * 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 1.5,
                      }}
                    >
                      <FaLeaf style={{ fontSize: '8px', color: '#4CAF50' }} />
                    </motion.div>
                  ))}

                  {/* Soft Sunlight Glow on Hover */}
                  <motion.div
                    className="card-sunlight-glow"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />

                  <div className="contact-header">
                    <div className="contact-photo-wrapper">
                      <div className={`contact-photo-ring ${availabilityStatus}`}>
                        <motion.div
                          className="ring-pulse"
                          animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.6, 0.3, 0.6],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        />
                        <div className="contact-photo">
                          {contact.passportPhoto ? (
                            <img src={contact.passportPhoto} alt={contact.name} />
                          ) : (
                            <div className="photo-placeholder">
                              <FaCamera />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="contact-info-main">
                      <h3 className="forest-name">
                        <FaPaw className="name-paw-icon" />
                        {contact.name}
                      </h3>
                      {contact.aryaMitraId && (
                        <div className="arya-mitra-id">
                          <span className="id-label">ID:</span>
                          <span className="id-value">{contact.aryaMitraId}</span>
                        </div>
                      )}
                      <div className="badge-section">
                        {getBadgeIcon(contact.badge)}
                        <span className="badge-label">{getBadgeLabel(contact.badge)}</span>
                      </div>
                      <div className="rescue-count">
                        <FaHeart className="rescue-icon" />
                        <span>{contact.rescueCount || 0} Rescues</span>
                      </div>
                      <div className="rating-section">
                        <div className="stars">
                          {[1, 2, 3, 4, 5].map(star => (
                            <FaStar
                              key={star}
                              className={`star ${star <= (contact.rating || 0) ? 'filled' : ''}`}
                              onClick={() => handleRating(contact, star)}
                            />
                          ))}
                        </div>
                        <span className="rating-text">({contact.rating || 0}/5)</span>
                      </div>
                    </div>
                 
                  </div>
                  
                  <div className="contact-services forest-services">
                    {contact.services.slice(0, 3).map((service, idx) => {
                      const serviceInfo = availableServices.find(s => s.key === service);
                      return (
                        <motion.span
                          key={idx}
                          className="service-tag forest-badge"
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.2 }}
                        >
                          {getAnimalIcon(service)}
                          {serviceInfo ? serviceInfo.label : service}
                        </motion.span>
                      );
                    })}
                    {contact.services.length > 3 && (
                      <span className="service-tag forest-badge more-badge">
                        +{contact.services.length - 3} more
                      </span>
                    )}
                  </div>
                
                <div className="contact-details">
                  <div className="contact-info">
                    <FaMapMarkerAlt className="contact-icon" />
                    <span>{contact.location}</span>
                  </div>
                  
                  <div className="contact-info">
                    <FaClock className="contact-icon" />
                    <span>{contact.availability}</span>
                  </div>

                  {contact.showFullDetails ? (
                    <>
                      <div className="contact-info">
                        <FaPhone className="contact-icon" />
                        <a href={`tel:${contact.mobileNumber}`} className="contact-link">
                          {contact.mobileNumber}
                        </a>
                      </div>
                      {contact.secondaryMobileNumber && (
                        <div className="contact-info">
                          <FaPhone className="contact-icon" />
                          <a href={`tel:${contact.secondaryMobileNumber}`} className="contact-link">
                            {contact.secondaryMobileNumber} (Secondary)
                          </a>
                        </div>
                      )}
                      <div className="contact-info">
                        <span className="contact-label">Work:</span>
                        <span>{contact.work}</span>
                      </div>
                      <div className="contact-info">
                        <span className="contact-label">Experience:</span>
                        <span>{contact.experience || 'Not specified'}</span>
                      </div>
                    </>
                  ) : (
                    <div className="contact-info">
                      <span className="contact-label">Phone:</span>
                      <span className="hidden-phone">••••••••••</span>
                    </div>
                  )}
                </div>
                
                <div className="contact-actions forest-actions">
                  {!contact.showFullDetails ? (
                    <motion.button 
                      className="show-details-btn forest-action-btn"
                      onClick={() => handleShowDetails(contact)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaEye /> Details
                    </motion.button>
                  ) : (
                    <motion.button 
                      className="view-details-btn forest-action-btn"
                      onClick={() => navigate(`/emergency/${contact._id}`)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaEye /> View Profile
                    </motion.button>
                  )}
                  <motion.button 
                    className="call-btn forest-action-btn"
                    onClick={() => {
                      if (contact.showFullDetails) {
                        window.location.href = `tel:${contact.mobileNumber}`;
                      }
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={!contact.showFullDetails}
                  >
                    <FaPhone /> Call
                  </motion.button>
                  <motion.button 
                    className="share-btn forest-action-btn"
                    onClick={() => handleShare(contact)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaShare /> Share
                  </motion.button>
                </div>
              </motion.div>
              );
            })
          ) : (
            <div className="no-contacts">
              <p>No ERF volunteers found for the selected criteria.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredContacts.length > itemsPerPage && (
          <div className="flex justify-center items-center gap-4 mt-8 p-4 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-2"
            >
              <FaChevronLeft className="w-3 h-3" />
              Previous
            </Button>
            
            <div className="flex items-center gap-2 text-sm" style={{ color: '#2F5035' }}>
              <span>Page</span>
              <span className="font-bold">{currentPage}</span>
              <span>of</span>
              <span className="font-bold">{totalPages}</span>
              <span className="ml-2 text-muted-foreground">
                ({filteredContacts.length} total)
              </span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-2"
            >
              Next
              <FaChevronRight className="w-3 h-3" />
            </Button>
          </div>
        )}
      </div>

      {/* Show Details Form Modal */}
      {showDetailsForm && (
        <div className="registration-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Show Contact Details</h2>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowDetailsForm(false);
                  setDetailsForm({ name: '', email: '', contact: '', purpose: '' });
                  setOtpSent(false);
                  setOtp('');
                  setEmailVerified(false);
                }}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleDetailsSubmit} className="registration-form">
              {error && (
                <div className="error-message" style={{ marginBottom: '1rem', padding: '0.75rem', background: '#fee', color: '#c33', borderRadius: '4px' }}>
                  {error}
                </div>
              )}

              {/* Google Login Option */}
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    text="continue_with"
                    shape="rectangular"
                  />
                </div>
              </div>

              <div style={{ textAlign: 'center', margin: '1rem 0', color: '#666' }}>OR</div>

              <div className="form-group">
                <label>Your Name *</label>
                <input
                  type="text"
                  name="name"
                  value={detailsForm.name}
                  onChange={(e) => setDetailsForm(prev => ({ ...prev, name: e.target.value }))}
                  required
                  disabled={emailVerified}
                />
              </div>
              
              <div className="form-group">
                <label>Your Email *</label>
                <input
                  type="email"
                  name="email"
                  value={detailsForm.email}
                  onChange={(e) => {
                    setDetailsForm(prev => ({ ...prev, email: e.target.value }));
                    setOtpSent(false);
                    setEmailVerified(false);
                  }}
                  required
                  disabled={emailVerified}
                />
              </div>

              {!emailVerified && (
                <>
                  {!otpSent ? (
                    <div className="form-group">
                      <button 
                        type="button"
                        onClick={handleSendOTP}
                        className="submit-btn"
                        disabled={!detailsForm.email || sendingOtp}
                        style={{ width: '100%', marginBottom: '0.5rem' }}
                      >
                        {sendingOtp ? 'Sending...' : 'Send OTP to Email'}
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="form-group">
                        <label>Enter OTP *</label>
                        <input
                          type="text"
                          name="otp"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          placeholder="Enter OTP sent to your email"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <button 
                          type="button"
                          onClick={handleVerifyOTP}
                          className="submit-btn"
                          disabled={!otp || verifyingOtp}
                          style={{ width: '100%', marginBottom: '0.5rem' }}
                        >
                          {verifyingOtp ? 'Verifying...' : 'Verify OTP'}
                        </button>
                      </div>
                    </>
                  )}
                </>
              )}

              {emailVerified && (
                <div style={{ padding: '0.75rem', background: '#efe', color: '#3a3', borderRadius: '4px', marginBottom: '1rem', textAlign: 'center' }}>
                  ✓ Email verified successfully
                </div>
              )}
              
              <div className="form-group">
                <label>Your Contact Number *</label>
                <input
                  type="tel"
                  name="contact"
                  value={detailsForm.contact}
                  onChange={(e) => setDetailsForm(prev => ({ ...prev, contact: e.target.value }))}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Purpose of Enquiry</label>
                <textarea
                  name="purpose"
                  value={detailsForm.purpose}
                  onChange={(e) => setDetailsForm(prev => ({ ...prev, purpose: e.target.value }))}
                  placeholder="Please describe why you need to contact this WAERF volunteer (optional)..."
                  rows="4"
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.9rem', resize: 'vertical', fontFamily: 'inherit' }}
                />
              </div>
              
              <div className="form-actions">
                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={!emailVerified}
                >
                  Show Details
                </button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => {
                    setShowDetailsForm(false);
                    setDetailsForm({ name: '', email: '', contact: '', purpose: '' });
                    setOtpSent(false);
                    setOtp('');
                    setEmailVerified(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showRegistrationForm && (
        <div className="registration-modal">
          <div className="modal-content">
            <div className="modal-header">
              <div className="modal-header-content">
                <div className="modal-icon-wrapper">
                  <FaPaw className="modal-icon" />
                </div>
                <div>
                  <h2>Register as Emergency Response Force</h2>
                  <p className="modal-subtitle">Join our network of emergency responders</p>
                </div>
              </div>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowRegistrationForm(false);
                  setRegistrationEmailVerified(false);
                  setRegistrationOtpSent(false);
                  setRegistrationOtp('');
                  setAcceptedTerms(false);
                  setRegistrationStep(1);
                  setSelectedServicesForRegistration([]);
                }}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {/* Progress Indicator */}
            <div className="registration-progress">
              <div className={`progress-step ${registrationStep >= 1 ? 'active' : ''} ${registrationStep > 1 ? 'completed' : ''}`}>
                <div className="progress-step-number">1</div>
                <div className="progress-step-label">Select Services</div>
              </div>
              <div className={`progress-line ${registrationStep > 1 ? 'completed' : ''}`}></div>
              <div className={`progress-step ${registrationStep >= 2 ? 'active' : ''}`}>
                <div className="progress-step-number">2</div>
                <div className="progress-step-label">Registration Details</div>
              </div>
            </div>
            
            {registrationStep === 1 ? (
              <div className="registration-form">
                <div className="step-header">
                  <h3>Step 1: Select Service(s)</h3>
                  <p className="step-description">Choose the emergency response services you want to provide</p>
                </div>
                
                <div className="services-grid" style={{ marginBottom: '20px' }}>
                  {availableServices.map(service => (
                    <label key={service.key} className="service-checkbox" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        name={`service-${service.key}`}
                        checked={selectedServicesForRegistration.includes(service.key)}
                        onChange={(e) => {
                          e.stopPropagation();
                          if (e.target.checked) {
                            setSelectedServicesForRegistration(prev => [...prev, service.key]);
                          } else {
                            setSelectedServicesForRegistration(prev => prev.filter(s => s !== service.key));
                          }
                        }}
                      />
                      <div className="permission-content">
                        <div className="permission-title">{service.label}</div>
                      </div>
                    </label>
                  ))}
                </div>

                {selectedServicesForRegistration.length > 0 && (
                  <div className="selected-services-summary">
                    <div className="selected-services-header">
                      <FaCheckCircle className="selected-icon" />
                      <span><strong>{selectedServicesForRegistration.length}</strong> Service{selectedServicesForRegistration.length > 1 ? 's' : ''} Selected</span>
                    </div>
                    <div className="selected-services-list">
                      {selectedServicesForRegistration.map(serviceKey => {
                        const service = availableServices.find(s => s.key === serviceKey);
                        return (
                          <span key={serviceKey} className="selected-service-badge">
                            {service?.label || serviceKey}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="form-actions">
                  <button 
                    type="button"
                    className="submit-btn"
                    onClick={async () => {
                      if (selectedServicesForRegistration.length === 0) {
                        setError('Please select at least one service');
                        return;
                      }
                      await fetchSelectedServicesDetails(selectedServicesForRegistration);
                      setFormData(prev => ({ ...prev, services: selectedServicesForRegistration }));
                      setRegistrationStep(2);
                    }}
                    disabled={selectedServicesForRegistration.length === 0}
                  >
                    Continue to Registration Form
                  </button>
                  <button 
                    type="button" 
                    className="cancel-btn"
                    onClick={() => {
                      setShowRegistrationForm(false);
                      setRegistrationEmailVerified(false);
                      setRegistrationOtpSent(false);
                      setRegistrationOtp('');
                      setAcceptedTerms(false);
                      setRegistrationStep(1);
                      setSelectedServicesForRegistration([]);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="registration-form">
                <div className="step-header">
                  <div className="step-header-content">
                    <h3>Step 2: Registration Details</h3>
                    <p className="step-description">Please provide your information to complete registration</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setRegistrationStep(1)}
                    className="change-services-btn"
                  >
                    <FaChevronLeft /> Change Services
                  </button>
                </div>

                {/* Selected Services Display at Top */}
                {selectedServicesForRegistration.length > 0 && (
                  <div className="selected-services-top">
                    <div className="selected-services-top-header">
                      <FaPaw className="selected-services-icon" />
                      <span className="selected-services-title">Selected Services</span>
                      {loadingServiceDetails && (
                        <span className="loading-text">Loading form configuration...</span>
                      )}
                    </div>
                    <div className="selected-services-top-list">
                      {selectedServicesForRegistration.map(serviceKey => {
                        const service = availableServices.find(s => s.key === serviceKey);
                        const serviceDetail = selectedServicesDetails.find(s => s.key === serviceKey);
                        return (
                          <div key={serviceKey} className="selected-service-top-badge">
                            {service?.label || serviceKey}
                            {serviceDetail && serviceDetail.requiredFields && serviceDetail.requiredFields.length > 0 && (
                              <span className="service-badge-info">({serviceDetail.requiredFields.length} custom fields)</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {loadingServiceDetails && (
                  <div className="loading-service-config" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '20px' }}>
                    <ImageLoader size={60} />
                    <p>Loading form configuration from backend...</p>
                  </div>
                )}
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Email *</label>
                <div className="email-verification-section">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    disabled={registrationOtpSent}
                  />
                  {!registrationEmailVerified && formData.email && (
                    <div className="otp-verification-box">
                      {!registrationOtpSent ? (
                        <button
                          type="button"
                          onClick={handleSendRegistrationOTP}
                          disabled={sendingRegistrationOtp}
                          className="send-otp-btn"
                        >
                          {sendingRegistrationOtp ? 'Sending...' : 'Send OTP to Email'}
                        </button>
                      ) : (
                        <div className="otp-input-group">
                          <input
                            type="text"
                            placeholder="Enter OTP"
                            value={registrationOtp}
                            onChange={(e) => setRegistrationOtp(e.target.value)}
                            maxLength="6"
                            className="otp-input"
                          />
                          <button
                            type="button"
                            onClick={handleVerifyRegistrationOTP}
                            disabled={verifyingRegistrationOtp || !registrationOtp}
                            className="verify-otp-btn"
                          >
                            {verifyingRegistrationOtp ? 'Verifying...' : 'Verify OTP'}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                  {registrationEmailVerified && (
                    <div className="email-verified-badge">
                      ✓ Email Verified
                    </div>
                  )}
                </div>
              </div>
              
              <div className="form-group">
                <label>Mobile Number *</label>
                <input
                  type="tel"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Location *</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="City, State"
                  required
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>District *</label>
                  <select
                    name="district"
                    value={formData.district}
                    onChange={handleFormDistrictChange}
                    required
                  >
                    <option value="">Select District</option>
                    {Object.keys(maharashtraData).map(district => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Taluka *</label>
                  <select
                    name="taluka"
                    value={formData.taluka}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Taluka</option>
                    {formData.district && maharashtraData[formData.district] ? (
                      maharashtraData[formData.district].map(taluka => (
                        <option key={taluka} value={taluka}>
                          {taluka}
                        </option>
                      ))
                    ) : (
                      <option value="">Select a district first</option>
                    )}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Pincode *</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    placeholder="Enter 6-digit pincode"
                    pattern="[0-9]{6}"
                    maxLength="6"
                    required
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Work/Profession *</label>
                  <input
                    type="text"
                    name="work"
                    value={formData.work}
                    onChange={handleInputChange}
                    placeholder="Your profession/work"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Secondary Mobile Number</label>
                  <input
                    type="tel"
                    name="secondaryMobileNumber"
                    value={formData.secondaryMobileNumber}
                    onChange={handleInputChange}
                    placeholder="Optional secondary number"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Experience (Years) *</label>
                <input
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  placeholder="Years of experience in emergency services"
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isGovernmentEmployee"
                    checked={formData.isGovernmentEmployee}
                    onChange={handleInputChange}
                  />
                  I am a government employee
                </label>
              </div>
              
              <div className="form-group">
                <label>Passport Photo *</label>
                <input
                  type="file"
                  name="passportPhoto"
                  accept="image/*"
                  onChange={(e) => setFormData(prev => ({ ...prev, passportPhoto: e.target.files[0] }))}
                  required
                />
                <small>This photo will be displayed on your identity card</small>
              </div>

              <div className="form-group">
                <label>ID Card</label>
                <input
                  type="file"
                  name="idCard"
                  accept="image/*,.pdf"
                  onChange={(e) => setFormData(prev => ({ ...prev, idCard: e.target.files[0] }))}
                />
                <small>Upload your government ID card for verification</small>
              </div>

              <div className="form-group">
                <label>Educational Certificate</label>
                <input
                  type="file"
                  name="educationalCertificate"
                  accept="image/*,.pdf"
                  onChange={(e) => setFormData(prev => ({ ...prev, educationalCertificate: e.target.files[0] }))}
                />
                <small>Upload relevant educational certificates</small>
              </div>

              <div className="form-group">
                <label>Experience Document</label>
                <input
                  type="file"
                  name="experienceDocument"
                  accept="image/*,.pdf"
                  onChange={(e) => setFormData(prev => ({ ...prev, experienceDocument: e.target.files[0] }))}
                />
                <small>Upload documents proving your experience</small>
              </div>

              {/* Service-specific required documents */}
              {selectedServicesDetails.length > 0 && selectedServicesDetails.some(s => s.requiredDocuments && s.requiredDocuments.length > 0) && (
                <div className="form-group" style={{ marginTop: '20px', padding: '15px', background: '#f0f9ff', borderRadius: '6px' }}>
                  <h4 style={{ marginBottom: '15px', fontSize: '1.1rem' }}>Service-Specific Required Documents</h4>
                  {selectedServicesDetails.map(service => {
                    if (!service.requiredDocuments || service.requiredDocuments.length === 0) return null;
                    return (
                      <div key={service.key} style={{ marginBottom: '15px' }}>
                        <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>{service.label}:</p>
                        {service.requiredDocuments.map((doc, idx) => (
                          <div key={idx} style={{ marginBottom: '8px', marginLeft: '15px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <input
                                type="file"
                                name={`service-${service.key}-doc-${doc.documentName}`}
                                accept="image/*,.pdf"
                                required={doc.mandatory}
                                onChange={(e) => {
                                  const file = e.target.files[0];
                                  if (file) {
                                    setFormData(prev => ({
                                      ...prev,
                                      [`serviceDoc_${service.key}_${doc.documentName}`]: file
                                    }));
                                  }
                                }}
                              />
                              <span>{doc.documentName} {doc.mandatory && <span style={{ color: 'red' }}>*</span>}</span>
                            </label>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="form-group">
                <label>Other Documents</label>
                <input
                  type="file"
                  name="otherDocuments"
                  accept="image/*,.pdf"
                  multiple
                  required={selectedServicesDetails.some(s => s.otherDocumentsMandatory)}
                  onChange={(e) => setFormData(prev => ({ ...prev, otherDocuments: Array.from(e.target.files) }))}
                />
                <small>
                  Upload any other relevant documents
                  {selectedServicesDetails.some(s => s.otherDocumentsMandatory) ? ' (Required)' : ' (Optional)'}
                </small>
              </div>

              {/* Service-specific dynamic fields */}
              {selectedServicesDetails.length > 0 && selectedServicesDetails.some(s => s.requiredFields && s.requiredFields.length > 0) && (
                <div className="form-group" style={{ marginTop: '20px', padding: '15px', background: '#fff9e6', borderRadius: '6px' }}>
                  <h4 style={{ marginBottom: '15px', fontSize: '1.1rem' }}>Service-Specific Information</h4>
                  {selectedServicesDetails.map(service => {
                    if (!service.requiredFields || service.requiredFields.length === 0) return null;
                    return (
                      <div key={service.key} style={{ marginBottom: '20px' }}>
                        <p style={{ fontWeight: 'bold', marginBottom: '10px', color: '#666' }}>{service.label} - Additional Information:</p>
                        {service.requiredFields.map((field, idx) => {
                          const fieldKey = `serviceField_${service.key}_${field.fieldName}`;
                          return (
                            <div key={idx} className="form-group" style={{ marginBottom: '15px', marginLeft: '15px' }}>
                              <label>
                                {field.label} {field.required && <span style={{ color: 'red' }}>*</span>}
                              </label>
                              {field.fieldType === 'textarea' ? (
                                <textarea
                                  name={fieldKey}
                                  value={formData[fieldKey] || ''}
                                  onChange={(e) => setFormData(prev => ({ ...prev, [fieldKey]: e.target.value }))}
                                  required={field.required}
                                  placeholder={field.placeholder || ''}
                                  rows={4}
                                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                                />
                              ) : field.fieldType === 'select' ? (
                                <select
                                  name={fieldKey}
                                  value={formData[fieldKey] || ''}
                                  onChange={(e) => setFormData(prev => ({ ...prev, [fieldKey]: e.target.value }))}
                                  required={field.required}
                                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                                >
                                  <option value="">Select {field.label}</option>
                                  {field.options && field.options.map((opt, optIdx) => (
                                    <option key={optIdx} value={opt}>{opt}</option>
                                  ))}
                                </select>
                              ) : field.fieldType === 'checkbox' ? (
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <input
                                    type="checkbox"
                                    name={fieldKey}
                                    checked={formData[fieldKey] || false}
                                    onChange={(e) => setFormData(prev => ({ ...prev, [fieldKey]: e.target.checked }))}
                                    required={field.required}
                                  />
                                  <span>{field.placeholder || 'Check this box'}</span>
                                </label>
                              ) : field.fieldType === 'file' ? (
                                <input
                                  type="file"
                                  name={fieldKey}
                                  accept="image/*,.pdf"
                                  required={field.required}
                                  onChange={(e) => setFormData(prev => ({ ...prev, [fieldKey]: e.target.files[0] }))}
                                />
                              ) : (
                                <input
                                  type={field.fieldType === 'email' ? 'email' : field.fieldType === 'tel' ? 'tel' : field.fieldType === 'number' ? 'number' : 'text'}
                                  name={fieldKey}
                                  value={formData[fieldKey] || ''}
                                  onChange={(e) => setFormData(prev => ({ ...prev, [fieldKey]: e.target.value }))}
                                  required={field.required}
                                  placeholder={field.placeholder || ''}
                                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                                />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              )}
              
              <div className="form-group">
                <label>Availability *</label>
                <select
                  name="availability"
                  value={formData.availability}
                  onChange={handleInputChange}
                  required
                >
                  {availabilityOptions.map(option => (
                    <option key={option.key} value={option.key}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Service-specific Terms & Conditions */}
              {selectedServicesDetails.length > 0 && selectedServicesDetails.some(s => s.termsAndConditions && s.termsAndConditions.trim()) && (
                <div className="form-group" style={{ marginTop: '20px', padding: '15px', background: '#fff5f5', borderRadius: '6px' }}>
                  <h4 style={{ marginBottom: '15px', fontSize: '1.1rem' }}>Service-Specific Terms & Conditions</h4>
                  {selectedServicesDetails.map(service => {
                    if (!service.termsAndConditions || !service.termsAndConditions.trim()) return null;
                    return (
                      <div key={service.key} style={{ marginBottom: '15px' }}>
                        <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>{service.label} Terms & Conditions:</p>
                        <div style={{ 
                          maxHeight: '150px', 
                          overflowY: 'auto', 
                          padding: '10px', 
                          background: 'white', 
                          border: '1px solid #ddd', 
                          borderRadius: '4px',
                          fontSize: '0.9rem',
                          lineHeight: '1.5'
                        }}>
                          {service.termsAndConditions}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="form-group">
                <label className="checkbox-label terms-checkbox" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    name="acceptedTerms"
                    checked={acceptedTerms}
                    onChange={(e) => {
                      e.stopPropagation();
                      setAcceptedTerms(e.target.checked);
                    }}
                    required
                  />
                  <span>
                    I agree to the{' '}
                    <button
                      type="button"
                      className="terms-link"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setShowTermsModal(true);
                      }}
                      style={{ background: 'none', border: 'none', color: 'inherit', textDecoration: 'underline', cursor: 'pointer' }}
                    >
                      ERF Terms & Conditions
                    </button>
                    {selectedServicesDetails.some(s => s.termsAndConditions && s.termsAndConditions.trim()) && ' and Service-Specific Terms & Conditions'}
                    {' '}and understand all risks and responsibilities *
                  </span>
                </label>
              </div>

              <div className="form-actions">
                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={isSubmitting || !registrationEmailVerified || !acceptedTerms}
                >
                  {isSubmitting ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <ImageLoader size={18} />
                      <span>Submitting...</span>
                    </div>
                  ) : (
                    'Submit Registration'
                  )}
                </button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => {
                    setShowRegistrationForm(false);
                    setRegistrationEmailVerified(false);
                    setRegistrationOtpSent(false);
                    setRegistrationOtp('');
                    setAcceptedTerms(false);
                  }}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
              </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Terms & Conditions Modal */}
      {showTermsModal && (
        <div className="registration-modal" style={{ zIndex: 10000 }}>
          <div className="modal-content" style={{ maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="modal-header">
              <h2>ERF Terms & Conditions</h2>
              <button 
                className="close-btn"
                onClick={() => setShowTermsModal(false)}
              >
                ×
              </button>
            </div>
            <div style={{ padding: '20px' }}>
              <AryaMitraTermsAndConditionsContent onClose={() => setShowTermsModal(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Terms Content Component (extracted for reuse)
const AryaMitraTermsAndConditionsContent = ({ onClose }) => {
  return (
    <div>
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold mb-2">ERF Terms & Conditions</h1>
        <p className="text-gray-600 mb-2">Emergency Response Force</p>
        <p className="text-gray-500 text-sm">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      <div className="space-y-6">
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
          <h3 className="font-bold text-amber-800 mb-2">Important Notice</h3>
          <p className="text-amber-700 text-sm leading-relaxed">
            All registered Emergency Response Force volunteers undertake emergency response activities entirely at their own risk and responsibility. Please read all terms carefully before registration.
          </p>
        </div>

        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-3">1. Volunteer Responsibility</h2>
          <div className="space-y-2 text-gray-700 leading-relaxed text-sm">
            <p>All registered ERF volunteers undertake emergency response activities entirely at their own risk and responsibility.</p>
            <p><strong>ERF, its founders, trustees, coordinators, helpline operators, affiliated NGOs, and partner groups shall not be held liable for:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Injuries</li>
              <li>Accidents</li>
              <li>Physical disability</li>
              <li>Psychological trauma</li>
              <li>Death</li>
              <li>Medical expenses</li>
              <li>Property loss</li>
            </ul>
            <p className="mt-2">resulting from volunteer participation or actions.</p>
          </div>
        </section>

        <section className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
          <h2 className="text-xl font-bold text-red-800 mb-3">Disclaimer</h2>
          <div className="space-y-2 text-red-700 leading-relaxed text-sm">
            <p className="font-semibold">All volunteers must ensure their own safety and accept all risks before engaging in emergency response activity.</p>
            <p><strong>ERF shall NOT be responsible for:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Any injury, accident, trauma</li>
              <li>Loss of life</li>
              <li>Property or financial damages</li>
              <li>Criminal or civil cases arising due to volunteer actions</li>
            </ul>
            <p className="mt-2 font-bold">Volunteers agree that ERF is not directly or indirectly liable for any legal consequences.</p>
          </div>
        </section>

        <div className="pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            ← Back to Registration
          </button>
        </div>
      </div>
    </div>
  );
};

export default Emergency;