"use client";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function TestimonialsCarousel({
  bgColor = "#FFF",
}: {
  bgColor?: string;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const testimonials = [
    {
      id: 1,
      quote:
        "As a fashion designer I always struggled with juggling sewing, content creation, and responding to clients. Kiki solved that for me!",
      name: "Kelly",
      role: "Fashion Designer",
      avatar: "https://i.pravatar.cc/80?img=5",
    },
    {
      id: 2,
      quote:
        "I tried Kiki once and I was sold. It so easy to use and even better at responding to customers than I am😂",
      name: "David",
      role: "Freelance Social media manager",
      avatar: "https://i.pravatar.cc/80?img=15",
    },
    {
      id: 3,
      quote:
        "I tried Kiki once and I was sold. It so easy to use and even better at responding to customers than I am😂",
      name: "David",
      role: "Freelance Social media manager",
      avatar: "https://i.pravatar.cc/80?img=23",
    },
    {
      id: 4,
      quote:
        "I tried Kiki once and I was sold. It so easy to use and even better at responding to customers than I am😂",
      name: "David",
      role: "Freelance Social media manager",
      avatar: "https://i.pravatar.cc/80?img=23",
    },
  ];

  const scroll = (direction: string) => {
    if (scrollerRef.current) {
      const scrollAmount = window.innerWidth < 768 ? 300 : 340;
      const newPosition =
        direction === "prev"
          ? scrollerRef.current.scrollLeft - scrollAmount
          : scrollerRef.current.scrollLeft + scrollAmount;

      scrollerRef.current.scrollTo({
        left: newPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-8 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 px-4">
          See what others are saying about{" "}
          <span className="text-orange-600">Kiki.</span>
        </h2>

        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={() => scroll("prev")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 md:w-10 md:h-10 bg-[#0C31A1] border border-gray-300 rounded-full shadow-sm flex items-center justify-center transition-colors"
            aria-label="Scroll left">
            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-white" />
          </button>

          {/* Scrollable Container */}
          <div
            ref={scrollerRef}
            className="overflow-x-auto scrollbar-hide flex gap-4 px-8 md:px-12 snap-x snap-mandatory"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
            {testimonials.map((testimonial) => (
              <article
                key={testimonial.id}
                className={`flex-none w-70 sm:w-[320px] md:w-100 border border-gray-200 rounded-2xl p-4 md:p-6 snap-start`}
                style={{ backgroundColor: bgColor }}>
                <p className="text-gray-700 text-base sm:text-lg md:text-[22px] leading-relaxed mb-4 md:mb-6">
                  "{testimonial.quote}"
                </p>

                <div className="flex items-center gap-3">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">
                      {testimonial.name}
                    </div>
                    <div className="text-gray-500 text-xs">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => scroll("next")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 md:w-10 md:h-10 bg-[#0C31A1] border border-gray-300 rounded-full shadow-sm flex items-center justify-center transition-colors"
            aria-label="Scroll right">
            <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-white" />
          </button>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
