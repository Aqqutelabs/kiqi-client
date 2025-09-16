import React, { useState, useEffect } from 'react';
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";

const BlogCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);

  const blogPosts = [
    {
      id: 1,
      title: "Minimal Illustration",
      image: "/api/placeholder/280/200",
      category: "Design",
      readTime: "5 min read"
    },
    {
      id: 2,
      title: "Minimal Illustration",
      image: "/api/placeholder/280/200", 
      category: "Development",
      readTime: "3 min read"
    },
    {
      id: 3,
      title: "Minimal Illustration",
      image: "/api/placeholder/280/200",
      category: "Photography",
      readTime: "7 min read"
    },
    {
      id: 4,
      title: "Minimal Illustration",
      image: "/api/placeholder/280/200",
      category: "Art",
      readTime: "4 min read"
    },
  ];

  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth >= 1200) {
        setItemsPerView(4);
      } else if (window.innerWidth >= 768) {
        setItemsPerView(3);
      } else if (window.innerWidth >= 640) {
        setItemsPerView(2);
      } else {
        setItemsPerView(1);
      }
    };
    
    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, []);

  // Calculate max slides to prevent empty screens
  const maxSlides = Math.max(0, blogPosts.length - itemsPerView);

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

  const goToSlide = (index: number) => {
    setCurrentIndex(Math.min(index, maxSlides));
  };

  // Calculate transform percentage based on items per view
  const transformPercentage = (100 / itemsPerView) * currentIndex;

  return (
    <div className="w-full max-w-7xl mx-auto my-20 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900">
          Blog
        </h2>
        
        {/* Desktop Navigation Arrows */}
        <div className="hidden md:flex items-center space-x-3">
          <button
            onClick={prevSlide}
            className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-600 rounded-full p-3 shadow-sm transition-colors"
            disabled={currentIndex === 0}
          >
            <FaArrowLeftLong size={16} />
          </button>
          
          <button
            onClick={nextSlide}
            className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-600 rounded-full p-3 shadow-sm transition-colors"
            disabled={currentIndex >= maxSlides}
          >
            <FaArrowRightLong size={16} />
          </button>
        </div>
      </div>

      {/* Carousel Container */}
      <div className="relative overflow-hidden">
        <div 
          className="flex transition-transform duration-300 ease-in-out"
          style={{ 
            transform: `translateX(-${transformPercentage}%)`
          }}
        >
          {blogPosts.map((post) => (
            <div
              key={post.id}
              className="flex-shrink-0 px-2"
              style={{ width: `${100 / itemsPerView}%` }}
            >
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer group">
                {/* Image Container */}
                <div className="relative h-48 md:h-56 lg:h-64 overflow-hidden bg-gray-200">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"></div>
                  <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                    <span className="text-gray-500 text-sm">Image Placeholder</span>
                  </div>
                  
                  {/* Floating Elements - like in the original */}
                  <div className="absolute top-4 right-4 w-3 h-3 bg-blue-500 rounded-full opacity-80"></div>
                  <div className="absolute top-6 right-8 w-2 h-2 bg-green-400 rounded-full opacity-60"></div>
                  <div className="absolute bottom-4 left-4 w-4 h-4 bg-orange-400 rounded-full opacity-70"></div>
                </div>
                
                {/* Content */}
                <div className="p-4 md:p-6">
                  <div className="mb-2">
                    <span className="text-xs md:text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {post.category}
                    </span>
                  </div>
                  
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {post.title}
                  </h3>
                  
                  <p className="text-sm text-gray-500">
                    {post.readTime}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Dots Navigation */}
      <div className="flex md:hidden justify-center mt-6 space-x-2">
        {Array.from({ length: maxSlides + 1 }).map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="hidden md:block mt-6 w-full bg-gray-200 rounded-full h-1">
        <div 
          className="bg-blue-600 h-1 rounded-full transition-all duration-300"
          style={{ 
            width: `${((currentIndex + 1) / (maxSlides + 1)) * 100}%` 
          }}
        ></div>
      </div>
    </div>
  );
};

export default BlogCarousel;