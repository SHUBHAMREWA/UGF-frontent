import React from 'react';
import { format, differenceInDays } from 'date-fns';
import { Clock, MapPin, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const EventCard = ({ event, onClick }) => {
  const eventDate = new Date(event.date);
  const day = format(eventDate, 'd');
  const month = format(eventDate, 'MMM');
  
  const getDaysLeft = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const eventDay = new Date(eventDate);
    eventDay.setHours(0, 0, 0, 0);
    
    const diff = differenceInDays(eventDay, today);
    if (diff > 0 && diff <= 10) {
      return `${diff} ${diff === 1 ? 'day' : 'days'} left`;
    }
    return null;
  };

  const getStatus = () => {
    const now = new Date();
    const eventStartTime = new Date(event.date);
    const eventEndTime = new Date(event.date);
    
    if (event.startTime) {
      const [startHours, startMinutes] = event.startTime.split(':');
      eventStartTime.setHours(parseInt(startHours), parseInt(startMinutes), 0);
    }
    
    if (event.endTime) {
      const [endHours, endMinutes] = event.endTime.split(':');
      eventEndTime.setHours(parseInt(endHours), parseInt(endMinutes), 0);
    } else {
      eventEndTime.setHours(eventStartTime.getHours() + 2);
    }

    if (now < eventStartTime) return 'upcoming';
    if (now >= eventStartTime && now <= eventEndTime) return 'ongoing';
    return 'past';
  };

  const status = getStatus();
  const daysLeft = getDaysLeft();

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="group relative bg-card border border-border/40 rounded-[24px] overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col cursor-pointer h-full"
      onClick={onClick}
    >
      {/* Animated Status Bar at the Top */}
      <div className="absolute top-0 left-0 w-full h-6 overflow-hidden z-30 pointer-events-none">
        <motion.div
           animate={{ x: [-100, 400] }}
           transition={{ 
             repeat: Infinity, 
             duration: 8, 
             ease: "linear" 
           }}
           className="flex items-center gap-2 whitespace-nowrap opacity-20"
        >
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">{status} event</span>
          <span className="w-10 h-[1px] bg-primary/20" />
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">{status} event</span>
          <span className="w-10 h-[1px] bg-primary/20" />
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">{status} event</span>
        </motion.div>
      </div>

      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl -mr-12 -mt-12 group-hover:bg-primary/10 transition-colors duration-300" />
      
      {/* Top Section */}
      <div className="relative p-3 pb-0 z-10 min-h-[140px] sm:min-h-[160px]">
        <div className="absolute inset-x-3 top-3 bottom-0 rounded-[16px] overflow-hidden bg-muted/20">
             <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '12px 12px' }}></div>
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-primary/10"></div>
        </div>

        <div className="relative w-[50%] h-32 sm:h-36 overflow-hidden rounded-l-[16px] rounded-r-full shadow-md border border-border/10">
          <img
            src={event.image || '/placeholder-event.jpg'}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className={`absolute inset-0 transition-opacity duration-300 ${
            status === 'past' ? 'bg-background/60 backdrop-grayscale' : 'bg-primary/5 group-hover:opacity-0'
          }`} />

          {/* Days Left Indicator */}
          {daysLeft && status === 'upcoming' && (
             <div className="absolute top-2 left-2 z-10">
                <div className="bg-primary text-primary-foreground px-2 py-0.5 rounded-full text-[8px] font-bold uppercase shadow-md flex items-center gap-1">
                    <Sparkles className="w-2 h-2" />
                    {daysLeft}
                </div>
            </div>
          )}
        </div>

        <div className="absolute top-[50%] left-[50%] translate-y-[-50%] translate-x-[-15%] z-20">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex flex-col items-center justify-center text-primary-foreground shadow-md transition-colors duration-300 ${
              status === 'past' ? 'bg-muted-foreground' : 'bg-primary'
            } ring-2 ring-card`}
          >
            <span className="text-xl sm:text-2xl font-black leading-none">{day}</span>
            <span className="text-[8px] sm:text-[10px] uppercase font-bold tracking-tighter">{month}</span>
          </motion.div>
        </div>

        {/* Moving Status Badge */}
        <div className="absolute top-6 right-6 z-10 overflow-hidden w-24">
          <motion.div
            animate={{ x: [-10, 0, -10] }}
            transition={{ 
              repeat: Infinity, 
              duration: 4, 
              ease: "easeInOut" 
            }}
          >
            <span className={`px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1.5 border backdrop-blur-sm ${
              status === 'ongoing' ? 'bg-green-500/20 text-green-500 border-green-500/20' : 
              status === 'upcoming' ? 'bg-primary/20 text-primary border-primary/20' : 
              'bg-muted/50 text-muted-foreground border-border'
            }`}>
              <span className={`w-1 h-1 rounded-full ${status === 'past' ? 'bg-muted-foreground' : 'bg-current'}`} />
              {status}
            </span>
          </motion.div>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1 z-10">
        <div className="flex items-center flex-wrap gap-2 text-[11px] font-bold text-primary mb-3 uppercase tracking-tight">
          <div className="flex items-center gap-1.5 bg-primary/5 px-2 py-1 rounded-md">
            <Clock className="w-3 h-3" />
            <span className="font-sans font-black leading-none">{event.startTime || '10:00 AM'}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-muted/40 px-2 py-1 rounded-md max-w-[140px]">
            <MapPin className="w-3 h-3 text-muted-foreground" />
            <span className="truncate font-sans font-bold leading-none text-foreground/80">{event.location || 'Newyork'}</span>
          </div>
        </div>

        <h3 className="text-base sm:text-lg font-bold text-foreground line-clamp-2 mb-3 leading-[1.3] group-hover:text-primary transition-colors tracking-tight font-sans italic">
          {event.title}
        </h3>

        <div className="w-8 h-0.5 bg-primary rounded-full mb-4 opacity-70" />

        <div className="mt-auto pt-3 flex items-center justify-between border-t border-border/10">
          <span className="text-[10px] font-black uppercase tracking-[0.1em] text-foreground/60 group-hover:text-primary transition-colors">
            More Details
          </span>
          <motion.div 
            whileHover={{ x: 2 }}
            className="text-primary"
          >
            <ArrowRight className="w-4 h-4" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;
