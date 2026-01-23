import React, { useState, useEffect } from 'react';
import authService from '../services/authService';
import { User, Mail, Phone, Shield, Edit2, Save, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import ImageLoader from './ImageLoader';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', mobileNumber: '', password: '' });
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await authService.getCurrentUser();
        setUserData(userResponse);
        setForm({
          name: userResponse?.name || '',
          email: userResponse?.email || '',
          mobileNumber: userResponse?.mobileNumber || '',
          password: ''
        });
      } catch (err) {
        setError('Failed to fetch profile data');
        console.error('Error fetching profile data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleEdit = () => {
    setEditMode(true);
    setSuccess('');
    setError(null);
  };

  const handleCancel = () => {
    setEditMode(false);
    setForm({
      name: userData?.name || '',
      email: userData?.email || '',
      mobileNumber: userData?.mobileNumber || '',
      password: ''
    });
    setSuccess('');
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updateData = { ...form };
      if (!updateData.password) delete updateData.password;
      const updated = await authService.updateProfile(updateData);
      setUserData(updated);
      setEditMode(false);
      setSuccess('Profile updated successfully!');
      setError(null);
    } catch (err) {
      setError('Failed to update profile');
      setSuccess('');
    }
  };

  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8 px-6 flex items-center justify-center">
        <div className="max-w-[1280px] mx-auto text-center">
          <ImageLoader size={120} text="Loading profile..." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-16 md:py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Profile</h1>
          <p className="text-muted-foreground">Manage your account information</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>User Details</CardTitle>
              {!editMode && (
                <Button variant="outline" onClick={handleEdit}>
                  <Edit2 className="mr-2 w-4 h-4" />
                  Edit Profile
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-6 p-4 rounded-md bg-destructive/10 border border-destructive/20 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 rounded-md bg-secondary/10 border border-secondary/20 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0" />
                <p className="text-sm text-secondary">{success}</p>
              </div>
            )}

            <div className="flex flex-col items-center mb-8">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-3xl font-bold text-primary">
                  {getInitials(userData?.name)}
                </span>
              </div>
            </div>

            {editMode ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                    Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <input
                      name="name"
                      id="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-2 border border-input bg-background rounded-md focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <input
                      name="email"
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-2 border border-input bg-background rounded-md focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="mobileNumber" className="block text-sm font-medium text-foreground mb-2">
                    Mobile Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <input
                      name="mobileNumber"
                      id="mobileNumber"
                      value={form.mobileNumber}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-2 border border-input bg-background rounded-md focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                    New Password (optional)
                  </label>
                  <input
                    name="password"
                    id="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Leave blank to keep unchanged"
                    className="w-full px-4 py-2 border border-input bg-background rounded-md focus:ring-2 focus:ring-ring"
                  />
                </div>

                <div className="flex gap-4">
                  <Button type="submit">
                    <Save className="mr-2 w-4 h-4" />
                    Save Changes
                  </Button>
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    <X className="mr-2 w-4 h-4" />
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/30">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-semibold text-foreground">{userData?.name || '-'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/30">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-semibold text-foreground">{userData?.email || '-'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/30">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Mobile Number</p>
                    <p className="font-semibold text-foreground">{userData?.mobileNumber || '-'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/30">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Role</p>
                    <p className="font-semibold text-foreground capitalize">{userData?.role || 'User'}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
