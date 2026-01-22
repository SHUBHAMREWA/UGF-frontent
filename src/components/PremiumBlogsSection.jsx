import React, { useState, useEffect, useRef } from 'react';
import { Newspaper, Search, Filter, ArrowRight, Eye, Clock, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { format } from 'date-fns';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import ImageLoader from './ImageLoader';

const PremiumBlogsSection = () => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    categoryFilter: 'all',
    sortBy: 'recent'
  });
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [blogs, filters, searchTerm]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/blog');
      const blogsData = response?.data?.success ? response?.data?.data : response?.data || [];
      setBlogs(blogsData);
      setFilteredBlogs(blogsData);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setBlogs([]);
      setFilteredBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...blogs];
    if (searchTerm) {
      filtered = filtered.filter(blog =>
        blog?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog?.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog?.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog?.tags?.some(tag => tag?.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    if (filters.categoryFilter !== 'all') {
      filtered = filtered.filter(blog => blog?.category === filters.categoryFilter);
    }
    if (filters.sortBy === 'recent') {
      filtered = filtered.sort((a, b) => new Date(b?.date) - new Date(a?.date));
    } else if (filters.sortBy === 'popular') {
      filtered = filtered.sort((a, b) => (b?.views || 0) - (a?.views || 0));
    }
    setFilteredBlogs(filtered);
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Technology': 'bg-primary/10 text-primary',
      'Sustainability': 'bg-secondary/10 text-secondary',
      'Health': 'bg-accent/10 text-accent-foreground',
      'Community': 'bg-primary/10 text-primary',
      'Education': 'bg-secondary/10 text-secondary'
    };
    return colors[category] || 'bg-muted text-muted-foreground';
  };

  const displayBlogs = filteredBlogs.slice(0, 6);

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
          <ImageLoader size={80} text="Loading blogs..." />
        </div>
      ) : displayBlogs.length > 0 ? (
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
              {displayBlogs.map((blog) => (
                <Card
                  key={blog._id}
                  className="overflow-hidden cursor-pointer flex flex-col flex-shrink-0 w-80 h-[500px]"
                  onClick={() => navigate(`/blog/${blog._id}`)}
                  style={{ scrollSnapAlign: 'start' }}
                >
              <div className="relative h-52 overflow-hidden">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getCategoryColor(blog.category)}`}>
                    {blog.category}
                  </span>
                </div>
              </div>

              <CardHeader className="flex-shrink-0">
                <CardTitle className="line-clamp-2 text-ellipsis overflow-hidden">{blog.title}</CardTitle>
              </CardHeader>

              <CardContent className="flex-1 overflow-hidden flex flex-col">
                <p className="text-muted-foreground text-sm line-clamp-3 mb-4 text-ellipsis overflow-hidden">{blog.excerpt}</p>
                
                <div className="flex items-center gap-4 text-xs text-muted-foreground flex-shrink-0">
                  <div className="flex items-center space-x-1 truncate">
                    <User className="w-3 h-3 text-primary flex-shrink-0" />
                    <span className="truncate">{blog.author}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-primary flex-shrink-0" />
                    <span>{blog.readTime}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Eye className="w-3 h-3 text-primary flex-shrink-0" />
                    <span>{blog.views || 0}</span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="border-t pt-4 flex-shrink-0">
                <Button variant="ghost" className="w-full">
                  Read More
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
          <Newspaper className="w-12 h-12 text-muted-foreground mx-auto mb-6" />
          <h3 className="text-xl font-semibold text-foreground mb-2">No blogs found</h3>
          <p className="text-muted-foreground">No blogs available at the moment</p>
        </div>
      )}
    </div>
  );
};

export default PremiumBlogsSection;
