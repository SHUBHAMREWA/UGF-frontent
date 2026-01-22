import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Linkedin, Twitter, CheckCircle2, XCircle } from 'lucide-react';
import api from '../utils/api';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus(null);
    setLoading(true);
    try {
      await api.post('/contact', formData, {
        headers: {
          Authorization: localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : undefined
        }
      });
      setFormStatus('success');
      setTimeout(() => {
        setFormStatus(null);
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      }, 3000);
    } catch (err) {
      setFormStatus('error');
    } finally {
      setLoading(false);
    }
  };

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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Get In Touch</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg flex items-center justify-center bg-primary/10 flex-shrink-0">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Address</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Main road Jafrabad Near Dawargaon Fata Behind Sn properties group Tembhurni, Jalna Maharashtra 431208
                  </p>
                  <a 
                    href="https://maps.app.goo.gl/M8d6sXVdNPuJExzv7" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    View on Map
                  </a>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg flex items-center justify-center bg-primary/10 flex-shrink-0">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Phone</h3>
                  <a href="tel:+917570708992" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    +91 7570708992
                  </a>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg flex items-center justify-center bg-primary/10 flex-shrink-0">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Email</h3>
                  <div className="space-y-1">
                    <a 
                      href="mailto:unitedglobalfederationoffice@gmail.com" 
                      className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      unitedglobalfederationoffice@gmail.com
                    </a>
                    <a 
                      href="mailto:unitedglobalfederation@org.com" 
                      className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      unitedglobalfederation@org.com
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg flex items-center justify-center bg-primary/10 flex-shrink-0">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Office Hours</h3>
                  <p className="text-sm text-muted-foreground">9 am to 7 pm</p>
                </div>
              </div>

              <div className="pt-6 border-t border-border">
                <h3 className="font-semibold text-foreground mb-4">Connect With Us</h3>
                <div className="flex items-center gap-3">
                  <a 
                    href="https://www.facebook.com/share/17RycVv5j2/" 
                    className="h-10 w-10 rounded-lg bg-card border border-border flex items-center justify-center hover:bg-accent hover:border-primary transition-colors"
                    aria-label="Facebook"
                  >
                    <Facebook className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                  </a>
                  <a 
                    href="https://www.instagram.com/unitedglobalfederation?igsh=bTltYXo2anQ0dXg0" 
                    className="h-10 w-10 rounded-lg bg-card border border-border flex items-center justify-center hover:bg-accent hover:border-primary transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                  </a>
                  <a 
                    href="https://www.linkedin.com/company/mansparshi-aashas-sewa-sanstha/" 
                    className="h-10 w-10 rounded-lg bg-card border border-border flex items-center justify-center hover:bg-accent hover:border-primary transition-colors"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                  </a>
                  <a 
                    href="#" 
                    className="h-10 w-10 rounded-lg bg-card border border-border flex items-center justify-center hover:bg-accent hover:border-primary transition-colors"
                    aria-label="Twitter"
                  >
                    <Twitter className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Send Us a Message</CardTitle>
            </CardHeader>
            <CardContent>
              {formStatus === 'success' ? (
                <div className="text-center py-12">
                  <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">Message Sent!</h3>
                  <p className="text-muted-foreground">We'll get back to you as soon as possible.</p>
                </div>
              ) : formStatus === 'error' ? (
                <div className="text-center py-12">
                  <XCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">Failed to send message.</h3>
                  <p className="text-muted-foreground">Please try again later.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Enter your name"
                        className="w-full px-4 py-2 border border-input bg-background rounded-md focus:ring-2 focus:ring-ring focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                        Your Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="Enter your email"
                        className="w-full px-4 py-2 border border-input bg-background rounded-md focus:ring-2 focus:ring-ring focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder="Enter subject"
                      className="w-full px-4 py-2 border border-input bg-background rounded-md focus:ring-2 focus:ring-ring focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      placeholder="Enter your message"
                      rows="5"
                      className="w-full px-4 py-2 border border-input bg-background rounded-md focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                    ></textarea>
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="overflow-hidden">
          <div className="h-96 w-full">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3753.1907243051236!2d76.0!3d19.8!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDQ4JzAwLjAiTiA3NsKwMDAnMDAuMCJF!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="United Global Federation India Location"
            ></iframe>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ContactUs;
