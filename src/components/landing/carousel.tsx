import { CiCircleCheck } from "react-icons/ci";

export default function LandingCarousel() {
  const carouselText = ["Never Miss a Sale", "Close More Deals", "Immediate Response 24/7", "100% Customer Sales"];
  
  return (
    <div className="overflow-hidden h-[70px] md:h-[92px] bg-[#111111] rounded-[25px] md:rounded-[30px] flex items-center">
      <style jsx>{`
        @keyframes slide {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .carousel-slide {
          animation: slide 30s linear infinite;
        }
      `}</style>
      
      <div className="flex items-center carousel-slide">
        {/* First set */}
        <div className="flex items-center shrink-0">
          {carouselText.map((text, index) => (
            <div key={`first-${index}`} className="flex items-center text-white gap-6 md:gap-16 mx-6 md:mx-10">
              <p className="text-base md:text-2xl whitespace-nowrap">{text}</p>
              <CiCircleCheck size={25} className="shrink-0" />
            </div>
          ))}
        </div>
        
        {/* Second set (duplicate) */}
        <div className="flex items-center shrink-0">
          {carouselText.map((text, index) => (
            <div key={`second-${index}`} className="flex items-center text-white gap-6 md:gap-16 mx-6 md:mx-10">
              <p className="text-base md:text-2xl whitespace-nowrap">{text}</p>
              <CiCircleCheck size={25} className="shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}