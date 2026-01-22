import React, { useState, useEffect } from 'react';
import { Bell, ExternalLink } from 'lucide-react';
import api from '../utils/api';
import { Card } from './ui/card';
import ImageLoader from './ImageLoader';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await api.get('/important-updates/public');
      
      if (response.data.success) {
        setAnnouncements(response.data.updates);
      }
    } catch (error) {
      console.error('Error fetching announcements:', error);
      setError('Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-8 bg-muted/30">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="flex items-center justify-center min-h-[200px]">
            <ImageLoader size={100} text="Loading updates..." />
          </div>
        </div>
      </div>
    );
  }

  if (error || announcements.length === 0) {
    return null;
  }

  return (
    <div className="py-8 bg-muted/30">
      <div className="max-w-[1280px] mx-auto px-6">
        <Card className="p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-primary/10 mr-4">
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                Latest Updates
              </h2>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              <span className="text-sm font-medium text-muted-foreground">Live</span>
            </div>
          </div>
        
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <div
                key={announcement._id}
                className="border border-border rounded-xl p-4 sm:p-5 bg-card"
              >
                <div className="flex items-start space-x-4">
                  {announcement.imageUrl && announcement.imageUrl.trim() !== '' && (
                    <div className="flex-shrink-0">
                      <img
                        src={announcement.imageUrl}
                        alt={announcement.title}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        {announcement.link ? (
                          <a
                            href={announcement.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-lg sm:text-xl font-semibold flex items-center text-foreground hover:text-primary"
                          >
                            {announcement.title}
                            <ExternalLink className="ml-2 w-4 h-4 opacity-60" />
                          </a>
                        ) : (
                          <h3 className="text-lg sm:text-xl font-semibold text-foreground">
                            {announcement.title}
                          </h3>
                        )}

                        {announcement.description && (
                          <p className="mt-2 leading-relaxed text-muted-foreground">
                            {announcement.description}
                          </p>
                        )}
                      </div>

                      <div className="flex-shrink-0">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          New
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center text-sm text-muted-foreground">
                      <span>
                        {new Date(announcement.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-border">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <p className="text-sm text-muted-foreground">
                {announcements.length} update{announcements.length !== 1 ? 's' : ''} available
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Announcements;
