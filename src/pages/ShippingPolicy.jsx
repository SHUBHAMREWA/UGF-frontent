import React from 'react';
import { motion } from 'framer-motion';
import { FaTruck, FaGift, FaInfoCircle } from 'react-icons/fa';

const ShippingPolicy = () => {
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
              <FaTruck className="text-white text-2xl" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent mb-4">
              Shipping & Delivery Policy
            </h1>
            <p className="text-gray-600">For Donation Receipts & Donor Recognition Items</p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
            
            {/* Important Notice */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6 border-l-4 border-primary-500">
              <div className="flex items-start gap-3">
                <FaInfoCircle className="text-primary-600 text-xl flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">Important Notice</h3>
                  <p className="text-gray-700 leading-relaxed">
                    United Global Federation India is a charitable organization. We do not sell products. This shipping policy applies to donation receipts, thank you gifts, and donor recognition items that may be sent to our valued donors.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 1 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaGift className="text-primary-600" />
                1. Digital Donation Receipts
              </h2>
              <div className="space-y-3 text-gray-600">
                <p className="leading-relaxed">
                  <strong className="text-gray-800">Instant Digital Delivery:</strong> Upon successful donation, you will receive an instant email confirmation with your digital donation receipt. This receipt is valid for tax deduction purposes under Section 80G of the Income Tax Act.
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Receipts are sent to your registered email address immediately</li>
                  <li>Check your spam/junk folder if you don't receive it within 5 minutes</li>
                  <li>You can download receipts from your donor dashboard anytime</li>
                  <li>Digital receipts are environmentally friendly and convenient</li>
                </ul>
              </div>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                2. Physical Donation Receipts
              </h2>
              <div className="space-y-4 text-gray-600">
                <p className="leading-relaxed">
                  If you require a physical copy of your donation receipt:
                </p>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <p><strong className="text-gray-800">Processing Time:</strong> 2-3 business days</p>
                  <p><strong className="text-gray-800">Delivery Time:</strong> 5-10 business days within India</p>
                  <p><strong className="text-gray-800">Shipping Method:</strong> India Post / Speed Post</p>
                  <p><strong className="text-gray-800">Cost:</strong> Free of charge for all donors</p>
                </div>
                <p className="leading-relaxed text-sm italic">
                  Note: Physical receipts are sent only upon request. Please contact us at unitedglobalfederationoffice@gmail.com with your donation reference number.
                </p>
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                3. Thank You Gifts & Appreciation Items
              </h2>
              <div className="space-y-4 text-gray-600">
                <p className="leading-relaxed">
                  For donations above ₹10,000, we may send small tokens of appreciation as a gesture of gratitude:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Certificate of appreciation</li>
                  <li>United Global Federation India branded merchandise (for major donors)</li>
                  <li>Annual impact reports</li>
                  <li>Personalized thank you letters</li>
                </ul>
                <div className="bg-gray-50 rounded-lg p-4 mt-4">
                  <p><strong className="text-gray-800">Delivery Timeline:</strong> 15-20 business days</p>
                  <p><strong className="text-gray-800">Tracking:</strong> Tracking information will be shared via email</p>
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                4. Shipping Locations
              </h2>
              <div className="space-y-3 text-gray-600">
                <p className="leading-relaxed">
                  <strong className="text-gray-800">Domestic Shipping (India):</strong>
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>We ship to all states and union territories in India</li>
                  <li>Remote areas may require additional delivery time</li>
                  <li>PO Box addresses are not accepted for courier deliveries</li>
                </ul>
                
                <p className="leading-relaxed mt-4">
                  <strong className="text-gray-800">International Shipping:</strong>
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Digital receipts are available globally</li>
                  <li>Physical items can be sent internationally upon request</li>
                  <li>International shipping may take 20-30 business days</li>
                  <li>Customs duties and taxes are the recipient's responsibility</li>
                </ul>
              </div>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                5. Address Verification
              </h2>
              <div className="bg-yellow-50 rounded-lg p-6 border-l-4 border-yellow-400">
                <p className="text-gray-700 leading-relaxed mb-3">
                  <strong className="text-gray-800">Important:</strong> Please ensure your shipping address is complete and accurate:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
                  <li>Include full name and contact number</li>
                  <li>Provide complete address with landmark</li>
                  <li>Mention correct pincode</li>
                  <li>Update your address in your donor profile</li>
                </ul>
                <p className="text-gray-700 mt-3 text-sm italic">
                  We are not responsible for delivery failures due to incorrect addresses provided by donors.
                </p>
              </div>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                6. Damaged or Lost Items
              </h2>
              <div className="space-y-3 text-gray-600">
                <p className="leading-relaxed">
                  If you receive a damaged item or if your shipment is lost:
                </p>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>Contact us within 7 days of expected delivery</li>
                  <li>Provide your donation reference number and order details</li>
                  <li>Share photos of damaged items (if applicable)</li>
                  <li>We will arrange for a replacement at no additional cost</li>
                </ol>
                <p className="leading-relaxed text-sm bg-gray-50 rounded p-4 mt-4">
                  <strong className="text-gray-800">Note:</strong> Since our items are complimentary appreciation gifts, we do not offer refunds. However, we will make every effort to resolve any shipping issues.
                </p>
              </div>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                7. Tracking Your Shipment
              </h2>
              <div className="space-y-3 text-gray-600">
                <p className="leading-relaxed">
                  For physical shipments, you will receive:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Shipment confirmation email with tracking number</li>
                  <li>Updates on shipping status</li>
                  <li>Expected delivery date</li>
                  <li>Delivery confirmation</li>
                </ul>
                <p className="leading-relaxed mt-4">
                  You can track your shipment using the tracking number provided in your email or by logging into your donor dashboard.
                </p>
              </div>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                8. Contact for Shipping Queries
              </h2>
              <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg p-6">
                <p className="text-gray-700 mb-4">
                  For any questions regarding shipping and delivery, please contact us:
                </p>
                <div className="space-y-2 text-gray-700">
                  <p><strong>Email:</strong> unitedglobalfederationoffice@gmail.com</p>
                  <p><strong>Phone:</strong> +91 757070899</p>
                  <p><strong>WhatsApp:</strong> +91 757070899</p>
                  <p><strong>Address:</strong> Main road Jafrabad Near Dawargaon Fata, Behind Sn properties group Tembhurni, Jalna Maharashtra 431208</p>
                </div>
                <p className="text-gray-700 mt-4 text-sm">
                  Our team will respond to your queries within 24-48 hours during business days.
                </p>
              </div>
            </section>

            {/* Eco-Friendly Note */}
            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-6 border-l-4 border-green-500">
              <div className="flex items-start gap-3">
                <div className="text-2xl">🌱</div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">Our Commitment to Environment</h3>
                  <p className="text-gray-700 leading-relaxed">
                    We encourage all donors to opt for digital receipts to reduce paper waste and our carbon footprint. Every digital receipt helps us save resources that can be directed towards our charitable causes.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ShippingPolicy;
