import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const CardData = [
    {
        imgSrc: "./HomepageCard/waterdrinkingchild.png",
        title: "Send Donation",
        description: "See how you can make a difference in Earth lives with just small donations.",
        link: "/donate",
        buttonText: "Donations",
        bgColor: "#9064bf",
        accentColor: "#7e4eb1"
    },
    {
        imgSrc: "./HomepageCard/hungryboy.png",
        title: "Campaigns",
        description: "Every campaign make a difference. Join us in our mission to create lasting change.",
        link: "/campaigns",
        buttonText: "Donate on Campaigns",
        bgColor: "#5586E8",
        accentColor: "#3b71db"
    },
    {
        imgSrc: "./HomepageCard/injuredanimal.png",
        title: "ERF",
        description: "Emergency Response Force (ERF) In the heart of the forest, every life matters. We stand as guardians, ready to answer the call of those who cannot speak.",
        link: "/sn-arya-mitra",
        buttonText: "Join Us",
        bgColor: "#FA575D",
        accentColor: "#e64147"
    },
    {
        imgSrc: "./HomepageCard/volunteer.jpg",
        title: "Become a Volunteer",
        description: "Our support creates empowered communities in the world.",
        link: "/volunteer-join",
        buttonText: "To be Volunteer",
        bgColor: "#5586E8",
        accentColor: "#3b71db"
    }
];

const Card = ({ imgSrc, title, description, link, buttonText, bgColor, accentColor, index }) => {
    const navigate = useNavigate();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -8 }}
            className="group relative flex flex-col h-[400px] overflow-hidden rounded-2xl shadow-xl transition-all duration-300 border border-white/10"
            style={{ backgroundColor: bgColor, fontFamily: "'Nunito Sans', sans-serif" }}
        >
            {/* Image Section */}
            <div className="h-[45%] w-full overflow-hidden relative">
                <img
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    src={imgSrc}
                    alt={title}
                />
                <div className="absolute inset-0 bg-black/10 transition-opacity group-hover:opacity-0" />
            </div>

            {/* Content Section */}
            <div className="flex flex-col items-center justify-between flex-1 p-6 text-center text-white">
                <div className="space-y-3">
                    <h3 className="text-xl font-bold tracking-tight leading-tight drop-shadow-sm">
                        {title}
                    </h3>
                    <p className="text-sm text-white/90 leading-relaxed font-medium line-clamp-3">
                        {description}
                    </p>
                </div>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-4 px-6 py-2 rounded-full border-2 border-white/40 hover:border-white transition-all duration-300 font-bold text-sm hover:bg-white hover:text-gray-900 shadow-md flex items-center gap-2"
                    onClick={() => navigate(link)}
                >
                    {buttonText}
                </motion.button>
            </div>

            {/* Decorative Element */}
            <div 
                className="absolute -bottom-16 -right-16 w-32 h-32 rounded-full opacity-20 transition-transform group-hover:scale-150 duration-700" 
                style={{ backgroundColor: accentColor }}
            />
        </motion.div>
    );
};

const HomeCards = () => {  
    const navigate = useNavigate();
    
    return (  
        <div style={{ fontFamily: "'Nunito Sans', sans-serif" }}>  
            {/* Call to Action Banner */}
            <div className="px-4 relative mx-auto flex flex-col lg:flex-row items-center lg:justify-around rounded-sm justify-center w-full lg:w-[80%] gap-4 h-auto lg:h-[120px] border border-border bg-card mt-5 p-6 lg:p-0">  
                <div className="text-center lg:text-left">
                    <p className="text-xl lg:text-3xl font-bold text-foreground">
                        Your Donation makes a life of Hope-less People
                    </p>
                    <h3 className="text-sm lg:text-2xl font-semibold text-muted-foreground">
                        Together to help the world better!
                    </h3>
                </div> 

                <button 
                    onClick={() => navigate("/donate")}
                    className="px-6 py-2 rounded-md bg-primary text-primary-foreground font-bold hover:opacity-90 transition-all shadow-lg active:scale-95"
                >
                    👆 Keep Help
                </button>

                <img 
                    className="h-[60px] lg:h-[100px] w-[60px] lg:w-[100px] absolute  md:top-0 right-0 pointer-events-none opacity-50 lg:opacity-100"
                    src="HomepageCard/hopelessChild.png" 
                    alt="" 
                />
            </div>
         
            {/* Cards Slider Section */}
            <div className="w-[90%] lg:w-[85%] mx-auto py-8 lg:py-12">
                <Swiper
                    modules={[Pagination, Autoplay]}
                    spaceBetween={20}
                    slidesPerView={1.1}
                    grabCursor={true}
                    centeredSlides={false}
                    pagination={{ 
                        clickable: true,
                        dynamicBullets: true,
                    }}
                    autoplay={{ 
                        delay: 5000, 
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true 
                    }}
                    breakpoints={{
                        640: {
                            slidesPerView: 2,
                            spaceBetween: 25,
                        },
                        768: {
                            slidesPerView: 2,
                            spaceBetween: 30,
                        },
                        1024: {
                            slidesPerView: 4,
                            spaceBetween: 30,
                            allowTouchMove: true,
                        },
                    }}
                    className="home-cards-swiper pb-14"
                >
                    {CardData.map((card, idx) => (
                        <SwiperSlide key={idx} className="h-full">
                            <Card {...card} index={idx} />
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Custom Pagination Style Overrides (Inline) */}
                <style dangerouslySetInnerHTML={{ __html: `
                    .home-cards-swiper .swiper-pagination-bullet {
                        background: hsl(var(--muted-foreground));
                        opacity: 0.4;
                        width: 10px;
                        height: 10px;
                    }
                    .home-cards-swiper .swiper-pagination-bullet-active {
                        background: hsl(var(--primary));
                        opacity: 1;
                        width: 24px;
                        border-radius: 5px;
                    }
                `}} />
            </div>
        </div>
    );
};

export default HomeCards;
