import { CiCircleCheck } from "react-icons/ci";

export default function LandingCarousel() {
      const carouselText = ["Never Miss a Sale", "Close More Deals", "Immediate respones 24/7", "100% Customer Sales"];
    return (
        <div className="overflow-hidden h-[70px] md:h-[92px] bg-[#111111] rounded-[25px] md:rounded-[30px] flex items-center">
        <div className="flex items-center" style={{ animation: 'slide 30s linear infinite'}}>
          <div className="flex items-center shrink-0">
            {carouselText.map((text, index) => (
              <div key={`first-${index}`} className="flex items-center text-white gap-16 mx-10">
                <p className="text-base md:text-2xl whitespace-nowrap">{text}</p>
                <CiCircleCheck size={25} />
              </div>
            ))}
          </div>
          <div className="flex items-center shrink-0">
            {carouselText.map((text, index) => (
              <div key={`second-${index}`} className="flex items-center text-white gap-16 mx-10">
                <p className="text-base md:text-2xl whitespace-nowrap">{text}</p>
                <CiCircleCheck size={25} />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
}