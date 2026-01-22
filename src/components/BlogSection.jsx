import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import api from '../utils/api';
import './BlogSection.css';

const BlogSection = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/blog');
      if (response.data.success) {
        // Get the latest 2 blog posts
        const latestPosts = response.data.data.slice(0, 2);
        setBlogPosts(latestPosts);
      }
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      // Fallback to sample posts if API fails
      setBlogPosts([
        {
          _id: 1,
          title: "AWESOME BLOG POST TITLE GOES HERE",
          excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
          author: "John Doe",
          date: new Date(),
          image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          comments: 24
        },
        {
          _id: 2,
          title: "AWESOME BLOG POST TITLE GOES HERE",
          excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
          author: "John Doe",
          date: new Date(),
          image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          comments: 24
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="blog-section">
        <div className="blog-container">
          <div className="blog-header">
            <h2>NEWS</h2>
            <div className="blog-accent"></div>
            <p className="blog-intro">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
          <div className="blog-preview-grid">
            <div className="blog-preview-skeleton"></div>
            <div className="blog-preview-skeleton"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <motion.section 
      className="blog-section"
      initial={{ y: 20 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="blog-container">
        <div className="blog-header">
          <h2>NEWS</h2>
          <div className="blog-accent"></div>
          <p className="blog-intro">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
        
        <div className="blog-preview-grid">
          {blogPosts.map((post, index) => (
            <motion.div
              key={post._id}
              className="blog-preview-card"
              initial={{ scale: 0.8 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ 
                y: -5, 
                boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                transition: { duration: 0.3 }
              }}
              onClick={() => navigate(`/blog/${post._id}`)}
              style={{ cursor: 'pointer' }}
            >
              <div className="blog-preview-image">
                <img src={post.image} alt={post.title} />
                <div className="image-overlay-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21,15 16,10 5,21"/>
                  </svg>
                </div>
              </div>
              
              <div className="blog-preview-content">
                <h3 className="blog-preview-title">{post.title}</h3>
                <p className="blog-preview-excerpt">{post.excerpt}</p>
                
                <div className="blog-preview-meta">
                  <span className="blog-date">{format(new Date(post.date), "dd MMM yy")}</span>
                  <span className="blog-author">{post.author}</span>
                  <span className="blog-comments">{post.comments} Comments</span>
                </div>
                
                <button className="blog-read-btn">
                  READ ON
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default BlogSection; 