"use client";
import FAQFooter from "@/components/ui/landing-footer";
import LandingNav from "@/components/ui/landing-nav";
import {
  ArrowUp,
  CheckCircle,
  Layout,
  MessageCircle,
  Rocket,
  TrendingUp,
} from "lucide-react";
import Image from "next/image";

export default function FeatureTwoPage() {
  const trustedCompaniyImages = [
    "/landing/company1.svg",
    "/landing/company2.svg",
    "/landing/company3.svg",
    "/landing/company4.svg",
    "/landing/company5.svg",
    "/landing/company6.svg",
  ];

  const whyEmailMarketingMatters = [
    {
      icon: "/landing/email-marketing1.svg",
      title: "Email = Direct Revenue.",
      description:
        "For every $1 spent on email marketing, businesses see an average $36 return.",
    },
    {
      icon: "/landing/email-marketing2.svg",
      title: "Own Your Audience.",
      description:
        "Unlike social media, your email list is yours — no algorithm changes, no reach drops.",
    },
    {
      icon: "/landing/email-marketing3.svg",
      title: "Build Trust.",
      description:
        "Regular, professional communication turns one-time buyers into repeat customers.",
    },
    {
      icon: "/landing/email-marketing4.svg",
      title: "Automation = Freedom.",
      description: "Set up once, and emails keep working while you sleep.",
    },
    {
      icon: "/landing/email-marketing5.svg",
      title: "Measurable Results.",
      description:
        "See exactly how many subscribers opened, clicked, and bought.",
    },
  ];

  const conciergeFeatures = [
    {
      icon: "/landing/concierge-feature1.svg",
      title: "Campaign Strategy",
      description: "We plan the right sequence for your audience.",
    },
    {
      icon: "/landing/concierge-feature2.svg",
      title: "Done-for-You Copywriting",
      description: "Subject lines, email text, CTAs written for conversions.",
    },
    {
      icon: "/landing/concierge-feature3.svg",
      title: "Design & Templates",
      description: "Beautiful, mobile-ready layouts that look professional.",
    },
    {
      icon: "/landing/concierge-feature4.svg",
      title: "Smart Scheduling",
      description: "Emails sent when your audience is most likely to open.",
    },
    {
      icon: "/landing/concierge-feature5.svg",
      title: "Engagement Score",
      description: "Simple star rating that tells you if it's working.",
    },
    {
      icon: "/landing/concierge-feature6.svg",
      title: "Optional Add-Ons",
      description: "Funnels, landing pages, automations as you grow.",
    },
  ];

  const realBenefits = [
    {
      icon: "/landing/benefit-1.svg",
      heading: "Sell More, Automatically ",
      text: "Drip campaigns nurture leads until they're ready to buy.",
    },
    {
      icon: "/landing/benefit-2.svg",
      heading: "Higher Engagement ",
      text: "A/B testing helps you discover what your audience actually clicks.",
    },
    {
      icon: "/landing/benefit-3.svg",
      heading: "Save Time",
      text: "No dashboards, no writing, no stress. We do it.",
    },
    {
      icon: "/landing/benefit-4.svg",
      heading: "Professional Look",
      text: "Your brand looks like a big player, even if you're just starting out.",
    },
    {
      icon: "/landing/benefit-5.svg",
      heading: "Scalable Growth",
      text: "Start small, and scale up as your business grows",
    },
  ];

  const moreBenefits = [
    {
      icon: Rocket,
      title: "Launch in 48 Hours",
      description: "Campaigns live almost instantly.",
    },
    {
      icon: MessageCircle,
      title: "Hands-Off Execution",
      description: "Strategy + copy + scheduling done for you.",
    },
    {
      icon: TrendingUp,
      title: "Scale Without Hiring",
      description: "No need for a marketer, designer, or copywriter.",
    },
    {
      icon: Layout,
      title: "Optional Add-Ons",
      description: "Landing pages, funnels, and automations when you're ready.",
    },
    {
      icon: CheckCircle,
      title: "One-Click Approvals",
      description: "Review campaigns in minutes, not hours.",
    },
  ];

  return (
    <section>
      <LandingNav />
      {/* hero section */}
      <div className="min-h-screen w-full bg-linear-to-b from-[#2BAAE2] to-[#020D1D] flex flex-col items-center justify-center pt-16 md:pt-20 relative overflow-hidden px-4 sm:px-6">
        {/* floating elements */}
        <Image
          src={"/landing/feature-2-float3.svg"}
          alt="Float Image"
          height={40}
          width={60}
          className="object-contain absolute left-4 sm:left-6 md:left-8 lg:left-24 top-[20%] sm:top-[25%] md:top-[30%] hidden sm:block"
        />
        <Image
          src={"/landing/feature-2-float4.svg"}
          alt="Float Image"
          height={40}
          width={60}
          className="object-contain absolute right-4 sm:right-6 md:right-8 lg:right-24 top-[20%] sm:top-[25%] md:top-[30%] hidden sm:block"
        />
        {/* top Content */}
        <div className="flex flex-col justify-center items-center space-y-4 md:space-y-5 px-4 mb-6 md:mb-8 w-full max-w-6xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-linear-to-b from-[#FFF] via-[#f8e58f] to-[#FED93B] text-transparent bg-clip-text leading-tight text-center">
            Email Marketing That Runs Itself
          </h1>

          <p className="text-white text-sm sm:text-base md:text-lg lg:text-xl text-center max-w-3xl">
            We do the strategy, write the copy, set the schedule, and hit send.
            You just approve and watch results roll in.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 text-sm font-medium mt-2">
            <button className="h-12 sm:h-14 px-4 sm:px-6 w-full sm:w-50 rounded-lg flex justify-center items-center bg-white text-[#111111] hover:cursor-pointer relative">
              Get Started Today
              <div className="size-6 sm:size-7.5 rounded-full flex justify-center items-center bg-[#020617] border border-white rotate-45 absolute -right-2 sm:-right-3 z-10">
                <ArrowUp color="white" size={12} className="sm:w-4 sm:h-4" />
              </div>
            </button>
            <button className="h-12 sm:h-14 px-4 sm:px-6 w-full sm:w-50 rounded-lg flex justify-center items-center border-white border text-white hover:cursor-pointer">
              See Concierge Plans
            </button>
          </div>
        </div>

        {/* bottom Content - Mockup */}
        <div className="flex-1 relative w-full max-w-125 sm:max-w-150 h-75 sm:h-100 md:h-125 mt-6 md:mt-8">
          <Image
            src={"/landing/feature-2-hero.svg"}
            alt="Hero Image"
            fill
            priority
            className="object-contain sm:object-cover rounded-lg sm:rounded-xl"
          />
          <Image
            src={"/landing/feature-2-float1.svg"}
            alt="Float Image"
            height={80}
            width={80}
            className="object-contain absolute -left-6 sm:-left-8 md:-left-14 top-[25%] sm:top-[30%] hidden sm:block"
          />
          <Image
            src={"/landing/feature-2-float2.svg"}
            alt="Float Image"
            height={100}
            width={100}
            className="object-contain absolute -right-8 sm:-right-12 md:-right-20 top-[25%] sm:top-[30%] hidden sm:block"
          />
        </div>
      </div>

      {/* previous clients */}
      <div className="space-y-6 my-10 sm:my-16 md:my-20 px-4">
        <p className="text-sm sm:text-base text-center max-w-2xl mx-auto">
          Trusted by founders, small businesses, and creators who want results —{" "}
          <span className="font-bold">not email headaches</span>.
        </p>
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

      {/* why email marketing matters */}
      <div className="space-y-4 px-4 sm:px-6">
        <div>
          <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-[45px] font-bold text-center">
            Why Email Marketing Matters
          </h3>
          <p className="text-center text-sm sm:text-base mt-2">
            (For people who've never done it)
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-7xl mx-auto my-6 sm:my-8 md:my-10">
          {whyEmailMarketingMatters.map((item, index) => (
            <div
              key={index}
              className="h-50 sm:h-55 md:h-62.5 w-full rounded-xl sm:rounded-2xl bg-[#E5F6FD] p-4 sm:p-6 flex flex-col justify-between">
              <Image
                src={item.icon}
                alt={item.title}
                height={50}
                width={50}
                className="object-contain w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16"
              />
              <p className="text-xs sm:text-sm md:text-base mt-2">
                <strong>{item.title}</strong> {item.description}
              </p>
            </div>
          ))}
          <div className="h-50 sm:h-55 md:h-62.5 w-full rounded-xl sm:rounded-2xl relative col-span-1 sm:col-span-2 lg:col-span-1">
            <Image
              src={"/landing/email-marketing6.svg"}
              alt="Email Marketing"
              fill
              className="object-cover rounded-xl sm:rounded-2xl"
            />
            <p className="text-xs sm:text-sm md:text-base absolute m-3 sm:m-4 md:m-6">
              👉 If you've never run email before, this is the simplest way to
              start <strong>— and the fastest way to see results.</strong>
            </p>
          </div>
        </div>
      </div>

      {/* how concierge works */}
      <div className="space-y-5 bg-[#F3F6FF] py-8 sm:py-10 md:py-16 px-4 sm:px-6 md:px-8 lg:px-0 mx-2 sm:mx-4 md:mx-6 lg:mx-10 my-10 sm:my-12 md:my-16 rounded-xl sm:rounded-2xl md:rounded-7.5">
        <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-[45px] font-bold text-center mb-6 sm:mb-8 md:mb-10 px-4">
          How Concierge Works
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid-rows-auto md:grid-rows-2 gap-3 sm:gap-4 mx-2 sm:mx-4 md:mx-6 lg:mx-10">
          {/* item 1 */}
          <div className="border border-gray-100 bg-[#2BAAE2] relative rounded-lg sm:rounded-xl md:rounded-[20px] w-full md:row-span-2 flex flex-col justify-between p-4 sm:p-6">
            <div className="text-white">
              <h4 className="font-extrabold text-lg sm:text-xl md:text-2xl">
                Upload or share contacts.
              </h4>
              <p className="text-sm sm:text-base md:text-lg mt-2">
                We handle spreadsheets, CSVs, or manual entry.
              </p>
            </div>
            <div className="relative w-full h-45 sm:h-55 md:h-85 mt-4">
              <Image
                src={"/landing/concierge-step1.svg"}
                alt="Contacts Upload"
                fill
                className="object-contain z-10"
              />
              <Image
                src={"/landing/concierge-float.svg"}
                alt="Icon"
                width={120}
                height={100}
                className="object-cover absolute right-4 sm:right-6 md:right-14 top-1/2 transform -translate-y-1/2 hidden md:block"
              />
            </div>
          </div>

          {/* item 2 */}
          <div className="border border-gray-100 bg-[#E9F5D7] rounded-lg sm:rounded-xl md:rounded-[20px] w-full p-4 sm:p-6 flex flex-col justify-between">
            <div className="relative w-full h-30 sm:h-35 mb-4">
              <Image
                src={"/landing/concierge-step2.svg"}
                alt="Contacts Upload"
                fill
                className="object-contain z-10"
              />
            </div>
            <div className="text-black">
              <h4 className="font-extrabold text-lg sm:text-xl md:text-2xl">
                Tell us your goal.
              </h4>
              <p className="text-sm sm:text-base md:text-lg mt-2">
                Sales, leads, awareness — we design the right campaign.
              </p>
            </div>
          </div>

          {/* item 3 */}
          <div className="border border-gray-100 bg-[#F9D5FF] rounded-lg sm:rounded-xl md:rounded-[20px] w-full p-4 sm:p-6 flex flex-col justify-between">
            <div className="relative w-full h-30 sm:h-35 mb-4">
              <Image
                src={"/landing/concierge-step3.svg"}
                alt="Contacts Upload"
                fill
                className="object-contain z-10"
              />
            </div>
            <div className="text-black">
              <h4 className="font-extrabold text-lg sm:text-xl md:text-2xl">
                Approve and relax.
              </h4>
              <p className="text-sm sm:text-base md:text-lg mt-2">
                We draft, design, and schedule emails. You approve before
                sending.
              </p>
            </div>
          </div>

          {/* item 4 */}
          <div className="border border-gray-100 bg-[#FFF] rounded-lg sm:rounded-xl md:rounded-[20px] w-full p-4 sm:p-6 flex flex-col md:flex-row items-center justify-between md:col-span-2 lg:col-span-2 gap-4">
            <div className="relative w-full md:w-1/2 h-37.5 sm:h-42.5 md:h-47.5">
              <Image
                src={"/landing/concierge-step4.svg"}
                alt="Contacts Upload"
                fill
                className="object-contain z-10"
              />
            </div>
            <div className="text-black md:w-1/2">
              <h4 className="font-extrabold text-lg sm:text-xl md:text-2xl">
                Track only what matters.
              </h4>
              <p className="text-sm sm:text-base md:text-lg mt-2">
                No confusing dashboards. Just see how many emails were sent, who
                engaged, and what sales came in.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* concierge features */}
      <div className="space-y-5 mb-12 sm:mb-16 md:mb-20 px-4 sm:px-6">
        <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-[45px] font-bold text-center mb-6 sm:mb-8 md:mb-10">
          Concierge Features
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mx-auto max-w-7xl">
          {conciergeFeatures.map((item, idx) => {
            const pairIndex = Math.floor(idx / 2);
            const isFirstInPair = idx % 2 === 0;
            const pairStartsWithBlue = pairIndex % 2 === 0;

            const isBlue = isFirstInPair
              ? pairStartsWithBlue
              : !pairStartsWithBlue;

            // For mobile: all items take full width
            // For tablet: items are in pairs (1 column each)
            // For desktop: original 3-column alternating layout

            return (
              <div
                key={idx}
                className={`
            border border-gray-200 rounded-lg sm:rounded-xl md:rounded-[20px] p-4 sm:p-6 relative 
            ${isBlue ? "lg:col-span-1" : "lg:col-span-2"} 
            ${
              isBlue
                ? "bg-linear-to-b from-[#F95417] to-[#2BAAE2] text-white"
                : "bg-white text-black"
            } 
            flex ${
              isBlue
                ? "flex-col justify-between gap-4"
                : "flex-col md:flex-row items-center gap-4 sm:gap-6 justify-center"
            }
          `}>
                <div
                  className={`relative h-30 sm:h-36.25 ${
                    isBlue ? "w-full" : "md:w-1/3 lg:w-2/5"
                  }`}>
                  <Image
                    src={item.icon}
                    alt={item.title}
                    fill
                    className="object-contain"
                  />
                  {item.title === "Smart Scheduling" && (
                    <Image
                      src={"/landing/tear-off-calendar.svg"}
                      alt={item.title}
                      width={80}
                      height={60}
                      className="absolute object-contain left-1/2 top-1/3 transform -translate-x-1/2 hidden lg:block"
                    />
                  )}
                </div>
                <div
                  className={`space-1 ${
                    isBlue ? "w-full" : "md:w-2/3 lg:w-3/5"
                  }`}>
                  <h4 className="font-extrabold text-lg sm:text-xl md:text-[22px]">
                    {item.title}
                  </h4>
                  <p className="text-sm sm:text-base md:text-lg mt-1">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* blend campaign with pr */}
      <div className="relative m-4 sm:m-6 md:m-8 lg:m-12 p-4 sm:p-6 md:p-8 lg:p-12 h-62.5 sm:h-70 md:h-80 lg:h-88.75 rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden text-[#000015]">
        {/* Background image */}
        <Image
          src="/landing/blend-campaign-with-pr.svg"
          alt="Background"
          fill
          priority
          className="object-cover z-0"
        />
        {/* Content */}
        <div className="relative z-10 space-y-2 sm:space-y-3 md:space-y-4 lg:space-y-6 w-full md:w-3/4 lg:w-[45%]">
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
          <button className="bg-black text-white rounded-lg h-8 sm:h-9 md:h-11 w-24 sm:w-28 md:w-36 text-xs sm:text-sm cursor-pointer mt-2">
            Get Started
          </button>
        </div>
      </div>

      {/* real benefits */}
      <div className="min-h-screen bg-linear-to-b to-[#2BAAE2] from-[#020D1D] p-4 sm:p-6 md:p-8 lg:p-10">
        <h4 className="text-white text-center text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-[45px] font-bold px-4">
          Real Benefits You'll See
        </h4>
        <div className="max-w-6xl mx-auto my-6 sm:my-8 md:my-10">
          {/* Top Row - 3 cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
            {realBenefits.slice(0, 3).map((benefit, idx) => (
              <div
                key={idx + 3}
                className="bg-white/10 backdrop-blur-2xl rounded-xl p-4 sm:p-6 border border-white/20 flex justify-center items-center flex-col gap-3 sm:gap-4 h-50 sm:h-57.5">
                {/* Icon */}
                <div className="size-20 sm:size-25 bg-linear-to-b from-[#D8E6EA] to-[#FED93B] rounded-full flex justify-center items-center">
                  <img
                    src={benefit.icon}
                    alt="Icon"
                    className="w-10 h-10 sm:w-12 sm:h-12"
                  />
                </div>

                {/* Content */}
                <p className="text-white text-xs sm:text-sm md:text-base text-center">
                  <strong>{benefit.heading} -</strong> {benefit.text}
                </p>
              </div>
            ))}
          </div>

          {/* Bottom Row - 2 cards centered */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-3xl mx-auto">
            {realBenefits.slice(3, 5).map((benefit, idx) => (
              <div
                key={idx + 3}
                className="bg-white/10 backdrop-blur-2xl rounded-xl p-4 sm:p-6 border border-white/20 flex justify-center items-center flex-col gap-3 sm:gap-4 h-50 sm:h-57.5">
                {/* Icon */}
                <div className="size-20 sm:size-25 bg-linear-to-b from-[#D8E6EA] to-[#FED93B] rounded-full flex justify-center items-center">
                  <img
                    src={benefit.icon}
                    alt="Icon"
                    className="w-10 h-10 sm:w-12 sm:h-12"
                  />
                </div>

                {/* Content */}
                <p className="text-white text-xs sm:text-sm md:text-base text-center">
                  <strong>{benefit.heading} -</strong> {benefit.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* cards */}
        <div className="w-full max-w-7xl mx-auto my-6 sm:my-8 md:my-10 lg:my-16 xl:my-20 px-2 sm:px-4">
          <div className="flex justify-start sm:justify-center overflow-x-auto scrollbar-hide gap-3 sm:gap-4 md:gap-6 pb-4 sm:pb-6 -mx-2 sm:mx-0 px-2 sm:px-0">
            {/* Card 1 */}
            <div className="shrink-0 w-70 sm:w-80 md:w-87.5 lg:w-100 h-62.5 sm:h-70 md:h-75 lg:h-82.5 rounded-xl sm:rounded-2xl md:rounded-7.5 bg-white flex flex-col items-start justify-between p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <p className="text-sm sm:text-base md:text-lg lg:text-[22px] font-normal leading-relaxed">
                "Kiki helped us grow from 200 monthly visitors to 10,000 in 6
                months — without hiring an agency."
              </p>
              <div className="flex items-center gap-3 w-full">
                <img
                  src="/landing/man-placeholder.svg"
                  alt="Man"
                  className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full object-cover shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm md:text-base font-medium text-black truncate">
                    Tunde
                  </p>
                  <p className="text-xs text-[#797878] truncate">
                    Startup Founder
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="shrink-0 w-70 sm:w-80 md:w-87.5 lg:w-100 h-62.5 sm:h-70 md:h-75 lg:h-82.5 rounded-xl sm:rounded-2xl md:rounded-7.5 bg-white flex flex-col items-start justify-between p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <p className="text-sm sm:text-base md:text-lg lg:text-[22px] font-normal leading-relaxed">
                "Our ecommerce blog now ranks on page 1 for 12 key terms. Sales
                doubled."
              </p>
              <div className="flex items-center gap-3 w-full">
                <img
                  src="/landing/man-placeholder.svg"
                  alt="Man"
                  className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full object-cover shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm md:text-base font-medium text-black truncate">
                    Mike
                  </p>
                  <p className="text-xs text-[#797878] truncate">
                    Online Store Owner
                  </p>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="shrink-0 w-70 sm:w-80 md:w-87.5 lg:w-100 h-62.5 sm:h-70 md:h-75 lg:h-82.5 rounded-xl sm:rounded-2xl md:rounded-7.5 bg-white flex flex-col items-start justify-between p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <p className="text-sm sm:text-base md:text-lg lg:text-[22px] font-normal leading-relaxed">
                "The SEO reports are simple enough for my investors to
                understand. Huge win."
              </p>
              <div className="flex items-center gap-3 w-full">
                <img
                  src="/landing/man-placeholder.svg"
                  alt="Man"
                  className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full object-cover shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm md:text-base font-medium text-black truncate">
                    Chuka
                  </p>
                  <p className="text-xs text-[#797878] truncate">Saas CEO</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* more concierge benefits */}
      <div className="space-y-5 my-12 sm:my-16 md:my-20 px-4 sm:px-6">
        <h4 className="text-center text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-[45px] font-bold px-4">
          More Concierge Benefits
        </h4>
        <div className="pt-6 sm:pt-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 bg-linear-to-br from-yellow-50 via-orange-50 to-yellow-100 rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-10">
            <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center">
              {/* Left Side - Features List */}
              <div className="space-y-4 sm:space-y-6">
                {moreBenefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black rounded-full flex items-center justify-center shrink-0">
                      <benefit.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-1">
                        {benefit.title}
                      </h3>
                      <p className="text-xs sm:text-sm md:text-base text-gray-600">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Side - Image/Visual */}
              <div className="relative w-full h-75 sm:h-87.5 md:h-100 lg:h-107.5 mt-8 lg:mt-0">
                <Image
                  src="/landing/more-benefit-hero.png"
                  alt="Woman on a Computer"
                  fill
                  className="object-cover rounded-xl sm:rounded-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* last cta section */}
      <div className="bg-linear-to-b from-orange-900 via-orange-800 to-cyan-400 flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 lg:gap-12 xl:gap-20 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-16 pt-6 sm:pt-8 md:pt-10 lg:pt-16 w-[95%] rounded-xl sm:rounded-2xl mx-auto my-8 sm:my-10 md:my-14 lg:my-20">
        {/* left corner */}
        <div className="max-w-2xl space-y-3 sm:space-y-4 md:space-y-6 lg:space-y-8 w-full lg:w-1/2">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight text-center lg:text-left">
            <strong>Stop Wasting Time</strong>{" "}
            <br className="hidden sm:block" /> Start Sending Emails That Sell.
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 text-center lg:text-left">
            Email marketing is the channel with the highest ROI. Don't learn it.
            Don't hire for it. Just approve and grow.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3 text-sm font-medium">
            <button className="h-10 sm:h-12 md:h-14 px-4 sm:px-6 w-full sm:w-auto rounded-lg flex justify-center items-center bg-white text-[#111111] hover:cursor-pointer relative group">
              Add Concierge to My Plan
              <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-7.5 md:h-7.5 rounded-full flex justify-center items-center bg-[#020617] border border-white rotate-45 absolute -right-2 sm:-right-3 z-10">
                <ArrowUp
                  color="#FFF"
                  size={10}
                  className="sm:w-3 sm:h-3 md:w-4 md:h-4"
                />
              </div>
            </button>
          </div>
        </div>
        {/* right corner */}
        <img
          src="/landing/website-into-sales.svg"
          alt="Image"
          className="w-full lg:w-1/2 h-auto max-h-50 sm:max-h-62.5 md:max-h-75 lg:max-h-full object-contain mt-6 lg:mt-0"
        />
      </div>
      <FAQFooter />
    </section>
  );
}
