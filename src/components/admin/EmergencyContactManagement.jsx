import React, { useState, useEffect } from 'react';
import { Check, X, Plus, Trash2, Info, Edit2, AlertTriangle, Clock, FileText, Download, Image as ImageIcon } from 'lucide-react';
import api from '../../utils/api';
import ImageCropper from '../common/ImageCropper';
import EmergencyContactEditModal from './EmergencyContactEditModal';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';

const EmergencyContactManagement = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewContact, setViewContact] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editContact, setEditContact] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    service: '',
    location: '',
    district: '',
    taluka: '',
    pincode: '',
    active: ''
  });
  const [availableServices, setAvailableServices] = useState([]);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showServiceFormModal, setShowServiceFormModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [serviceFormData, setServiceFormData] = useState({ 
    key: '', 
    label: '', 
    active: true, 
    order: 0,
    termsAndConditions: '',
    requiredFields: [],
    requiredDocuments: [],
    otherDocumentsMandatory: false
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobileNumber: '',
    services: [],
    location: '',
    availability: '24x7',
    notes: '',
    district: '',
    taluka: '',
    pincode: '',
    work: '',
    secondaryMobileNumber: '',
    passportPhoto: null,
    idCard: null,
    educationalCertificate: null,
    experienceDocument: null,
    experience: '',
    isGovernmentEmployee: false,
    specializations: [],
    badge: 'unverified',
    rescueCount: 0,
    rating: 0,
    totalRatings: 0,
    active: true
  });

  const [customService, setCustomService] = useState('');

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


  useEffect(() => {
    fetchServices();
    fetchContacts();
  }, [filters]);

  const fetchServices = async () => {
    try {
      const response = await api.get('/services/admin');
      if (response.data.success) {
        setAvailableServices(response.data.services);
      }
    } catch (error) {
      console.error('Failed to fetch services:', error);
    }
  };

  const fetchContacts = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.service) params.append('service', filters.service);
      if (filters.location) params.append('location', filters.location);
      if (filters.district) params.append('district', filters.district);
      if (filters.taluka) params.append('taluka', filters.taluka);
      if (filters.pincode) params.append('pincode', filters.pincode);
      if (filters.active) params.append('active', filters.active);

      const response = await api.get(`/emergency-contacts/admin?${params}`);
      if (response.data.success) {
        setContacts(response.data.contacts);
      }
    } catch (error) {
      setError('Failed to fetch emergency contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleServiceChange = (service) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const handleAddCustomService = () => {
    if (customService.trim()) {
      setFormData(prev => ({
        ...prev,
        services: [...prev.services, customService.trim()]
      }));
      setCustomService('');
    }
  };

  const handleRemoveCustomService = (serviceToRemove) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter(s => s !== serviceToRemove)
    }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDistrictChange = (e) => {
    const { value } = e.target;
    setFilters(prev => ({
      ...prev,
      district: value,
      taluka: '' // Reset taluka when district changes
    }));
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
    try {
      const formDataToSend = new FormData();
      
      // Add all form fields to FormData
      Object.keys(formData).forEach(key => {
        if (key === 'passportPhoto') {
          if (formData.passportPhoto) {
            formDataToSend.append(key, formData.passportPhoto);
          }
        } else if (key === 'services') {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      await api.post('/emergency-contacts/admin/add', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setShowAddForm(false);
      setFormData({
        name: '',
        email: '',
        mobileNumber: '',
        services: [],
        location: '',
        availability: '24x7',
        notes: '',
        district: '',
        taluka: '',
        pincode: '',
        work: '',
        secondaryMobileNumber: '',
        passportPhoto: null,
        idCard: null,
        educationalCertificate: null,
        experienceDocument: null,
        experience: '',
        isGovernmentEmployee: false,
        specializations: [],
        badge: 'unverified',
        rescueCount: 0,
        rating: 0,
        totalRatings: 0,
        active: true
      });
      fetchContacts();
    } catch (error) {
      setError('Failed to add emergency contact');
    }
  };

  const handleApprove = async (contactId) => {
    try {
      await api.put(`/emergency-contacts/admin/approve/${contactId}`);
      fetchContacts();
    } catch (error) {
      setError('Failed to approve contact');
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      setError('Please provide a rejection reason');
      return;
    }

    try {
      await api.put(`/emergency-contacts/admin/reject/${selectedContact._id}`, {
        rejectionReason
      });
      setShowRejectModal(false);
      setRejectionReason('');
      setSelectedContact(null);
      fetchContacts();
    } catch (error) {
      setError('Failed to reject contact');
    }
  };

  const handleStatusChange = async (contactId, newStatus) => {
    try {
      await api.put(`/emergency-contacts/${contactId}/status`, { status: newStatus });
      fetchContacts();
      alert(`Status changed to ${newStatus} successfully`);
    } catch (error) {
      setError('Failed to change status');
      alert('Failed to change status. Please try again.');
    }
  };

  const handleDelete = async (contactId) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        await api.delete(`/emergency-contacts/admin/${contactId}`);
        fetchContacts();
      } catch (error) {
        setError('Failed to delete contact');
      }
    }
  };

  const handleEditContact = (contact) => {
    setEditContact(contact);
    setShowEditModal(true);
  };

  const handleEditModalClose = () => {
    setShowEditModal(false);
    setEditContact(null);
  };

  const handleEditSubmit = async (updatedData) => {
    try {
      // If no file upload, send as regular JSON
      await api.put(`/emergency-contacts/admin/${editContact._id}`, updatedData);
      alert('ERF volunteer updated successfully!');
      setShowEditModal(false);
      setEditContact(null);
      fetchContacts();
    } catch (error) {
      setError('Failed to update ERF volunteer');
      alert('Failed to update ERF volunteer. Please try again.');
    }
  };

  const handleBadgeUpdate = async (contactId, newBadge) => {
    try {
      await api.put(`/emergency-contacts/${contactId}/badge`, { badge: newBadge });
      alert('Badge updated successfully!');
      fetchContacts();
    } catch (error) {
      setError('Failed to update badge');
      alert('Failed to update badge. Please try again.');
    }
  };

  const handleGenerateIds = async () => {
    if (!window.confirm('This will generate IDs for all contacts that don\'t have one. Continue?')) {
      return;
    }

    try {
      setLoading(true);
      const response = await api.post('/emergency-contacts/admin/generate-ids');
      alert(`Successfully generated IDs for ${response.data.generated} contacts!`);
      fetchContacts();
    } catch (error) {
      setError('Failed to generate IDs');
      alert(error.response?.data?.message || 'Failed to generate IDs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleServiceInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setServiceFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (name === 'order' ? parseInt(value) || 0 : value)
    }));
  };

  const handleManageServices = () => {
    setShowServiceModal(true);
  };

  const handleAddService = () => {
    setEditingService(null);
    setServiceFormData({ 
      key: '', 
      label: '', 
      active: true, 
      order: 0,
      termsAndConditions: '',
      requiredFields: [],
      requiredDocuments: [],
      otherDocumentsMandatory: false
    });
    setShowServiceFormModal(true);
    setShowServiceModal(false); // Close list modal when opening form
  };

  const handleEditService = (service) => {
    setEditingService(service);
    setServiceFormData({
      key: service.key,
      label: service.label,
      active: service.active,
      order: service.order || 0,
      termsAndConditions: service.termsAndConditions || '',
      requiredFields: service.requiredFields || [],
      requiredDocuments: service.requiredDocuments || [],
      otherDocumentsMandatory: service.otherDocumentsMandatory || false
    });
    setShowServiceFormModal(true);
    setShowServiceModal(false); // Close list modal when opening form
  };

  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    try {
      // Filter out incomplete requiredFields (must have fieldName, fieldType, and label)
      const validRequiredFields = (serviceFormData.requiredFields || [])
        .filter(field => field && typeof field === 'object')
        .filter(field => {
          const hasFieldName = field.fieldName && typeof field.fieldName === 'string' && field.fieldName.trim().length > 0;
          const hasFieldType = field.fieldType && typeof field.fieldType === 'string' && field.fieldType.trim().length > 0;
          const hasLabel = field.label && typeof field.label === 'string' && field.label.trim().length > 0;
          return hasFieldName && hasFieldType && hasLabel;
        });

      // Filter out incomplete requiredDocuments (must have documentName)
      const validRequiredDocuments = (serviceFormData.requiredDocuments || [])
        .filter(doc => doc && typeof doc === 'object')
        .filter(doc => {
          const hasDocumentName = doc.documentName && typeof doc.documentName === 'string' && doc.documentName.trim().length > 0;
          return hasDocumentName;
        });

      const dataToSubmit = {
        ...serviceFormData,
        requiredFields: validRequiredFields,
        requiredDocuments: validRequiredDocuments
      };

      if (editingService) {
        await api.put(`/services/admin/${editingService._id}`, dataToSubmit);
        alert('Service updated successfully!');
      } else {
        await api.post('/services/admin', dataToSubmit);
        alert('Service added successfully!');
      }
      setShowServiceFormModal(false);
      setShowServiceModal(true); // Show list modal after saving
      fetchServices();
      setServiceFormData({ 
        key: '', 
        label: '', 
        active: true, 
        order: 0,
        termsAndConditions: '',
        requiredFields: [],
        requiredDocuments: [],
        otherDocumentsMandatory: false
      });
      setEditingService(null);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save service. Please try again.');
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (!window.confirm('Are you sure you want to delete this service?')) {
      return;
    }

    try {
      await api.delete(`/services/admin/${serviceId}`);
      alert('Service deleted successfully!');
      fetchServices();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete service. Please try again.');
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

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { bg: 'bg-amber-500', label: 'Pending' },
      approved: { bg: 'bg-green-500', label: 'Approved' },
      rejected: { bg: 'bg-red-500', label: 'Rejected' }
    };
    const config = statusConfig[status] || { bg: 'bg-muted', label: status };
    
    return (
      <span className={`${config.bg} text-white px-3 py-1 rounded-md text-sm font-semibold`}>
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="text-muted-foreground">Loading ERF volunteers...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">ERF Volunteer Management</h2>
        <div className="flex gap-2">
          <Button onClick={handleManageServices} variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Manage Services
          </Button>
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add ERF Volunteer
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <Card className="bg-destructive/10 border-destructive">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="w-5 h-5" />
                <p>{error}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setError('')}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Status</label>
              <select 
                name="status" 
                value={filters.status} 
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:ring-2 focus:ring-ring"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Service</label>
              <select 
                name="service" 
                value={filters.service} 
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:ring-2 focus:ring-ring"
              >
                <option value="">All Services</option>
                {availableServices.map(service => (
                  <option key={service.key} value={service.key}>
                    {service.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Location</label>
              <input
                type="text"
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                placeholder="Search by location"
                className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">District</label>
              <select 
                name="district" 
                value={filters.district} 
                onChange={handleDistrictChange}
                className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:ring-2 focus:ring-ring"
              >
                <option value="">All Districts</option>
                {Object.keys(maharashtraData).map(district => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Taluka</label>
              <select 
                name="taluka" 
                value={filters.taluka} 
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:ring-2 focus:ring-ring"
                disabled={!filters.district}
              >
                <option value="">All Talukas</option>
                {filters.district && maharashtraData[filters.district] && maharashtraData[filters.district].map(taluka => (
                  <option key={taluka} value={taluka}>
                    {taluka}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Pincode</label>
              <input
                type="text"
                name="pincode"
                value={filters.pincode}
                onChange={handleFilterChange}
                placeholder="Search by pincode"
                className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Active</label>
              <select 
                name="active" 
                value={filters.active} 
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:ring-2 focus:ring-ring"
              >
                <option value="">All Status</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contacts Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>ERF Volunteer Contacts</CardTitle>
            <Button
              onClick={handleGenerateIds}
              variant="outline"
              size="sm"
              className="text-sm"
            >
              Generate IDs for Existing
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">ID</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Name</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Contact</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Services</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Location</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Availability</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Badge</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map(contact => (
                  <tr key={contact._id} className="border-b border-border hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <div className="text-sm font-mono text-primary font-semibold">
                        {contact.aryaMitraId || 'N/A'}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <strong className="text-foreground">{contact.name}</strong>
                        {contact.isVerified && (
                          <span className="bg-primary text-primary-foreground px-2 py-0.5 rounded-md text-xs font-medium">
                            ✓ Verified
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div>{contact.email}</div>
                        <div>{contact.mobileNumber}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-2">
                        {contact.services.map((service, idx) => {
                          const serviceInfo = availableServices.find(s => s.key === service);
                          return (
                            <span key={idx} className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
                              {serviceInfo ? serviceInfo.label : service}
                            </span>
                          );
                        })}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-foreground">{contact.location}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{contact.availability}</td>
                    <td className="py-3 px-4">
                      <select
                        value={contact.badge || 'unverified'}
                        onChange={(e) => handleBadgeUpdate(contact._id, e.target.value)}
                        className="px-2 py-1 text-sm border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="unverified">Unverified</option>
                        <option value="ugf_verified">UGF Verified</option>
                        <option value="government">Government</option>
                        <option value="government_verified">Government Verified</option>
                        <option value="sn_arya_mitra">WAERF</option>
                      </select>
                    </td>
                    <td className="py-3 px-4">{getStatusBadge(contact.status)}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {/* Show status change buttons based on current status */}
                        {contact.status === 'approved' && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleStatusChange(contact._id, 'pending')}
                              title="Set to Pending"
                              className="h-10 w-10 p-0 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                            >
                              <Clock className="w-5 h-5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedContact(contact);
                                setShowRejectModal(true);
                              }}
                              title="Reject"
                              className="h-10 w-10 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <X className="w-5 h-5" />
                            </Button>
                          </>
                        )}
                        {contact.status === 'rejected' && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleApprove(contact._id)}
                              title="Approve"
                              className="h-10 w-10 p-0 text-primary hover:text-primary hover:bg-primary/10"
                            >
                              <Check className="w-5 h-5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleStatusChange(contact._id, 'pending')}
                              title="Set to Pending"
                              className="h-10 w-10 p-0 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                            >
                              <Clock className="w-5 h-5" />
                            </Button>
                          </>
                        )}
                        {contact.status === 'pending' && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleApprove(contact._id)}
                              title="Approve"
                              className="h-10 w-10 p-0 text-primary hover:text-primary hover:bg-primary/10"
                            >
                              <Check className="w-5 h-5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedContact(contact);
                                setShowRejectModal(true);
                              }}
                              title="Reject"
                              className="h-10 w-10 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <X className="w-5 h-5" />
                            </Button>
                          </>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={async () => {
                            try {
                              // Fetch full contact details including all documents
                              const response = await api.get(`/emergency-contacts/${contact._id}`);
                              if (response.data.success) {
                                const fullContact = response.data.contact;
                                console.log('Fetched contact with documents:', {
                                  idCard: fullContact.idCard,
                                  educationalCertificate: fullContact.educationalCertificate,
                                  experienceDocument: fullContact.experienceDocument,
                                  otherDocuments: fullContact.otherDocuments,
                                  passportPhoto: fullContact.passportPhoto
                                });
                                setViewContact(fullContact);
                                setShowViewModal(true);
                              } else {
                                // Fallback to using contact from list
                                console.log('Using contact from list:', contact);
                                setViewContact(contact);
                                setShowViewModal(true);
                              }
                            } catch (error) {
                              console.error('Failed to fetch contact details:', error);
                              // Fallback to using contact from list
                              setViewContact(contact);
                              setShowViewModal(true);
                            }
                          }}
                          title="View Details"
                          className="h-10 w-10 p-0"
                        >
                          <Info className="w-5 h-5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditContact(contact)}
                          title="Edit Contact"
                          className="h-10 w-10 p-0"
                        >
                          <Edit2 className="w-5 h-5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(contact._id)}
                          title="Delete"
                          className="h-10 w-10 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {contacts.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                No contacts found
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add Contact Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Add Emergency Contact</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setShowAddForm(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Mobile Number *</label>
                    <input
                      type="tel"
                      name="mobileNumber"
                      value={formData.mobileNumber}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Location *</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Services *</label>
                  
                  {/* Custom Service Input */}
                  <div className="mb-4">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={customService}
                        onChange={(e) => setCustomService(e.target.value)}
                        placeholder="Add custom service..."
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomService())}
                        className="flex-1 px-3 py-2 border border-input bg-background rounded-md text-sm focus:ring-2 focus:ring-ring"
                      />
                      <Button type="button" onClick={handleAddCustomService} variant="outline">
                        Add
                      </Button>
                    </div>
                  </div>

                  {/* Selected Custom Services */}
                  {formData.services.filter(service => !availableServices.find(s => s.key === service)).length > 0 && (
                    <div className="mb-4">
                      <label className="text-sm font-medium text-foreground mb-2 block">Custom Services:</label>
                      <div className="flex flex-wrap gap-2">
                        {formData.services
                          .filter(service => !availableServices.find(s => s.key === service))
                          .map((service, index) => (
                            <div key={index} className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                              <span>{service}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveCustomService(service)}
                                className="hover:bg-amber-200 rounded-full p-0.5"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Predefined Services */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {availableServices.map(service => (
                      <label key={service.key} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.services.includes(service.key)}
                          onChange={() => handleServiceChange(service.key)}
                          className="rounded border-input"
                        />
                        <span className="text-sm text-foreground">{service.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Availability *</label>
                    <select
                      name="availability"
                      value={formData.availability}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:ring-2 focus:ring-ring"
                    >
                      <option value="24x7">24x7 Available</option>
                      <option value="day_time">Day Time Only</option>
                      <option value="night_time">Night Time Only</option>
                      <option value="weekends">Weekends Only</option>
                      <option value="on_call">On Call Basis</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Notes</label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:ring-2 focus:ring-ring resize-y"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">District *</label>
                    <select
                      name="district"
                      value={formData.district}
                      onChange={handleFormDistrictChange}
                      required
                      className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:ring-2 focus:ring-ring"
                    >
                      <option value="">Select District</option>
                      {Object.keys(maharashtraData).map(district => (
                        <option key={district} value={district}>
                          {district}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Taluka *</label>
                    <select
                      name="taluka"
                      value={formData.taluka}
                      onChange={handleInputChange}
                      required
                      disabled={!formData.district}
                      className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:ring-2 focus:ring-ring disabled:opacity-50"
                    >
                      <option value="">Select Taluka</option>
                      {formData.district && maharashtraData[formData.district] && maharashtraData[formData.district].map(taluka => (
                        <option key={taluka} value={taluka}>
                          {taluka}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Pincode *</label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Work *</label>
                    <input
                      type="text"
                      name="work"
                      value={formData.work}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Secondary Mobile Number</label>
                    <input
                      type="tel"
                      name="secondaryMobileNumber"
                      value={formData.secondaryMobileNumber}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Passport Photo</label>
                    <ImageCropper
                      onImageCropped={(image) => {
                        setFormData(prev => ({ ...prev, passportPhoto: image }));
                      }}
                      aspectRatio={1}
                      circular={true}
                      maxWidth={500}
                      maxHeight={500}
                      buttonText="Upload Passport Photo"
                      maxFileSize={2 * 1024 * 1024}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Active</label>
                  <select
                    name="active"
                    value={formData.active ? 'true' : 'false'}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:ring-2 focus:ring-ring"
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
                
                <div className="flex gap-4 pt-4">
                  <Button type="submit" className="flex-1">
                    Add Contact
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <Card className="max-w-md w-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Reject Application</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setShowRejectModal(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground"><strong className="text-foreground">Contact:</strong> {selectedContact?.name}</p>
                  <p className="text-sm text-muted-foreground"><strong className="text-foreground">Email:</strong> {selectedContact?.email}</p>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Rejection Reason *</label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Please provide a reason for rejection..."
                    rows="4"
                    required
                    className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:ring-2 focus:ring-ring resize-y"
                  />
                </div>
                
                <div className="flex gap-4 pt-4">
                  <Button 
                    onClick={handleReject}
                    variant="destructive"
                    disabled={!rejectionReason.trim()}
                    className="flex-1"
                  >
                    Reject Application
                  </Button>
                  <Button 
                    onClick={() => setShowRejectModal(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* View Contact Modal */}
      {showViewModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Contact Details</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setShowViewModal(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="text-xl font-bold text-foreground mb-4">{viewContact?.name}</h4>
                </div>
                
                <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                  <h5 className="font-semibold text-foreground mb-2">Basic Information</h5>
                  <p className="text-sm"><strong className="text-foreground">Email:</strong> <span className="text-muted-foreground">{viewContact?.email}</span></p>
                  <p className="text-sm"><strong className="text-foreground">Mobile Number:</strong> <span className="text-muted-foreground">{viewContact?.mobileNumber}</span></p>
                  <p className="text-sm"><strong className="text-foreground">Secondary Mobile:</strong> <span className="text-muted-foreground">{viewContact?.secondaryMobileNumber || 'Not provided'}</span></p>
                  <p className="text-sm"><strong className="text-foreground">Work:</strong> <span className="text-muted-foreground">{viewContact?.work || 'Not provided'}</span></p>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                  <h5 className="font-semibold text-foreground mb-2">Location Details</h5>
                  <p className="text-sm"><strong className="text-foreground">Location:</strong> <span className="text-muted-foreground">{viewContact?.location}</span></p>
                  <p className="text-sm"><strong className="text-foreground">District:</strong> <span className="text-muted-foreground">{viewContact?.district}</span></p>
                  <p className="text-sm"><strong className="text-foreground">Taluka:</strong> <span className="text-muted-foreground">{viewContact?.taluka}</span></p>
                  <p className="text-sm"><strong className="text-foreground">Pincode:</strong> <span className="text-muted-foreground">{viewContact?.pincode}</span></p>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                  <h5 className="font-semibold text-foreground mb-2">Services & Availability</h5>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {viewContact?.services?.map((service, idx) => {
                      const serviceInfo = availableServices.find(s => s.key === service);
                      return (
                        <span key={idx} className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
                          {serviceInfo ? serviceInfo.label : service}
                        </span>
                      );
                    })}
                  </div>
                  <p className="text-sm"><strong className="text-foreground">Availability:</strong> <span className="text-muted-foreground">{viewContact?.availability}</span></p>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                  <h5 className="font-semibold text-foreground mb-2">Status & Verification</h5>
                  <p className="text-sm"><strong className="text-foreground">Status:</strong> {getStatusBadge(viewContact?.status)}</p>
                  <p className="text-sm"><strong className="text-foreground">Active:</strong> <span className="text-muted-foreground">{viewContact?.active ? 'Yes' : 'No'}</span></p>
                  <p className="text-sm"><strong className="text-foreground">Verified:</strong> <span className="text-muted-foreground">{viewContact?.isVerified ? 'Yes' : 'No'}</span></p>
                  {viewContact?.rejectionReason && (
                    <p className="text-sm"><strong className="text-foreground">Rejection Reason:</strong> <span className="text-muted-foreground">{viewContact.rejectionReason}</span></p>
                  )}
                </div>

                {/* Documents Section */}
                {(viewContact?.passportPhoto || viewContact?.idCard || viewContact?.educationalCertificate || viewContact?.experienceDocument || (viewContact?.serviceDocuments && Array.isArray(viewContact.serviceDocuments) && viewContact.serviceDocuments.length > 0) || (viewContact?.otherDocuments && Array.isArray(viewContact.otherDocuments) && viewContact.otherDocuments.length > 0)) && (
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h5 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Documents
                    </h5>
                    <div className="space-y-4">
                      {/* Passport Photo */}
                      {viewContact?.passportPhoto && (
                        <div className="document-item">
                          <div className="flex items-start gap-3">
                            <div className="document-icon-wrapper">
                              <ImageIcon className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-foreground mb-1">Passport Photo</div>
                              <div className="mt-2">
                                <img 
                                  src={viewContact.passportPhoto} 
                                  alt="Passport Photo" 
                                  className="max-w-[200px] rounded-lg border border-border shadow-sm"
                                />
                              </div>
                            </div>
                            <a
                              href={viewContact.passportPhoto}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="document-action-btn"
                              title="View Full Size"
                            >
                              <Download className="w-4 h-4" />
                            </a>
                          </div>
                        </div>
                      )}

                      {/* ID Card */}
                      {viewContact?.idCard && (
                        <div className="document-item">
                          <div className="flex items-start gap-3">
                            <div className="document-icon-wrapper">
                              <FileText className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-foreground mb-1">ID Card</div>
                              <div className="text-sm text-muted-foreground">Government issued identification card</div>
                            </div>
                            <a
                              href={viewContact.idCard}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="document-action-btn"
                              title="View Document"
                            >
                              <Download className="w-4 h-4" />
                            </a>
                          </div>
                        </div>
                      )}

                      {/* Educational Certificate */}
                      {viewContact?.educationalCertificate && (
                        <div className="document-item">
                          <div className="flex items-start gap-3">
                            <div className="document-icon-wrapper">
                              <FileText className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-foreground mb-1">Educational Certificate</div>
                              <div className="text-sm text-muted-foreground">Relevant educational qualifications</div>
                            </div>
                            <a
                              href={viewContact.educationalCertificate}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="document-action-btn"
                              title="View Document"
                            >
                              <Download className="w-4 h-4" />
                            </a>
                          </div>
                        </div>
                      )}

                      {/* Experience Document */}
                      {viewContact?.experienceDocument && (
                        <div className="document-item">
                          <div className="flex items-start gap-3">
                            <div className="document-icon-wrapper">
                              <FileText className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-foreground mb-1">Experience Document</div>
                              <div className="text-sm text-muted-foreground">Documents proving work experience</div>
                            </div>
                            <a
                              href={viewContact.experienceDocument}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="document-action-btn"
                              title="View Document"
                            >
                              <Download className="w-4 h-4" />
                            </a>
                          </div>
                        </div>
                      )}

                      {/* Service-Specific Documents */}
                      {viewContact?.serviceDocuments && Array.isArray(viewContact.serviceDocuments) && viewContact.serviceDocuments.length > 0 && (
                        <div className="document-item">
                          <div className="flex items-start gap-3">
                            <div className="document-icon-wrapper">
                              <FileText className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-foreground mb-2">Service-Specific Documents ({viewContact.serviceDocuments.length})</div>
                              <div className="space-y-2">
                                {viewContact.serviceDocuments.map((doc, idx) => {
                                  const serviceInfo = availableServices.find(s => s.key === doc.serviceKey);
                                  return (
                                    <div key={idx} className="flex items-center justify-between p-2 bg-background rounded border border-border">
                                      <div className="flex items-center gap-2 flex-1">
                                        <FileText className="w-4 h-4 text-muted-foreground" />
                                        <div className="flex flex-col">
                                          <span className="text-sm font-medium text-foreground">{doc.documentName}</span>
                                          <span className="text-xs text-muted-foreground">
                                            Service: {serviceInfo ? serviceInfo.label : doc.serviceKey}
                                          </span>
                                        </div>
                                      </div>
                                      <a
                                        href={doc.documentUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="document-action-btn"
                                        title="View Document"
                                      >
                                        <Download className="w-4 h-4" />
                                      </a>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Other Documents */}
                      {viewContact?.otherDocuments && Array.isArray(viewContact.otherDocuments) && viewContact.otherDocuments.length > 0 && (
                        <div className="document-item">
                          <div className="flex items-start gap-3">
                            <div className="document-icon-wrapper">
                              <FileText className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-foreground mb-2">Other Documents ({viewContact.otherDocuments.length})</div>
                              <div className="space-y-2">
                                {viewContact.otherDocuments.map((doc, idx) => (
                                  <div key={idx} className="flex items-center justify-between p-2 bg-background rounded border border-border">
                                    <div className="flex items-center gap-2">
                                      <FileText className="w-4 h-4 text-muted-foreground" />
                                      <span className="text-sm text-foreground">Document {idx + 1}</span>
                                    </div>
                                    <a
                                      href={doc}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="document-action-btn"
                                      title="View Document"
                                    >
                                      <Download className="w-4 h-4" />
                                    </a>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {viewContact?.notes && (
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h5 className="font-semibold text-foreground mb-2">Notes</h5>
                    <p className="text-sm text-muted-foreground">{viewContact.notes}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Edit Contact Modal */}
      <EmergencyContactEditModal
        isOpen={showEditModal}
        onClose={handleEditModalClose}
        contact={editContact}
        onSubmit={handleEditSubmit}
      />

      {/* Services List Modal */}
      {showServiceModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <Card className="max-w-4xl w-full max-h-[90vh] overflow-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Manage Services</CardTitle>
                <div className="flex gap-2">
                  <Button onClick={handleAddService} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Service
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => setShowServiceModal(false)}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Key</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Label</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Order</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {availableServices.map(service => (
                      <tr key={service._id} className="border-b border-border hover:bg-muted/50">
                        <td className="py-3 px-4 text-sm font-mono text-muted-foreground">{service.key}</td>
                        <td className="py-3 px-4 text-sm text-foreground">{service.label}</td>
                        <td className="py-3 px-4 text-sm text-foreground">{service.order || 0}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-md text-xs font-semibold ${service.active ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}>
                            {service.active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditService(service)}
                              className="h-10 w-10 p-0"
                            >
                              <Edit2 className="w-5 h-5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteService(service._id)}
                              className="h-10 w-10 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="w-5 h-5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {availableServices.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    No services found. Click "Add Service" to create one.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Service Form Modal */}
      {showServiceFormModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{editingService ? 'Edit Service' : 'Add Service'}</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => {
                  setShowServiceFormModal(false);
                  setShowServiceModal(true);
                  setEditingService(null);
                  setServiceFormData({ key: '', label: '', active: true, order: 0 });
                }}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleServiceSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Service Key *</label>
                  <input
                    type="text"
                    name="key"
                    value={serviceFormData.key}
                    onChange={handleServiceInputChange}
                    required
                    disabled={!!editingService}
                    className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:ring-2 focus:ring-ring disabled:opacity-50"
                    placeholder="e.g., snake_rescue"
                  />
                  {editingService && (
                    <p className="text-xs text-muted-foreground">Key cannot be changed after creation</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Service Label *</label>
                  <input
                    type="text"
                    name="label"
                    value={serviceFormData.label}
                    onChange={handleServiceInputChange}
                    required
                    className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:ring-2 focus:ring-ring"
                    placeholder="e.g., Snake Rescue"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Order</label>
                    <input
                      type="number"
                      name="order"
                      value={serviceFormData.order}
                      onChange={handleServiceInputChange}
                      className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div className="space-y-2 flex items-center">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="active"
                        checked={serviceFormData.active}
                        onChange={handleServiceInputChange}
                        className="rounded border-input"
                      />
                      <span className="text-sm font-medium text-foreground">Active</span>
                    </label>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Terms & Conditions</label>
                  <textarea
                    name="termsAndConditions"
                    value={serviceFormData.termsAndConditions}
                    onChange={handleServiceInputChange}
                    rows={6}
                    className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:ring-2 focus:ring-ring"
                    placeholder="Enter service-specific Terms & Conditions..."
                  />
                  <p className="text-xs text-muted-foreground">These terms will be shown to users when registering for this service</p>
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="otherDocumentsMandatory"
                      checked={serviceFormData.otherDocumentsMandatory}
                      onChange={handleServiceInputChange}
                      className="rounded border-input"
                    />
                    <span className="text-sm font-medium text-foreground">Other Documents Mandatory</span>
                  </label>
                  <p className="text-xs text-muted-foreground">If checked, users must upload other documents when registering for this service</p>
                </div>

                {/* Required Documents Configuration */}
                <div className="space-y-2 pt-4 border-t">
                  <label className="text-sm font-medium text-foreground">Required Documents</label>
                  <p className="text-xs text-muted-foreground mb-2">Add documents that users must upload for this service</p>
                  {serviceFormData.requiredDocuments && serviceFormData.requiredDocuments.map((doc, idx) => (
                    <div key={idx} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={doc.documentName || ''}
                        onChange={(e) => {
                          const newDocs = [...serviceFormData.requiredDocuments];
                          newDocs[idx] = { ...newDocs[idx], documentName: e.target.value };
                          setServiceFormData(prev => ({ ...prev, requiredDocuments: newDocs }));
                        }}
                        placeholder="Document name"
                        className="flex-1 px-3 py-2 border border-input bg-background rounded-md text-sm"
                      />
                      <label className="flex items-center gap-2 px-3 py-2 border border-input rounded-md cursor-pointer">
                        <input
                          type="checkbox"
                          checked={doc.mandatory || false}
                          onChange={(e) => {
                            const newDocs = [...serviceFormData.requiredDocuments];
                            newDocs[idx] = { ...newDocs[idx], mandatory: e.target.checked };
                            setServiceFormData(prev => ({ ...prev, requiredDocuments: newDocs }));
                          }}
                          className="rounded border-input"
                        />
                        <span className="text-xs">Mandatory</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const newDocs = serviceFormData.requiredDocuments.filter((_, i) => i !== idx);
                          setServiceFormData(prev => ({ ...prev, requiredDocuments: newDocs }));
                        }}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setServiceFormData(prev => ({
                        ...prev,
                        requiredDocuments: [...(prev.requiredDocuments || []), { documentName: '', mandatory: false }]
                      }));
                    }}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    + Add Required Document
                  </button>
                </div>

                {/* Required Fields Configuration */}
                <div className="space-y-2 pt-4 border-t">
                  <label className="text-sm font-medium text-foreground">Required Fields</label>
                  <p className="text-xs text-muted-foreground mb-2">Add custom fields that users must fill for this service</p>
                  {serviceFormData.requiredFields && serviceFormData.requiredFields.map((field, idx) => (
                    <div key={idx} className="border p-3 rounded-md mb-2 space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={field.fieldName || ''}
                          onChange={(e) => {
                            const newFields = [...serviceFormData.requiredFields];
                            newFields[idx] = { ...newFields[idx], fieldName: e.target.value };
                            setServiceFormData(prev => ({ ...prev, requiredFields: newFields }));
                          }}
                          placeholder="Field name (e.g., license_number)"
                          className="px-3 py-2 border border-input bg-background rounded-md text-sm"
                        />
                        <select
                          value={field.fieldType || 'text'}
                          onChange={(e) => {
                            const newFields = [...serviceFormData.requiredFields];
                            newFields[idx] = { ...newFields[idx], fieldType: e.target.value };
                            setServiceFormData(prev => ({ ...prev, requiredFields: newFields }));
                          }}
                          className="px-3 py-2 border border-input bg-background rounded-md text-sm"
                        >
                          <option value="text">Text</option>
                          <option value="number">Number</option>
                          <option value="email">Email</option>
                          <option value="tel">Phone</option>
                          <option value="textarea">Textarea</option>
                          <option value="select">Select</option>
                          <option value="file">File</option>
                          <option value="checkbox">Checkbox</option>
                        </select>
                      </div>
                      <input
                        type="text"
                        value={field.label || ''}
                        onChange={(e) => {
                          const newFields = [...serviceFormData.requiredFields];
                          newFields[idx] = { ...newFields[idx], label: e.target.value };
                          setServiceFormData(prev => ({ ...prev, requiredFields: newFields }));
                        }}
                        placeholder="Field label (e.g., License Number)"
                        className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                      />
                      {field.fieldType === 'select' && (
                        <input
                          type="text"
                          value={field.options ? field.options.join(', ') : ''}
                          onChange={(e) => {
                            const newFields = [...serviceFormData.requiredFields];
                            newFields[idx] = { ...newFields[idx], options: e.target.value.split(',').map(s => s.trim()).filter(s => s) };
                            setServiceFormData(prev => ({ ...prev, requiredFields: newFields }));
                          }}
                          placeholder="Options (comma-separated)"
                          className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                        />
                      )}
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={field.required || false}
                            onChange={(e) => {
                              const newFields = [...serviceFormData.requiredFields];
                              newFields[idx] = { ...newFields[idx], required: e.target.checked };
                              setServiceFormData(prev => ({ ...prev, requiredFields: newFields }));
                            }}
                            className="rounded border-input"
                          />
                          <span className="text-xs">Required</span>
                        </label>
                        <input
                          type="text"
                          value={field.placeholder || ''}
                          onChange={(e) => {
                            const newFields = [...serviceFormData.requiredFields];
                            newFields[idx] = { ...newFields[idx], placeholder: e.target.value };
                            setServiceFormData(prev => ({ ...prev, requiredFields: newFields }));
                          }}
                          placeholder="Placeholder text"
                          className="flex-1 px-3 py-2 border border-input bg-background rounded-md text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newFields = serviceFormData.requiredFields.filter((_, i) => i !== idx);
                            setServiceFormData(prev => ({ ...prev, requiredFields: newFields }));
                          }}
                          className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setServiceFormData(prev => ({
                        ...prev,
                        requiredFields: [...(prev.requiredFields || []), { fieldName: '', fieldType: 'text', label: '', required: false, options: [] }]
                      }));
                    }}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    + Add Required Field
                  </button>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button type="submit" className="flex-1">
                    {editingService ? 'Update Service' : 'Add Service'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowServiceFormModal(false);
                      setShowServiceModal(true);
                      setEditingService(null);
                      setServiceFormData({ 
                        key: '', 
                        label: '', 
                        active: true, 
                        order: 0,
                        termsAndConditions: '',
                        requiredFields: [],
                        requiredDocuments: [],
                        otherDocumentsMandatory: false
                      });
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default EmergencyContactManagement;
