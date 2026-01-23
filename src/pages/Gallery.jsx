import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Images } from "lucide-react";
import api from "../utils/api";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import ImageLoader from "../components/ImageLoader";

const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGalleryItems = async () => {
      try {
        setLoading(true);
        const response = await api.get('/gallery');
        setGalleryItems(response.data || []);
        setError(null);
      } catch (err) {
        setError('Failed to load gallery items. Please try again later.');
        console.error('Error fetching gallery items:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryItems();
  }, []);

  const categories = [
    { id: "all", name: "All Photos" },
    { id: "events", name: "Events" },
    { id: "programs", name: "Programs" },
    { id: "people", name: "People" },
    { id: "nature", name: "Nature" }
  ];

  const filteredItems = activeCategory === "all"
    ? galleryItems
    : galleryItems.filter(item => item.category === activeCategory);

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8 px-6 flex items-center justify-center">
        <div className="max-w-[1280px] mx-auto text-center">
          <ImageLoader size={120} text="Loading gallery..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background py-8 px-6">
        <div className="max-w-[1280px] mx-auto text-center">
          <p className="text-destructive mb-4">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <section className="py-8 px-6 bg-muted/30">
        <div className="max-w-[1280px] mx-auto text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Gallery
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Capturing moments of impact and transformation
          </p>
        </div>
      </section>

      <section className="py-8 px-6">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex flex-wrap gap-3 mb-8">
            {categories.map(category => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "outline"}
                onClick={() => setActiveCategory(category.id)}
                className="rounded-full"
              >
                {category.name}
              </Button>
            ))}
          </div>

          {filteredItems.length === 0 ? (
            <div className="text-center py-8">
              <Images className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No gallery items found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <Card
                  key={item._id}
                  className="overflow-hidden cursor-pointer group"
                  onClick={() => item.link && navigate(item.link)}
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title || 'Gallery image'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {item.title && (
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <p className="text-white font-semibold text-center px-4">{item.title}</p>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Gallery;
