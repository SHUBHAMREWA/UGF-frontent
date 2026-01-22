import React from 'react';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaLock, FaUserShield } from 'react-icons/fa';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full mb-4">
              <FaShieldAlt className="text-white text-2xl" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent mb-4">
              Privacy Policy
            </h1>
            <p className="text-gray-600">Last Updated: January 2024</p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
            
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaLock className="text-primary-600" />
                Introduction
              </h2>
              <p className="text-gray-600 leading-relaxed">
                At United Global Federation India, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our donation platform and services.
              </p>
            </section>

            {/* Section 1 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaUserShield className="text-primary-600" />
                1. Information We Collect
              </h2>
              <div className="space-y-4 text-gray-600">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">1.1 Personal Information</h3>
                  <p className="leading-relaxed mb-2">When you make a donation or create an account, we may collect:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Full name and contact details (email, phone number)</li>
                    <li>Billing address and payment information</li>
                    <li>PAN card details (for tax receipts)</li>
                    <li>Date of birth and demographic information (optional)</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">1.2 Transaction Information</h3>
                  <p className="leading-relaxed">
                    We collect information about your donations, including donation amount, date, payment method, and designated cause or campaign.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">1.3 Technical Information</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>IP address and device information</li>
                    <li>Browser type and version</li>
                    <li>Cookies and usage data</li>
                    <li>Access times and referring website addresses</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                2. How We Use Your Information
              </h2>
              <div className="space-y-3 text-gray-600">
                <p className="leading-relaxed">We use the collected information for the following purposes:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong className="text-gray-800">Processing Donations:</strong> To process and manage your charitable contributions</li>
                  <li><strong className="text-gray-800">Tax Receipts:</strong> To generate and send tax-deductible donation receipts</li>
                  <li><strong className="text-gray-800">Communication:</strong> To send updates about campaigns, impact reports, and organizational news</li>
                  <li><strong className="text-gray-800">Account Management:</strong> To create and manage your donor account</li>
                  <li><strong className="text-gray-800">Security:</strong> To prevent fraud and ensure platform security</li>
                  <li><strong className="text-gray-800">Analytics:</strong> To improve our services and user experience</li>
                </ul>
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                3. Information Sharing and Disclosure
              </h2>
              <div className="space-y-3 text-gray-600">
                <p className="leading-relaxed">
                  <strong className="text-gray-800">We do not sell or rent your personal information to third parties.</strong> We may share your information only in the following circumstances:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong className="text-gray-800">Service Providers:</strong> With payment processors and IT service providers who assist in our operations</li>
                  <li><strong className="text-gray-800">Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
                  <li><strong className="text-gray-800">Partner NGOs:</strong> Limited information may be shared with partner organizations for specific campaigns (with your consent)</li>
                  <li><strong className="text-gray-800">Public Recognition:</strong> Donor names may be published with your explicit consent</li>
                </ul>
              </div>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                4. Data Security
              </h2>
              <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-6 space-y-3">
                <p className="text-gray-700 leading-relaxed">
                  We implement industry-standard security measures to protect your information:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
                  <li>SSL/TLS encryption for all data transmission</li>
                  <li>Secure payment gateway integration</li>
                  <li>Regular security audits and updates</li>
                  <li>Access controls and authentication systems</li>
                  <li>Data backup and disaster recovery procedures</li>
                </ul>
              </div>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                5. Your Rights and Choices
              </h2>
              <div className="space-y-3 text-gray-600">
                <p className="leading-relaxed">You have the following rights regarding your personal information:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong className="text-gray-800">Access:</strong> Request access to your personal data we hold</li>
                  <li><strong className="text-gray-800">Correction:</strong> Request correction of inaccurate information</li>
                  <li><strong className="text-gray-800">Deletion:</strong> Request deletion of your data (subject to legal requirements)</li>
                  <li><strong className="text-gray-800">Opt-Out:</strong> Unsubscribe from marketing communications at any time</li>
                  <li><strong className="text-gray-800">Data Portability:</strong> Request a copy of your data in a portable format</li>
                </ul>
              </div>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                6. Cookies and Tracking Technologies
              </h2>
              <p className="text-gray-600 leading-relaxed mb-3">
                We use cookies and similar technologies to enhance your browsing experience. You can control cookies through your browser settings. Our cookies are used for:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-gray-600">
                <li>Maintaining your session and preferences</li>
                <li>Understanding website usage and performance</li>
                <li>Personalizing content and recommendations</li>
                <li>Security and fraud prevention</li>
              </ul>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                7. Data Retention
              </h2>
              <p className="text-gray-600 leading-relaxed">
                We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, comply with legal obligations, resolve disputes, and enforce our agreements. Donation records are retained for a minimum of 7 years as required by Indian tax laws.
              </p>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                8. Children's Privacy
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
              </p>
            </section>

            {/* Section 9 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                9. International Data Transfers
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Your information is primarily stored and processed in India. If data is transferred internationally, we ensure appropriate safeguards are in place to protect your information in accordance with applicable data protection laws.
              </p>
            </section>

            {/* Section 10 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                10. Changes to This Policy
              </h2>
              <p className="text-gray-600 leading-relaxed">
                We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements. We will notify you of significant changes via email or website announcement. Please review this policy regularly to stay informed about how we protect your information.
              </p>
            </section>

            {/* Contact Section */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Contact Us
              </h2>
              <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg p-6">
                <p className="text-gray-700 mb-3">
                  If you have questions or concerns about this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="space-y-2 text-gray-700">
                  <p><strong>Privacy Officer:</strong> United Global Federation India</p>
                  <p><strong>Email:</strong> unitedglobalfederationoffice@gmail.com</p>
                  <p><strong>Phone:</strong> +91 757070899</p>
                  <p><strong>Address:</strong> Main road Jafrabad Near Dawargaon Fata, Behind Sn properties group Tembhurni, Jalna Maharashtra 431208</p>
                </div>
              </div>
            </section>

          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
