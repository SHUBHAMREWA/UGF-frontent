import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { User, Calendar, Share2 } from 'lucide-react';
import api from '../utils/api';
import ShareButton from '../components/common/ShareButton';
import PageLoader from '../components/PageLoader';
import usePageLoader from '../hooks/usePageLoader';

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isPageLoading = usePageLoader();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/blog/${id}`);
        setPost(response.data.success ? response.data.data : response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (isPageLoading || loading) {
    return <PageLoader subtitle="Loading blog post..." />;
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', padding: '32px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ maxWidth: '760px', width: '100%', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', padding: '32px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>Error</h2>
          <p style={{ fontSize: '16px', color: '#334155', marginBottom: '24px' }}>{error}</p>
          <Link to="/blog" style={{ fontSize: '14px', color: '#2563eb', textDecoration: 'none' }}>Back to Blog</Link>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', padding: '32px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ maxWidth: '760px', width: '100%', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', padding: '32px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>Blog Post Not Found</h2>
          <p style={{ fontSize: '16px', color: '#334155', marginBottom: '24px' }}>The requested blog post could not be found.</p>
          <Link to="/blog" style={{ fontSize: '14px', color: '#2563eb', textDecoration: 'none' }}>Back to Blog</Link>
        </div>
      </div>
    );
  }

  const images = post.images && post.images.length > 0 ? post.images : (post.image ? [post.image] : []);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', padding: '32px 16px' }}>
      <div style={{ width: '100%', margin: '0 auto', padding: '32px' }}>
        {/* Back link */}
        <div style={{ marginBottom: '16px' }}>
          <Link
            to="/blog"
            style={{
              fontSize: '14px',
              color: '#2563eb',
              textDecoration: 'none',
              fontFamily: 'system-ui, sans-serif'
            }}
          >
            ← Back to Blog
          </Link>
        </div>

        {/* Article card */}
        <article
          style={{
            width: '100%',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
            padding: '32px',
            fontFamily: 'system-ui, sans-serif'
          }}
        >
          {/* Featured image */}
          {images.length > 0 && (
            <div style={{ marginBottom: '24px', textAlign: 'center' }}>
              <img
                src={images[0]}
                alt={post.title}
                style={{
                  maxWidth: '600px',
                  width: '100%',
                  height: 'auto',
                  borderRadius: '10px',
                  display: 'block',
                  margin: '0 auto'
                }}
              />
            </div>
          )}

          {/* Article title */}
          <h1
            style={{
              fontSize: '32px',
              fontWeight: 700,
              lineHeight: 1.3,
              color: '#0f172a',
              marginBottom: '12px',
              marginTop: 0
            }}
          >
            {post.title}
          </h1>

          {/* Meta row */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '14px',
              color: '#475569',
              marginBottom: '24px',
              flexWrap: 'wrap',
              gap: '12px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              {post.author && (
                <span>{post.author}</span>
              )}
              {post.author && post.date && <span>•</span>}
              {post.date && !isNaN(new Date(post.date)) && (
                <span>{format(new Date(post.date), 'MMMM dd, yyyy')}</span>
              )}
            </div>
            <div>
              <ShareButton
                url={window.location.href}
                title={post.title}
                description={post.excerpt || post.content?.substring(0, 150) + '...'}
              >
                <button
                  style={{
                    fontSize: '14px',
                    color: '#475569',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    textDecoration: 'none'
                  }}
                >
                  Share
                </button>
              </ShareButton>
            </div>
          </div>

          {/* Article body */}
          <div
            style={{
              fontSize: '16px',
              lineHeight: 1.7,
              color: '#334155'
            }}
            dangerouslySetInnerHTML={{
              __html: post.content?.replace(/<p>/g, '<p style="margin-bottom: 16px; margin-top: 0;">') || ''
            }}
          />

          {/* Bottom action */}
          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <Link
              to="/blog"
              style={{
                display: 'inline-block',
                fontSize: '14px',
                color: '#334155',
                textDecoration: 'none',
                border: '1px solid #e5e7eb',
                padding: '12px 20px',
                borderRadius: '8px',
                backgroundColor: '#ffffff'
              }}
            >
              View Full Blog Post
            </Link>
          </div>
        </article>
      </div>

      <style>{`
        @media (max-width: 768px) {
          div[style*="padding: '32px'"] {
            padding: 16px !important;
          }
          article[style*="padding: '32px'"] {
            padding: 24px 16px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default BlogDetails;
