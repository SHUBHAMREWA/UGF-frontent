import React, { useEffect, useRef } from 'react';
// import Swiper from 'swiper';
// import { Navigation, Pagination, Autoplay } from 'swiper/modules';
// import 'swiper/css';
// import 'swiper/css/navigation';
// import 'swiper/css/pagination';
// import './Testimonials.css'; // Add this import for the CSS file

// Import Swiper styles in your main CSS or directly here
// Make sure to install swiper: npm install swiper

const Testimonials = () => {
  // const swiperRef = useRef(null);

  // const testimonials = [
  //   {
  //     id: 1,
  //     name: "Sarah Johnson",
  //     role: "CEO, TechInnovate",
  //     image: "/images/testimonials/sarah.jpg",
  //     quote: "Working with this team was a game-changer for our business. Their attention to detail and commitment to excellence exceeded our expectations. The final product was delivered on time and has significantly improved our customer engagement.",
  //     rating: 5,
  //   },
  //   {
  //     id: 2,
  //     name: "Michael Chen",
  //     role: "Marketing Director, GrowthFirst",
  //     image: "/images/testimonials/michael.jpg",
  //     quote: "I've worked with many development teams, but none have delivered the level of quality and professionalism that I experienced here. Their strategic approach to our project helped us achieve results beyond what we thought possible.",
  //     rating: 5,
  //   },
  //   {
  //     id: 3,
  //     name: "Emily Rodriguez",
  //     role: "Founder, CreativeStudio",
  //     image: "/images/testimonials/emily.jpg",
  //     quote: "The team's ability to understand our vision and translate it into a beautiful, functional solution was impressive. They were responsive, collaborative, and genuinely cared about our success. Highly recommended!",
  //     rating: 5,
  //   },
  // ];

  // useEffect(() => {
  //   // Initialize Swiper
  //   swiperRef.current = new Swiper('.testimonial-swiper', {
  //     modules: [Navigation, Pagination, Autoplay],
  //     slidesPerView: 1,
  //     spaceBetween: 30,
  //     loop: true,
  //     autoplay: {
  //       delay: 5000,
  //       disableOnInteraction: false,
  //     },
  //     pagination: {
  //       el: '.swiper-pagination',
  //       clickable: true,
  //     },
  //     navigation: {
  //       nextEl: '.swiper-button-next',
  //       prevEl: '.swiper-button-prev',
  //     },
  //     breakpoints: {
  //       640: {
  //         slidesPerView: 1,
  //       },
  //       768: {
  //         slidesPerView: 2,
  //       },
  //       1024: {
  //         slidesPerView: 3,
  //       },
  //     },
  //   });

  //   return () => {
  //     if (swiperRef.current) {
  //       swiperRef.current.destroy();
  //     }
  //   };
  // }, []);

  // // Generate star rating
  // const renderStars = (rating) => {
  //   const stars = [];
  //   for (let i = 0; i < 5; i++) {
  //     stars.push(
  //       <svg 
  //         key={i}
  //         xmlns="http://www.w3.org/2000/svg" 
  //         className={`star ${i < rating ? 'star-filled' : 'star-empty'}`}
  //         viewBox="0 0 20 20" 
  //         fill={i < rating ? "currentColor" : "none"}
  //         stroke="currentColor"
  //       >
  //         <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  //       </svg>
  //     );
  //   }
  //   return stars;
  // };

  return (
    <section className="testimonials-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">What Our Clients Say</h2>
          <div className="title-underline"></div>
          <p className="section-description">
            Discover why our clients trust us to deliver exceptional results for their projects.
          </p>
        </div>
        
        <div className="testimonial-swiper">
          <div className="swiper-wrapper">
            {/* {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="swiper-slide">
                <div className="testimonial-card">
                  <div className="rating-container">
                    <div className="star-rating">
                      {renderStars(testimonial.rating)}
                    </div>
                  </div>
                  <blockquote className="testimonial-quote">
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="testimonial-author">
                    <div className="author-image-container">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name}
                        className="author-image"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/56";
                        }}
                      />
                    </div>
                    <div className="author-info">
                      <p className="author-name">{testimonial.name}</p>
                      <p className="author-role">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))} */}
          </div>
          
          {/* Navigation buttons */}
          <div className="swiper-button-next"></div>
          <div className="swiper-button-prev"></div>
          
          {/* Pagination */}
          <div className="swiper-pagination"></div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials; 