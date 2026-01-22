import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaMapMarkerAlt, FaClock, FaShare, FaRegHeart } from 'react-icons/fa';
import api from '../utils/api';
import ImageLoader from './ImageLoader';

const EventsSection = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('upcoming');
  const [filteredEvents, setFilteredEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [events, activeCategory]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      console.log('Fetching events from API...');
      const response = await api.get('/events');
      console.log('Events API response:', response.data);
      if (response.data) {
        setEvents(response.data);
        // Log the first event to see its structure
        if (response.data.length > 0) {
          console.log('First event structure:', response.data[0]);
          console.log('Available fields:', Object.keys(response.data[0]));
        }
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      console.error('Error details:', error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of today
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1); // Start of tomorrow
    
    let filtered = [];

    switch (activeCategory) {
      case 'upcoming':
        // Events from tomorrow onwards
        filtered = events.filter(event => {
          const eventDate = new Date(event.date);
          eventDate.setHours(0, 0, 0, 0);
          return eventDate >= tomorrow;
        });
        break;
      case 'ongoing':
        // Events happening today
        filtered = events.filter(event => {
          const eventDate = new Date(event.date);
          eventDate.setHours(0, 0, 0, 0);
          return eventDate.getTime() === today.getTime();
        });
        break;
      case 'past':
        // Events before today
        filtered = events.filter(event => {
          const eventDate = new Date(event.date);
          eventDate.setHours(0, 0, 0, 0);
          return eventDate < today;
        });
        break;
      default:
        filtered = events;
    }

    setFilteredEvents(filtered.slice(0, 6)); // Show only 6 events
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'upcoming':
        return <FaCalendarAlt />;
      case 'past':
        return <FaClock />;
      case 'ongoing':
        return <FaRegHeart />;
      default:
        return <FaCalendarAlt />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short'
    }).toUpperCase();
  };

  const formatTime = (event) => {
    // Check for different possible time field names
    const timeValue = event.time || event.startTime || event.eventTime;
    
    if (!timeValue) {
      console.log('No time found for event:', event.title, 'Available fields:', Object.keys(event));
      return '-';
    }
    
    return timeValue;
  };

  const getStatusLabel = (eventDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const eventDateObj = new Date(eventDate);
    eventDateObj.setHours(0, 0, 0, 0);
    
    if (eventDateObj < today) {
      return 'PAST';
    } else if (eventDateObj.getTime() === today.getTime()) {
      return 'ONGOING';
    } else {
      return 'UPCOMING';
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="mx-auto px-4">
          <div className="flex items-center justify-center py-8">
            <ImageLoader size={80} text="Loading events..." />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Upcoming Events</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join us in making a difference through our community events and initiatives
          </p>
          <div className="w-24 h-1 bg-primary-500 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Category Tabs */}
        <div className="flex justify-center mb-12">
          <div className="bg-gray-100 rounded-2xl p-2 flex space-x-2">
            {[
              { key: 'upcoming', label: 'Upcoming' },
              { key: 'ongoing', label: 'Ongoing' },
              { key: 'past', label: 'Past' }
            ].map((category) => (
              <button
                key={category.key}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 ${
                  activeCategory === category.key 
                    ? 'bg-white text-primary-500 shadow-soft' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setActiveCategory(category.key)}
              >
                <span className="text-lg">{getCategoryIcon(category.key)}</span>
                <span>{category.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <div key={event._id} className="bg-white rounded-2xl shadow-soft overflow-hidden hover:shadow-medium transition-all duration-300 hover:-translate-y-2 group">
                {/* Event Image */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={event.image || '/images/event-placeholder.jpg'} 
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = '/images/event-placeholder.jpg';
                    }}
                  />
                  {/* Status Overlay */}
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      getStatusLabel(event.date) === 'UPCOMING' 
                        ? 'bg-green-100 text-green-800' 
                        : getStatusLabel(event.date) === 'ONGOING'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {getStatusLabel(event.date)}
                    </span>
                  </div>
                  {/* Date Overlay */}
                  <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 backdrop-blur-sm rounded-xl px-3 py-2">
                    <div className="flex items-center space-x-2">
                      <FaCalendarAlt className="text-primary-500 w-4 h-4" />
                      <span className="text-sm font-semibold text-gray-900">{formatDate(event.date)}</span>
                    </div>
                  </div>
                </div>

                {/* Event Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 line-clamp-2">
                    {event.title}
                  </h3>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center space-x-3 text-gray-600">
                      <FaClock className="w-4 h-4 text-primary-500 flex-shrink-0" />
                      <span className="text-sm">{formatTime(event) || '-'}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-600">
                      <FaMapMarkerAlt className="w-4 h-4 text-primary-500 flex-shrink-0" />
                      <span className="text-sm">{event.location}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between">
                    <button className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors duration-200 text-sm font-medium">
                      {getStatusLabel(event.date)} Event
                    </button>
                    <button className="p-2 text-gray-400 hover:text-primary-500 transition-colors duration-200">
                      <FaShare className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaCalendarAlt className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No {activeCategory} events found</h3>
              <p className="text-gray-600 mb-6">Check back later for new events or browse other categories.</p>
              {events.length === 0 && (
                <div className="bg-gray-50 rounded-xl p-6 max-w-md mx-auto">
                  <p className="text-sm text-gray-500">
                    <strong>Debug Info:</strong> No events found in database. 
                    Total events loaded: {events.length}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* View More Button */}
        {filteredEvents.length > 0 && (
          <div className="text-center mt-12">
            <Link 
              to="/events" 
              className="inline-flex items-center px-8 py-4 bg-primary-500 text-white font-semibold rounded-xl hover:bg-primary-600 transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              View All Events
              <svg className="ml-2 w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default EventsSection; 