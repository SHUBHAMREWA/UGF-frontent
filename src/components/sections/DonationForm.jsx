import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../common/Button";
import Input from "../common/Input";
import Modal from "../common/Modal";

const DonationForm = ({ isOpen, onClose, preselectedAmount = null }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    amount: preselectedAmount || "",
    firstName: "",
    lastName: "",
    email: "",
    paymentMethod: "creditCard",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    isMonthly: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else {
      // Here you would integrate with your payment processor
      console.log("Processing donation:", formData);
      // After successful payment
      onClose();
      // Redirect to success page or show success message
    }
  };

  const predefinedAmounts = [25, 50, 100, 250];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Make a Donation">
      <div className="px-6 py-4">
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label className="block text-richBlack font-medium mb-4">
                    Select Donation Amount
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    {predefinedAmounts.map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        className={`py-3 px-4 rounded-lg border-2 transition-all ${
                          formData.amount === amount
                            ? "border-primary bg-primary bg-opacity-5 text-primary"
                            : "border-gray-200 hover:border-primary text-subtext"
                        }`}
                        onClick={() => setFormData({ ...formData, amount })}
                      >
                        ${amount}
                      </button>
                    ))}
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-subtext">
                      $
                    </span>
                    <Input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      placeholder="Enter custom amount"
                      className="pl-8"
                      required
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isMonthly"
                      checked={formData.isMonthly}
                      onChange={handleChange}
                      className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="ml-2 text-subtext">
                      Make this a monthly donation
                    </span>
                  </label>
                </div>

                <div className="mb-6">
                  <Input
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-6">
                  <Input
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-8">
                  <Input
                    label="Email Address"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <Button type="submit" fullWidth size="lg">
                  Continue to Payment
                </Button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <div className="bg-background p-4 rounded-lg mb-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-subtext">Donation Amount</p>
                        <p className="text-richBlack text-xl font-bold">
                          ${formData.amount}
                          {formData.isMonthly && <span className="text-sm font-normal ml-1">/month</span>}
                        </p>
                      </div>
                      <button
                        type="button"
                        className="text-primary hover:underline"
                        onClick={() => setStep(1)}
                      >
                        Edit
                      </button>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-richBlack font-medium mb-4">
                      Payment Method
                    </label>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <button
                        type="button"
                        className={`py-3 px-4 rounded-lg border-2 transition-all flex items-center justify-center ${
                          formData.paymentMethod === "creditCard"
                            ? "border-primary bg-primary bg-opacity-5 text-primary"
                            : "border-gray-200 hover:border-primary text-subtext"
                        }`}
                        onClick={() => setFormData({ ...formData, paymentMethod: "creditCard" })}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        Credit Card
                      </button>
                      <button
                        type="button"
                        className={`py-3 px-4 rounded-lg border-2 transition-all flex items-center justify-center ${
                          formData.paymentMethod === "paypal"
                            ? "border-primary bg-primary bg-opacity-5 text-primary"
                            : "border-gray-200 hover:border-primary text-subtext"
                        }`}
                        onClick={() => setFormData({ ...formData, paymentMethod: "paypal" })}
                      >
                        <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.641.641 0 0 1 .632-.539h6.964c2.075 0 3.76.417 4.741 1.252.453.386.802.9 1.015 1.488.226.627.224 1.39.002 2.22l-.006.022v.63l.48.336c.41.287.707.662.881 1.116.207.536.224 1.188.05 1.994-.193.893-.538 1.664-1.022 2.295-.455.593-1.032 1.073-1.72 1.42-.664.333-1.436.57-2.223.676-.718.098-1.527.107-2.42.107H9.716c-.407 0-.775.256-.916.639l-.542 1.654-.012.039-.87 2.654a.642.642 0 0 1-.633.522l.002.002z" />
                          <path d="M19.076 7.337h-4.606c-.407 0-.775.256-.916.639l-.542 1.654-.012.039-.87 2.654a.642.642 0 0 1-.633.522H7.076a.641.641 0 0 1-.633-.74L9.55 3.72a.641.641 0 0 1 .632-.539h6.964c2.075 0 3.76.417 4.741 1.252.453.386.802.9 1.015 1.488.226.627.224 1.39.002 2.22l-.006.022v.63l.48.336c.41.287.707.662.881 1.116.207.536.224 1.188.05 1.994-.193.893-.538 1.664-1.022 2.295-.455.593-1.032 1.073-1.72 1.42-.664.333-1.436.57-2.223.676-.718.098-1.527.107-2.42.107h-2.498z" fill="none" />
                        </svg>
                        PayPal
                      </button>
                    </div>
                  </div>

                  {formData.paymentMethod === "creditCard" && (
                    <>
                      <div className="mb-6">
                        <Input
                          label="Card Number"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleChange}
                          placeholder="1234 5678 9012 3456"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <Input
                          label="Expiry Date"
                          name="expiryDate"
                          value={formData.expiryDate}
                          onChange={handleChange}
                          placeholder="MM/YY"
                          required
                        />
                        <Input
                          label="CVV"
                          name="cvv"
                          value={formData.cvv}
                          onChange={handleChange}
                          placeholder="123"
                          required
                        />
                      </div>
                    </>
                  )}

                  <div className="mb-8">
                    <p className="text-sm text-subtext mb-4">
                      Your donation will be processed securely. You'll receive a receipt via email.
                    </p>
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-secondary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <span className="text-sm text-subtext">
                        Your payment information is secure and encrypted
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      fullWidth
                      onClick={() => setStep(1)}
                    >
                      Back
                    </Button>
                    <Button type="submit" fullWidth>
                      Complete Donation
                    </Button>
                  </div>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Modal>
  );
};

export default DonationForm; 