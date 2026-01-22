import React, { useState, useEffect, useRef } from 'react';
import { GraduationCap, Search, Filter, ArrowRight, Clock, Star, Leaf, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import ImageLoader from './ImageLoader';

const PremiumProgramsSection = () => {
  const [programs, setPrograms] = useState([]);
  const [filteredPrograms, setFilteredPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    statusFilter: 'all',
    difficultyFilter: 'all',
    categoryFilter: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    fetchPrograms();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [programs, filters, searchTerm]);

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const response = await api.get('/programs');
      const programsData = response?.data || [];
      setPrograms(programsData);
      setFilteredPrograms(programsData);
    } catch (error) {
      console.error('Error fetching programs:', error);
      setPrograms([]);
      setFilteredPrograms([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...programs];

    if (searchTerm) {
      filtered = filtered.filter(program =>
        program?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        program?.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        program?.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        program?.tags?.some(tag => tag?.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (filters.statusFilter !== 'all') {
      filtered = filtered.filter(program => program?.status === filters.statusFilter);
    }

    if (filters.difficultyFilter !== 'all') {
      filtered = filtered.filter(program => program?.difficulty === filters.difficultyFilter);
    }

    if (filters.categoryFilter !== 'all') {
      filtered = filtered.filter(program => program?.category === filters.categoryFilter);
    }

    setFilteredPrograms(filtered);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return 'bg-primary/10 text-primary';
      case 'ongoing': return 'bg-secondary/10 text-secondary';
      case 'completed': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'upcoming': return 'UPCOMING';
      case 'ongoing': return 'ONGOING';
      case 'completed': return 'COMPLETED';
      default: return 'UNKNOWN';
    }
  };

  const getProgressPercentage = (participants, maxParticipants) => {
    return Math.round(((participants || 0) / (maxParticipants || 1)) * 100);
  };

  const displayPrograms = filteredPrograms.slice(0, 6);

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
          <ImageLoader size={80} text="Loading programs..." />
        </div>
      ) : displayPrograms.length > 0 ? (
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
              {displayPrograms.map((program) => (
                <Card
                  key={program?._id}
                  className="overflow-hidden flex flex-col cursor-pointer flex-shrink-0 w-80 h-[600px]"
                  onClick={() => navigate(`/programs/${program._id}`)}
                  style={{ scrollSnapAlign: 'start' }}
                >
              <div className="relative h-52 overflow-hidden">
                <img
                  src={program?.image}
                  alt={program?.title}
                  className="w-full h-full object-cover"
                  onError={(e) => (e.currentTarget.src = '/fallback.jpg')}
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-card/90 text-foreground">
                    {program?.category || 'Program'}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(program?.status)}`}>
                    {getStatusText(program?.status)}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 bg-card/90 rounded-md px-4 py-2">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="text-sm font-bold text-foreground">{program?.duration}</span>
                  </div>
                </div>
              </div>

              <CardHeader className="flex-shrink-0">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="p-1.5 rounded-lg bg-primary/10">
                      <Leaf className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-primary/10 text-primary truncate">
                      {program?.category}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-secondary/10 flex-shrink-0">
                    <Star className="w-4 h-4 text-secondary" />
                    <span className="text-sm font-bold text-foreground">{program?.rating}</span>
                  </div>
                </div>
                <CardTitle className="line-clamp-2 text-ellipsis overflow-hidden">{program?.title}</CardTitle>
              </CardHeader>

              <CardContent className="flex-1 overflow-hidden">
                <p className="text-muted-foreground text-sm line-clamp-2 mb-5 text-ellipsis overflow-hidden">{program?.description}</p>

                <div className="mb-5">
                  <div className="flex items-center justify-between text-sm mb-3 text-foreground">
                    <span className="font-semibold">Enrollment Progress</span>
                    <span className="font-bold text-primary">{program?.participants || 0}/{program?.maxParticipants || 1}</span>
                  </div>
                  <div className="w-full rounded-full h-3.5 overflow-hidden bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-300"
                      style={{ width: `${getProgressPercentage(program?.participants, program?.maxParticipants)}%` }}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-5">
                  {program?.tags?.slice(0, 2).map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-3 py-1.5 rounded-full text-xs font-semibold bg-muted text-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                  {program?.tags?.length > 2 && (
                    <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-muted text-foreground">
                      +{program?.tags.length - 2} more
                    </span>
                  )}
                </div>
              </CardContent>

              <CardFooter className="flex items-center justify-between pt-3 border-t flex-shrink-0">
                <div className="flex flex-col">
                  <span className="text-xs font-semibold uppercase tracking-wide mb-0.5 text-muted-foreground">Price</span>
                  <span className="text-2xl font-bold text-foreground truncate">{program?.price}</span>
                </div>
                <Button>
                  <span>Enroll Now</span>
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
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
          <GraduationCap className="w-12 h-12 text-muted-foreground mx-auto mb-6" />
          <h3 className="text-xl font-semibold text-foreground mb-2">No programs found</h3>
          <p className="text-muted-foreground">No programs available at the moment</p>
        </div>
      )}
    </div>
  );
};

export default PremiumProgramsSection;
