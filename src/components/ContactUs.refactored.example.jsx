/**
 * EXAMPLE: Refactored ContactUs component using new hooks and utilities
 * This demonstrates how to use the new architecture
 */
import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useForm } from '../hooks/useForm';
import { useApi } from '../hooks/useApi';
import { useValidation, validators } from '../hooks/useValidation';
import { API_ENDPOINTS } from '../constants';
import { FormField, FormTextarea } from './common';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import api from '../utils/api';

const ContactUs = () => {
  // Define validation rules
  const validationRules = {
    name: [validators.required('Name is required')],
    email: [
      validators.required('Email is required'),
      validators.email('Invalid email format')
    ],
    subject: [validators.required('Subject is required')],
    message: [
      validators.required('Message is required'),
      validators.minLength(10, 'Message must be at least 10 characters')
    ]
  };

  const { validate } = useValidation(validationRules);

  // API call hook
  const { execute: submitContact, loading, error: apiError } = useApi(
    async (data) => {
      const response = await api.post(API_ENDPOINTS.CONTACT, data);
      return response.data;
    }
  );

  // Form hook
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    reset
  } = useForm(
    {
      name: '',
      email: '',
      subject: '',
      message: ''
    },
    async (formValues) => {
      const result = await submitContact(formValues);
      if (result.success) {
        reset();
        // Show success message
      }
    },
    validate
  );

  return (
    <div className="min-h-screen bg-background py-8 px-6">
      <div className="max-w-[1280px] mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            We'd love to hear from you. Reach out to us with any questions or inquiries.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Get in Touch</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-1" />
                <div>
                  <p className="font-semibold">Address</p>
                  <p className="text-sm text-muted-foreground">
                    Main road Jafrabad Near Dawargaon Fata,<br />
                    Behind Sn properties group Tembhurni,<br />
                    Jalna Maharashtra 431208
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary" />
                <a href="tel:+917570708992" className="text-sm hover:text-primary">
                  +91 7570708992
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary" />
                <a href="mailto:unitedglobalfederationoffice@gmail.com" className="text-sm hover:text-primary">
                  unitedglobalfederationoffice@gmail.com
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>Send us a Message</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <FormField
                  label="Name"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.name}
                  touched={touched.name}
                  required
                />

                <FormField
                  label="Email"
                  name="email"
                  type="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.email}
                  touched={touched.email}
                  required
                />

                <FormField
                  label="Subject"
                  name="subject"
                  value={values.subject}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.subject}
                  touched={touched.subject}
                  required
                />

                <FormTextarea
                  label="Message"
                  name="message"
                  value={values.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.message}
                  touched={touched.message}
                  rows={5}
                  required
                />

                {apiError && (
                  <p className="text-sm text-destructive">{apiError}</p>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;

