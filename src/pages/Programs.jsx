import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Search, Filter, ArrowRight, Clock, Users } from 'lucide-react';
import api from "../utils/api";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import ImageLoader from "../components/ImageLoader";

const Programs = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
    
  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const response = await api.get('/programs');
      setPrograms(response.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: "all", name: "All Programs" },
    { id: "health", name: "Health" },
    { id: "education", name: "Education" },
    { id: "food", name: "Food Security" },
    { id: "social", name: "Social Welfare" },
    { id: "environment", name: "Environment" }
  ];

  const filteredPrograms = programs.filter(program => {
    const matchesFilter = activeFilter === "all" || program.category === activeFilter;
    const matchesSearch = !searchTerm || 
      program.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8 px-6 flex items-center justify-center">
        <div className="max-w-[1280px] mx-auto text-center">
          <ImageLoader size={120} text="Loading programs..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background py-8 px-6">
        <div className="max-w-[1280px] mx-auto text-center">
          <p className="text-destructive mb-4">Error: {error}</p>
          <Button onClick={fetchPrograms}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <section className="py-8 px-6 bg-muted/30">
        <div className="max-w-[1280px] mx-auto text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Our Programs
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            We work across multiple sectors to address the root causes of poverty and create sustainable change.
          </p>
        </div>
      </section>

      <section className="py-8 px-6">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search programs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-input bg-background rounded-md focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mb-8">
            {categories.map(category => (
              <Button
                key={category.id}
                variant={activeFilter === category.id ? "default" : "outline"}
                onClick={() => setActiveFilter(category.id)}
                className="rounded-full"
              >
                {category.name}
              </Button>
            ))}
          </div>

          {filteredPrograms.length === 0 ? (
            <div className="text-center py-8">
              <GraduationCap className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No programs found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPrograms.map((program) => (
                <Card
                  key={program._id}
                  className="overflow-hidden cursor-pointer h-full flex flex-col"
                  onClick={() => navigate(`/programs/${program._id}`)}
                >
                  {program.image && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={program.image}
                        alt={program.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                        {program.category || 'Program'}
                      </span>
                      {program.status && (
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          program.status === 'active' ? 'bg-secondary/10 text-secondary' : 'bg-muted text-muted-foreground'
                        }`}>
                          {program.status}
                        </span>
                      )}
                    </div>
                    <CardTitle className="line-clamp-2">{program.title}</CardTitle>
                  </CardHeader>

                  <CardContent className="flex-1">
                    <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                      {program.description}
                    </p>
                    {program.duration && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{program.duration}</span>
                      </div>
                    )}
                  </CardContent>

                  <CardFooter>
                    <Button className="w-full" variant="outline">
                      Learn More
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Programs;
