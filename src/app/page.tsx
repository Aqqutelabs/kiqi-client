"use client";

import LandingNav from "@/components/ui/landing-nav";
import { CheckCircleIcon, CirclePlay } from "lucide-react";
import { useState } from "react";

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

  return (
    <section>
      <LandingNav />

      {/* hero section */}
      <div className="min-h-screen w-[95%] bg-gradient-to-b from-blue-900 via-blue-800 to-cyan-400 flex items-center justify-center p-10 mx-auto rounded-2xl">
        <div className="max-w-7xl w-full flex items-center justify-between gap-12">
          {/* Left Content */}
          <div className="flex-1 space-y-8">
            <h1 className="text-6xl font-bold text-white leading-tight">
              Email Marketing
              <br />
              Without the
              <br />
              <span className="bg-gradient-to-b from-[#FFF] via-[#f8e58f] to-[#FED93B] text-transparent bg-clip-text">
                Headache
              </span>
            </h1>

            <p className="text-white text-lg max-w-md">
              Launch campaigns, grow subscribers, and drive sales — without
              learning <span className="font-semibold">"Email Marketing"</span>.
            </p>

            <div className="flex items-center gap-4 text-sm font-medium">
              <button className="h-11 px-4 rounded-lg flex justify-center items-center bg-white text-[#111111] hover:cursor-pointer">
                Start for Free
              </button>
              <button className="h-11 px-4 rounded-lg flex justify-center items-center border-white border text-white hover:cursor-pointer">
                Watch Demo
              </button>
            </div>

            <div className="flex items-center gap-8 text-white text-sm">
              <div className="flex items-center gap-2">
                <CheckCircleIcon color="green" size={24} />
                <span>No technical experience required</span>
              </div>

              <div className="flex items-center gap-2">
                <CheckCircleIcon color="green" size={24} />
                <span>No credit card required</span>
              </div>
            </div>
          </div>

          {/* Right Content - Mockup */}
          <div className="flex-1 relative w-[550px] h-[570px]">
            <img
              src="/new-hero-img.svg"
              alt="Hero Image"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* carousel */}
      <div className="overflow-hidden h-[50px] md:h-[92px] bg-[#111111] flex items-center my-6">
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
              <div
                key={`first-${index}`}
                className="flex items-center text-white gap-6 md:gap-16 mx-6 md:mx-10">
                <p className="text-base md:text-lg whitespace-nowrap">{text}</p>
                <CheckCircleIcon size={25} className="shrink-0" />
              </div>
            ))}
          </div>

          {/* Second set (duplicate) */}
          <div className="flex items-center shrink-0">
            {carouselText.map((text, index) => (
              <div
                key={`second-${index}`}
                className="flex items-center text-white gap-6 md:gap-16 mx-6 md:mx-10">
                <p className="text-base md:text-lg whitespace-nowrap">{text}</p>
                <CheckCircleIcon size={25} className="shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* inbox magic*/}
      <div className="gap-5 flex items-center flex-col my-10">
        <div className="h-10.5 w-[194px] rounded-full bg-[#FED93B] flex justify-center items-center">
          <p className="font-medium text-[#0C31A1] text-lg text-center">
            Inbox Magic
          </p>
        </div>
        <h2 className="text-[#111111] font-bold text-[45px]">
           We send the <span className="text-[#0C31A1]">Emails</span>. You get
          the <span className="text-[#4CAF50]">Sales.</span>
        </h2>
        <p className="text-xl text-[#797878] font-normal text-center">
           Upload a sheet, paste contacts, or connect your inbox. Our{" "}
          <br className="hidden md:block" /> concierge does the rest.
        </p>
        <img src={"/inbox-magic.svg"} className="cursor-pointer" />
      </div>

      {/* features */}
      <div className="bg-[#EEF5FD] rounded-4xl mx-4 md:mx-10 my-14 p-6 md:p-10 flex flex-col items-center gap-8">
        <h2 className="text-black font-bold text-3xl md:text-5xl text-center">
          Kiki Features
        </h2>

        {/* Tabs Container */}
        <div className="w-full max-w-3xl">
          <div className="rounded-lg bg-white flex flex-wrap md:flex-nowrap items-center justify-center gap-2 md:gap-3 p-3 md:px-5 md:py-2">
            {features.map((f) => {
              const isActive = activeFeatureTab === f.id;
              return (
                <div
                  key={f.id}
                  onClick={() => setActiveFeatureTab(f.id)}
                  className={`rounded-md py-3 px-4 md:px-8 flex justify-center items-center cursor-pointer transition-all duration-200 ease-in whitespace-nowrap text-sm md:text-base ${
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
        <div className="w-full max-w-5xl mt-6">
          {activeFeature && (
            <div className="relative w-full rounded-2xl overflow-hidden transition-all duration-300 ease-in-out">
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
      <div className="flex flex-col items-center relative gap-10">
        <h2 className="text-center font-bold text-4xl flex items-center gap-2">
          <CirclePlay size={35} /> Watch full{" "}
          <span className="text-[#2BAAE2]">Demo Video</span> Below
        </h2>
        <img src="/blue-arrow.svg" className="absolute left-[70%] top-9" />
        <img
          src="/demo-video-placeholder.svg"
          className="w-full h-auto object-cover cursor-pointer"
        />
      </div>

      {/* smarter emails section */}
      <div className="rounded-[30px] bg-linear-to-br from-[#0C31A1] to-[#2BAAE2] mx-10 p-10">
        <h2 className="font-bold text-[45px] text-center">
          <span className="text-[#FED93B]">Smarter Emails</span>
          <span className="text-white">. Safer Data</span>
        </h2>
        <p className="text-xl text-white font-normal text-center">
          Kiki gives you analytics that make sense and security that keeps your{" "}
          <br className="hidden md:block" /> emails safe — without extra setup.
        </p>
        <div className="space-y-6 mt-10 mb-4 px-24">
          {smarterEmailsFeatures.map((s, idx) => (
            <div
              key={idx}
              className={`bg-white rounded-2xl flex justify-between gap-16 items-center h-[400px] px-10 ${
                idx % 2 !== 0 ? "flex-col md:flex-row-reverse" : "flex-col md:flex-row"
              }`}>
              {/* image card */}
              <div className="rounded-2xl bg-[#67B2FE47] h-auto w-2/5 p-5 flex justify-center items-center">
                <img
                  src={s.img}
                  alt={`Image ${idx}`}
                  className="h-auto w-auto object-cover"
                />
              </div>

              {/* title and description */}
              <div className="space-y-5 w-3/5">
                <h4 className="text-[#1E1E1E] text-[30px] font-bold">{s.title}</h4>
                <p className="text-[#1E1E1ECC] text-base font-normal">{s.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* recent blogs */}
      <div className="h-fit bg-[#EEF5FD] my-10 space-y-8 p-12">
        <h2 className="font-bold text-4xl">Recent Blogs</h2>
        <div className="overflow-y-auto">
          <div className="h-[260px] w-[450px] rounded-3xl bg-gray-200 flex items-center gap-4">
            <h3>Lorem ipsum dolor sit amet consectetur.</h3>
          </div>
        </div>
      </div>

    </section>
  );
}