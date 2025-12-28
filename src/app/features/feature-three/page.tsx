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
    {
      text: "Lower cost than hiring in-house.",
      icon: "/landing/low-price.svg",
    },
    { text: "Transparent SEO reports.", icon: "/landing/graph.svg" },
    { text: "Scale as you grow.", icon: "/landing/search.svg" },
    {
      text: "AI + Human blend = speed & quality.",
      icon: "/landing/ai-component.svg",
    },
  ];

  return (
    <section>
      <LandingNav />
      {/* hero */}
      <div className="min-h-screen bg-linear-to-b from-[#012332] to-[#001532] flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 xl:gap-20 px-4 sm:px-6 lg:px-8 xl:px-16 py-8 sm:py-10 lg:py-16 xl:py-20">
        {/* left corner */}
        <div className="max-w-2xl space-y-4 sm:space-y-6 lg:space-y-8 w-full lg:w-1/2">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight text-center lg:text-left">
            🚀 Rank Higher. <br className="hidden md:block" /> Convert Faster
            without Writing a Single Word.
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-300 text-center lg:text-left">
            Kiki&apos;s Blogging & SEO service gets you Google traffic and
            credibility while you focus on building your business. We research,
            write, optimize, and publish content that attracts the right
            audience.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 text-sm font-medium">
            <button className="h-12 sm:h-14 px-6 w-full sm:w-auto rounded-lg flex justify-center items-center bg-[#FED93B] text-[#111111] hover:cursor-pointer relative group">
              Start for Free
              <div className="w-6 h-6 sm:w-7.5 sm:h-7.5 rounded-full flex justify-center items-center bg-[#020617] border border-[#FED93B] rotate-45 absolute -right-2 sm:-right-3 z-10">
                <ArrowUp color="#FED93B" size={12} className="sm:w-4 sm:h-4" />
              </div>
            </button>
            <button className="h-12 sm:h-14 px-6 w-full sm:w-auto rounded-lg flex justify-center items-center border-white border text-white hover:cursor-pointer hover:bg-white/10 transition-colors">
              See Pricing
            </button>
          </div>
        </div>
        {/* right corner */}
        <div className="w-full lg:w-1/2 h-75 sm:h-87.5 md:h-100 lg:h-112.5 relative rounded-lg border-4 border-white mt-8 lg:mt-0 hidden md:block">
          {/* Main background image */}
          <Image
            src="/landing/landing-feature-3-hero.svg"
            alt="Feature 3 Hero"
            fill
            className="object-cover"
            priority
          />
          {/* Floating image 1 */}
          <div className="absolute -top-6 sm:-top-10 right-1/4 z-10">
            <Image
              src="/landing/landing-feature-3-hero-1.svg"
              alt="Floating element 1"
              width={120}
              height={135}
              className="w-24 h-28 sm:w-32 sm:h-36 lg:w-40 lg:h-45 object-cover"
            />
          </div>
          {/* Floating image 2 */}
          <div className="absolute -bottom-10 sm:-bottom-14 -left-10 sm:-left-14 z-10">
            <Image
              src="/landing/landing-feature-3-hero-2.svg"
              alt="Floating element 2"
              width={112}
              height={74}
              className="w-24 h-16 sm:w-28 sm:h-18 lg:w-37.25 lg:h-24.5 object-cover"
            />
          </div>
        </div>
      </div>

      {/* why this matters */}
      <div className="bg-[#E5F6A4] rounded-xl sm:rounded-2xl h-auto lg:h-125 mx-4 my-10 sm:m-6 md:m-10 lg:m-20 flex flex-col lg:flex-row items-end gap-8 lg:gap-12 p-4 sm:p-6 lg:p-8 pt-8 relative">
        <div className="h-10 sm:h-11 rounded-full bg-[#2BAAE2] w-40 sm:w-45 md:w-48.5 flex justify-center items-center absolute -top-5 left-1/2 lg:left-[40%] transform -translate-x-1/2 lg:transform-none">
          <p className="text-xs sm:text-sm text-white whitespace-nowrap">
            Why This Matters
          </p>
        </div>
        <div className="space-y-4 sm:space-y-6 w-full lg:w-1/2 pb-6 lg:pb-10">
          <h2 className="font-bold text-black text-2xl sm:text-3xl md:text-4xl lg:text-[42px]">
            💡 Why Most Businesses Struggle with SEO
          </h2>
          <p className="text-sm sm:text-base">
            ❌ Writing is time-consuming and inconsistent.
          </p>
          <p className="text-sm sm:text-base">
            ❌ SEO best practices are constantly changing.
          </p>
          <p className="text-sm sm:text-base">
            ❌ Creating high-quality content requires expertise.
          </p>
          <p className="text-sm sm:text-base">
            ❌ Competing for attention in a crowded market is tough.
          </p>
          <p className="text-xs sm:text-sm lg:text-base">
            Search engines reward consistency, authority, and optimized content.
            That&apos;s exactly what Kiki delivers — on autopilot.
          </p>
        </div>
        <img
          src="/landing/why-this-matters.svg"
          alt="A photo of a girl"
          className="w-full lg:w-1/2 h-auto max-h-75 lg:max-h-full object-contain hidden md:block"
        />
      </div>

      {/* the solution */}
      <div className="flex flex-col items-center justify-center space-y-4 sm:space-y-6 mb-10 lg:mb-20 px-4 sm:px-6 py-8 sm:py-10 relative">
        <Image
          src={"/landing/solution-bg.svg"}
          alt="Solution background"
          fill
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
        />
        <div className="h-9 sm:h-10 md:h-11 rounded-full bg-transparent w-40 sm:w-45 md:w-48.5 border border-[#BCBCBC] flex justify-center items-center z-10">
          <p className="text-xs sm:text-sm md:text-base text-black">
            The Solution
          </p>
        </div>
        <h2 className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-[42px] text-center z-10">
           Content That Ranks & <br className="hidden md:block" /> Converts —{" "}
          <span className="text-[#2BAAE2]">Done for You.</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 max-w-md lg:max-w-4xl w-full z-10">
          {solutionPoints.map((point, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl space-y-4 sm:space-y-5 flex flex-col last:md:col-span-2 last:md:flex-row last:md:gap-6 lg:last:gap-10 last:md:items-center items-start p-4 sm:p-6">
              <img
                src={point.img}
                alt={point.title}
                className="h-25 w-30 sm:h-30 sm:w-35 md:h-32.5 md:w-37.5 lg:h-auto lg:w-auto object-contain"
              />
              <div className="space-y-2 sm:space-y-4">
                <h4 className="text-[#2BAAE2] font-extrabold text-lg sm:text-xl lg:text-[22px]">
                  {point.title}
                </h4>
                <p className="text-xs sm:text-sm md:text-base text-black">
                  {point.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        <button className="bg-linear-to-b from-[#2BAAE2] to-[#233E97] text-white rounded-lg sm:rounded-xl flex gap-2.5 h-12 sm:h-14 cursor-pointer px-3 sm:px-4 items-center hover:opacity-90 transition-opacity">
          See Pricing <MoveRight className="w-4 h-4" />
        </button>
      </div>

      {/* how it works */}
      <div className="mx-4 sm:mx-6 md:mx-8 lg:mx-14 my-10 sm:my-14 md:my-16 lg:my-20">
        <h3 className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-[50px] text-center px-4">
          How it works in
          <span className="text-[#233E97]"> 3 simple steps</span>
        </h3>
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 lg:gap-10 mt-6 md:my-12 lg:my-16 px-4">
          {howItWorksSteps.map((step) => (
            <div
              key={step.id}
              className="flex flex-col items-center gap-6 md:gap-4 relative w-full max-w-sm md:max-w-none">
              <div className="absolute -top-4 rounded-md bg-radial from-[#233E97] to-[#2BAAE2] text-white text-sm md:text-base h-7 md:h-8 w-16 md:w-20 flex justify-center items-center">
                Step {step.id}
              </div>
              <div className="rounded-xl md:rounded-2xl bg-[#DFEFFC] p-4 md:p-6 flex justify-center items-center w-full h-45 sm:h-50 md:h-62.5 lg:h-75">
                <img
                  src={step.img}
                  alt={step.highlighted}
                  className="h-auto w-full max-h-30 sm:max-h-37.5 md:max-h-full object-contain"
                />
              </div>
              <h4 className="text-[#1E1E1E] text-sm sm:text-base md:text-lg lg:text-xl text-center px-2">
                <span className="font-bold">{step.highlighted}</span> –{" "}
                {step.text}
              </h4>
            </div>
          ))}
        </div>
      </div>

      {/* use cases */}
      <div className="bg-[#EEF5FD] p-4 sm:p-6 lg:p-10 space-y-6 lg:space-y-10">
        <div className="h-12 sm:h-14 md:h-16.75 w-40 sm:w-45 md:w-48.5 border border-[#233E97] rounded-full flex justify-center items-center mx-auto">
          <p className="text-[#233E97] font-bold text-sm sm:text-base md:text-lg">
            Use Cases
          </p>
        </div>
        <HorizontalCarousel items={useCases} />
      </div>

      {/* why choose us */}
      <div className="min-h-screen bg-linear-to-b to-[#2BAAE2] from-[#020D1D] p-4 sm:p-6 lg:p-10">
        <h4 className="text-white text-center text-2xl sm:text-3xl md:text-4xl lg:text-[45px] font-bold px-4">
          Why Choose Kiki SEO?
        </h4>
        <div className="h-auto lg:h-125 mx-auto max-w-6xl border border-white/30 rounded-xl sm:rounded-2xl backdrop-blur-2xl bg-white/10 my-6 sm:my-8 lg:my-12 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-14 py-8 sm:py-10 lg:py-12 px-4 sm:px-6 lg:px-16">
          <div className="space-y-3 sm:space-y-4 w-full lg:w-1/2">
            {whyChooseUsPoints.map((point, index) => (
              <div
                key={index}
                className="flex items-center gap-3 sm:gap-4 bg-white py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg sm:rounded-xl">
                <div className="h-10 w-10 sm:h-12 sm:w-12 flex justify-center items-center bg-black rounded-full shrink-0">
                  <img
                    src={point.icon}
                    alt={point.text}
                    className="h-5 w-5 sm:h-6 sm:w-6 object-contain"
                  />
                </div>
                <p className="text-black font-bold text-sm sm:text-base lg:text-lg">
                  {point.text}
                </p>
              </div>
            ))}
          </div>
          <img
            src="/landing/why-choose-us.svg"
            alt="Picture of a woman holding a laptop"
            className="w-full lg:w-1/2 h-auto max-h-75 lg:max-h-full object-contain hidden md:block"
          />
        </div>

        {/* cards */}
        <div className="w-full max-w-7xl mx-auto my-8 sm:my-10 lg:my-16 xl:my-20 px-4">
          <div className="flex justify-center overflow-x-auto scrollbar-hide gap-4 sm:gap-6 pb-4 sm:pb-6 -mx-4 px-4 sm:mx-0 sm:px-0">
            {/* Card 1 */}
            <div className="shrink-0 w-[85vw] max-w-75 sm:w-87.5 md:w-100 h-70 sm:h-75 md:h-82.5 rounded-2xl sm:rounded-7.5 bg-white flex flex-col items-start justify-between p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <p className="text-base sm:text-lg md:text-[22px] font-normal leading-relaxed">
                &quot;Kiki helped us grow from 200 monthly visitors to 10,000 in
                6 months — without hiring an agency.&quot;
              </p>
              <div className="flex items-center gap-3 w-full">
                <img
                  src="/landing/man-placeholder.svg"
                  alt="Man"
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-sm sm:text-base font-medium text-black truncate">
                    Tunde
                  </p>
                  <p className="text-xs sm:text-sm text-[#797878] truncate">
                    Startup Founder
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="shrink-0 w-[85vw] max-w-75 sm:w-87.5 md:w-100 h-70 sm:h-75 md:h-82.5 rounded-2xl sm:rounded-7.5 bg-white flex flex-col items-start justify-between p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <p className="text-base sm:text-lg md:text-[22px] font-normal leading-relaxed">
                &quot;Our ecommerce blog now ranks on page 1 for 12 key terms.
                Sales doubled.&quot;
              </p>
              <div className="flex items-center gap-3 w-full">
                <img
                  src="/landing/man-placeholder.svg"
                  alt="Man"
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-sm sm:text-base font-medium text-black truncate">
                    Mike
                  </p>
                  <p className="text-xs sm:text-sm text-[#797878] truncate">
                    Online Store Owner
                  </p>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="shrink-0 w-[85vw] max-w-75 sm:w-87.5 md:w-100 h-70 sm:h-75 md:h-82.5 rounded-2xl sm:rounded-7.5 bg-white flex flex-col items-start justify-between p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <p className="text-base sm:text-lg md:text-[22px] font-normal leading-relaxed">
                &quot;The SEO reports are simple enough for my investors to
                understand. Huge win.&quot;
              </p>
              <div className="flex items-center gap-3 w-full">
                <img
                  src="/landing/man-placeholder.svg"
                  alt="Man"
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-sm sm:text-base font-medium text-black truncate">
                    Chuka
                  </p>
                  <p className="text-xs sm:text-sm text-[#797878] truncate">
                    Saas CEO
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* blend campaign with pr */}
      <div className="relative mx-4 my-10 sm:m-6 md:m-8 lg:m-12 p-4 sm:p-6 lg:p-12 h-75 sm:h-70 md:h-75 lg:h-88.75 rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden text-[#000015]">
        {/* Background image */}
        <Image
          src="/landing/blend-campaign-with-pr.svg"
          alt="Background"
          fill
          priority
          className="object-cover z-0"
        />
        {/* Content */}
        <div className="relative z-10 space-y-3 sm:space-y-4 lg:space-y-6 w-full md:w-3/4 lg:w-[45%]">
          <h1 className="font-extrabold text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl">
            Blend your campaign with PR
          </h1>
          <p className="text-xs sm:text-sm md:text-base">
            Why stop at inboxes? Amplify your email marketing with guaranteed PR
            placements on top media outlets. Turn every campaign into a
            headline, boost credibility, and reach audiences beyond your list.
          </p>
          <p className="text-xs sm:text-sm md:text-base">
            With Kiki, your story travels further, faster, and with more
            authority.
          </p>
          <button className="bg-black text-white rounded-lg h-9 sm:h-10 md:h-11 w-24 sm:w-28 md:w-36 text-xs sm:text-sm cursor-pointer mt-2 hover:bg-gray-800 transition-colors">
            Get Started
          </button>
        </div>
      </div>

      {/* email marketing in 3 steps */}
      <div className="bg-[#EEF5FD] p-4 sm:p-6 lg:p-10 space-y-3 sm:space-y-4 lg:space-y-6">
        <h3 className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-[50px] text-center px-4">
          From zero to email marketing in
          <span className="text-[#233E97] block">3 simple steps</span>
        </h3>
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 sm:gap-8 lg:gap-10 mt-6 sm:mt-8 lg:mt-10 px-4">
          {emailMarketingSteps.map((step) => (
            <div
              key={step.id}
              className="flex flex-col items-center gap-3 sm:gap-4 relative w-full max-w-sm md:max-w-none">
              <div className="absolute -top-4 rounded-md bg-radial from-[#233E97] to-[#2BAAE2] text-white text-sm md:text-base h-7 md:h-8 w-16 md:w-20 flex justify-center items-center">
                Step {step.id}
              </div>
              <div className="rounded-xl sm:rounded-2xl bg-white p-4 sm:p-6 flex justify-center items-center w-full h-45 sm:h-50 md:h-62.5 lg:h-75">
                <img
                  src={step.img}
                  alt={step.title}
                  className="h-auto w-auto max-h-30 sm:max-h-37.5 md:max-h-full object-contain"
                />
              </div>
              <h4 className="text-[#1E1E1E] text-base sm:text-lg md:text-xl lg:text-[24px] font-bold text-center">
                {step.title}
              </h4>
            </div>
          ))}
        </div>
      </div>

      {/* last cta section */}
      <div className="bg-linear-to-b from-blue-900 via-blue-800 to-cyan-400 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 xl:gap-20 px-4 sm:px-6 lg:px-8 xl:px-16 py-8 sm:py-10 lg:py-16 xl:py-20 w-[95%] rounded-xl sm:rounded-2xl mx-auto my-10 sm:my-14 lg:my-20">
        {/* left corner */}
        <div className="max-w-2xl space-y-4 sm:space-y-6 lg:space-y-8 w-full lg:w-1/2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight text-center lg:text-left">
            🔥 Turn Your Website <br className="hidden md:block" /> Into a 24/7
            Sales Machine.
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-300 text-center lg:text-left">
            Stop guessing with SEO. Let Kiki run your content engine so you can
            run your business.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 text-sm font-medium">
            <button className="h-12 sm:h-14 px-6 w-full sm:w-auto rounded-lg flex justify-center items-center bg-[#FED93B] text-[#111111] hover:cursor-pointer relative group">
              Start for Free
              <div className="w-6 h-6 sm:w-7.5 sm:h-7.5 rounded-full flex justify-center items-center bg-[#020617] border border-[#FED93B] rotate-45 absolute -right-2 sm:-right-3 z-10">
                <ArrowUp color="#FED93B" size={12} className="sm:w-4 sm:h-4" />
              </div>
            </button>
            <button className="h-12 sm:h-14 px-6 w-full sm:w-auto rounded-lg flex justify-center items-center border-white border text-white hover:cursor-pointer hover:bg-white/10 transition-colors">
              See Pricing
            </button>
          </div>
        </div>
        {/* right corner */}
        <img
          src="/landing/website-into-sales.svg"
          alt="Image"
          className="w-full lg:w-1/2 h-auto max-h-75 lg:max-h-full object-contain mt-8 lg:mt-0"
        />
      </div>

      <FAQFooter />
    </section>
  );
}
