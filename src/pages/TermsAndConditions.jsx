import React from 'react';
import { motion } from 'framer-motion';
import { FaFileContract, FaCheckCircle } from 'react-icons/fa';

const TermsAndConditions = () => {
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
              <FaFileContract className="text-white text-2xl" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent mb-4">
              Terms and Conditions
            </h1>
            <p className="text-gray-600">Last Updated: January 2024</p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
            
            {/* Section 1 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaCheckCircle className="text-primary-600" />
                1. Acceptance of Terms
              </h2>
              <p className="text-gray-600 leading-relaxed">
                By accessing and using United Global Federation India's donation platform, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, please do not use our services.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaCheckCircle className="text-primary-600" />
                2. Donation Guidelines
              </h2>
              <div className="space-y-3 text-gray-600">
                <p className="leading-relaxed">
                  <strong className="text-gray-800">2.1 Voluntary Donations:</strong> All donations made through our platform are voluntary and non-refundable unless otherwise specified.
                </p>
                <p className="leading-relaxed">
                  <strong className="text-gray-800">2.2 Use of Funds:</strong> Donations will be used for charitable purposes as described in our mission statement and specific campaign descriptions.
                </p>
                <p className="leading-relaxed">
                  <strong className="text-gray-800">2.3 Tax Receipts:</strong> Tax-deductible receipts will be provided for eligible donations as per Indian tax laws (Section 80G).
                </p>
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaCheckCircle className="text-primary-600" />
                3. User Responsibilities
              </h2>
              <div className="space-y-3 text-gray-600">
                <p className="leading-relaxed">
                  <strong className="text-gray-800">3.1 Accurate Information:</strong> You agree to provide accurate and complete information when making donations.
                </p>
                <p className="leading-relaxed">
                  <strong className="text-gray-800">3.2 Account Security:</strong> You are responsible for maintaining the confidentiality of your account credentials.
                </p>
                <p className="leading-relaxed">
                  <strong className="text-gray-800">3.3 Prohibited Activities:</strong> Users must not engage in fraudulent activities, misuse the platform, or attempt to disrupt our services.
                </p>
              </div>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaCheckCircle className="text-primary-600" />
                4. Payment Processing
              </h2>
              <div className="space-y-3 text-gray-600">
                <p className="leading-relaxed">
                  We use secure third-party payment processors to handle donations. By making a donation, you agree to the terms and conditions of these payment processors.
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>All transactions are encrypted and secure</li>
                  <li>Payment information is not stored on our servers</li>
                  <li>Transaction fees may apply based on payment method</li>
                </ul>
              </div>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaCheckCircle className="text-primary-600" />
                5. Transparency and Reporting
              </h2>
              <p className="text-gray-600 leading-relaxed">
                United Global Federation India is committed to transparency. We provide regular updates on how donations are utilized through our website, newsletters, and annual reports. Donors have the right to request information about specific campaigns they have supported.
              </p>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaCheckCircle className="text-primary-600" />
                6. Intellectual Property
              </h2>
              <p className="text-gray-600 leading-relaxed">
                All content on this website, including text, images, logos, and software, is the property of United Global Federation India and is protected by copyright and intellectual property laws. Unauthorized use is prohibited.
              </p>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaCheckCircle className="text-primary-600" />
                7. Limitation of Liability
              </h2>
              <p className="text-gray-600 leading-relaxed">
                United Global Federation India shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our services or inability to access the platform. We strive to ensure all information is accurate but do not guarantee the availability or accuracy of our services at all times.
              </p>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaCheckCircle className="text-primary-600" />
                8. Modification of Terms
              </h2>
              <p className="text-gray-600 leading-relaxed">
                United Global Federation India reserves the right to modify these terms and conditions at any time. Users will be notified of significant changes via email or website announcement. Continued use of the platform after modifications constitutes acceptance of the updated terms.
              </p>
            </section>

            {/* Section 9 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaCheckCircle className="text-primary-600" />
                9. Governing Law
              </h2>
              <p className="text-gray-600 leading-relaxed">
                These terms and conditions are governed by the laws of India. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts in Jalna, Maharashtra.
              </p>
            </section>

            {/* Section 10 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaCheckCircle className="text-primary-600" />
                10. Contact Information
              </h2>
              <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg p-6">
                <p className="text-gray-700 mb-3">
                  If you have any questions about these Terms and Conditions, please contact us:
                </p>
                <div className="space-y-2 text-gray-700">
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

export default TermsAndConditions;
