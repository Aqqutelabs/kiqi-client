"use client";

import FAQFooter from "@/components/ui/landing-footer";
import LandingNav from "@/components/ui/landing-nav";
import HorizontalCarousel from "@/components/ui/LandingCarousel";
import { ArrowRight, ArrowUp, MoveRight } from "lucide-react";
import Image from "next/image";

export default function FeatureThreePage() {
  const solutionPoints = [
    {
      img: "/landing/solution-1.svg",
      title: "Research-Driven",
      description: "We find what your audience is searching for.",
    },
    {
      img: "/landing/solution-2.svg",
      title: "SEO Optimized",
      description:
        "Every blog is keyword-rich, structured, and internally linked.",
    },
    {
      img: "/landing/solution-3.svg",
      title: "Growth-Focused",
      description:
        "Not just traffic — content designed to generate leads & sales.",
    },
  ];

  const emailMarketingSteps = [
    { id: 1, title: "Upload Contacts", img: "/landing/landing-step-1.svg" },
    { id: 2, title: "Approve campaign", img: "/landing/landing-step-2.svg" },
    { id: 3, title: "Track result", img: "/landing/landing-step-3.svg" },
  ];

  const howItWorksSteps = [
    {
      id: 1,
      highlighted: "Tell Us Your Goals",
      text: "Share your niche, audience, or focus keywords.",
      img: "/landing/how-it-works-1.svg",
    },
    {
      id: 2,
      highlighted: "We Write & Optimize",
      text: "Our AI + human writers create blogs that pass SEO tests.",
      img: "/landing/how-it-works-2.svg",
    },
    {
      id: 3,
      highlighted: "Publish & Track",
      text: "Blogs go live on your site, reports show results.",
      img: "/landing/how-it-works-3.svg",
    },
  ];

  const useCases = [
    {
      id: 1,
      title: "Boost Local Authority",
      image: "/landing/use-case-one.png",
      subtitle: "Dominate search in your city/region.",
    },
    {
      id: 2,
      title: "Startup Growth",
      image: "/landing/use-case-one.png",
      subtitle: "Attract investors and partners through thought leadership.",
    },
    {
      id: 3,
      title: "E-commerce Sales",
      image: "/landing/use-case-one.png",
      subtitle: "Rank product pages & buying guides.",
    },
    {
      id: 4,
      title: "Enterprise Visibility",
      image: "/landing/use-case-one.png",
      subtitle: "Show up where decision-makers search.",
    },
  ];

  const whyChooseUsPoints = [
    { text: "Content that ranks fast.", icon: "/landing/rank.svg" },
    { text: "Lower cost than hiring in-house.", icon: "/landing/low-price.svg" },
    { text: "Transparent SEO reports.", icon: "/landing/graph.svg" },
    { text: "Scale as you grow.", icon: "/landing/search.svg" },
    { text: "AI + Human blend = speed & quality.", icon: "/landing/ai-component.svg" },
  ];

  return (
    <section>
      <LandingNav />
      {/* hero */}
      <div className="min-h-screen bg-gradient-to-b from-[#012332] to-[#001532] flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-20 px-4 sm:px-6 lg:px-16 py-10 lg:py-20">
        {/* left corner */}
        <div className="max-w-2xl space-y-6 lg:space-y-8">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
            🚀 Rank Higher. <br className="hidden md:block" /> Convert Faster
            without Writing a Single Word.
          </h1>
          <p className="text-lg sm:text-xl text-gray-300">
            Kiki&apos;s Blogging & SEO service gets you Google traffic and
            credibility while you focus on building your business. We research,
            write, optimize, and publish content that attracts the right
            audience.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 text-sm font-medium">
            <button className="h-14 px-6 w-full md:w-[160px] rounded-lg flex justify-center items-center bg-[#FED93B] text-[#111111] hover:cursor-pointer relative">
              Start for Free
              <div className="w-[30px] h-[30px] rounded-full flex justify-center items-center bg-[#020617] border border-[#FED93B] rotate-45 absolute -right-3 z-10">
                <ArrowUp color="#FED93B" size={16} />
              </div>
            </button>
            <button className="h-14 px-6 w-full md:w-[160px] rounded-lg flex justify-center items-center border-white border text-white hover:cursor-pointer">
              See Pricing
            </button>
          </div>
        </div>
        {/* right corner */}
        <div className="w-4/5 h-[400px] relative rounded-lg border-4 border-white">
          {/* Main background image */}
          <Image
            src="/landing/landing-feature-3-hero.svg"
            alt="Feature 3 Hero"
            fill
            className="object-cover"
            priority
          />
          {/* Floating image 1 */}
          <div className="absolute -top-10 right-1/4 z-10">
            <Image
              src="/landing/landing-feature-3-hero-1.svg"
              alt="Floating element 1"
              width={160}
              height={180}
              className="object-cover"
            />
          </div>
          {/* Floating image 2 */}
          <div className="absolute -bottom-14 -left-14 z-10">
            <Image
              src="/landing/landing-feature-3-hero-2.svg"
              alt="Floating element 2"
              width={149}
              height={98}
              className="object-cover"
            />
          </div>
        </div>
      </div>

      {/* why this matters */}
      <div className="bg-[#E5F6A4] rounded-2xl h-[500px] m-20 flex items-end gap-12 px-8 pt-8 relative">
        <div className="h-11 rounded-full bg-[#2BAAE2] w-[194px] flex justify-center items-center absolute -top-5 left-[40%]">
          <p className="text-sm text-white">Why This Matters</p>
        </div>
        <div className="space-y-6 w-2/4 pb-10">
          <h2 className="font-bold text-black text-[42px]">
            💡 Why Most Businesses Struggle with SEO
          </h2>
          <p>❌ Writing is time-consuming and inconsistent.</p>
          <p>❌ SEO best practices are constantly changing.</p>
          <p>❌ Creating high-quality content requires expertise.</p>
          <p>❌ Competing for attention in a crowded market is tough.</p>
          <p className="text-sm">
            Search engines reward consistency, authority, and optimized content.
            That’s exactly what Kiki delivers — on autopilot.”
          </p>
        </div>
        <img src="/landing/why-this-matters.svg" alt="A photo of a girl" />
      </div>

      {/* the solution */}
      <div className="flex flex-col items-center justify-center space-y-6 mb-20 px-4 py-10 relative">
        <Image
          src={"/landing/solution-bg.svg"}
          alt="Solution background"
          fill
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
        />
        <div className="h-11 rounded-full bg-transparent w-[194px] border border-[#BCBCBC] flex justify-center items-center z-10">
          <p className="text-sm text-black">The Solution</p>
        </div>
        <h2 className="font-bold text-[42px] z-10">
           Content That Ranks & <br className="hidden md:block" /> Converts —{" "}
          <span className="text-[#2BAAE2]">Done for You.</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-md lg:max-w-4xl w-full z-10">
          {solutionPoints.map((point, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-2xl last:col-span-2 space-y-5 flex flex-col last:flex-row last:gap-10 last:items-center items-start p-6">
              <img
                src={point.img}
                alt="Image"
                className="h-[130px] w-[150px] md:h-auto md:w-auto"
              />
              <div className="space-y-4">
                <h4 className="text-[#2BAAE2] font-extrabold text-[22px]">
                  {point.title}
                </h4>
                <p className="text-sm text-black">{point.description}</p>
              </div>
            </div>
          ))}
        </div>
        <button className="bg-linear-to-b from-[#2BAAE2] to-[#233E97] text-white rounded-xl flex gap-2.5 h-14 cursor-pointer px-3 items-center">
          See Pricing <MoveRight />
        </button>
      </div>

      {/* how it works */}
      <div className="mx-14 my-20">
        <h3 className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-[50px] text-center">
          How it works in
          <span className="text-[#233E97]"> 3 simple steps</span>
        </h3>
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 lg:gap-10 mt-6 md:my-16 px-4">
          {howItWorksSteps.map((step) => (
            <div
              key={step.id}
              className="flex flex-col items-center gap-8 md:gap-4 relative w-full max-w-sm md:max-w-none">
              <div className="absolute -top-4 rounded-md bg-radial from-[#233E97] to-[#2BAAE2] text-white text-sm md:text-base h-7 md:h-8 w-16 md:w-20 flex justify-center items-center">
                Step {step.id}
              </div>
              <div className="rounded-xl md:rounded-2xl bg-[#DFEFFC] p-4 md:p-6 flex justify-center items-center w-full h-[200px] md:h-[250px] lg:h-[300px]">
                <img
                  src={step.img}
                  alt={step.highlighted}
                  className="h-[230px] w-[340px] max-h-[150px] md:max-h-full object-cover"
                />
              </div>
              <h4 className="text-[#1E1E1E] text-base md:text-lg lg:text-xl text-center">
                <span className="font-bold">{step.highlighted}</span> –{" "}
                {step.text}
              </h4>
            </div>
          ))}
        </div>
      </div>

      {/* use cases */}
      <div className="bg-[#EEF5FD] p-10 space-y-10">
        <div className="h-[67px] w-[194px] border border-[#233E97] rounded-full flex justify-center items-center">
          <p className="text-[#233E97] font-bold text-lg">Use Cases</p>
        </div>
        <HorizontalCarousel items={useCases} />
      </div>

      {/* why choose us */}
      <div className="min-h-screen bg-linear-to-b to-[#2BAAE2] from-[#020D1D] p-10">
        <h4 className="text-white text-center text-[45px] font-bold">Why Choose Kiki SEO?</h4>
        <div className="h-[500px] mx-auto max-w-6xl border border-white/30 rounded-xl backdrop-blur-2xl bg-white/10 my-8 flex items-center justify-between gap-14 py-12 px-16">
          <div className="space-y-4">
            {whyChooseUsPoints.map((point, index) => (
              <div key={index} className="flex items-center gap-4 bg-white py-2.5 px-4 rounded-xl">
                <div className="h-12 w-12 flex justify-center items-center bg-black rounded-full">
                  <img
                    src={point.icon}
                    alt={point.text}
                    className="h-6 w-6 object-contain"
                  />
                </div>
                <p className="text-black font-bold text-lg">{point.text}</p>
              </div>
            ))}
          </div>
          <img src="/landing/why-choose-us.svg" alt="Picture of a woman holding a laptop" />
        </div>

        {/* cards */}
        <div className="flex justify-center items-center gap-6 mx-auto max-w-7xl my-20 overflow-x-auto pb-6 scrollbar-hide px-4">
          <div className="rounded-[30px] bg-white w-[400px] h-[330px] flex flex-col items-start justify-between p-6 shadow-lg">
            <p className="text-[22px] font-normal">“Kiki helped us grow from 200 monthly visitors to 10,000 in 6 months — without hiring an agency.”</p>
            <div className="flex items-center gap-2.5">
              <img src="/landing/man-placeholder.svg" alt="Man" className="object-cover" />
              <div>
                <p className="text-base text-black">Tunde</p>
                <p className="text-sm text-[#797878]">Startup Founder</p>
              </div>
            </div>
          </div>
           <div className="rounded-[30px] bg-white w-[400px] h-[330px] flex flex-col items-start justify-between p-6 shadow-lg hover:shadow-2xl transition-shadow duration-300">
            <p className="text-[22px] font-normal">“Our ecommerce blog now ranks on page 1 for 12 key terms. Sales doubled.”</p>
            <div className="flex items-center gap-2.5">
              <img src="/landing/man-placeholder.svg" alt="Man" className="object-cover" />
              <div>
                <p className="text-base text-black">Mike</p>
                <p className="text-sm text-[#797878]">Online Store Owner</p>
              </div>
            </div>
          </div>
           <div className="rounded-[30px] bg-white w-[400px] h-[330px] flex flex-col items-start justify-between p-6 shadow-lg hover:shadow-2xl transition-shadow duration-300">
            <p className="text-[22px] font-normal">“The SEO reports are simple enough for my investors to understand. Huge win.”</p>
            <div className="flex items-center gap-2.5">
              <img src="/landing/man-placeholder.svg" alt="Man" className="object-cover" />
              <div>
                <p className="text-base text-black">Chuka</p>
                <p className="text-sm text-[#797878]">Saas CEO</p>
              </div>
            </div>
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

      {/* email marketing in 3 steps */}
      <div className="bg-[#EEF5FD] p-4 md:p-6 lg:p-10 space-y-3 md:space-y-4">
        <h3 className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-[50px] text-center">
          From zero to email marketing in
          <span className="text-[#233E97] block">3 simple steps</span>
        </h3>
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 lg:gap-10 mt-6 md:mt-10 px-4">
          {emailMarketingSteps.map((step) => (
            <div
              key={step.id}
              className="flex flex-col items-center gap-3 md:gap-4 relative w-full max-w-sm md:max-w-none">
              <div className="absolute -top-4 rounded-md bg-radial from-[#233E97] to-[#2BAAE2] text-white text-sm md:text-base h-7 md:h-8 w-16 md:w-20 flex justify-center items-center">
                Step {step.id}
              </div>
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

      {/* last cta section */}
      <div className="bg-gradient-to-b from-blue-900 via-blue-800 to-cyan-400 flex flex-col md:flex-row items-center justify-between gap-8 lg:gap-20 px-4 sm:px-6 lg:px-16 py-10 lg:py-20 w-[95%] lg:w-full max-w-[95%] rounded-2xl mx-auto my-20">
        {/* left corner */}
        <div className="max-w-2xl space-y-6 lg:space-y-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
            🔥 Turn Your Website <br className="hidden md:block" /> Into a 24/7 Sales Machine.
          </h1>
          <p className="text-lg sm:text-xl text-gray-300">
           Stop guessing with SEO. Let Kiki run your content engine so you can run your business.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 text-sm font-medium">
            <button className="h-14 px-6 w-full md:w-[160px] rounded-lg flex justify-center items-center bg-[#FED93B] text-[#111111] hover:cursor-pointer relative">
              Start for Free
              <div className="w-[30px] h-[30px] rounded-full flex justify-center items-center bg-[#020617] border border-[#FED93B] rotate-45 absolute -right-3 z-10">
                <ArrowUp color="#FED93B" size={16} />
              </div>
            </button>
            <button className="h-14 px-6 w-full md:w-[160px] rounded-lg flex justify-center items-center border-white border text-white hover:cursor-pointer">
              See Pricing
            </button>
          </div>
        </div>
        {/* right corner */}
        <img src="/landing/website-into-sales.svg" alt="Image" className="w-2/5 h-auto object-contain" />
      </div>

      <FAQFooter />
    </section>
  );
}
