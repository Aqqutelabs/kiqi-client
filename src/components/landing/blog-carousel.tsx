import React, { useState, useEffect } from "react";
import { FaArrowLeftLong, FaArrowRightLong, FaAngleRight } from "react-icons/fa6";
import Image from "next/image";

const BlogCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);

  const blogPosts = [
    { id: 1, title: "Minimal Illustration", image: "/blog1.svg" },
    { id: 2, title: "Minimal Illustration", image: "/blog2.svg" },
    { id: 3, title: "Minimal Illustration", image: "/blog3.svg" },
    { id: 4, title: "Minimal Illustration", image: "/blog4.svg" },
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
    window.addEventListener("resize", updateItemsPerView);
    return () => window.removeEventListener("resize", updateItemsPerView);
  }, []);

  const maxSlides = Math.max(0, blogPosts.length - itemsPerView);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxSlides ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? maxSlides : prev - 1));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(Math.min(index, maxSlides));
  };

  const transformPercentage = (100 / itemsPerView) * currentIndex;

  return (
    <div className="w-full max-w-7xl mx-auto my-20 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900">
          Blog
        </h2>

        {/* Desktop arrows */}
        <div className="hidden md:flex items-center space-x-3">
          <button
            onClick={prevSlide}
            className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-600 rounded-full p-3 shadow-sm transition-colors disabled:opacity-40"
            disabled={currentIndex === 0}
          >
            <FaArrowLeftLong size={16} />
          </button>
          <button
            onClick={nextSlide}
            className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-600 rounded-full p-3 shadow-sm transition-colors disabled:opacity-40"
            disabled={currentIndex >= maxSlides}
          >
            <FaArrowRightLong size={16} />
          </button>
        </div>
      </div>

      {/* Carousel */}
      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${transformPercentage}%)` }}
        >
          {blogPosts.map((post) => (
            <div
              key={post.id}
              className="flex-shrink-0 px-2"
              style={{ width: `${100 / itemsPerView}%` }}
            >
              {/* Card */}
              <div className="relative rounded-2xl overflow-hidden shadow-lg h-72 md:h-80 lg:h-96 cursor-pointer group">
                
                <Image 
                src={post.image}
                alt={post.title}
                width={360}
                height={500}
                className="absolute inset-0 bg-gray-400 group-hover:scale-105 transition-transform duration-500"/>

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-black/50"></div>

                {/* Featured badge */}
                <div className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-medium px-3 py-1 rounded-full">
                  Featured
                </div>

                {/* Card content */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                  <h3 className="text-xl md:text-2xl font-bold mb-2">
                    {post.title}
                  </h3>

                  {/* Arrow button */}
                  <button onClick={() => goToSlide(post.id)} className="self-end bg-white text-gray-900 rounded-full p-2 shadow-md hover:bg-gray-100 transition">
                    <FaAngleRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile dots */}
      <div className="flex md:hidden justify-center mt-6 space-x-2">
        {Array.from({ length: maxSlides + 1 }).map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? "bg-blue-600" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default BlogCarousel;
