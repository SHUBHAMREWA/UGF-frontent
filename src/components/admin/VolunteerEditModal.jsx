import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import './VolunteerEditModal.css';

const VolunteerEditModal = ({ isOpen, onClose, volunteer, onSubmit }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    gender: '',
    contactNumber: '',
    email: '',
    address: '',
    district: '',
    areasOfInterest: [],
    skills: [],
    previousExperience: '',
    motivation: '',
    goals: '',
    emergencyContact: {
      name: '',
      relationship: '',
      contactNumber: ''
    }
  });

  const [newInterest, setNewInterest] = useState('');
  const [newSkill, setNewSkill] = useState('');

  const maharashtraDistricts = [
    'Ahmednagar', 'Akola', 'Amravati', 'Aurangabad', 'Beed', 'Bhandara', 
    'Buldhana', 'Chandrapur', 'Dhule', 'Gadchiroli', 'Gondia', 'Hingoli', 
    'Jalgaon', 'Jalna', 'Kolhapur', 'Latur', 'Mumbai City', 'Mumbai Suburban', 
    'Nagpur', 'Nanded', 'Nandurbar', 'Nashik', 'Osmanabad', 'Palghar', 'Parbhani', 
    'Pune', 'Raigad', 'Ratnagiri', 'Sangli', 'Satara', 'Sindhudurg', 'Solapur', 
    'Thane', 'Wardha', 'Washim', 'Yavatmal'
  ];

  const availableAreasOfInterest = [
    'Education', 'Healthcare', 'Environment', 'Animal Welfare', 'Community Development',
    'Women Empowerment', 'Child Welfare', 'Elderly Care', 'Disaster Relief', 'Blood Donation',
    'Mental Health', 'Rural Development', 'Urban Development', 'Sports', 'Arts & Culture',
    'Technology', 'Agriculture', 'Water Conservation', 'Waste Management', 'Other'
  ];

  const availableSkills = [
    'Teaching', 'Medical', 'Counseling', 'Event Management', 'Fundraising',
    'Social Media', 'Photography', 'Videography', 'Content Writing', 'Translation',
    'Driving', 'Cooking', 'First Aid', 'Computer Skills', 'Language Skills',
    'Leadership', 'Communication', 'Problem Solving', 'Team Work', 'Other'
  ];

  useEffect(() => {
    if (volunteer) {
      setFormData({
        fullName: volunteer.fullName || '',
        age: volunteer.age || '',
        gender: volunteer.gender || '',
        contactNumber: volunteer.contactNumber || '',
        email: volunteer.email || '',
        address: volunteer.address || '',
        district: volunteer.district || '',
        areasOfInterest: volunteer.areasOfInterest || [],
        skills: volunteer.skills || [],
        previousExperience: volunteer.previousExperience || '',
        motivation: volunteer.motivation || '',
        goals: volunteer.goals || '',
        emergencyContact: {
          name: volunteer.emergencyContact?.name || '',
          relationship: volunteer.emergencyContact?.relationship || '',
          contactNumber: volunteer.emergencyContact?.contactNumber || ''
        }
      });
    }
  }, [volunteer]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAddInterest = () => {
    if (newInterest.trim() && !formData.areasOfInterest.includes(newInterest.trim())) {
      setFormData(prev => ({
        ...prev,
        areasOfInterest: [...prev.areasOfInterest, newInterest.trim()]
      }));
      setNewInterest('');
    }
  };

  const handleRemoveInterest = (interest) => {
    setFormData(prev => ({
      ...prev,
      areasOfInterest: prev.areasOfInterest.filter(i => i !== interest)
    }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skill) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="volunteer-edit-modal-overlay">
      <div className="volunteer-edit-modal">
        <div className="modal-header">
          <h2>Edit Volunteer</h2>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="edit-form">
          <div className="form-section">
            <h3>Personal Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Age *</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  required
                  min="16"
                  max="100"
                />
              </div>
              <div className="form-group">
                <label>Gender</label>
                <select name="gender" value={formData.gender} onChange={handleInputChange}>
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-row">
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
              <div className="form-group">
                <label>Contact Number *</label>
                <input
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Address *</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>District *</label>
              <select name="district" value={formData.district} onChange={handleInputChange} required>
                <option value="">Select District</option>
                {maharashtraDistricts.map(district => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-section">
            <h3>Areas of Interest</h3>
            <div className="tags-container">
              {formData.areasOfInterest.map((interest, index) => (
                <span key={index} className="tag">
                  {interest}
                  <button
                    type="button"
                    onClick={() => handleRemoveInterest(interest)}
                    className="remove-tag"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="add-tag-container">
              <select
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                className="tag-select"
              >
                <option value="">Select Area of Interest</option>
                {availableAreasOfInterest.map(interest => (
                  <option key={interest} value={interest}>{interest}</option>
                ))}
              </select>
              <button type="button" onClick={handleAddInterest} className="add-tag-btn">
                Add
              </button>
            </div>
          </div>

          <div className="form-section">
            <h3>Skills</h3>
            <div className="tags-container">
              {formData.skills.map((skill, index) => (
                <span key={index} className="tag">
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="remove-tag"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="add-tag-container">
              <select
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                className="tag-select"
              >
                <option value="">Select Skill</option>
                {availableSkills.map(skill => (
                  <option key={skill} value={skill}>{skill}</option>
                ))}
              </select>
              <button type="button" onClick={handleAddSkill} className="add-tag-btn">
                Add
              </button>
            </div>
          </div>

          <div className="form-section">
            <h3>Experience & Motivation</h3>
            <div className="form-group">
              <label>Previous Experience</label>
              <textarea
                name="previousExperience"
                value={formData.previousExperience}
                onChange={handleInputChange}
                rows="3"
                placeholder="Describe any previous volunteer or relevant experience..."
              />
            </div>
            <div className="form-group">
              <label>Motivation *</label>
              <textarea
                name="motivation"
                value={formData.motivation}
                onChange={handleInputChange}
                required
                rows="3"
                placeholder="Why do you want to volunteer with us?"
              />
            </div>
            <div className="form-group">
              <label>Goals</label>
              <textarea
                name="goals"
                value={formData.goals}
                onChange={handleInputChange}
                rows="3"
                placeholder="What do you hope to achieve through volunteering?"
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Emergency Contact</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  name="emergencyContact.name"
                  value={formData.emergencyContact.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Relationship</label>
                <input
                  type="text"
                  name="emergencyContact.relationship"
                  value={formData.emergencyContact.relationship}
                  onChange={handleInputChange}
                  placeholder="e.g., Parent, Spouse, Friend"
                />
              </div>
            </div>
            <div className="form-group">
              <label>Contact Number *</label>
              <input
                type="tel"
                name="emergencyContact.contactNumber"
                value={formData.emergencyContact.contactNumber}
                onChange={handleInputChange}
                required
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

export default VolunteerEditModal; 