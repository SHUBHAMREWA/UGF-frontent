import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Facebook, Twitter, Instagram, Linkedin, Youtube, Phone, Mail, MapPin, ArrowRight, Globe } from 'lucide-react';
import { Card } from './ui/card';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/30 border-t border-border">
      <div className="max-w-[1280px] mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-primary/10">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <span className="text-2xl font-bold text-foreground">United Global Federation India</span>
            </div>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              We are India's most trusted and transparent crowdfunding platform, with a vision to create a social impact. Join us in making a difference.
            </p>
            
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: '₹10L+', label: 'Donations' },
                { value: '1000+', label: 'Donors' },
                { value: '1200+', label: 'NGOs' },
              ].map((stat, index) => (
                <Card key={index} className="p-4 text-center">
                  <div className="text-xl font-bold text-foreground mb-1">{stat.value}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wide">{stat.label}</div>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-6 text-foreground">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { to: '/about', label: 'About Us' },
                { to: '/mission', label: 'Mission' },
                { to: '/vision', label: 'Vision' },
                { to: '/campaigns', label: 'Campaigns' },
                { to: '/programs', label: 'Programs' },
                { to: '/events', label: 'Events' },
                { to: '/blog', label: 'Blog' },
                { to: '/contact', label: 'Contact' },
              ].map((link) => (
                <li key={link.to}>
                  <Link 
                    to={link.to} 
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <ArrowRight className="w-3 h-3" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-6 text-foreground">Support</h4>
            <ul className="space-y-3">
              {[
                { to: '/volunteer-join', label: 'Volunteer' },
                { to: '/sn-arya-mitra', label: 'WAERF' },
                { to: '/donate', label: 'Donate' },
                { to: '/terms', label: 'Terms & Conditions' },
                { to: '/privacy', label: 'Privacy Policy' },
                { to: '/shipping', label: 'Shipping' },
              ].map((link) => (
                <li key={link.to}>
                  <Link 
                    to={link.to} 
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <ArrowRight className="w-3 h-3" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-6 text-foreground">Get in Touch</h4>
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg flex items-center justify-center bg-primary/10 flex-shrink-0">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>Main road Jafrabad Near Dawargaon Fata,</p>
                  <p>Behind Sn properties group Tembhurni,</p>
                  <p>Jalna Maharashtra 431208</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg flex items-center justify-center bg-primary/10 flex-shrink-0">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <a 
                  href="tel:+917570708992" 
                  className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  +91 7570708992
                </a>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg flex items-center justify-center bg-primary/10 flex-shrink-0">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <a 
                  href="mailto:unitedglobalfederationoffice@gmail.com" 
                  className="text-sm font-medium text-foreground hover:text-primary transition-colors break-all"
                >
                  unitedglobalfederationoffice@gmail.com
                </a>
              </div>
            </div>
            
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-foreground">Follow Us</h4>
            <div className="flex items-center gap-3">
              {[
                { href: 'https://www.facebook.com/share/17RycVv5j2/', icon: Facebook, label: 'Facebook' },
                { href: 'https://www.instagram.com/unitedglobalfederation?igsh=bTltYXo2anQ0dXg0', icon: Instagram, label: 'Instagram' },
                { href: '#', icon: Twitter, label: 'Twitter' },
                { href: '#', icon: Youtube, label: 'YouTube' },
                { href: 'https://www.linkedin.com/company/mansparshi-aashas-sewa-sanstha/', icon: Linkedin, label: 'LinkedIn' },
              ].map((social, index) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="h-10 w-10 rounded-lg bg-card border border-border flex items-center justify-center hover:bg-accent hover:border-primary transition-colors"
                  >
                    <IconComponent className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © {currentYear} <span className="font-semibold text-foreground">United Global Federation India</span> | Made with{' '}
              <Heart className="inline w-4 h-4 text-primary" /> in India | All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm flex-wrap justify-center">
              {[
                { to: '/terms', label: 'Terms & Conditions' },
                { to: '/privacy', label: 'Privacy Policy' },
                { to: '/shipping', label: 'Shipping' },
                { to: '/cancellation-refunds', label: 'Cancellation & Refunds' },
              ].map((link) => (
                <Link 
                  key={link.to}
                  to={link.to} 
                  className="text-muted-foreground hover:text-primary transition-colors font-medium"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
