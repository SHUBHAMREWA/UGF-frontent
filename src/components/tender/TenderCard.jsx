import React from 'react';
import { Calendar, MapPin, FileText, Clock, IndianRupee, Download } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import { Button } from '../ui/button';

import './TenderCard.css';

const TenderCard = ({ tender, onApply }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isDeadlineNear = (deadline) => {
    const daysLeft = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
    return daysLeft <= 7 && daysLeft > 0;
  };

  const daysLeft = Math.ceil((new Date(tender.deadline) - new Date()) / (1000 * 60 * 60 * 24));

  const handleDownload = async () => {
      try {
          const response = await fetch(tender.tenderDocument);
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `Tender_${tender.tenderTitle?.replace(/[^a-zA-Z0-9]/g, '_') || 'Document'}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
      } catch (error) {
          console.error('Download failed, opening in new tab:', error);
          window.open(tender.tenderDocument, '_blank');
      }
  };




  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between mb-3">
          <div className="flex justify-between gap-2  w-[100%]">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold category-${tender.tenderCategory.toLowerCase().replace(/\s+/g, '-')}`}>
              {tender.tenderCategory}
            </span>
            {tender.tenderType && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-secondary/20 text-secondary-foreground">
                {tender.tenderType}
              </span>
            )}
          </div>
          {isDeadlineNear(tender.deadline) && (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-destructive/10 text-destructive">
              Urgent
            </span>
          )}
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-2">{tender.tenderTitle}</h3>
        <p className="text-sm text-muted-foreground line-clamp-3">{tender.tenderDescription}</p>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <IndianRupee className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">Budget:</span>
            <span className="font-semibold text-foreground">{tender.budget}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">Location:</span>
            <span className="font-medium text-foreground">{tender.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">Start:</span>
            <span className="font-medium text-foreground">{formatDate(tender.startDate)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className={`w-4 h-4 ${daysLeft <= 7 ? 'text-red-500' : 'text-primary'}`} />
            <span className="text-muted-foreground">Deadline:</span>
            <span className={`font-medium ${daysLeft <= 7 ? 'text-red-600' : 'text-foreground'}`}>
              {formatDate(tender.deadline)}
              {daysLeft > 0 && (
                <span className="text-xs text-muted-foreground ml-1">({daysLeft} days left)</span>
              )}
            </span>
          </div>
          {tender.requiredDocuments && tender.requiredDocuments.length > 0 && (
            <div className="pt-3 border-t">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold text-muted-foreground uppercase">Required Documents</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {tender.requiredDocuments.map((doc, index) => (
                  <span key={index} className="px-2 py-1 text-xs bg-muted rounded-md text-foreground">
                    {doc}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        {tender.tenderDocument && (
          <Button 
            onClick={handleDownload} 
            variant="outline" 
            className="w-full" 
            size="lg"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Tender Document
          </Button>
        )}
        <Button onClick={onApply} className="w-full" size="lg">
          Apply Now
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TenderCard;

