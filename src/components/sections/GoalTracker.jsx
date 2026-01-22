import React from "react";
import { motion } from "framer-motion";
import ProgressBar from "../common/ProgressBar";

const GoalTracker = () => {
  // This would come from your API/context in a real app
  const goalData = {
    currentAmount: 78650,
    goalAmount: 100000,
    donorsCount: 1243,
    daysLeft: 18,
    campaignName: "Clean Water Initiative"
  };

  const percentage = Math.min(100, Math.round((goalData.currentAmount / goalData.goalAmount) * 100));

  return (
    <section className="py-16 bg-background">
      <div className="mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-medium overflow-hidden">
          <div className="p-8 md:p-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl md:text-3xl font-display font-bold text-richBlack mb-2">
                  {goalData.campaignName}
                </h3>
                <p className="text-subtext">
                  Help us reach our goal and bring clean water to communities in need
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <span className="inline-block px-4 py-1 rounded-full bg-accent bg-opacity-20 text-richBlack font-medium">
                  {goalData.daysLeft} days left
                </span>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-end mb-2">
                <div>
                  <span className="text-3xl md:text-4xl font-bold text-primary">
                    ${goalData.currentAmount.toLocaleString()}
                  </span>
                  <span className="text-subtext ml-2">
                    raised of ${goalData.goalAmount.toLocaleString()}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold text-richBlack">{percentage}%</span>
                </div>
              </div>
              
              <ProgressBar percentage={percentage} />
            </div>

            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <motion.div 
                className="bg-background rounded-xl p-6 flex-1"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex items-center">
                  <div className="bg-secondary bg-opacity-10 p-3 rounded-full mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-subtext text-sm">Total Donors</p>
                    <p className="text-richBlack text-xl font-bold">{goalData.donorsCount}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                className="bg-background rounded-xl p-6 flex-1"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex items-center">
                  <div className="bg-primary bg-opacity-10 p-3 rounded-full mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-subtext text-sm">Avg. Donation</p>
                    <p className="text-richBlack text-xl font-bold">
                      ${Math.round(goalData.currentAmount / goalData.donorsCount)}
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                className="bg-background rounded-xl p-6 flex-1"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex items-center">
                  <div className="bg-accent bg-opacity-20 p-3 rounded-full mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-richBlack" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-subtext text-sm">Needed</p>
                    <p className="text-richBlack text-xl font-bold">
                      ${(goalData.goalAmount - goalData.currentAmount).toLocaleString()}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GoalTracker; 