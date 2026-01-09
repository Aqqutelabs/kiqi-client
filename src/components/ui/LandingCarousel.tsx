"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Define the type for carousel items
export interface CarouselItem {
  id: number;
  title: string;
  subtitle?: string;
  image: string;
}

// Props for the reusable carousel component
interface HorizontalCarouselProps {
  items: CarouselItem[];
}

export default function HorizontalCarousel({ items }: HorizontalCarouselProps) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cardWidth = 320; // Approximate card width + gap
      container.scrollLeft -= cardWidth;
      setScrollPosition(container.scrollLeft);
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cardWidth = 320; // Approximate card width + gap
      container.scrollLeft += cardWidth;
      setScrollPosition(container.scrollLeft);
    }
  };

  return (
    <div className="relative">
      {/* Carousel Container */}
      <div
        ref={scrollContainerRef}
        className="flex items-center gap-6 md:gap-10 overflow-x-auto pb-6 md:pb-8 scrollbar-hide"
        style={{ scrollBehavior: "smooth" }}>
        {items.map((item) => {
          const isEven = item.id % 2 === 0;

          return (
            <div key={item.id} className="min-w-[280px] shrink-0">
              <div
                className={`h-[300px] rounded-2xl shadow-sm ${
                  isEven ? "bg-[#FED93B]" : "bg-[#0C31A1] text-white"
                } flex flex-col md:flex-row items-center justify-center p-6`}>
                {/* content */}
                <div className="flex flex-col justify-between h-full w-2/4">
                  <div className="space-y-4">
                    <h4 className="font-bold text-lg md:text-xl lg:text-2xl text-center md:text-left">
                      {item.title}
                    </h4>
                    {item.subtitle && (
                      <p className="text-sm md:text-base text-center md:text-left mt-2">
                        "{item.subtitle}"
                      </p>
                    )}
                  </div>
                  <img
                    src={
                      isEven
                        ? "/xxing-logo-colored.svg"
                        : "/kiki-logo-white.svg"
                    }
                    alt="Logo"
                    className="h-10 w-20 object-cover"
                  />
                </div>
                {/* image */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-2/4 h-full rounded-2xl object-cover"
                />
              </div>
            </div>
          );
        })}
      </div>
      {/* Navigation Buttons */}
      <div className="flex justify-end gap-4 mb-6">
        <button
          onClick={scrollLeft}
          className="p-3 rounded-full bg-white text-black hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          aria-label="Scroll left">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={scrollRight}
          className="p-3 rounded-full bg-white text-black hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          aria-label="Scroll right">
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
