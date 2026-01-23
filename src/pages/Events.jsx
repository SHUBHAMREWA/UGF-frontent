import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Calendar} from "lucide-react";
import api from "../utils/api";
import { Button } from "../components/ui/button";
import ImageLoader from "../components/ImageLoader";
import EventCard from "../components/ui/eventCard";

const Events = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const statusFromQuery = queryParams.get('status');
  
  const [activeTab, setActiveTab] = useState(statusFromQuery || "all");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (statusFromQuery) {
      setActiveTab(statusFromQuery);
    }
  }, [statusFromQuery]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await api.get('/events');
      const eventsWithDates = response.data.map(event => ({
        ...event,
        date: new Date(event.date)
      }));
      setEvents(eventsWithDates);
    } catch (err) {
      setError('Failed to fetch events. Please try again later.');
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  const getEventStatus = (event) => {
    const now = new Date();
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

    if (now < eventStartTime) return 'upcoming';
    if (now >= eventStartTime && now <= eventEndTime) return 'ongoing';
    return 'past';
  };

  const getFilteredEvents = () => {
    if (activeTab === 'all') {
      return events;
    }
    return events.filter(event => {
      const eventStatus = getEventStatus(event);
      return eventStatus === activeTab;
    });
  };



  const tabs = [
    { id: 'all', label: 'All Events' },
    { id: 'upcoming', label: 'Upcoming Events' },
    { id: 'ongoing', label: 'Ongoing Events' },
    { id: 'past', label: 'Past Events' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8 px-6 flex items-center justify-center">
        <div className="max-w-[1280px] mx-auto text-center">
          <ImageLoader size={120} text="Loading events..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background py-8 px-6">
        <div className="max-w-[1280px] mx-auto text-center">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={fetchEvents}>Retry</Button>
        </div>
      </div>
    );
  }

  const filteredEvents = getFilteredEvents();

  return (
    <div className="min-h-screen bg-background">
      <section className="py-8 px-6 bg-muted/30">
        <div className="max-w-[1280px] mx-auto text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Events
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Get involved and make a difference by participating in our community events.
          </p>
        </div>
      </section>

      <section className="py-8 px-6">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex flex-wrap gap-3 mb-8">
            {tabs.map(tab => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "outline"}
                onClick={() => setActiveTab(tab.id)}
                className="rounded-full"
              >
                {tab.label}
              </Button>
            ))}
          </div>

          {filteredEvents.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-20" />
              <p className="text-muted-foreground text-lg font-medium">
                {activeTab === 'all' ? 'No events found.' : `No ${activeTab} events found.`}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredEvents.map((event) => (
                <EventCard
                  key={event._id}
                  event={event}
                  onClick={() => navigate(`/events/${event._id}`)}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Events;
