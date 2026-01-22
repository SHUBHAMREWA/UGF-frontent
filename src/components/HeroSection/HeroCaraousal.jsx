import React from 'react'
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { motion } from "framer-motion";
import "./HeroCaraousal.css";

import "swiper/css";


const images = [ 
    '/tree.png' ,
     '/dog.png' ,
     '/donate.png' ,
     '/school.png'
]



const HeroCaraousal = () => {
  return (
    
   <div className="carousel-wrapper">
  <Swiper
    slidesPerView={1.1}
    centeredSlides
    spaceBetween={24}
    loop
    grabCursor
    speed={1000}
    autoplay={{
      delay: 700,
      disableOnInteraction: false,
    }}
    modules={[Autoplay]}
    className="mySwiper"
  >
    {images.map((img, i) => (
      <SwiperSlide key={i}>
        <div className="slide">
          <motion.img
            src={img}
            alt=""
            
            transition={{
              duration: 0.4,
              ease: "easeOut",
            }}
          />
        </div>
      </SwiperSlide>
    ))}
  </Swiper>
</div>

  )
}

export default HeroCaraousal
