import React from "react";
import { motion } from "framer-motion";
import Button from '../common/Button'
const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      title: "Choose Your Cause",
      description: "Select from our various initiatives that align with your values and the change you want to see.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
    },
    {
      id: 2,
      title: "Make Your Donation",
      description: "Contribute any amount that feels right for you, whether it's a one-time gift or a monthly commitment.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      id: 3,
      title: "See Your Impact",
      description: "Receive updates about how your generosity is making a real difference in people's lives.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
        </svg>
      ),
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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
    <section className="py-20 bg-background">
      <div className="mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 rounded-full bg-primary bg-opacity-10 text-primary font-medium text-sm mb-4">
            Simple Process
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-richBlack mb-4">
            How Your Donation Works
          </h2>
          <p className="text-subtext max-w-2xl mx-auto">
            Making a difference is easier than you think. Follow these simple steps to create lasting impact.
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {steps.map((step) => (
            <motion.div
              key={step.id}
              className="relative"
              variants={itemVariants}
            >
              <div className="bg-white rounded-2xl shadow-soft p-8 h-full relative z-10">
                <div className="bg-primary bg-opacity-10 text-primary rounded-full w-16 h-16 flex items-center justify-center mb-6">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-richBlack mb-4">
                  {step.title}
                </h3>
                <p className="text-subtext">{step.description}</p>
              </div>
              
              {step.id !== steps.length && (
                <div className="hidden md:block absolute top-1/2 left-full w-12 h-1 bg-gray-200 -ml-6 z-0">
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-primary"></div>
                </div>
              )}
              
              <div className="absolute -top-2 -right-2 w-12 h-12 bg-accent opacity-10 rounded-lg"></div>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-16 text-center">
          <Button variant="secondary" size="lg">
            Start Donating Now
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks; 