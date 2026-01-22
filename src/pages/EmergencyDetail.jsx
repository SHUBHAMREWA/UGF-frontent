import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import ImageLoader from '../components/ImageLoader';

const labelStyle = { fontWeight: 600, color: '#1a3c34', minWidth: 160, display: 'inline-block' };
const valueStyle = { color: '#222', wordBreak: 'break-word' };
const sectionStyle = { marginBottom: 28, paddingBottom: 16, borderBottom: '1px solid #eee' };

const EmergencyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/emergency-contacts/${id}`)
      .then(res => {
        if (res.data.success) setContact(res.data.contact);
        else setError('Contact not found');
      })
      .catch(() => setError('Failed to fetch contact'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8 px-6 flex items-center justify-center">
        <ImageLoader size={120} text="Loading..." />
      </div>
    );
  }
  if (error) return <div>{error}</div>;
  if (!contact) return <div>No contact found.</div>;

  return (
    <div style={{ maxWidth: 900, margin: '2.5rem auto', background: '#fff', borderRadius: 18, padding: 40, boxShadow: '0 8px 32px rgba(0,0,0,0.10)', minHeight: 600 }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: 24, background: '#f5f5f5', border: 'none', borderRadius: 6, padding: '8px 18px', cursor: 'pointer', fontWeight: 500 }}>&larr; Back</button>
      <h1 style={{ fontSize: 32, marginBottom: 8 }}>{contact.name}</h1>
      <div style={{ color: '#666', marginBottom: 24, fontSize: 18 }}>{contact.work}</div>
      <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap' }}>
        {/* Left: Details */}
        <div style={{ flex: 2, minWidth: 320 }}>
          <div style={sectionStyle}>
            <div style={{ marginBottom: 10 }}><span style={labelStyle}>Email:</span> <span style={valueStyle}>{contact.email || '-'}</span></div>
            <div style={{ marginBottom: 10 }}><span style={labelStyle}>Mobile Number:</span> <span style={valueStyle}>{contact.mobileNumber}</span></div>
            <div style={{ marginBottom: 10 }}><span style={labelStyle}>Secondary Mobile:</span> <span style={valueStyle}>{contact.secondaryMobileNumber || '-'}</span></div>
            <div style={{ marginBottom: 10 }}><span style={labelStyle}>District:</span> <span style={valueStyle}>{contact.district || '-'}</span></div>
            <div style={{ marginBottom: 10 }}><span style={labelStyle}>Taluka:</span> <span style={valueStyle}>{contact.taluka || '-'}</span></div>
            <div style={{ marginBottom: 10 }}><span style={labelStyle}>Pincode:</span> <span style={valueStyle}>{contact.pincode || '-'}</span></div>
            <div style={{ marginBottom: 10 }}><span style={labelStyle}>Location:</span> <span style={valueStyle}>{contact.location || '-'}</span></div>
            <div style={{ marginBottom: 10 }}><span style={labelStyle}>Services:</span> <span style={valueStyle}>{contact.services && contact.services.length ? contact.services.join(', ') : '-'}</span></div>
            <div style={{ marginBottom: 10 }}><span style={labelStyle}>Availability:</span> <span style={valueStyle}>{contact.availability || '-'}</span></div>
            <div style={{ marginBottom: 10 }}><span style={labelStyle}>Status:</span> <span style={valueStyle}>{contact.status || '-'}</span></div>
            <div style={{ marginBottom: 10 }}><span style={labelStyle}>Verified:</span> <span style={valueStyle}>{contact.isVerified ? 'Yes' : 'No'}</span></div>
            <div style={{ marginBottom: 10 }}><span style={labelStyle}>Notes:</span> <span style={valueStyle}>{contact.notes || '-'}</span></div>
          </div>
          <div style={sectionStyle}>
            <div style={{ marginBottom: 10 }}><span style={labelStyle}>Created At:</span> <span style={valueStyle}>{contact.createdAt ? new Date(contact.createdAt).toLocaleString() : '-'}</span></div>
            <div style={{ marginBottom: 10 }}><span style={labelStyle}>Approved At:</span> <span style={valueStyle}>{contact.approvedAt ? new Date(contact.approvedAt).toLocaleString() : '-'}</span></div>
          </div>
        </div>
        {/* Right: Passport Photo */}
        <div style={{ flex: 1, minWidth: 220, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' }}>
          {contact.passportPhoto ? (
            <img src={contact.passportPhoto} alt="Passport" style={{ width: 220, height: 280, objectFit: 'cover', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.10)' }} />
          ) : (
            <div style={{ width: 220, height: 280, background: '#f0f0f0', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', fontSize: 18 }}>
              No Passport Photo
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmergencyDetail; 