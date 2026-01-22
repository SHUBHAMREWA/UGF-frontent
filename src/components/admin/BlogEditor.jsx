import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, X, Image as ImageIcon, Tag, User, FileText, Star, Calendar, Eye } from 'lucide-react';
import api from '../../utils/api';
import { useForm } from '../../hooks/useForm';
import { API_ENDPOINTS } from '../../constants';
import { formatDate } from '../../utils/formatters';
import ImageCropper from '../common/ImageCropper';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { FormField, FormTextarea } from '../common';
import withAdminAccess from '../Auth/withAdminAccess';
import ImageLoader from '../ImageLoader';

const BlogEditor = () => {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [saving, setSaving] = useState(false);

  // Fetch posts
  const fetchPosts = async () => {
    try {
      setLoadingPosts(true);
      const response = await api.get(API_ENDPOINTS.BLOG.LIST);
      setPosts(response.data.data || response.data || []);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setLoadingPosts(false);
    }
  };

  // Save post
  const savePost = async (formData) => {
    try {
      setSaving(true);
      const formattedData = new FormData();
      formattedData.append('title', formData.title);
      formattedData.append('excerpt', formData.excerpt);
      formattedData.append('content', formData.content);
      formattedData.append('author', formData.author);
      formattedData.append('tags', JSON.stringify(formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)));
      formattedData.append('featured', formData.featured);
      
      images.forEach((image) => {
        formattedData.append('images', image.file);
      });

      if (selectedPost && existingImages.length > 0) {
        formattedData.append('existingImages', JSON.stringify(existingImages));
      }

      if (selectedPost) {
        await api.put(API_ENDPOINTS.BLOG.UPDATE(selectedPost._id), formattedData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post(API_ENDPOINTS.BLOG.CREATE, formattedData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      
      await fetchPosts();
      resetForm();
    } catch (error) {
      console.error('Error saving blog post:', error);
      throw error;
    } finally {
      setSaving(false);
    }
  };

  // Delete post
  const deletePost = async (postId) => {
    try {
      await api.delete(API_ENDPOINTS.BLOG.DELETE(postId));
      await fetchPosts();
    } catch (error) {
      console.error('Error deleting blog post:', error);
    }
  };

  // Form hook
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setValues,
    reset
  } = useForm(
    {
      title: '',
      excerpt: '',
      content: '',
      author: '',
      tags: '',
      featured: false
    },
    async (formValues) => {
      await savePost(formValues);
    }
  );

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleImagesChange = (newImages) => {
    setImages(newImages);
  };

  const handleDelete = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      await deletePost(postId);
    }
  };

  const handleEdit = (post) => {
    setSelectedPost(post);
    setValues({
      title: post.title || '',
      excerpt: post.excerpt || '',
      content: post.content || '',
      author: post.author || '',
      tags: post.tags?.join(', ') || '',
      featured: post.featured || false
    });
    
    if (post.images && post.images.length > 0) {
      setExistingImages(post.images);
    } else {
      setExistingImages([]);
    }
    
    setImages([]);
    setShowForm(true);
  };

  const resetForm = () => {
    setSelectedPost(null);
    reset();
    setImages([]);
    setExistingImages([]);
    setShowForm(false);
  };

  const handleNewPost = () => {
    resetForm();
    setShowForm(true);
  };

  const filteredPosts = posts.filter(post => 
    post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const removeExistingImage = (imageIndex) => {
    setExistingImages(prev => prev.filter((_, index) => index !== imageIndex));
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Blog Management</h1>
            <p className="text-muted-foreground mt-1">Create and manage blog posts</p>
          </div>
          {!showForm && (
            <Button onClick={handleNewPost} className="gap-2">
              <Plus className="w-4 h-4" />
              New Post
            </Button>
          )}
        </div>

        {/* Form Section */}
        {showForm && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{selectedPost ? 'Edit Blog Post' : 'Create New Blog Post'}</CardTitle>
                  <CardDescription>
                    {selectedPost ? 'Update your blog post content and settings' : 'Create a new blog post for your website'}
                  </CardDescription>
                </div>
                <Button variant="ghost" size="icon" onClick={resetForm}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    label="Title"
                    name="title"
                    value={values.title}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.title}
                    touched={touched.title}
                    required
                    placeholder="Enter blog post title"
                  />

                  <FormField
                    label="Author"
                    name="author"
                    value={values.author}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.author}
                    touched={touched.author}
                    required
                    placeholder="Author name"
                  />
                </div>

                <FormTextarea
                  label="Excerpt"
                  name="excerpt"
                  value={values.excerpt}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.excerpt}
                  touched={touched.excerpt}
                  rows={3}
                  required
                  placeholder="Brief description of the blog post"
                />

                <FormTextarea
                  label="Content"
                  name="content"
                  value={values.content}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.content}
                  touched={touched.content}
                  rows={12}
                  required
                  placeholder="Write your blog post content here..."
                />

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    Tags
                  </Label>
                  <Input
                    name="tags"
                    value={values.tags}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="e.g., health, water, community (comma-separated)"
                  />
                  {errors.tags && touched.tags && (
                    <p className="text-sm text-destructive">{errors.tags}</p>
                  )}
                </div>

                {/* Image Upload */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    Blog Images
                  </Label>
                  <ImageCropper
                    onImageCropped={(image) => {
                      const newImage = {
                        id: Date.now(),
                        file: image,
                        preview: URL.createObjectURL(image),
                        name: image.name,
                        size: image.size
                      };
                      handleImagesChange([...images, newImage]);
                    }}
                    aspectRatio={16 / 9}
                    maxWidth={1920}
                    maxHeight={1080}
                    buttonText="Add Blog Image"
                  />
                  
                  {images.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                      {images.map((img) => (
                        <div key={img.id} className="relative group">
                          <img 
                            src={img.preview} 
                            alt={img.name} 
                            className="w-full h-32 object-cover rounded-lg border border-border"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleImagesChange(images.filter(i => i.id !== img.id))}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Existing Images */}
                {existingImages.length > 0 && (
                  <div className="space-y-3">
                    <Label>Existing Images</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {existingImages.map((image, index) => (
                        <div key={index} className="relative group">
                          <img 
                            src={image} 
                            alt={`Existing ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg border border-border"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeExistingImage(index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Featured Checkbox */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="featured"
                    name="featured"
                    checked={values.featured}
                    onChange={handleChange}
                    className="w-4 h-4 rounded border-input"
                  />
                  <Label htmlFor="featured" className="flex items-center gap-2 cursor-pointer">
                    <Star className="w-4 h-4 text-primary" />
                    Featured Post
                  </Label>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t">
                  <Button type="submit" disabled={saving} className="gap-2">
                    {saving ? 'Saving...' : selectedPost ? 'Update Post' : 'Create Post'}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Posts List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Blog Posts</CardTitle>
                <CardDescription>{posts.length} total posts</CardDescription>
              </div>
              <div className="relative w-64">
                <Input
                  type="text"
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                <Eye className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loadingPosts ? (
              <div className="flex items-center justify-center py-12 min-h-[300px]">
                <ImageLoader size={100} text="Loading posts..." />
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {searchQuery ? 'No posts found matching your search' : 'No blog posts yet. Create your first post!'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.map(post => (
                  <motion.div
                    key={post._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    {/* Post Image */}
                    <div className="relative h-48 bg-muted">
                      {post.images && post.images.length > 0 ? (
                        <>
                          <img 
                            src={post.images[0]} 
                            alt={post.title}
                            className="w-full h-full object-cover"
                          />
                          {post.images.length > 1 && (
                            <div className="absolute top-2 right-2 bg-background/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium">
                              +{post.images.length - 1} more
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="w-12 h-12 text-muted-foreground" />
                        </div>
                      )}
                      {post.featured && (
                        <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                          <Star className="w-3 h-3 fill-current" />
                          Featured
                        </div>
                      )}
                    </div>

                    {/* Post Content */}
                    <div className="p-4 space-y-3">
                      <h3 className="font-semibold text-foreground line-clamp-2">{post.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                        <div className="flex items-center gap-2">
                          <User className="w-3 h-3" />
                          <span>{post.author}</span>
                        </div>
                        {post.createdAt && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDate(post.createdAt, 'MMM d, yyyy')}</span>
                          </div>
                        )}
                      </div>

                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-2">
                          {post.tags.slice(0, 3).map((tag, idx) => (
                            <span 
                              key={idx}
                              className="text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground"
                            >
                              {tag}
                            </span>
                          ))}
                          {post.tags.length > 3 && (
                            <span className="text-xs px-2 py-1 text-muted-foreground">
                              +{post.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(post)}
                          className="flex-1 gap-2"
                        >
                          <Edit className="w-3 h-3" />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(post._id)}
                          className="gap-2"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default withAdminAccess(BlogEditor); 