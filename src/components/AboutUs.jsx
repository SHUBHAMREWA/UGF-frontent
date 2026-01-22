import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHandHoldingHeart, FaUsers, FaLightbulb, FaGlobeAsia, FaCalendarAlt, FaMapMarkerAlt, FaClock, FaArrowRight, FaImages, FaHeart } from 'react-icons/fa';
import api from '../utils/api';
import { format } from 'date-fns';
import PageLoader from './PageLoader';
import usePageLoader from '../hooks/usePageLoader';

const AboutUs = () => {
  const [carouselImages, setCarouselImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [activeGalleryFilter, setActiveGalleryFilter] = useState('all');
  const navigate = useNavigate();
  const isPageLoading = usePageLoader();

  useEffect(() => {
    fetchCarouselImages();
    fetchEvents();
    fetchGalleryImages();
  }, []);

  const fetchCarouselImages = async () => {
    try {
      const response = await api.get('/carousel');
      if (response.data.success) {
        setCarouselImages(response.data.carouselImages || []);
      }
    } catch (error) {
      console.error('Error fetching carousel images:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await api.get('/events');
      const eventsWithDates = response.data.map(event => ({
        ...event,
        date: new Date(event.date)
      }));
      setEvents(eventsWithDates);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const fetchGalleryImages = async () => {
    try {
      const response = await api.get('/gallery');
      setGalleryImages(response.data || []);
    } catch (error) {
      console.error('Error fetching gallery images:', error);
      // Fallback to sample images if API fails
      setGalleryImages([
        {
          _id: 1,
          title: "Community Service",
          image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          category: "community"
        },
        {
          _id: 2,
          title: "Education Support",
          image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          category: "education"
        }
      ]);
    }
  };

  const filteredGalleryImages = activeGalleryFilter === 'all'
    ? galleryImages
    : galleryImages.filter(image => image.category === activeGalleryFilter);

  const getEventStatus = (event) => {
    const now = new Date();
    const eventDate = new Date(event.date);
    const eventStartTime = new Date(event.date);
    const eventEndTime = new Date(event.date);

    if (event.startTime) {
      const [startHours, startMinutes] = event.startTime.split(':');
      eventStartTime.setHours(parseInt(startHours), parseInt(startMinutes), 0);
    }

    if (event.endTime) {
      const [endHours, endMinutes] = event.endTime.split(':');
      eventEndTime.setHours(parseInt(endHours), parseInt(endMinutes), 0);
    } else {
      eventEndTime.setHours(eventStartTime.getHours() + 2);
    }

    if (now < eventStartTime) {
      return 'upcoming';
    } else if (now >= eventStartTime && now <= eventEndTime) {
      return 'ongoing';
    } else {
      return 'past';
    }
  };

  const getFilteredEvents = (status) => {
    return events.filter(event => getEventStatus(event) === status).slice(0, 3);
  };

  const formatEventDate = (date) => {
    return format(new Date(date), "MMM d, yyyy");
  };

  const pillars = [
    {
      id: 1,
      title: "Community Empowerment",
      description: "We believe in empowering communities to drive their own development and create sustainable change.",
      icon: <FaUsers className="w-8 h-8" />,
      color: "from-primary-500 to-primary-500"
    },
    {
      id: 2,
      title: "Youth Engagement",
      description: "Mobilizing India's youth through volunteerism to contribute to social causes and develop leadership skills.",
      icon: <FaLightbulb className="w-8 h-8" />,
      color: "from-primary-500 to-primary-500"
    },
    {
      id: 3,
      title: "Compassionate Action",
      description: "Taking action with empathy and understanding to address the needs of vulnerable populations.",
      icon: <FaHandHoldingHeart className="w-8 h-8" />,
      color: "from-primary-500 to-primary-500"
    },
    {
      id: 4,
      title: "Global Perspective",
      description: "Working with a global mindset while focusing on local solutions to create meaningful impact.",
      icon: <FaGlobeAsia className="w-8 h-8" />,
      color: "from-primary-500 to-primary-500"
    }
  ];

  if (isPageLoading) {
    return <PageLoader subtitle="Loading our story..." />;
  }

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-[#F2F2F2] overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className=" mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              About <span className="text-primary-500">United Global Federation India</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              We are India's most trusted and transparent crowdfunding platform, dedicated to creating
              meaningful social impact through community-driven initiatives and compassionate action.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/mission"
                className="inline-flex items-center px-8 py-4 bg-primary-500 hover:text-white text-white font-semibold rounded-xl "
              >
                Our Mission
                <FaArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                to="/vision"
                className="inline-flex items-center px-8 py-4 bg-white text-primary-500 hover:text-primary-500 font-semibold rounded-xl hover:bg-gray-50 transition-colors duration-200 shadow-lg hover:shadow-xl border-2 border-primary-500"
              >
                Our Vision
                <FaArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-20 bg-white">
        <div className=" mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Explore Our Events</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover upcoming events, join ongoing initiatives, and relive our past achievements
            </p>
            <div className="w-24 h-1 bg-primary-500 mx-auto mt-6 rounded-full"></div>
          </div>

          {/* Upcoming Events */}
          {getFilteredEvents('upcoming').length > 0 && (
            <div className="mb-16">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Upcoming Events</h3>
                  <p className="text-gray-600">Discover events that are coming soon</p>
                </div>
                <Link
                  to="/events?status=upcoming"
                  className="text-primary-600 hover:text-primary-700 font-semibold flex items-center"
                >
                  View All
                  <FaArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {getFilteredEvents('upcoming').map(event => (
                  <div
                    key={event._id}
                    className="bg-white rounded-2xl shadow-soft overflow-hidden hover:shadow-medium transition-all duration-300 hover:-translate-y-2 cursor-pointer group"
                    onClick={() => navigate(`/events/${event._id}`)}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={event.images?.[0] || event.image || '/images/event-placeholder.jpg'}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 right-4">
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                          UPCOMING
                        </span>
                      </div>
                      <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 backdrop-blur-sm rounded-xl px-3 py-2">
                        <div className="flex items-center space-x-2">
                          <FaCalendarAlt className="text-primary-500 w-4 h-4" />
                          <span className="text-sm font-semibold text-gray-900">{formatEventDate(event.date)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <h4 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">{event.title}</h4>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <FaClock className="text-primary-500 w-4 h-4" />
                          <span>{event.startTime} - {event.endTime}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <FaMapMarkerAlt className="text-primary-500 w-4 h-4" />
                          <span>{event.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ongoing Events */}
          {getFilteredEvents('ongoing').length > 0 && (
            <div className="mb-16">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Ongoing Events</h3>
                  <p className="text-gray-600">Events happening right now</p>
                </div>
                <Link
                  to="/events?status=ongoing"
                  className="text-primary-600 hover:text-primary-700 font-semibold flex items-center"
                >
                  View All
                  <FaArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {getFilteredEvents('ongoing').map(event => (
                  <div
                    key={event._id}
                    className="bg-white rounded-2xl shadow-soft overflow-hidden hover:shadow-medium transition-all duration-300 hover:-translate-y-2 cursor-pointer group"
                    onClick={() => navigate(`/events/${event._id}`)}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={event.images?.[0] || event.image || '/images/event-placeholder.jpg'}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 right-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                          ONGOING
                        </span>
                      </div>
                      <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 backdrop-blur-sm rounded-xl px-3 py-2">
                        <div className="flex items-center space-x-2">
                          <FaCalendarAlt className="text-primary-500 w-4 h-4" />
                          <span className="text-sm font-semibold text-gray-900">{formatEventDate(event.date)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <h4 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">{event.title}</h4>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <FaClock className="text-primary-500 w-4 h-4" />
                          <span>{event.startTime} - {event.endTime}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <FaMapMarkerAlt className="text-primary-500 w-4 h-4" />
                          <span>{event.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Volunteers Section */}
      <section className="py-20 bg-[#F2F2F2]">
        <div className=" mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="mb-8">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Join Our Volunteer Community</h2>
                <div className="w-24 h-1 bg-primary-500 rounded-full mb-6"></div>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Make a meaningful impact in your community by joining our volunteer program.
                  We offer various opportunities to contribute your skills and time to causes that matter.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-500 mb-2">500+</div>
                  <div className="text-sm text-gray-600">Active Volunteers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-500 mb-2">50+</div>
                  <div className="text-sm text-gray-600">Projects Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-500 mb-2">10K+</div>
                  <div className="text-sm text-gray-600">Hours Contributed</div>
                </div>
              </div>

              <button
                className="inline-flex items-center px-8 py-4 bg-primary-500 text-white font-semibold rounded-xl hover:bg-primary-500 transition-colors duration-200 shadow-lg hover:shadow-xl"
                onClick={() => navigate('/volunteer-join')}
              >
                Become a Volunteer
                <FaArrowRight className="ml-2 w-5 h-5" />
              </button>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl shadow-soft p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-500 rounded-2xl flex items-center justify-center mb-6">
                  <FaUsers className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Why Volunteer With Us?</h3>
                <div className="space-y-4 text-gray-600">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p>Make a real difference in people's lives</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p>Develop new skills and gain experience</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p>Join a supportive community of changemakers</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p>Flexible opportunities that fit your schedule</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 bg-white">
        <div className=" mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Impact Gallery</h2>
              <div className="w-24 h-1 bg-primary-500 rounded-full mb-6"></div>
              <p className="text-xl text-gray-600 leading-relaxed mb-8">
                Explore our visual journey through impactful moments, community events, and the lives we've touched.
                Each image tells a story of hope, compassion, and positive change.
              </p>
              <Link
                to="/gallery"
                className="inline-flex items-center px-8 py-4 bg-primary-500 text-white font-semibold rounded-xl hover:bg-primary-500 hover:text-white transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                View Full Gallery
                <FaImages className="ml-2 w-5 h-5" />
              </Link>
            </div>

            {/* Right Side Gallery Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-4">
              {filteredGalleryImages.slice(0, 4).map((image) => (
                <div
                  key={image._id}
                  className="group cursor-pointer"
                  onClick={() => navigate('/gallery')}
                >
                  <div className="relative aspect-square overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                    <img
                      src={image.image}
                      alt={image.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-white font-semibold text-sm sm:text-base truncate">
                          {image.title}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Pillars Section */}
      <section className="py-20 bg-[#F2F2F2]">
        <div className=" mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary-500 mb-4">Our Pillars</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our work is guided by four fundamental principles that shape everything we do
            </p>
            <div className="w-24 h-1 bg-primary-500 mx-auto mt-6 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {pillars.map((pillar) => (
              <div
                key={pillar.id}
                className="bg-white rounded-2xl shadow-soft p-8 hover:shadow-medium transition-all duration-300 hover:-translate-y-2 text-center group"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${pillar.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <div className="text-white">
                    {pillar.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{pillar.title}</h3>
                <p className="text-gray-600 leading-relaxed">{pillar.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br bg-white">
        <div className=" mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Join Our Journey</h2>
          <p className="text-xl text-gray-900 max-w-3xl mx-auto mb-8 leading-relaxed">
            Be part of our mission to create lasting change. Whether through volunteering,
            donating, or spreading awareness, your contribution matters.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/campaigns"
              className="inline-flex items-center px-8 py-4 bg-primary-500 text-white font-semibold rounded-xl hover:bg-primary-500 hover:text-white transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              <FaHeart className="mr-2 w-5 h-5" />
              Donate Now
            </Link>
            <Link
              to="/volunteer-join"
              className="inline-flex items-center text-red-500 px-8 py-4 bg-transparent  font-semibold rounded-xl  hover:text-primary-500 transition-colors duration-200  "
            >
              Get Involved
              <FaArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs; 