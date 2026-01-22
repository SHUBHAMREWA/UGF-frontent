import React, { useState } from "react";
import { motion } from "framer-motion";
import Button from "../common/Button";
import Card from "../common/Card";

const DonationTiers = () => {
  const [donationType, setDonationType] = useState("monthly");
  
  const tiers = {
    monthly: [
      { id: 1, amount: 25, title: "Supporter", description: "Provides clean water for 5 families each month", popular: false },
      { id: 2, amount: 50, title: "Champion", description: "Supplies educational materials for 10 children monthly", popular: true },
      { id: 3, amount: 100, title: "Guardian", description: "Funds medical care for 15 individuals every month", popular: false },
      { id: 4, amount: 250, title: "Visionary", description: "Helps build sustainable infrastructure for communities", popular: false },
    ],
    oneTime: [
      { id: 5, amount: 50, title: "Friend", description: "Provides emergency food supplies for a family", popular: false },
      { id: 6, amount: 150, title: "Ally", description: "Funds a community health workshop", popular: true },
      { id: 7, amount: 300, title: "Hero", description: "Supplies a classroom with essential learning materials", popular: false },
      { id: 8, amount: 500, title: "Changemaker", description: "Helps fund a clean water project", popular: false },
    ]
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section className="py-20 bg-white">
      <div className="mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1 rounded-full bg-secondary bg-opacity-10 text-secondary font-medium text-sm mb-4">
            Choose Your Impact
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-richBlack mb-4">
            Make a Meaningful Difference
          </h2>
          <p className="text-subtext max-w-2xl mx-auto">
            Select the donation tier that resonates with you. Every contribution, regardless of size, creates lasting positive change.
          </p>
        </div>

        <div className="flex justify-center mb-12">
          <div className="bg-background p-1.5 rounded-lg inline-flex">
            <button
              className={`px-6 py-3 rounded-md font-medium transition-all ${
                donationType === "monthly"
                  ? "bg-white shadow-soft text-primary"
                  : "text-subtext hover:text-richBlack"
              }`}
              onClick={() => setDonationType("monthly")}
            >
              Monthly Giving
            </button>
            <button
              className={`px-6 py-3 rounded-md font-medium transition-all ${
                donationType === "oneTime"
                  ? "bg-white shadow-soft text-primary"
                  : "text-subtext hover:text-richBlack"
              }`}
              onClick={() => setDonationType("oneTime")}
            >
              One-time Gift
            </button>
          </div>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {tiers[donationType].map((tier) => (
            <motion.div key={tier.id} variants={itemVariants}>
              <Card
                className={`h-full flex flex-col ${
                  tier.popular ? "border-2 border-primary" : ""
                }`}
              >
                {tier.popular && (
                  <div className="bg-primary text-white text-center py-1 px-4 rounded-t-lg font-medium text-sm">
                    Most Popular
                  </div>
                )}
                <div className="p-6 flex-grow">
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-richBlack">${tier.amount}</span>
                    <span className="text-subtext ml-1">
                      {donationType === "monthly" ? "/month" : ""}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-richBlack mb-2">{tier.title}</h3>
                  <p className="text-subtext mb-6">{tier.description}</p>
                </div>
                <div className="px-6 pb-6">
                  <Button
                    variant={tier.popular ? "primary" : "outline"}
                    fullWidth
                  >
                    Select
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-12 text-center">
          <p className="text-subtext mb-4">
            Want to contribute a custom amount?
          </p>
          <Button variant="secondary">
            Custom Donation
          </Button>
        </div>
      </div>
    </section>
  );
};

export default DonationTiers; 