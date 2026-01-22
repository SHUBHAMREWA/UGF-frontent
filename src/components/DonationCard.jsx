import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaRegClock, FaUserFriends, FaShareAlt, FaArrowRight, FaUsers } from 'react-icons/fa';

function getInitials(name) {
  if (!name) return 'U';
  const parts = name.split(' ');
  return parts.length === 1 ? parts[0][0] : parts[0][0] + parts[1][0];
}

const DonationCard = ({
  _id,
  title,
  image,
  goal,
  collectedAmount,
  endDate,
  donors = [],
  author = { name: 'Fundraiser', avatar: '' },
}) => {
  const navigate = useNavigate();
  const progress = Math.min((collectedAmount / goal) * 100, 100);
  const daysLeft = endDate ? Math.max(0, Math.ceil((new Date(endDate) - new Date()) / (1000 * 60 * 60 * 24))) : '--';
  const supporters = donors.length;

  const handleClick = () => navigate(`/donations/${_id}`);
  const handleShare = (e) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title,
        url: window.location.origin + `/donations/${_id}`
      });
    } else {
      navigator.clipboard.writeText(window.location.origin + `/donations/${_id}`);
      // You can replace this with a toast notification
      alert('Link copied to clipboard!');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-blue-500';
    if (percentage >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getDaysLeftColor = (days) => {
    if (days <= 7) return 'text-red-600 bg-red-50';
    if (days <= 14) return 'text-orange-600 bg-orange-50';
    return 'text-green-600 bg-green-50';
  };

  return (
    <motion.div
      className="group relative bg-white rounded-2xl shadow-soft overflow-hidden hover:shadow-medium transition-all duration-300 hover:-translate-y-2 cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      onClick={handleClick}
    >
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Share Button */}
        <button
          onClick={handleShare}
          className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-700 hover:bg-white hover:text-primary-600 transition-all duration-200 opacity-0 group-hover:opacity-100"
        >
          <FaShareAlt className="w-4 h-4" />
        </button>

        {/* Progress Badge */}
        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl px-3 py-2">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${getProgressColor(progress)}`} />
            <span className="text-sm font-semibold text-gray-900">{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Days Left Badge */}
        <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold ${getDaysLeftColor(daysLeft)}`}>
          {daysLeft} days left
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors duration-200">
          {title}
        </h3>

        {/* Author Section */}
        <div className="flex items-center space-x-3 mb-4">
          {author.avatar ? (
            <img 
              src={author.avatar} 
              alt={author.name} 
              className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-semibold text-sm border-2 border-gray-200">
              {getInitials(author.name)}
            </div>
          )}
          <div>
            <p className="text-sm text-gray-600">by</p>
            <p className="font-semibold text-gray-900">{author.name}</p>
          </div>
        </div>

        {/* Progress Section */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span className="font-semibold">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <motion.div 
              className={`h-full rounded-full ${getProgressColor(progress)}`}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Amount Section */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center p-3 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl">
            <div className="text-lg font-bold text-primary-600">
              {formatCurrency(collectedAmount)}
            </div>
            <div className="text-xs text-primary-700 font-medium">Raised</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-xl">
            <div className="text-lg font-bold text-gray-900">
              {formatCurrency(goal)}
            </div>
            <div className="text-xs text-gray-600 font-medium">Goal</div>
          </div>
        </div>

        {/* Supporters Section */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <FaUsers className="w-4 h-4 text-primary-500" />
            <span>{supporters} supporters</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <FaRegClock className="w-4 h-4 text-orange-500" />
            <span>{daysLeft} days left</span>
          </div>
        </div>

        {/* Action Button */}
        <button 
          className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-primary-600 hover:to-primary-700 transition-all duration-200 flex items-center justify-center space-x-2 group/btn"
          onClick={handleClick}
        >
          <FaHeart className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-200" />
          <span>Contribute Now</span>
          <FaArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-200" />
        </button>

        {/* Hover Effect Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-secondary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>

      {/* Ripple Effect on Click */}
      <motion.div
        className="absolute inset-0 bg-white/20 rounded-2xl pointer-events-none"
        initial={{ scale: 0, opacity: 0 }}
        whileTap={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
      />
    </motion.div>
  );
};

export default DonationCard; 