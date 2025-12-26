"use client";

import FAQFooter from "@/components/ui/landing-footer";
import LandingNav from "@/components/ui/landing-nav";
import {
  CheckCircleIcon,
  CirclePlay,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
} from "lucide-react";
import Image from "next/image";
import { useState, useRef } from "react";

const TestimonialsCarousel = () => {
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
          <span className="text-blue-600">Kiki.</span>
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
                className="flex-none w-[280px] sm:w-[320px] md:w-[400px] bg-white border border-gray-200 rounded-2xl p-4 md:p-6 snap-start">
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
};

export default function Home() {
  const carouselText = [
    "Never Miss a Sale",
    "Close More Deals",
    "Immediate Response 24/7",
    "100% Customer Sales",
  ];

  const features = [
    { id: 1, title: "Manage Campaigns", img: "/landing-feature-img-1.svg" },
    { id: 2, title: "Email Lists", img: "/landing-feature-img-2.svg" },
    { id: 3, title: "Automation", img: "/landing-feature-img-3.svg" },
    { id: 4, title: "Analytics", img: "/landing-feature-img-4.svg" },
  ];
  const [activeFeatureTab, setActiveFeatureTab] = useState<number>(1);
  const activeFeature = features.find((f) => f.id === activeFeatureTab);

  const smarterEmailsFeatures = [
    {
      title: "Engagement score simplified",
      description:
        "Auto-generate meaningful alternative text for thousands of images with a single click—saving your team hours of manual tagging. Perfect for ecommerce, media-heavy sites, and content-rich platforms.",
      img: "/engagement-score.svg",
    },
    {
      title: "Subscriber growth trends",
      description:
        "Auto-generate meaningful alternative text for thousands of images with a single click—saving your team hours of manual tagging. Perfect for ecommerce, media-heavy sites, and content-rich platforms.",
      img: "/subscriber-growth.svg",
    },
    {
      title: "Encrypted data protection",
      description:
        "Auto-generate meaningful alternative text for thousands of images with a single click—saving your team hours of manual tagging. Perfect for ecommerce, media-heavy sites, and content-rich platforms.",
      img: "/encrypted-data-protecttion.svg",
    },
  ];

  const plans = [
    {
      name: "Free",
      description: "Perfect for beginners testing email.",
      price: "0",
      perks: [
        "500 emails",
        "Extended Quota @ $0.005/email",
        "1 Campaign",
        "Basic analytics",
      ],
    },
    {
      name: "Solo",
      description: "Built for freelancers and side hustles.",
      price: "0.99",
      perks: [
        "Everything in Free +",
        "2000 emails",
        "Extended Quota @ $0.002/email",
        "5 Campaigns",
        "Engagement score",
        "Smart templates",
        "Basic automation",
        "Support",
      ],
    },
    {
      name: "MSME",
      description: " For growing small businesses.",
      price: "9.85",
      perks: [
        "20,000 emails",
        "Extended Quota @ $0.001/email",
        "Unlimited Campaigns",
        "Concierge access (4 emails per month)",
        "Advanced analytics",
        "Campaign A/B testing",
      ],
    },
    {
      name: "Business",
      description: "Serious power for scale.",
      price: "56",
      perks: [
        "100,000 emails",
        "Extended Quota @ $0.001/email",
        "Team accounts",
        "Security compliance",
        "Custom integrations",
        "Concierge+ automation",
      ],
    },
  ];

  const emailMarketingSteps = [
    { id: 1, title: "Upload Contacts", img: "/landing/landing-step-1.svg" },
    { id: 2, title: "Approve campaign", img: "/landing/landing-step-2.svg" },
    { id: 3, title: "Track result", img: "/landing/landing-step-3.svg" },
  ]
  return (
    <section>
      <LandingNav />

      {/* hero section */}
      <div className="min-h-screen w-[95%] lg:w-full max-w-[95%] bg-gradient-to-b from-blue-900 via-blue-800 to-cyan-400 flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-10 mx-auto rounded-2xl">
        <div className="max-w-7xl w-full flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
          {/* Left Content */}
          <div className="flex-1 space-y-6 lg:space-y-8 px-4 sm:px-6 lg:px-0">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight text-center lg:text-left">
              Email Marketing
              <br />
              Without the
              <br />
              <span className="bg-gradient-to-b from-[#FFF] via-[#f8e58f] to-[#FED93B] text-transparent bg-clip-text">
                Headache
              </span>
            </h1>

            <p className="text-white text-base sm:text-lg max-w-md text-center lg:text-left mx-auto lg:mx-0">
              Launch campaigns, grow subscribers, and drive sales — without
              learning <span className="font-semibold">"Email Marketing"</span>.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 text-sm font-medium">
              <button className="h-14 px-6 w-full md:w-[160px] rounded-lg flex justify-center items-center bg-white text-[#111111] hover:cursor-pointer relative">
                Start for Free
                <div className="size-[30px] rounded-full flex justify-center items-center bg-[#020617] border border-white rotate-45 absolute -right-3 z-10">
                  <ArrowUp color="white" size={16}/>
                </div>
              </button>
              <button className="h-14 px-6 w-full md:w-[160px] rounded-lg flex justify-center items-center border-white border text-white hover:cursor-pointer">
                Watch Demo
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 text-white text-sm">
              <div className="flex items-center gap-2">
                <CheckCircleIcon color="green" size={20} className="shrink-0" />
                <span>No technical experience required</span>
              </div>

              <div className="flex items-center gap-2">
                <CheckCircleIcon color="green" size={20} className="shrink-0" />
                <span>No credit card required</span>
              </div>
            </div>
          </div>

          {/* Right Content - Mockup */}
          <div className="flex-1 relative w-full max-w-[500px] lg:w-[550px] h-[350px] sm:h-[450px] lg:h-[570px] mt-8 lg:mt-0">
            <img
              src="/new-hero-img.svg"
              alt="Hero Image"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>

      {/* carousel */}
      <div className="overflow-hidden h-[40px] md:h-[92px] bg-[#111111] flex items-center my-4 md:my-6">
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
            {carouselText.map((text, index) => (
              <div
                key={`first-${index}`}
                className="flex items-center text-white gap-4 md:gap-16 mx-4 md:mx-10">
                <p className="text-sm md:text-lg whitespace-nowrap">{text}</p>
                <CheckCircleIcon size={20} className="shrink-0" />
              </div>
            ))}
          </div>

          {/* Second set (duplicate) */}
          <div className="flex items-center shrink-0">
            {carouselText.map((text, index) => (
              <div
                key={`second-${index}`}
                className="flex items-center text-white gap-4 md:gap-16 mx-4 md:mx-10">
                <p className="text-sm md:text-lg whitespace-nowrap">{text}</p>
                <CheckCircleIcon size={20} className="shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* inbox magic*/}
      <div className="gap-4 md:gap-5 flex items-center flex-col my-8 md:my-10 px-4">
        <div className="h-9 md:h-10.5 w-[160px] md:w-[194px] rounded-full bg-[#FED93B] flex justify-center items-center">
          <p className="font-medium text-[#0C31A1] text-base md:text-lg text-center">
            Inbox Magic
          </p>
        </div>
        <h2 className="text-[#111111] font-bold text-2xl sm:text-3xl md:text-[45px] text-center">
           We send the <span className="text-[#0C31A1]">Emails</span>. You get
          the <span className="text-[#4CAF50]">Sales.</span>
        </h2>
        <p className="text-base md:text-xl text-[#797878] font-normal text-center max-w-3xl">
           Upload a sheet, paste contacts, or connect your inbox. Our concierge does the rest.
        </p>
        <img src={"/inbox-magic.svg"} className="cursor-pointer w-full max-w-4xl px-4" />
      </div>

      {/* features */}
      <div className="bg-[#EEF5FD] rounded-3xl md:rounded-4xl mx-2 md:mx-4 lg:mx-10 my-8 md:my-14 p-4 md:p-6 lg:p-10 flex flex-col items-center gap-6 md:gap-8">
        <h2 className="text-black font-bold text-2xl md:text-3xl lg:text-5xl text-center">
          Kiki Features
        </h2>

        {/* Tabs Container */}
        <div className="w-full max-w-3xl">
          <div className="rounded-lg bg-white flex flex-wrap items-center justify-center gap-2 md:gap-3 p-2 md:p-3 lg:px-5 lg:py-2">
            {features.map((f) => {
              const isActive = activeFeatureTab === f.id;
              return (
                <div
                  key={f.id}
                  onClick={() => setActiveFeatureTab(f.id)}
                  className={`rounded-md py-2 px-3 md:py-3 md:px-4 lg:px-8 flex justify-center items-center cursor-pointer transition-all duration-200 ease-in whitespace-nowrap text-xs md:text-sm lg:text-base ${
                    isActive
                      ? "text-[#233E97] bg-[#2BAAE233] font-semibold"
                      : "text-gray-400 bg-transparent hover:bg-gray-50"
                  }`}>
                  {f.title}
                </div>
              );
            })}
          </div>
        </div>

        {/* Image Display Area */}
        <div className="w-full max-w-5xl mt-4 md:mt-6">
          {activeFeature && (
            <div className="relative w-full rounded-xl md:rounded-2xl overflow-hidden transition-all duration-300 ease-in-out">
              <img
                src={activeFeature.img}
                alt={`Feature ${activeFeature.id} - ${activeFeature.title}`}
                className="w-full h-auto object-cover"
              />
            </div>
          )}
        </div>
      </div>

      {/* demo video section */}
      <div className="flex flex-col items-center relative gap-6 md:gap-10 px-4">
        <h2 className="text-center font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl flex flex-col sm:flex-row items-center gap-2">
          <CirclePlay size={25} className="sm:mr-2" /> Watch full{" "}
          <span className="text-[#2BAAE2]">Demo Video</span> Below
        </h2>
        <img src="/blue-arrow.svg" className="absolute left-[65%] sm:left-[70%] top-6 md:top-9 w-16 md:w-auto hidden sm:block" />
        <img
          src="/demo-video-placeholder.svg"
          className="w-full h-auto object-cover cursor-pointer rounded-lg"
        />
      </div>

      {/* smarter emails section */}
      <div className="rounded-2xl md:rounded-[30px] bg-linear-to-br from-[#0C31A1] to-[#2BAAE2] mx-2 md:mx-4 lg:mx-10 p-4 md:p-6 lg:p-10">
        <h2 className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-[45px] text-center">
          <span className="text-[#FED93B]">Smarter Emails</span>
          <span className="text-white">. Safer Data</span>
        </h2>
        <p className="text-base md:text-lg lg:text-xl text-white font-normal text-center max-w-3xl mx-auto mt-2 md:mt-4">
          Kiki gives you analytics that make sense and security that keeps your emails safe — without extra setup.
        </p>
        <div className="space-y-4 md:space-y-6 mt-6 md:mt-10 mb-4 px-2 sm:px-4 md:px-8 lg:px-24">
          {smarterEmailsFeatures.map((s, idx) => (
            <div
              key={idx}
              className={`bg-white rounded-xl md:rounded-2xl flex flex-col md:flex-row justify-between gap-6 md:gap-8 lg:gap-16 items-center h-auto md:h-[400px] p-4 md:p-6 lg:p-10 ${
                idx % 2 !== 0
                  ? "md:flex-col lg:flex-row-reverse"
                  : "md:flex-col lg:flex-row"
              }`}>
              {/* image card */}
              <div className="rounded-xl md:rounded-2xl bg-[#67B2FE47] h-auto w-full md:w-2/5 p-4 md:p-5 flex justify-center items-center order-2 md:order-1">
                <img
                  src={s.img}
                  alt={`Image ${idx}`}
                  className="h-auto w-full max-w-[200px] md:max-w-none object-cover"
                />
              </div>

              {/* title and description */}
              <div className="space-y-3 md:space-y-5 w-full md:w-3/5 order-1 md:order-2">
                <h4 className="text-[#1E1E1E] text-lg sm:text-xl md:text-2xl lg:text-[30px] font-bold">
                  {s.title}
                </h4>
                <p className="text-[#1E1E1ECC] text-sm md:text-base font-normal">
                  {s.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* recent blogs */}
      <div className="h-fit bg-[#EEF5FD] my-8 md:my-10 space-y-6 md:space-y-8 p-4 md:p-6 lg:p-12">
        <h2 className="font-bold text-2xl md:text-3xl lg:text-4xl">Recent Blogs</h2>
        <div className="overflow-x-auto">
          <div className="h-[200px] md:h-[260px] w-[280px] sm:w-[350px] md:w-[450px] rounded-2xl md:rounded-3xl bg-gray-200 flex items-center justify-center gap-4 p-4">
            <h3 className="text-base md:text-lg">Lorem ipsum dolor sit amet consectetur.</h3>
          </div>
        </div>
      </div>

      {/* blend campaign with pr */}
      <div className="relative m-4 md:m-8 lg:m-12 p-4 md:p-6 lg:p-12 h-[300px] sm:h-[250px] md:h-[300px] lg:h-[355px] rounded-xl md:rounded-2xl lg:rounded-3xl overflow-hidden text-[#000015]">
        {/* Background image */}
        <Image
          src="/landing/blend-campaign-with-pr.svg"
          alt="Background"
          fill
          priority
          className="object-cover z-0"
        />
        {/* Content */}
        <div className="relative z-10 space-y-3 md:space-y-4 lg:space-y-6 w-full md:w-3/4 lg:w-[45%]">
          <h1 className="font-extrabold text-xl sm:text-2xl md:text-3xl lg:text-4xl">
            Blend your campaign with PR
          </h1>
          <p className="text-sm md:text-base">
            Why stop at inboxes? Amplify your email marketing with guaranteed PR
            placements on top media outlets. Turn every campaign into a
            headline, boost credibility, and reach audiences beyond your list.
          </p>
          <p className="text-sm md:text-base">
            With Kiki, your story travels further, faster, and with more
            authority.
          </p>
          <button className="bg-black text-white rounded-lg h-9 md:h-11 w-28 md:w-36 text-xs cursor-pointer mt-2">
            Get Started
          </button>
        </div>
      </div>

      {/* pricing plans */}
      <div className="flex flex-col justify-center items-center gap-4 md:gap-6 my-8 md:my-10 px-4">
        <div className="h-8 md:h-10.5 w-[160px] md:w-[194px] rounded-full bg-[#0C31A126] flex justify-center items-center">
          <p className="font-medium text-[#0C31A1] text-base md:text-lg text-center">
            Pricing Plans
          </p>
        </div>
        <h2 className="text-[#111111] font-bold text-2xl sm:text-3xl md:text-4xl lg:text-[45px] text-center">
          Find Your Perfect Plan
        </h2>
        <p className="text-base md:text-lg lg:text-xl text-[#797878] font-normal text-center max-w-3xl -mt-2 md:-mt-6">
            Choose the plan that grows with you. Start free, scale when you're ready, cancel anytime.
        </p>
        <div className="flex items-center bg-[#FBFBFB] border border-[#E7EBFF] shadow-sm h-[44px] md:h-[50px] w-fit rounded-lg py-4 md:py-6 px-3 md:px-4 gap-2 md:gap-3 text-xs md:text-sm">
          <p className="bg-white border border-[#E7EBFF] py-2 px-3 md:px-4 rounded-lg">
            Monthly
          </p>
          <p className="py-2 px-3 md:px-4 rounded-xl">Yearly</p>
        </div>
        <div className="flex flex-wrap md:flex-nowrap items-start justify-center gap-4 mx-2 md:mx-4 w-full max-w-6xl">
          {plans.map((plan, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <div
                key={idx}
                className={`border border-[#E7EBFF] shadow-sm rounded-xl md:rounded-2xl p-4 md:p-6 space-y-1.5 ${
                  !isEven ? "bg-[#0C31A1]" : "bg-white"
                } w-full sm:w-[calc(50%-8px)] md:w-1/4 last:bg-black`}>
                <div
                  className={`size-[28px] md:size-[34px] rounded-lg flex justify-center items-center ${
                    !isEven ? "bg-white" : "bg-[#6A8AFF]"
                  }`}>
                  <img
                    src={isEven ? "/bullseye-arrow.svg" : "/gem.svg"}
                    alt="Icon"
                    className="w-4 h-4 md:w-auto md:h-auto"
                  />
                </div>
                <h4
                  className={`text-lg md:text-xl lg:text-[26px] font-normal ${
                    !isEven ? "text-white" : "text-[#1B223C]"
                  }`}>
                  {plan.name}
                </h4>
                <p
                  className={`text-xs md:text-sm ${
                    !isEven ? "text-white" : "text-[#797878]"
                  }`}>
                  {plan.description}
                </p>
                <p className="flex items-center gap-2">
                  <span
                    className={`font-bold text-2xl md:text-3xl lg:text-[35px] ${
                      !isEven ? "text-white" : "text-[#1B223C]"
                    }`}>
                    ${plan.price}
                  </span>
                  <span
                    className={`text-xs md:text-sm font-normal ${
                      !isEven ? "text-white" : "text-[#797878]"
                    }`}>
                    per month
                  </span>
                </p>
                <hr className="text-[#E7EBFF]" />
                <ul className="space-y-1.5 md:space-y-2 my-3 md:my-4">
                  {plan.perks.map((perk, perkIdx) => (
                    <li
                      key={perkIdx}
                      className={`text-xs md:text-sm flex gap-2 md:gap-2.5 items-start md:items-center ${
                        !isEven ? "text-white" : "text-[#1B223C]"
                      }`}>
                      <img src="/check-2.svg" alt="Check" className="w-4 h-4 mt-0.5 md:mt-0 flex-shrink-0" />
                      <span className="flex-1">{perk}</span>
                    </li>
                  ))}
                </ul>
                <button className={`border border-gray-400 py-2 md:py-3 px-4 md:px-7 rounded-lg text-xs md:text-sm h-[40px] md:h-[46px] w-full ${
                  !isEven ? "bg-white text-[#1B223C]" : "bg-white text-[#1B223C]"
                }`}>
                  Get Started
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <TestimonialsCarousel/>

      {/* email marketing in 3 steps */}
      <div className="bg-[#EEF5FD] p-4 md:p-6 lg:p-10 space-y-3 md:space-y-4">
        <h3 className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-[50px] text-center">
          From zero to email marketing in 
          <span className="text-[#233E97] block">3 simple steps</span>
        </h3>
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 lg:gap-10 mt-6 md:mt-10 px-4">
          {emailMarketingSteps.map((step) => (
            <div key={step.id} className="flex flex-col items-center gap-3 md:gap-4 relative w-full max-w-sm md:max-w-none">
              <div className="absolute -top-4 rounded-md bg-radial from-[#233E97] to-[#2BAAE2] text-white text-sm md:text-base h-7 md:h-8 w-16 md:w-20 flex justify-center items-center">Step {step.id}</div>
              <div className="rounded-xl md:rounded-2xl bg-white p-4 md:p-6 flex justify-center items-center w-full h-[200px] md:h-[250px] lg:h-[300px]">
                <img
                  src={step.img}
                  alt={step.title}
                  className="h-auto w-auto max-h-[150px] md:max-h-full object-contain"
                />
              </div>
              <h4 className="text-[#1E1E1E] text-lg md:text-xl lg:text-[24px] font-bold text-center">
                {step.title}
              </h4>
            </div>
          ))}
        </div>
      </div>

      <FAQFooter />
    </section>
  );
}