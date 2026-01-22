import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const Success = () => {
  const location = useLocation();
  const donationDetails = location.state?.donation || {};

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-md mx-auto my-10 p-6 bg-white rounded-lg shadow-md text-center dark:bg-gray-800">
      <div className="mb-6">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-8 w-8 text-green-500" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M5 13l4 4L19 7" 
            />
          </svg>
        </div>
      </div>
      
      <h1 className="text-2xl font-bold mb-4 dark:text-white">Thank You for Your Donation!</h1>
      
      <p className="text-gray-600 mb-6 dark:text-gray-300">
        Your generous contribution helps us continue our mission.
        {donationDetails.amount && (
          <span className="block mt-2 font-semibold">
            Donation Amount: ${donationDetails.amount.toFixed(2)}
          </span>
        )}
      </p>
      
      <div className="flex flex-col space-y-3">
        <Link 
          to="/" 
          className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
        >
          Return to Home
        </Link>
        
        <Link 
          to="/donate" 
          className="inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg transition duration-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
        >
          Make Another Donation
        </Link>
      </div>
    </div>
  );
};

export default Success; 