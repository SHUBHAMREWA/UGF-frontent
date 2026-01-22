import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { Search, Clock, User, ArrowRight, Tag, Image as ImageIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import PageLoader from '../components/PageLoader';
import usePageLoader from '../hooks/usePageLoader';
import ImageLoader from '../components/ImageLoader';

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTag, setActiveTag] = useState("all");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const isPageLoading = usePageLoader();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/blog');
      if (response.data.success) {
        setPosts(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAllTags = () => {
    const tags = new Set(posts.flatMap(post => post.tags || []));
    return ['all', ...Array.from(tags)];
  };

  const filterPosts = () => {
    return posts
      .filter(post => 
        post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter(post => 
        activeTag === 'all' || (post.tags && post.tags.includes(activeTag))
      );
  };

  if (isPageLoading) {
    return <PageLoader subtitle="Loading blog posts..." />;
  }

  const filteredPosts = filterPosts();
  const tags = getAllTags();

  return (
    <div className="min-h-screen bg-background">
      <section className="py-8 px-6 bg-muted/30">
        <div className="max-w-[1280px] mx-auto text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Our Blog
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Read our latest articles and insights
          </p>
        </div>
      </section>

      <section className="py-8 px-6">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
            <div className="relative w-full md:w-1/3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
            {tags.length > 1 && (
              <div className="flex flex-wrap justify-center md:justify-end gap-2 w-full md:w-2/3">
                {tags.map(tag => (
                  <Button
                    key={tag}
                    variant={activeTag === tag ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveTag(tag)}
                    className="capitalize"
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12 min-h-[300px]">
              <ImageLoader size={120} text="Loading blog posts..." />
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No blog posts found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => {
                const images = post.images && post.images.length > 0 ? post.images : (post.image ? [post.image] : []);
                return (
                  <Card
                    key={post._id}
                    className="overflow-hidden flex flex-col hover:shadow-lg transition-shadow"
                  >
                    {images.length > 0 ? (
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={images[0]}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                        {post.featured && (
                          <Badge className="absolute top-3 left-3" variant="secondary">
                            Featured
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <div className="h-48 bg-muted flex items-center justify-center">
                        <ImageIcon className="w-12 h-12 text-muted-foreground" />
                      </div>
                    )}

                    <CardHeader className="pb-3">
                      {post.category && (
                        <Badge variant="outline" className="w-fit mb-2 text-xs">
                          {post.category}
                        </Badge>
                      )}
                      <CardTitle className="text-lg font-semibold line-clamp-2">
                        {post.title}
                      </CardTitle>
                      {post.excerpt && (
                        <CardDescription className="text-sm line-clamp-2 mt-2">
                          {post.excerpt}
                        </CardDescription>
                      )}
                    </CardHeader>

                    <CardContent className="flex-1 flex flex-col">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                        {post.author && (
                          <div className="flex items-center gap-1.5">
                            <User className="w-3 h-3" />
                            <span>{post.author}</span>
                          </div>
                        )}
                        {post.date && (
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3 h-3" />
                            <span>{format(new Date(post.date), 'MMM dd, yyyy')}</span>
                          </div>
                        )}
                      </div>
                      {post.tags && post.tags.filter(tag => tag).length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {post.tags.filter(tag => tag).slice(0, 3).map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              <Tag className="w-2.5 h-2.5 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>

                    <CardFooter className="pt-0">
                      <Button asChild variant="outline" className="w-full" size="sm">
                        <Link to={`/blog/${post._id}`}>
                          Read More
                          <ArrowRight className="ml-2 w-3 h-3" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Blog;
