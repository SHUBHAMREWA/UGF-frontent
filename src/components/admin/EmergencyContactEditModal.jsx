import React, { useState, useEffect } from 'react';
import { FaTimes, FaTrash, FaCamera, FaImage } from 'react-icons/fa';
import ImageCropper from '../common/ImageCropper';
import api from '../../utils/api';
import './EmergencyContactEditModal.css';

const EmergencyContactEditModal = ({ isOpen, onClose, contact, onSubmit }) => {
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
    active: true,
    notes: ''
  });

  const [newService, setNewService] = useState('');
  const [passportPhoto, setPassportPhoto] = useState(null);
  const [deletePassportPhoto, setDeletePassportPhoto] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);

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

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get('/services/admin');
        if (response.data.success) {
          setAvailableServices(response.data.services);
        }
      } catch (error) {
        console.error('Failed to fetch services:', error);
        // Fallback to empty array
        setAvailableServices([]);
      }
    };
    fetchServices();
  }, []);

  const availabilityOptions = [
    { value: '24x7', label: '24x7' },
    { value: 'day_time', label: 'Day Time' },
    { value: 'night_time', label: 'Night Time' },
    { value: 'weekends', label: 'Weekends' },
    { value: 'on_call', label: 'On Call' }
  ];

  useEffect(() => {
    if (contact) {
      setFormData({
        name: contact.name || '',
        email: contact.email || '',
        mobileNumber: contact.mobileNumber || '',
        services: contact.services || [],
        location: contact.location || '',
        availability: contact.availability || '24x7',
        district: contact.district || '',
        taluka: contact.taluka || '',
        pincode: contact.pincode || '',
        work: contact.work || '',
        secondaryMobileNumber: contact.secondaryMobileNumber || '',
        active: contact.active !== undefined ? contact.active : true,
        notes: contact.notes || ''
      });
      setPhotoPreview(contact.passportPhoto || null);
      setPassportPhoto(null);
      setDeletePassportPhoto(false);
    }
  }, [contact]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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
    if (newService.trim() && !formData.services.includes(newService.trim())) {
      setFormData(prev => ({
        ...prev,
        services: [...prev.services, newService.trim()]
      }));
      setNewService('');
    }
  };

  const handleRemoveCustomService = (serviceToRemove) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter(s => s !== serviceToRemove)
    }));
  };

  const handleDistrictChange = (e) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      district: value,
      taluka: '' // Reset taluka when district changes
    }));
  };

  const handlePhotoCropped = (croppedFile) => {
    setPassportPhoto(croppedFile);
    setDeletePassportPhoto(false);
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result);
    };
    reader.readAsDataURL(croppedFile);
  };

  const handleDeletePhoto = () => {
    setPassportPhoto(null);
    setPhotoPreview(null);
    setDeletePassportPhoto(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // If there's a photo to upload or delete, handle everything here
      if (passportPhoto || deletePassportPhoto) {
        // Create FormData for file upload
        const formDataToSubmit = new FormData();
        
        // Append all form fields
        Object.keys(formData).forEach(key => {
          if (key === 'services') {
            formDataToSubmit.append(key, JSON.stringify(formData[key]));
          } else {
            formDataToSubmit.append(key, formData[key]);
          }
        });

        // Handle photo upload or deletion
        if (passportPhoto) {
          formDataToSubmit.append('passportPhoto', passportPhoto);
        } else if (deletePassportPhoto) {
          formDataToSubmit.append('deletePassportPhoto', 'true');
        }

        // Submit with FormData - backend will upload to Firebase Storage
        await api.put(`/emergency-contacts/admin/${contact._id}`, formDataToSubmit, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        // Call onSubmit to refresh the list (it won't make another API call)
        onSubmit(formData);
      } else {
        // No photo change, use regular form submission
        onSubmit(formData);
      }
    } catch (error) {
      console.error('Error updating contact:', error);
      alert('Failed to update contact. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="emergency-contact-edit-modal-overlay">
      <div className="emergency-contact-edit-modal">
        <div className="modal-header">
          <h2>Edit Emergency Contact</h2>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="edit-form">
          <div className="form-section">
            <h3>Basic Information</h3>
            
            {/* Profile Photo Section */}
            <div className="form-group photo-upload-section">
              <label>Profile Photo</label>
                  <div className="photo-upload-container">
                {photoPreview && !deletePassportPhoto ? (
                  <div className="photo-preview-wrapper">
                    <img src={photoPreview} alt="Profile" className="photo-preview" />
                    <div className="photo-actions">
                      <ImageCropper
                        onImageCropped={handlePhotoCropped}
                        aspectRatio={1}
                        maxWidth={500}
                        maxHeight={500}
                        buttonText="Change Photo"
                      />
                      <button 
                        type="button" 
                        onClick={handleDeletePhoto}
                        className="delete-photo-btn"
                      >
                        <FaTrash />
                        Delete
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="photo-upload-placeholder">
                    <FaImage className="placeholder-icon" />
                    <p>No profile photo</p>
                    <ImageCropper
                      onImageCropped={handlePhotoCropped}
                      aspectRatio={1}
                      maxWidth={500}
                      maxHeight={500}
                      buttonText="Upload Photo"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Name *</label>
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
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
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
                <label>Secondary Mobile Number</label>
                <input
                  type="tel"
                  name="secondaryMobileNumber"
                  value={formData.secondaryMobileNumber}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Work/Profession</label>
              <input
                type="text"
                name="work"
                value={formData.work}
                onChange={handleInputChange}
                placeholder="e.g., Doctor, Teacher, etc."
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Location Details</h3>
            <div className="form-row">
              <div className="form-group">
                <label>District *</label>
                <select name="district" value={formData.district} onChange={handleDistrictChange} required>
                  <option value="">Select District</option>
                  {Object.keys(maharashtraData).map(district => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Taluka *</label>
                <select name="taluka" value={formData.taluka} onChange={handleInputChange} required>
                  <option value="">Select Taluka</option>
                  {formData.district && maharashtraData[formData.district]?.map(taluka => (
                    <option key={taluka} value={taluka}>{taluka}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Pincode *</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  required
                  pattern="[0-9]{6}"
                  title="Please enter a valid 6-digit pincode"
                />
              </div>
              <div className="form-group">
                <label>Location/Area</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g., City area, Village name"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Services & Availability</h3>
            <div className="form-group">
              <label>Services *</label>
              <div className="services-container">
                {availableServices.map(service => (
                  <label key={service.key} className="service-checkbox">
                    <input
                      type="checkbox"
                      checked={formData.services.includes(service.key)}
                      onChange={() => handleServiceChange(service.key)}
                    />
                    {service.label}
                  </label>
                ))}
              </div>
              <div className="custom-service-container">
                <input
                  type="text"
                  value={newService}
                  onChange={(e) => setNewService(e.target.value)}
                  placeholder="Add custom service"
                  className="custom-service-input"
                />
                <button type="button" onClick={handleAddCustomService} className="add-service-btn">
                  Add
                </button>
              </div>
              <div className="selected-services">
                {formData.services.map((service, index) => {
                  const serviceInfo = availableServices.find(s => s.key === service);
                  return (
                    <span key={index} className="service-tag">
                      {serviceInfo ? serviceInfo.label : service}
                      <button
                        type="button"
                        onClick={() => handleRemoveCustomService(service)}
                        className="remove-service"
                      >
                        ×
                      </button>
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="form-group">
              <label>Availability *</label>
              <select name="availability" value={formData.availability} onChange={handleInputChange} required>
                {availabilityOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-section">
            <h3>Status & Notes</h3>
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="active"
                  checked={formData.active}
                  onChange={handleInputChange}
                />
                Active Contact
              </label>
            </div>

            <div className="form-group">
              <label>Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows="3"
                placeholder="Additional notes about this contact..."
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="save-btn">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmergencyContactEditModal; 