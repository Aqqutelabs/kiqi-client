import React, { useState, useEffect } from 'react';
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";

const TestimonialCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const testimonials = [
    {
      id: 1,
      text: "As a fashion designer I always struggled with juggling sewing, content creation, and responding to clients, KiQi solved that for me!",
      author: "Kelly",
      title: "Fashion Designer",
      avatar: "K"
    },
    {
      id: 2,
      text: "I tried KiQi once and I was sold. It so easy to use and even better at responding to customers than I am😂",
      author: "David",
      title: "Freelance Social media manager",
      avatar: "D"
    },
    {
      id: 3,
      text: "KiQi transformed my workflow completely. Managing multiple projects became effortless and my clients love the quick response times!",
      author: "Sarah",
      title: "Digital Marketing Consultant",
      avatar: "S"
    },
    {
      id: 4,
      text: "The automation features in KiQi saved me hours every day. Now I can focus on what I do best while KiQi handles the rest seamlessly.",
      author: "Michael",
      title: "E-commerce Store Owner",
      avatar: "M"
    }
  ];

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Calculate max slides based on items per view
  const itemsPerView = isMobile ? 1 : 2;
  const maxSlides = testimonials.length - itemsPerView;

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex >= maxSlides ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? maxSlides : prevIndex - 1
    );
  };

  return (
    <div className="w-full md:max-w-5xl mx-auto my-20 px-0 md:px-4">
      {/* Header */}
      <h2 className="font-bold text-center text-2xl md:text-[52px] leading-tight">
        See what others are saying <br className='hidden md:block' /> 
        about <span className="text-[#0C31A1]">Kiqi</span>
      </h2>

      {/* Carousel Container */}
      <div className="relative my-14 h-fit">
        <div className="flex gap-4 overflow-scroll md:overflow-hidden scrollbar-hide">
          <div 
            className="flex transition-transform duration-300 ease-in-out"
            style={{ 
              transform: `translateX(-${currentIndex * (isMobile ? 100 : 50)}%)` 
            }}
          >
            {testimonials.map(testimonial => (
              <div
                key={testimonial.id}
                className="w-2/4 md:w-[450px] h-auto flex-shrink-0 bg-white rounded-[20px] md:rounded-[30px] p-4 md:p-6 border border-[#797878] mx-2 flex flex-col justify-between"
              >
                <div className="mb-4 flex-1">
                  <p className="text-[#111111] text-lg md:text-2xl lg:text-3xl xl:text-[38px] leading-relaxed font-bold">
                    '{testimonial.text}'
                  </p>
                </div>
                
                <div className="flex items-center mt-auto">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-semibold text-xs md:text-sm">
                      {testimonial.avatar}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm md:text-base">
                      {testimonial.author}
                    </p>
                    <p className="text-gray-500 text-xs md:text-sm">
                      {testimonial.title}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Buttons - Only show on larger screens */}
        <button
          onClick={prevSlide}
          className="hidden md:block absolute -left-6 lg:-left-10 top-1/2 transform -translate-y-1/2 bg-[#0C31A1] hover:bg-[#0a2890] text-white rounded-full p-2 lg:p-3 shadow-lg transition-colors"
        >
          <FaArrowLeftLong size={16} className="lg:w-5 lg:h-5" />
        </button>

        <button
          onClick={nextSlide}
          className="hidden md:block absolute -right-6 lg:-right-10 top-1/2 transform -translate-y-1/2 bg-gray-400 hover:bg-gray-500 text-white rounded-full p-2 lg:p-3 shadow-lg transition-colors"
        >
          <FaArrowRightLong size={16} className="lg:w-5 lg:h-5" />
        </button>

        {/* Mobile Navigation Dots */}
        <div className="flex md:hidden justify-center mt-6 space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? 'bg-[#0C31A1]' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestimonialCarousel;