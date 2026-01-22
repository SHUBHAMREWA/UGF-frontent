import React, { useState, useEffect, useRef } from "react";
import { Calendar, MapPin, Filter, Search, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { format } from "date-fns";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import ImageLoader from "./ImageLoader";

const PremiumEventsSection = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    dateFilter: "all",
    locationFilter: "all",
    categoryFilter: "all",
  });
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [events, filters, searchTerm]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await api.get("/events");
      const eventsData = response?.data?.success ? response?.data?.data : response?.data || [];
      const eventsWithDates = eventsData.map((event) => ({
        ...event,
        date: new Date(event?.date || new Date()),
        status: getEventStatus(event),
      }));
      setEvents(eventsWithDates);
      setFilteredEvents(eventsWithDates);
    } catch (error) {
      console.error("Error fetching events:", error);
      setEvents([]);
      setFilteredEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const getEventStatus = (event) => {
    const now = new Date();
    const eventStartTime = new Date(event?.date || new Date());
    if (event?.startTime) {
      const [h, m] = event.startTime.split(":");
      eventStartTime.setHours(parseInt(h), parseInt(m), 0);
    }
    if (now < eventStartTime) return "upcoming";
    if (now >= eventStartTime && now <= new Date(event?.date || new Date()).setHours(23, 59, 59)) return "ongoing";
    return "past";
  };

  const applyFilters = () => {
    let filtered = events;
    if (searchTerm) {
      filtered = filtered.filter(
        (event) =>
          event?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event?.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event?.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filters.dateFilter !== "all") filtered = filtered.filter((event) => event?.status === filters.dateFilter);
    if (filters.locationFilter !== "all") filtered = filtered.filter((event) => event?.location?.toLowerCase().includes(filters.locationFilter.toLowerCase()));
    if (filters.categoryFilter !== "all") filtered = filtered.filter((event) => event?.category === filters.categoryFilter);
    setFilteredEvents(filtered);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "upcoming":
        return "bg-primary/10 text-primary";
      case "ongoing":
        return "bg-secondary/10 text-secondary";
      case "past":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "upcoming":
        return "UPCOMING";
      case "ongoing":
        return "ONGOING";
      case "past":
        return "PAST";
      default:
        return "UNKNOWN";
    }
  };

  const displayEvents = filteredEvents.slice(0, 6);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 336; // 320px (w-80) + 16px (gap-6)
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="w-full relative">
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <ImageLoader size={80} text="Loading events..." />
        </div>
      ) : displayEvents.length > 0 ? (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm shadow-lg"
            onClick={() => scroll('left')}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div 
            ref={scrollContainerRef}
            className="overflow-x-auto scrollbar-hide -mx-6 px-6 w-[calc(100%+3rem)]"
          >
            <div className="flex gap-6 pb-4 w-max" style={{ scrollSnapType: 'x mandatory', scrollPaddingLeft: '24px' }}>
              {displayEvents.map((event) => (
                <Card
                  key={event._id}
                  className="overflow-hidden cursor-pointer flex flex-col flex-shrink-0 w-80 h-[500px]"
                  onClick={() => navigate(`/events/${event._id}`)}
                  style={{ scrollSnapAlign: 'start' }}
                >
              <div className="relative h-56 flex-shrink-0">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-card rounded-md shadow-md px-3 py-2 text-center">
                  <p className="text-sm font-bold text-foreground">{format(event.date, "dd")}</p>
                  <p className="text-xs uppercase text-muted-foreground">{format(event.date, "MMM")}</p>
                </div>
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(event.status)}`}>
                    {getStatusText(event.status)}
                  </span>
                </div>
              </div>

              <CardHeader className="flex-shrink-0">
                <CardTitle className="line-clamp-2 text-ellipsis overflow-hidden">{event.title}</CardTitle>
              </CardHeader>

              <CardContent className="flex-1 overflow-hidden">
                <p className="text-muted-foreground text-sm line-clamp-3 text-ellipsis overflow-hidden">{event.description}</p>
              </CardContent>

              <CardFooter className="flex justify-between items-center text-xs border-t pt-4 flex-shrink-0">
                <span className="flex items-center space-x-1 text-muted-foreground truncate">
                  <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="truncate">{event.location}</span>
                </span>
              </CardFooter>
              </Card>
            ))}
          </div>
        </div>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm shadow-lg"
            onClick={() => scroll('right')}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </>
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No events found.</p>
        </div>
      )}
    </div>
  );
};

export default PremiumEventsSection;
