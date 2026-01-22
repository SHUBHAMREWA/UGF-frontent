import React, { useState } from 'react';
import { lazy, Suspense } from "react";
import { Link } from 'react-router-dom';
import { Calendar, Newspaper, GraduationCap, Heart, Info, ArrowRight, Images, Users, FileText, Mail } from 'lucide-react';
import HeroCompassion from '../components/HeroCompassion';
import Announcements from '../components/Announcements';
import StatisticsSection from '../components/StatisticsSection';
import PremiumEventsSection from '../components/PremiumEventsSection';
import PremiumBlogsSection from '../components/PremiumBlogsSection';
import PremiumProgramsSection from '../components/PremiumProgramsSection';
import PremiumCampaignsSection from '../components/PremiumCampaignsSection';
import GallerySection from '../components/GallerySection';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import Preloader from '../components/preLoader/Preloader';
import HeroCaraousal from '../components/HeroSection/HeroCaraousal';
import Loader from '../components/Loader';
const HomeCards = lazy(() => import("../components/HeroSection/HomeCards"));


const Home = () => {  
     
    const [loading , setLoading] = useState(true)
   
  return (
    
    <div className="min-h-screen bg-background">
      {loading && <Preloader onFinish={() => setLoading(false)} />}
        <HeroCaraousal/>
        <Suspense fallback={<div className="flex justify-center items-center py-20"><Loader /></div>}>
          <HomeCards/>
        </Suspense>
      <HeroCompassion />
      
      <Announcements />

      <section className="py-8 px-6 bg-muted/30">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Our Impact Across the Earth
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Real change happens when communities unite. See how we're creating sustainable impact worldwide.
            </p>
          </div>
          <StatisticsSection />
        </div>
      </section>

      <section className="py-8 px-6 bg-background">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mr-4">
                <Calendar className="text-primary text-xl" />
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
                Global Events
              </h2>
            </div>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Join world-class events and conferences connecting communities for positive change
            </p>
          </div>
          <PremiumEventsSection />
        </div>
      </section>

      <section className="py-8 px-6 bg-background">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mr-4">
                <Newspaper className="text-primary text-xl" />
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
                Impact Stories
              </h2>
            </div>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Insights and perspectives that inspire global change and drive sustainable impact
            </p>
          </div>
          <PremiumBlogsSection />
        </div>
      </section>

      <section className="py-8 px-6 bg-muted/30">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mr-4">
                <GraduationCap className="text-primary text-xl" />
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
                Global Programs
              </h2>
            </div>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Programs that uplift people and restore nature.
            </p>
          </div>
          <PremiumProgramsSection />
        </div>
      </section>

      <section className="py-8 px-6 bg-background">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mr-4">
                <Heart className="text-primary text-xl" />
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
                Global Campaigns
              </h2>
            </div>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Unite for impact through powerful social initiatives creating lasting change worldwide
            </p>
          </div>
          <PremiumCampaignsSection />
        </div>
      </section>

      <section className="py-8 px-6 bg-muted/30">
        <div className="max-w-[1280px] mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Join thousands of donors and volunteers who are already creating positive change in communities around the world.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link to="/donate">
                <Heart className="mr-2 h-5 w-5" />
                Start Donating
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/volunteer-join">
                <Users className="mr-2 h-5 w-5" />
                Become a Volunteer
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-8 px-6 bg-background">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Explore Our Website
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Discover all the features and pages available on our platform
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <Link to="/about">
              <Card className="p-6 h-full flex flex-col">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <Info className="text-primary text-xl" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-foreground">About Us</h3>
                <p className="text-sm text-muted-foreground mb-4 flex-1">
                  Learn about our story, mission, and vision for creating positive change.
                </p>
                <div className="flex items-center font-semibold text-sm text-primary">
                  <span>Learn More</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </Card>
            </Link>

            <Link to="/campaigns">
              <Card className="p-6 h-full flex flex-col">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <Heart className="text-primary text-xl" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-foreground">Campaigns</h3>
                <p className="text-sm text-muted-foreground mb-4 flex-1">
                  Support our ongoing campaigns and make a real impact in communities.
                </p>
                <div className="flex items-center font-semibold text-sm text-primary">
                  <span>View Campaigns</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </Card>
            </Link>

            <Link to="/programs">
              <Card className="p-6 h-full flex flex-col">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <GraduationCap className="text-primary text-xl" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-foreground">Programs</h3>
                <p className="text-sm text-muted-foreground mb-4 flex-1">
                  Explore our educational and community development programs.
                </p>
                <div className="flex items-center font-semibold text-sm text-primary">
                  <span>Explore Programs</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </Card>
            </Link>

            <Link to="/events">
              <Card className="p-6 h-full flex flex-col">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <Calendar className="text-primary text-xl" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-foreground">Events</h3>
                <p className="text-sm text-muted-foreground mb-4 flex-1">
                  Join our upcoming events and connect with the community.
                </p>
                <div className="flex items-center font-semibold text-sm text-primary">
                  <span>View Events</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </Card>
            </Link>

            <Link to="/gallery">
              <Card className="p-6 h-full flex flex-col">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <Images className="text-primary text-xl" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-foreground">Gallery</h3>
                <p className="text-sm text-muted-foreground mb-4 flex-1">
                  Browse through our photo gallery and see our impact in action.
                </p>
                <div className="flex items-center font-semibold text-sm text-primary">
                  <span>View Gallery</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </Card>
            </Link>

            <Link to="/sn-arya-mitra">
              <Card className="p-6 h-full flex flex-col">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <Users className="text-primary text-xl" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-foreground">WAERF</h3>
                <p className="text-sm text-muted-foreground mb-4 flex-1">
                  Connect with our verified volunteers and emergency contacts.
                </p>
                <div className="flex items-center font-semibold text-sm text-primary">
                  <span>Find Mitras</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </Card>
            </Link>

            <Link to="/blog">
              <Card className="p-6 h-full flex flex-col">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <FileText className="text-primary text-xl" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-foreground">Blog</h3>
                <p className="text-sm text-muted-foreground mb-4 flex-1">
                  Read our latest articles, stories, and insights about social impact.
                </p>
                <div className="flex items-center font-semibold text-sm text-primary">
                  <span>Read Blog</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </Card>
            </Link>

            <Link to="/contact">
              <Card className="p-6 h-full flex flex-col">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <Mail className="text-primary text-xl" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-foreground">Contact</h3>
                <p className="text-sm text-muted-foreground mb-4 flex-1">
                  Get in touch with us for questions, support, or collaboration.
                </p>
                <div className="flex items-center font-semibold text-sm text-primary">
                  <span>Contact Us</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      <GallerySection />
    </div>
  );
};

export default Home;
