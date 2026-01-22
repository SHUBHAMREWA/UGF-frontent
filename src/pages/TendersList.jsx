import React, { useState, useEffect } from 'react';
import { FileText, AlertCircle, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../utils/api';
import TenderCard from '../components/tender/TenderCard';
import ApplicationModal from '../components/tender/ApplicationModal';
import { Card } from '../components/ui/card';
import ImageLoader from '../components/ImageLoader';

const TendersList = () => {
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTender, setSelectedTender] = useState(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    fetchTenders();
  }, []);

  const fetchTenders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/tenders');
      
      if (response.data.success) {
        setTenders(response.data.tenders);
      }
    } catch (error) {
      console.error('Error fetching tenders:', error);
      toast.error('Failed to load tenders');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = (tender) => {
    setSelectedTender(tender);
    setShowApplicationModal(true);
  };

  const handleApplicationSuccess = () => {
    setShowApplicationModal(false);
    setSelectedTender(null);
    toast.success('Application submitted successfully!');
  };
  const disclaimerItems = [
    <p><strong>United Global Federation</strong> is a Section 8 Company (Non-Profit Organization).</p>,
    <p>All tenders are issued solely for the execution of <span className="font-semibold text-primary">social welfare projects</span>.</p>,
    <p>No profit, commission, or commercial trading is involved in any process.</p>,
    <p>Payments are made strictly against <span className="font-semibold text-primary">work completion and verification</span>.</p>,
    <p><strong>Funding Source:</strong> Government Grant / CSR / Donor Fund / Foundation / MLA / CM Fund / OTHER.</p>,
    <p>UGF does not earn any profit from these tenders.</p>,
    <p>The organization acts only as a <span className="font-semibold text-primary">project implementing and monitoring agency</span>.</p>
  ];

  return (
    <div className="min-h-screen bg-background">
      <section className="py-8 px-6 bg-muted/30">
        <div className="max-w-[1280px] mx-auto text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mr-4">
              <FileText className="text-primary text-xl" />
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
              Available Tenders
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Apply for tenders and contribute to our mission of creating positive change
          </p>
        </div>
      </section>

      <section className="py-8 px-6 bg-background">
        <div className="max-w-[1280px] mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12 min-h-[400px]">
              <ImageLoader size={120} text="Loading tenders..." />
            </div>
          ) : tenders.length === 0 ? (
            <Card className="p-12 text-center">
              <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">No Active Tenders</h3>
              <p className="text-muted-foreground">
                There are currently no active tenders available. Please check back later.
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tenders.map((tender) => (
                <TenderCard
                  key={tender._id}
                  tender={tender}
                  onApply={() => handleApply(tender)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Important Information Section */}
      <section className="py-12 px-6 bg-muted/30 border-t border-border">
        <div className="max-w-[1280px] mx-auto">
          <div className="bg-card rounded-2xl shadow-lg p-8 md:p-10 border border-border">
            <div className="flex items-center justify-center mb-8">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                <AlertCircle className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                Important Information & Disclaimer
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 text-foreground/90">
              {disclaimerItems.map((item, index) => (
                <div 
                  key={index} 
                  className={`flex items-start ${index > 2 && !isExpanded ? 'hidden md:flex' : 'flex'}`}
                >
                  <ShieldCheck className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-6 text-center md:hidden">
              <button 
                onClick={() => setIsExpanded(!isExpanded)} 
                className="text-primary font-medium flex items-center justify-center mx-auto hover:opacity-80 transition-opacity"
              >
                {isExpanded ? 'Read Less' : 'Read More'}
                {isExpanded ? <ChevronUp className="ml-1 w-4 h-4"/> : <ChevronDown className="ml-1 w-4 h-4"/>}
              </button>
            </div>

            <div className="mt-8 pt-6 border-t border-border text-center">
              <p className="text-sm text-muted-foreground italic">
                We are committed to transparency and social impact.
              </p>
            </div>
          </div>
        </div>
      </section>

      {showApplicationModal && selectedTender && (
        <ApplicationModal
          tender={selectedTender}
          onClose={() => {
            setShowApplicationModal(false);
            setSelectedTender(null);
          }}
          onSuccess={handleApplicationSuccess}
        />
      )}
    </div>
  );
};

export default TendersList;

