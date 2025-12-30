"use client";

import FAQFooter from "@/components/ui/landing-footer";
import LandingNav from "@/components/ui/landing-nav";
import TestimonialsCarousel from "@/components/ui/LandingTestimonialCarousel";
import { ArrowUp, CircleUserRound, MousePointer2 } from "lucide-react";
import Image from "next/image";

export default function FeatureOnePage() {
  const carouselImages = [
    "/landing/feature-1-carousel1.svg",
    "/landing/feature-1-carousel2.svg",
    "/landing/feature-1-carousel3.svg",
    "/landing/feature-1-carousel4.svg",
    "/landing/feature-1-carousel5.svg",
    "/landing/feature-1-carousel6.svg",
    "/landing/feature-1-carousel7.svg",
    "/landing/feature-1-carousel8.svg",
  ];

  const trustedCompaniyImages = [
    "/landing/company1.svg",
    "/landing/company2.svg",
    "/landing/company3.svg",
    "/landing/company4.svg",
    "/landing/company5.svg",
    "/landing/company6.svg",
  ];

  const visibilityTips = [
    {
      highlight: "💸 Agencies cost a fortune.",
      mainText: "Retainers start at $1000/month.",
    },
    {
      highlight: "⏳ News takes too long.",
      mainText: "By the time your story is live, it’s old news.",
    },
    {
      highlight: "👀 Nobody sees you.",
      mainText: "Without media coverage, you look small and untrustworthy.",
    },
  ];

  const whyPRWorks = [
    {
      icon: "/landing/pr-work1.svg",
      header: "⭐ Instant Authority", 
      text: "As Seen On Forbes builds credibility overnight.",
    },
     {
      icon: "/landing/pr-work2.svg",
      header: "✅ Guaranteed Placements", 
      text: " No editor declines. You pay, you publish.",
    },
     {
      icon: "/landing/pr-work3.svg",
      header: "🔗 SEO Power", 
      text: "High-authority backlinks that rank on Google.",
    },
     {
      icon: "/landing/pr-work4.svg",
      header: "🌍 Global Reach",
      text: "Local, African, or worldwide syndication.",
    },
     {
      icon: "/landing/pr-work5.svg",
      header: "💼 Investor Trust",
      text: "Media validation that closes funding faster.",
    },
     {
      icon: "/landing/pr-work6.svg",
      header: "🔄 Multi-Channel Flow", 
      text: "Syncs with your email, SMS & influencer campaigns.",
    },
  ];

  return (
    <section>
      <LandingNav />

      {/* hero section */}
      <div className="min-h-screen bg-linear-to-r from-[#0B5ED8] via-blue-500 to-white flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-14">
        {/* Left Content */}
        <div className="flex-1 space-y-6 lg:space-y-8 px-4 sm:px-6 lg:px-0">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight text-center lg:text-left">
            Get featured in
            <br />
            <span className="text-[#FED93B]">50,000+</span> media outlets
            <br />
            <span className="bg-linear-to-b from-[#FFF] via-[#f8e58f] to-[#FED93B] text-transparent bg-clip-text">
              across the globe instantly
            </span>
          </h1>

          <p className="text-white text-base sm:text-lg max-w-md text-center lg:text-left mx-auto lg:mx-0">
            <strong>You’ve got the launch, the story, the product,</strong> but
            nobody knows. With Kiki PR, your brand gets featured on{" "}
            <strong>
              Punch, TechCabal, Forbes, BusinessDay and more in 24 hours
            </strong>{" "}
            without PR agencies, chasing editors, or heavy retainers.”
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 text-sm font-medium w-100">
            <button className="h-14 px-6 w-full rounded-lg flex justify-center items-center bg-white text-[#111111] hover:cursor-pointer relative">
              Get Featured Now
              <div className="size-7.5 rounded-full flex justify-center items-center bg-[#020617] border border-white rotate-45 absolute -right-3 z-10">
                <ArrowUp color="white" size={16} />
              </div>
            </button>
            <button className="h-14 px-6 w-full rounded-lg flex justify-center items-center border-white border text-white hover:cursor-pointer">
              See How It Works
            </button>
          </div>
        </div>

        {/* Right Content - Mockup */}
        <div className="flex-1 relative w-full max-w-125 lg:w-137.5 h-87.5 sm:h-112.5 lg:h-142.5 mt-8 lg:mt-0">
          <img
            src="/landing/feature-1-hero.svg"
            alt="Hero Image"
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* carousel */}
      <div className="overflow-hidden h-10 md:h-23 bg-[#F4F4F4] flex items-center">
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
            animation: slide 10s linear infinite;
            display: flex;
            align-items: center;
          }

          @media (max-width: 640px) {
            .carousel-slide {
              animation: slide 20s linear infinite;
            }
          }
        `}</style>

        <div className="flex items-center carousel-slide">
          {/* First set */}
          <div className="flex items-center shrink-0">
            {carouselImages.map((image, index) => (
              <img key={index} src={image} alt="Brand Logo" className="mx-10" />
            ))}
          </div>

          {/* Second set (duplicate) */}
          <div className="flex items-center shrink-0">
            {carouselImages.map((image, index) => (
              <img key={index} src={image} alt="Brand Logo" className="mx-10" />
            ))}
          </div>
        </div>
      </div>

      {/* visibility tips */}
      <div className="space-y-1 my-20">
        <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-[45px] font-bold text-center">
          Why most brands stay invisible.
        </h3>
        <p className="text-center text-sm sm:text-base mt-2">
          Your competitors already look like the real players.{" "}
          <br className="hidden md:block" /> They’re in the news. You look like
          you are testing. End that today.
        </p>

        <div className="flex items-center justify-center gap-8 max-w-6xl mx-auto mt-10 px-4 sm:px-6 md:px-8 lg:px-0 flex-col lg:flex-row">
          {/* image */}
          <div className="overflow-x-hidden bg-[#2BAAE2] rounded-2xl w-113 p-8">
            <img src="/landing/visibility-tips.svg" alt="Image" />
          </div>
          {/* content */}
          <div className="space-y-4">
            {visibilityTips.map((tip, index) => (
              <div
                key={index}
                className="space-y-1 bg-[#E5F6FD] p-4 rounded-lg">
                <h4 className="text-base md:text-lg font-semibold">
                  {tip.highlight}
                </h4>
                <p className="text-gray-700 text-sm">{tip.mainText}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* mansory stats */}
      <div className="bg-[#F3F6FF] rounded-[30px] m-4 md:m-20 p-10 ">
        <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-[45px] font-bold text-center">
          <span className="text-[#0C31A1]">Trusted </span>
          by startups, creators, <br className="hidden md:block" /> and SMEs
          across Africa.
        </h3>

        {/* grids */}
        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 mt-10">
          {/* 1st item */}
          <div className="size-67 bg-[#F7F7F7] rounded-2xl border border-gray-200 flex flex-col justify-between p-6">
            <h4 className="text-black font-extrabold text-5xl">20,000+</h4>
            {/* icons */}
            <div className="flex items-center gap-2">
              <div className="size-12 rounded-full border border-white bg-[#D9D9D9] flex justify-center items-center">
                <img src="/landing/music-folder.svg" alt="" />
              </div>
              <div className="size-12 rounded-full border border-white bg-[#D9D9D9] flex justify-center items-center">
                <img src="/landing/video-folder.svg" alt="" />
              </div>
              <div className="size-12 rounded-full border border-white bg-[#D9D9D9] flex justify-center items-center">
                <img src="/landing/social-media-marketing.svg" alt="" />
              </div>
              <div className="size-12 rounded-full border border-white bg-[#D9D9D9] flex justify-center items-center">
                <img src="/landing/picture-icon.svg" alt="" />
              </div>
            </div>
            <p className="text-black text-lg">Media Outlets</p>
          </div>
          {/* 2nd item */}
          <div className="w-67 rounded-2xl border border-gray-200 md:row-span-2 relative">
            <Image
              src={"/landing/feature-1-grid-image-1.svg"}
              alt="Image of a woman"
              fill
              className="object-cover rounded-2xl"
            />
          </div>
          {/* 3rd item */}
          <div className="size-67 bg-[#E9F5D7] rounded-2xl border border-gray-200 flex flex-col justify-between p-6">
            <h4 className="text-[66px]">📕</h4>
            <div>
              <h4 className="font-black text-[52px]">80M</h4>
              <p className="text-sm font-normal">Monthly Readers</p>
            </div>
          </div>
          {/* 4th item */}
          <div className="size-67 rounded-2xl border border-gray-200 relative">
            <Image
              src={"/landing/feature-1-grid-image-2.svg"}
              alt="Image of a man"
              fill
              className="object-cover rounded-2xl"
            />
          </div>
          {/* 5th item */}
          <div className="size-67 bg-[#F5D2FD] rounded-2xl border border-gray-200 flex flex-col justify-center items-center">
            <h4 className="font-black text-[52px] ">
              <span className="text-[#B513DA]">1,</span>000+
            </h4>
            <p className="text-sm font-normal">Brands Featured</p>
          </div>
          {/* 6th item */}
          <div className="h-67 bg-[#F7F7F7] rounded-2xl border border-gray-200 col-span-2 flex flex-col justify-center items-center p-6 relative">
            <CircleUserRound
              className="absolute text-gray-200 top-4 left-4 hidden md:block"
              size={30}
            />
            <CircleUserRound
              className="absolute text-gray-200 bottom-4 right-4 hidden md:block"
              size={30}
            />
            <h4 className="font-black text-[52px] text-[#4870EA]">
              1day Avg. <span className="text-black">Delivery</span>
            </h4>
            <p className="text-sm font-normal">Rolls down from 90 days</p>
          </div>
        </div>
      </div>

      {/* floating btn */}
      <div className="w-115 h-35 rounded-2xl p-4 bg-white border border-gray-300 mx-auto my-20">
        <div className="border border-gray-300 p-4 rounded-2xl h-full">
          <button className="bg-linear-to-r from-[#2BAAE2] to-[#233E97] border border-black shadow h-full w-full rounded-2xl text-white flex items-center justify-between p-4 text-xl cursor-pointer">
            Launch Your PR Now
            <MousePointer2 color="white" size={30} className="rotate-90"/>
          </button>
        </div>
      </div>

      {/* why kiki pr works */}
      <div className="bg-linear-to-br from-[#010921] via-[#010921] to-[#7e6c20] rounded-[30px] p-10 w-[95%] mx-auto">
        <h4 className="text-center text-[45px] text-[#FED93B] font-bold capitalize">
          Why Kiki PR Works.
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto my-8">
            {whyPRWorks.map((item, idx) => (
              <div key={idx} className="bg-white/20 backdrop-blur-2xl rounded-xl border border-white h-58 w-full p-6 flex flex-col justify-center items-center gap-6">
                {/* icon */}
                <div className="bg-linear-to-b from-[#2BAAE2] to-[#233E97] size-25 rounded-full flex justify-center items-center">
                  <img src={item.icon} alt={`Icon ${idx}`} />
                </div>

                {/* content */}
                <div className="text-center text-white">
                  <h4 className="font-bold text-xl">{item.header}</h4>
                  <p className="text-sm">{item.text}</p>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* brands featured */}
      <div className="space-y-10 my-10 sm:my-16 md:my-20 px-4">
        <h4 className="text-center text-3xl font-bold capitalize">
          Some brands we’ve helped feature
        </h4>
        <div className="flex flex-wrap justify-center gap-6 sm:gap-10 md:gap-16 opacity-50 px-4">
          {trustedCompaniyImages.map((src, index) => (
            <div
              key={index}
              className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14">
              <Image
                src={src}
                alt={`Company ${index + 1}`}
                width={56}
                height={56}
                className="object-contain w-full h-full grayscale opacity-70"
              />
            </div>
          ))}
        </div>
      </div>

      <TestimonialsCarousel bgColor="#E9F5FA" />

      {/* guarantee */}
      <div className="bg-[#2BAAE2] rounded-3xl h-fit md:h-41.75 w-full md:w-169.5 mx-5 md:mx-auto border border-gray-200 p-6 flex items-center gap-6">
        <img src="/landing/guarantee-badge.svg" alt="Badge" />
        <div className="space-y-2 text-white">
          <h4 className="font-bold text-3xl capitalize">
            Your success is guaranteed.
          </h4>
          <p className="text-lg">
            If you don’t get published on the outlets you paid for, you get your
            money back. No excuses. <strong>No risks.</strong>
          </p>
        </div>
      </div>

      {/* last cta section */}
      <div className="bg-radial from-[#074561] to-[#053144] flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 xl:gap-20 px-4 sm:px-6 lg:px-8 xl:px-16 w-[95%] rounded-xl sm:rounded-2xl mx-auto my-10 sm:my-14 lg:my-20">
        {/* left corner */}
        <div className="max-w-2xl space-y-4 sm:space-y-6 lg:space-y-8 w-full lg:w-1/2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight text-center lg:text-left">
            Your (customers, investors, partners, fans,) are waiting for you. Be visible. be credible.
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-300 text-center lg:text-left">
            In 24 hours, your brand could be in Punch, TechCabal, or Forbes. Or you could still be waiting for a PR agency to call you back. The choice is yours.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 text-sm font-medium">
            <button className="h-12 sm:h-14 px-6 w-full sm:w-auto rounded-lg flex justify-center items-center bg-white text-[#111111] hover:cursor-pointer relative group">
              Get Featured Now
              <div className="w-6 h-6 sm:w-7.5 sm:h-7.5 rounded-full flex justify-center items-center bg-[#020617] border border-white rotate-45 absolute -right-2 sm:-right-3 z-10">
                <ArrowUp color="#fff" size={12} className="sm:w-4 sm:h-4" />
              </div>
            </button>
            <button className="h-12 sm:h-14 px-6 w-full sm:w-auto rounded-lg flex justify-center items-center border-white border text-white hover:cursor-pointer hover:bg-white/10 transition-colors">
              See How it Works
            </button>
          </div>
        </div>
        {/* right corner */}
        <img
          src="/landing/feature1-cta.svg"
          alt="Image"
          className="w-full lg:w-1/2 h-auto max-h-75 lg:max-h-full object-contain mt-8 lg:mt-0"
        />
      </div>

      <FAQFooter />
    </section>
  );
}
