import React from 'react';
import { motion } from 'framer-motion';
import { FaFileContract, FaExclamationTriangle, FaShieldAlt, FaCheckCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const AryaMitraTermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-600 to-green-700 rounded-full mb-4">
              <FaFileContract className="text-white text-2xl" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent mb-4">
              WA-ERF Terms & Conditions
            </h1>
            <p className="text-gray-600 mb-2">Wildlife Animal Emergency Response Force</p>
            <p className="text-gray-500 text-sm">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
            
            {/* Disclaimer */}
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
              <div className="flex items-start">
                <FaExclamationTriangle className="text-amber-500 text-xl mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-amber-800 mb-2">Important Notice</h3>
                  <p className="text-amber-700 text-sm leading-relaxed">
                    All registered Wildlife Volunteers of WA-ERF undertake wildlife rescue activities entirely at their own risk and responsibility. Please read all terms carefully before registration.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 1 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaShieldAlt className="text-green-600" />
                1. Volunteer Responsibility
              </h2>
              <div className="space-y-3 text-gray-700 leading-relaxed">
                <p>
                  All registered Wildlife Volunteers of WA-ERF undertake wildlife rescue activities entirely at their own risk and responsibility.
                </p>
                <p>
                  <strong className="text-gray-900">WA-ERF, its founders, trustees, coordinators, helpline operators, affiliated NGOs, and partner groups shall not be held liable for:</strong>
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Injuries</li>
                  <li>Wildlife bites</li>
                  <li>Accidents</li>
                  <li>Physical disability</li>
                  <li>Psychological trauma</li>
                  <li>Death</li>
                  <li>Medical expenses</li>
                  <li>Property loss</li>
                </ul>
                <p className="mt-3">
                  resulting from volunteer participation or actions.
                </p>
                <p>
                  Volunteers agree that their service is purely voluntary and does not establish employment, contract, or compensation obligations from WA-ERF.
                </p>
              </div>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaShieldAlt className="text-green-600" />
                2. Wildlife Handling
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <div>
                  <p className="mb-2"><strong className="text-gray-900">Volunteers must strictly follow:</strong></p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Forest Department guidelines</li>
                    <li>Provisions of the Wildlife Protection Act, 1972</li>
                    <li>WA-ERF training standards & safety instructions</li>
                  </ul>
                </div>
                <p>
                  Volunteers must use proper tools, protective gear, and equipment while rescuing wildlife.
                </p>
                <div>
                  <p className="mb-2"><strong className="text-gray-900">The following activities are strictly prohibited:</strong></p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Taking wildlife into custody beyond rescue response</li>
                    <li>Handling wildlife for entertainment, photo-shoots, reels, or social media publicity</li>
                    <li>Allowing untrained public members to interact with wildlife</li>
                    <li>Posing with wildlife or showing off rescue activities</li>
                  </ul>
                </div>
                <p className="text-red-600 font-semibold">
                  Any public display, mishandling, stunts, or negligent behavior leading to harm will be solely the volunteer's liability.
                </p>
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaExclamationTriangle className="text-red-600" />
                3. Illegal Activities – Strictly Prohibited
              </h2>
              <div className="space-y-3 text-gray-700 leading-relaxed">
                <p>
                  <strong className="text-gray-900">Any activity violating the Wildlife Protection Act, including:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Hunting</li>
                  <li>Capturing wildlife without cause</li>
                  <li>Animal trading or trafficking</li>
                  <li>Transporting wildlife without Forest Department order</li>
                  <li>Keeping wild animals as pets</li>
                  <li>Selling shed skins, remains, or wildlife parts</li>
                </ul>
                <p className="mt-3">
                  ...is a punishable offense.
                </p>
                <p>
                  <strong className="text-gray-900">If any volunteer is suspected or found involved:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>WA-ERF registration will be cancelled</li>
                  <li>Report will be submitted to the Forest Department & local authorities</li>
                  <li>Legal action may be processed under IPC & Wildlife Act</li>
                </ul>
                <p className="text-red-600 font-bold mt-3">
                  WA-ERF has zero-tolerance for any type of illegal wildlife exploitation.
                </p>
              </div>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaShieldAlt className="text-green-600" />
                4. Limited Liability – Organization Scope
              </h2>
              <div className="space-y-3 text-gray-700 leading-relaxed">
                <p>
                  <strong className="text-gray-900">WA-ERF functions only as a:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Connecting platform between public & wildlife volunteers</li>
                  <li>Helpline coordination network</li>
                  <li>Support system for wildlife awareness</li>
                </ul>
                <p className="mt-3">
                  <strong className="text-gray-900">WA-ERF does NOT:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Guarantee volunteer arrival</li>
                  <li>Guarantee successful rescue outcome</li>
                  <li>Provide insurance, injury coverage, or compensation</li>
                  <li>Hold responsibility for volunteer mistakes or legal disputes</li>
                </ul>
                <p className="mt-3">
                  Volunteers act independently in the field and are fully responsible for their safety and decisions.
                </p>
              </div>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaExclamationTriangle className="text-red-600" />
                5. Right to Cancel Registration
              </h2>
              <div className="space-y-3 text-gray-700 leading-relaxed">
                <p>
                  WA-ERF may suspend or permanently remove a volunteer without notice if:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Wildlife rules are violated</li>
                  <li>Misuse of WA-ERF ID or name occurs</li>
                  <li>Rescue videos/photos are used for self-promotion</li>
                  <li>Wildlife or public safety is threatened</li>
                  <li>Complaints are received from Forest officials or public</li>
                  <li>False identity or fake representation is detected</li>
                </ul>
                <p className="mt-3">
                  Once removed, the volunteer may be blacklisted and ineligible for re-registration.
                </p>
              </div>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaShieldAlt className="text-green-600" />
                6. Wildlife Rescue Protocol – Forest Coordination
              </h2>
              <div className="space-y-3 text-gray-700 leading-relaxed">
                <p>
                  Wildlife rescue must be conducted only by trained & authorized personnel.
                </p>
                <p>
                  <strong className="text-gray-900">Volunteers must:</strong>
                </p>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>Respond only if the situation is safe</li>
                  <li>Collect basic information before arrival</li>
                  <li>Carry proper gear and avoid unnecessary risk</li>
                </ol>
                <p className="mt-3">
                  <strong className="text-gray-900">For rare, critically endangered, venomous, or high-risk species:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Immediately inform the nearest Forest Department office</li>
                  <li>Provide photographs or location coordinates only for reporting – not social media</li>
                  <li>Follow Forest-issued release instructions and documentation</li>
                </ul>
              </div>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaShieldAlt className="text-green-600" />
                7. Confidentiality & Media Policy
              </h2>
              <div className="space-y-3 text-gray-700 leading-relaxed">
                <p>
                  All rescue-related information, locations, or sensitive case details are confidential.
                </p>
                <p>
                  <strong className="text-gray-900">Volunteers may not:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Disclose citizen details publicly</li>
                  <li>Post rescue locations, nests, dens, or protected habitat info online</li>
                </ul>
                <p className="mt-3">
                  All images/videos must be submitted to WA-ERF (if requested) and shared publicly only after written approval.
                </p>
                <p className="text-red-600 font-semibold">
                  Unauthorized posting may lead to registration cancellation.
                </p>
              </div>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaShieldAlt className="text-green-600" />
                8. ID Card, Uniform & Name Use
              </h2>
              <div className="space-y-3 text-gray-700 leading-relaxed">
                <p>
                  WA-ERF identity card is for verification only — it does not grant legal authority.
                </p>
                <p>
                  <strong className="text-gray-900">Volunteers may NOT:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Claim government/forest officer position</li>
                  <li>Demand money or reward for rescue</li>
                  <li>Represent WA-ERF for political or religious promotion</li>
                </ul>
                <p className="text-red-600 font-semibold mt-3">
                  Asking for donations, money, fuel charges, or gifts using WA-ERF name is strictly prohibited.
                </p>
              </div>
            </section>

            {/* Disclaimer Section */}
            <section className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg">
              <h2 className="text-2xl font-bold text-red-800 mb-4 flex items-center gap-2">
                <FaExclamationTriangle className="text-red-600" />
                Disclaimer
              </h2>
              <div className="space-y-3 text-red-700 leading-relaxed">
                <p className="font-semibold">
                  All volunteers must ensure their own safety and accept all risks before engaging in wildlife activity.
                </p>
                <p>
                  <strong className="text-red-800">WA-ERF shall NOT be responsible for:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Any injury, accident, bite, fall, trauma</li>
                  <li>Loss of life</li>
                  <li>Property or financial damages</li>
                  <li>Criminal or civil cases arising due to volunteer actions</li>
                </ul>
                <p className="mt-3 font-bold">
                  Volunteers agree that WA-ERF is not directly or indirectly liable for any legal consequences.
                </p>
              </div>
            </section>

            {/* Back Button */}
            <div className="pt-8 border-t border-gray-200">
              <Link
                to="/sn-arya-mitra"
                className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                ← Back to Registration
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AryaMitraTermsAndConditions;

