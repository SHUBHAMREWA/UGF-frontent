import React from 'react';
import { motion } from 'framer-motion';
import { FaUndo, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';

const CancellationRefunds = () => {
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
              <FaUndo className="text-white text-2xl" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent mb-4">
              Cancellation & Refund Policy
            </h1>
            <p className="text-gray-600">For Charitable Donations</p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
            
            {/* Important Notice */}
            <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg p-6 border-l-4 border-yellow-500">
              <div className="flex items-start gap-3">
                <FaExclamationTriangle className="text-yellow-600 text-xl flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">Important Notice About Donations</h3>
                  <p className="text-gray-700 leading-relaxed">
                    As per Indian charitable donation guidelines and our organizational policy, all donations made to United Global Federation India are considered voluntary contributions and are generally non-refundable. Please read this policy carefully before making a donation.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 1 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaCheckCircle className="text-primary-600" />
                1. General Policy
              </h2>
              <div className="space-y-3 text-gray-600">
                <p className="leading-relaxed">
                  <strong className="text-gray-800">Non-Refundable Nature:</strong> All donations made to United Global Federation India are voluntary charitable contributions and are generally considered final and non-refundable. Once a donation is successfully processed, it is allocated to the designated cause or general fund and cannot be refunded under normal circumstances.
                </p>
                <p className="leading-relaxed">
                  This policy is in place because:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Donations are immediately utilized for charitable purposes</li>
                  <li>Tax receipts are issued which cannot be reversed</li>
                  <li>Administrative costs are incurred in processing donations</li>
                  <li>Funds are allocated to ongoing charitable programs</li>
                </ul>
              </div>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                2. Exceptional Circumstances for Refunds
              </h2>
              <div className="space-y-4 text-gray-600">
                <p className="leading-relaxed">
                  Refunds may be considered in the following exceptional circumstances:
                </p>
                
                <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">2.1 Technical Errors</h3>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Duplicate transactions due to technical glitches</li>
                      <li>Incorrect amount debited due to system error</li>
                      <li>Payment processed but donation not confirmed</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">2.2 Unauthorized Transactions</h3>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Fraudulent transactions on your account</li>
                      <li>Unauthorized use of payment information</li>
                      <li>Identity theft cases (with proper documentation)</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">2.3 Campaign Cancellation</h3>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Specific campaign is cancelled before fund utilization</li>
                      <li>Goal cannot be achieved due to unforeseen circumstances</li>
                      <li>Campaign was found to be fraudulent (rare cases)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                3. Refund Request Process
              </h2>
              <div className="space-y-4 text-gray-600">
                <p className="leading-relaxed">
                  If you believe you qualify for a refund under exceptional circumstances:
                </p>
                
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-800 mb-3">Step-by-Step Process:</h3>
                  <ol className="list-decimal list-inside space-y-2 ml-4">
                    <li><strong>Contact Us Immediately:</strong> Email us within 7 days of the transaction</li>
                    <li><strong>Provide Details:</strong> Include transaction ID, date, amount, and reason for refund</li>
                    <li><strong>Submit Documentation:</strong> Provide supporting documents (bank statements, screenshots)</li>
                    <li><strong>Await Review:</strong> Our team will review your request within 7-10 business days</li>
                    <li><strong>Decision Notification:</strong> You will be notified of the decision via email</li>
                    <li><strong>Refund Processing:</strong> If approved, refund will be processed within 14-21 business days</li>
                  </ol>
                </div>

                <p className="text-sm italic leading-relaxed mt-4">
                  <strong className="text-gray-800">Note:</strong> All refund requests are reviewed on a case-by-case basis. The decision of United Global Federation India's management committee is final.
                </p>
              </div>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                4. Refund Timeline
              </h2>
              <div className="space-y-3 text-gray-600">
                <p className="leading-relaxed">
                  If your refund request is approved:
                </p>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <p><strong className="text-gray-800">Credit/Debit Card:</strong> 7-14 business days</p>
                  <p><strong className="text-gray-800">Net Banking:</strong> 7-14 business days</p>
                  <p><strong className="text-gray-800">UPI:</strong> 3-7 business days</p>
                  <p><strong className="text-gray-800">Wallet Payments:</strong> 5-10 business days</p>
                </div>
                <p className="text-sm leading-relaxed mt-3">
                  The actual credit to your account depends on your bank's processing time. Some banks may take longer during weekends and holidays.
                </p>
              </div>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                5. Donation Modification
              </h2>
              <div className="space-y-3 text-gray-600">
                <p className="leading-relaxed">
                  <strong className="text-gray-800">Change of Cause:</strong> If you wish to redirect your donation to a different cause or campaign:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Contact us within 48 hours of donation</li>
                  <li>Request must be made before funds are allocated</li>
                  <li>Modification is subject to approval and fund availability</li>
                  <li>Tax receipt will reflect the modified allocation</li>
                </ul>
                <p className="leading-relaxed mt-4 text-sm">
                  <strong className="text-gray-800">Note:</strong> Donation modifications are easier to process than refunds and are more likely to be approved.
                </p>
              </div>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                6. Recurring Donations Cancellation
              </h2>
              <div className="space-y-3 text-gray-600">
                <p className="leading-relaxed">
                  For monthly or recurring donations:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>You can cancel your recurring donation at any time</li>
                  <li>Cancellation will take effect from the next billing cycle</li>
                  <li>Already processed donations are non-refundable</li>
                  <li>Cancel through your donor dashboard or by contacting us</li>
                </ul>
                <div className="bg-green-50 rounded-lg p-4 mt-4">
                  <p className="text-sm">
                    <strong className="text-green-800">Good to Know:</strong> You can pause recurring donations for up to 3 months instead of cancelling completely.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                7. Failed Transactions
              </h2>
              <div className="space-y-3 text-gray-600">
                <p className="leading-relaxed">
                  If your payment failed but amount was debited:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Amount is usually auto-reversed by your bank within 5-7 business days</li>
                  <li>Check your transaction status in your donor dashboard</li>
                  <li>If not reversed within 7 days, contact us with transaction details</li>
                  <li>We will coordinate with the payment gateway for resolution</li>
                </ul>
              </div>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                8. Tax Receipt Implications
              </h2>
              <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-lg p-6 border-l-4 border-red-500">
                <p className="text-gray-700 leading-relaxed mb-3">
                  <strong className="text-gray-800">Important:</strong> If a refund is processed:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
                  <li>The issued tax receipt (80G certificate) becomes invalid</li>
                  <li>You must not claim tax deduction for refunded donations</li>
                  <li>United Global Federation India will inform income tax authorities of the refund</li>
                  <li>A revised receipt will be issued if partial refund is processed</li>
                </ul>
              </div>
            </section>

            {/* Section 9 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                9. Dispute Resolution
              </h2>
              <div className="space-y-3 text-gray-600">
                <p className="leading-relaxed">
                  If you disagree with our refund decision:
                </p>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>Request for review by senior management</li>
                  <li>Provide additional documentation or clarification</li>
                  <li>Escalate to our Trust Board for final review</li>
                  <li>Seek mediation through recognized charitable organization forums</li>
                </ol>
                <p className="text-sm leading-relaxed mt-3">
                  We are committed to fair and transparent handling of all refund requests while maintaining the integrity of our charitable operations.
                </p>
              </div>
            </section>

            {/* Contact Section */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Contact for Refund Requests
              </h2>
              <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg p-6">
                <p className="text-gray-700 mb-4">
                  For refund requests or queries, please contact us:
                </p>
                <div className="space-y-2 text-gray-700">
                  <p><strong>Email:</strong> unitedglobalfederationoffice@gmail.com (Subject: Refund Request)</p>
                  <p><strong>Phone:</strong> +91 757070899 (Mon-Sat, 10 AM - 6 PM)</p>
                  <p><strong>WhatsApp:</strong> +91 757070899</p>
                  <p><strong>Address:</strong> Main road Jafrabad Near Dawargaon Fata, Behind Sn properties group Tembhurni, Jalna Maharashtra 431208</p>
                </div>
                <p className="text-gray-700 mt-4 text-sm">
                  Please include your donation reference number and transaction details in all communications.
                </p>
              </div>
            </section>

            {/* Final Note */}
            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <div className="text-2xl">💚</div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">Thank You for Your Support</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Every donation makes a real difference in the lives of those we serve. We appreciate your trust and commitment to our cause. If you have any concerns about your donation, please don't hesitate to reach out to us.
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

export default CancellationRefunds;
