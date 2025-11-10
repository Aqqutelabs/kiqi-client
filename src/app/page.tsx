"use client";

import Image from "next/image";
import { GoArrowUp } from "react-icons/go";
import { FaCircleCheck } from "react-icons/fa6";
import LandingCarousel from "@/components/landing/carousel";
import KiQiFeatures from "@/components/landing/kiqi-features";
import FAQ from "@/components/landing/faq";
import LandingFooter from "@/components/landing/footer";
import TestimonialCarousel from "@/components/landing/testimonial-carousel";
import BlogCarousel from "@/components/landing/blog-carousel";
import { useState } from "react";
import Link from "next/link";

type ButtonProps = {
  variant: "primary" | "secondary" | "plain";
  icon?: React.ReactNode;
  content: string;
  className?: string;
};

function Button({ variant, icon, content, className }: ButtonProps) {
  const classes = `${
    variant === "primary"
      ? "bg-[#0C31A1] text-white"
      : variant === "secondary"
      ? "bg-transparent border border-white text-white"
      : "bg-white text-[#111111]"
  } h-[58px] w-full rounded-[10px] flex justify-center items-center relative text-sm ${className}`;
  return (
    <button className={classes}>
      {content}
      {icon && (
        <div className="bg-[#020617] size-[30px] rounded-full border border-white flex justify-center items-center text-white absolute -right-3.5 rotate-45">
          {icon}
        </div>
      )}
    </button>
  );
}

export default function Home() {
  const navLinks = ["Product", "Pricing", "Blog", "Download"];

  const gridBoxes = [
    {
      title: "Tailor KiKi to your business",
      subtitle:
        "KiKi is not just your regular AI chatbot, it understands your business and it can help your business grow faster.",
      lists: [
        "Upload your business data with the help of our interactive bot",
        "Ask KiKi anything about your business",
        "Generate text & media for Ads",
      ],
    },
    {
      title: "Toggle KiKi on/off",
      subtitle: "Switch off AI mode and respond yourself when you want to.",
      lists: [
        "Respond to your customers instantly",
        "Professional & Polite",
        "Flexible",
      ],
    },
  ];

  const [activePlanTab, setActivePlanTab] = useState(1);
  const tabs = [
    { id: 1, name: "Monthly" },
    { id: 2, name: "Yearly" },
  ];
  const plans = [
    {
      id: 1,
      icon: "/bullseye-arrow.svg",
      name: "Free",
      description: "Start for free - basic tools to automate conversations.",
      price: "0",
      perks: [
        "Enhanced Analytics",
        "Custom Domain",
        "E-commerce Integration",
        "Priority Support",
        "Advanced Security",
      ],
    },
    {
      id: 2,
      icon: "/gem.svg",
      name: "Soloprenuer",
      description:
        "Perfect for individuals - get business analytics and higher limits than the free tier.",
      price: "5",
      perks: [
        "Advanced Marketing Tools",
        "Customizable Templates",
        "Multi-user Access",
        "Third-party Integrations",
        "24/7 Priority Support",
      ],
    },
    {
      id: 3,
      icon: "/bullseye-arrow.svg",
      name: "Small Business",
      description:
        "Take your small business to the next level with limitless features.",
      price: "34",
      perks: [
        "Enhanced Analytics",
        "Custom Domain",
        "E-commerce Integration",
        "Priority Support",
        "Advanced Security",
      ],
    },
    {
      id: 4,
      icon: "/gem.svg",
      name: "Enterprise",
      description: "When collaboration and security  matter.",
      price: "56",
      perks: [
        "Advanced Marketing Tools",
        "Customizable Templates",
        "Multi-user Access",
        "Third-party Integrations",
        "24/7 Priority Support",
      ],
    },
  ];

  return (
    <>
      <section className="px-4 md:px-10 py-5 space-y-6">
        {/* navigation */}
        <nav className="flex justify-between items-center">
          {/* logo */}
          <Image
            src={"/kiki-logo.svg"}
            alt="KiKi 2025"
            height={66}
            width={140}
          />

          {/* links */}
          <ul className="hidden md:flex items-center gap-4">
            {navLinks.map((link, index) => (
              <li
                key={index}
                className="text-base text-[#111111] font-normal hover:text-[#0C31A1] cursor-pointer">
                {link}
              </li>
            ))}
          </ul>

          {/* cta */}
          <div className="bg-[#111111] h-[58px] w-[260px] rounded-[10px] py-5 gap-10 hidden md:flex items-center justify-center">
            <Link href="/login" className="text-sm text-white cursor-pointer">
              Sign In
            </Link>
            <Link href="/signup" className="text-sm text-white cursor-pointer">
              Get Started
            </Link>
          </div>
        </nav>

        {/* hero */}
        <div className="flex flex-col md:flex-row items-start md:h-[600px] gap-5">
          <div className="w-full md:w-3/4 bg-[#0C31A1] text-white rounded-[30px] h-full relative p-7 md:p-14">
            <Image
              src={"/kiqi-hero.svg"}
              alt="Hero Image"
              width={410}
              height={530}
              className="absolute -right-11 bottom-0 z-10 hidden md:block"
            />

            <h1 className="font-bold text-[28px] md:text-[52px]">
              KiKi, <br className="hidden md:block" /> Your Easy To Use{" "}
              <br className="hidden md:block" /> AI Sales Assistant
            </h1>
            <p className="text-base md:text-xl font-light my-12">
              Swamped with business tasks and can't keep up{" "}
              <br className="hidden md:block" />
              with customer inquiries? Let KiKi handle it for you!
            </p>

            <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-center w-full md:w-[360px]">
              <Button
                content="Start For Free"
                variant="plain"
                icon={<GoArrowUp />}
              />
              <Button content="Watch Demo" variant="secondary" />
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center my-8">
              <div className="flex gap-2 items-center">
                <FaCircleCheck color="#4CAF50" size={20} />
                <p className="text-sm">No technical experience required</p>
              </div>
              <div className="flex gap-2 items-center">
                <FaCircleCheck color="#4CAF50" size={20} />
                <p className="text-sm">No credit card required</p>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/4 relative rounded-[30px] h-full">
            <Image
              src={"/hero-group.svg"}
              alt="Hero Image"
              fill
              className="object-cover rounded-[30px]"
            />
          </div>
        </div>

        <LandingCarousel />

        {/* easy integration */}
        <div className="flex flex-col justify-center items-center gap-6 my-20">
          <div className="bg-[#0C31A133] h-[34px] w-[220px] rounded-full flex justify-center items-center">
            <p className="text-[#0C31A1] text-xs md:text-sm">
              Easy Integration
            </p>
          </div>
          <h2 className="text-[#111111] text-[32px] md:text-[52px] text-center font-bold md:w-[677px]">
            One Click Is All It Takes To Connect KiKi With Your Top Sales
            Platforms
          </h2>
          <p className="text-[#797878] text-lg md:text-[27px] text-center font-normal">
            All your messages in one place - Automate your Lead Conversion.
          </p>
          <div className="border border-[#E7EBFF] shadow-sm rounded-[30px] h-[155px] w-[95%] md:w-[420px] flex items-center justify-between p-5">
            <div className="border border-[#E7EBFF] size-20 md:size-[115px] rounded-[10px] py-2.5 px-5 space-y-2.5">
              <Image
                src={"/instagram.svg"}
                alt="Instagram"
                height={70}
                width={70}
              />
              <p className="text-[8px] md:text-xs text-center text-[#111111]">
                Instagram
              </p>
            </div>
            <div className="border border-[#E7EBFF] size-20 md:size-[115px] rounded-[10px] py-2.5 px-5 space-y-2.5">
              <Image
                src={"/facebook.svg"}
                alt="Facebook"
                height={70}
                width={70}
              />
              <p className="text-[8px] md:text-xs text-center text-[#111111]">
                Facebook
              </p>
            </div>
            <div className="border border-[#E7EBFF] size-20 md:size-[115px] rounded-[10px] py-2.5 px-5 space-y-2.5">
              <Image
                src={"/whatsapp.svg"}
                alt="WhatsApp"
                height={70}
                width={70}
              />
              <p className="text-[8px] md:text-xs text-center text-[#111111]">
                Whatsapp
              </p>
            </div>
          </div>
        </div>

        <KiQiFeatures />

        {/* grid section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-[#E6E6E6] rounded-[30px] p-4 md:p-10">
          <div className="md:h-[560px] rounded-[30px] relative">
            <Image
              src={"/grid-image-1.svg"}
              alt="Image"
              fill
              className="object-cover rounded-[30px]"
            />
          </div>
          {gridBoxes.map((box, index) => (
            <div
              key={index}
              className="md:h-[560px] rounded-[30px] bg-white p-8 space-y-4 md:space-y-10">
              <h2 className="text-[#111111] font-bold text-2xl md:text-[38px]">
                {box.title}
              </h2>
              <p className="font-light text-base md:text-[27px] leading-9">
                {box.subtitle}
              </p>
              <ul className="space-y-4">
                {box.lists.map((list, idx) => (
                  <li key={idx} className="flex gap-2 items-center">
                    <FaCircleCheck color="#4CAF50" size={20} />
                    <p className="text-xs md:text-lg">{list}</p>
                  </li>
                ))}
              </ul>
              <div className="w-full md:w-[280px]">
                <Button
                  content="Start For Free"
                  variant="primary"
                  icon={<GoArrowUp />}
                />
              </div>
            </div>
          ))}
          <div className="md:h-[560px] rounded-[30px] relative">
            <Image
              src={"/grid-image-2.svg"}
              alt="Image"
              fill
              className="object-cover rounded-[30px]"
            />
          </div>
        </div>

        <BlogCarousel />

        {/* plans */}
        <div className="space-y-4 flex flex-col items-center my-20 px-4 md:px-10">
          <h2 className="font-bold text-center text-2xl md:text-[52px] capitalize">
            Find your perfect plan
          </h2>
          <p className="text-center text-[#797878] font-normal text-sm md:text-2xl max-w-2xl">
            Discover the ideal plan to fuel your business growth.
            <br className="hidden md:block" />
            Over 500% return on investment guaranteed for your business.
          </p>

          {/* tabs */}
          <div className="bg-[#FBFBFB] rounded-2xl h-[60px] md:h-[73px] w-full max-w-[320px] md:max-w-[290px] p-2.5 border border-[#E7EBFF] flex items-center justify-between">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                onClick={() => setActivePlanTab(tab.id)}
                className={`rounded-xl flex-1 h-full transition-all duration-300 ease-in-out flex justify-center items-center cursor-pointer ${
                  activePlanTab === tab.id
                    ? "bg-white text-[#1B223C] shadow-sm"
                    : "bg-transparent text-[#797878]"
                }`}>
                <p className="text-sm md:text-lg font-normal">{tab.name}</p>
              </div>
            ))}
          </div>

          {/* plans scroll */}
          <div className="w-full overflow-x-auto scrollbar-hide">
            <div className="flex items-stretch gap-4 py-6 md:py-12 min-w-max">
              {plans.map((plan) => {
                const isEven = plan.id % 2;
                return (
                  <div
                    key={plan.id}
                    className={`flex-shrink-0 h-auto md:h-[600px] w-[280px] sm:w-[320px] md:w-[360px] rounded-[20px] border border-[#E7EBFF] space-y-2 shadow-sm p-[20px] md:p-[30px] flex flex-col justify-between ${
                      isEven ? "bg-white" : "bg-[#BCCAFF21]"
                    }`}>
                    {/* icon */}
                    <div
                      className={`size-10 rounded-[10px] flex justify-center items-center ${
                        isEven ? "bg-[#6A8AFF]" : "bg-white"
                      }`}>
                      <Image
                        src={plan.icon}
                        alt="Icon"
                        height={23}
                        width={23}
                      />
                    </div>

                    {/* details */}
                    <div
                      className={`space-y-5 ${
                        !isEven ? "text-[#0C31A1]" : "text-[#1B223C]"
                      }`}>
                      <div className="space-y-4">
                        <h3 className="text-2xl md:text-3xl font-bold">
                          {plan.name}
                        </h3>
                        <p className="text-sm md:text-base text-[#3C3C3C] font-light">
                          {plan.description}
                        </p>
                        <p className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-3xl md:text-[44px]">
                            ${plan.price}
                          </span>
                          <span className="text-sm md:text-base text-[#797878] font-light">
                            per month
                          </span>
                        </p>
                      </div>

                      <div
                        className={`${
                          isEven ? "bg-[#E7EBFF]" : "bg-white"
                        } h-0.5 w-full`}></div>

                      <div className="space-y-2">
                        {plan.perks.map((p, idx) => (
                          <div
                            key={idx}
                            className="flex gap-[11px] items-center text-sm md:text-base">
                            <Image
                              src={isEven ? "/check-2.svg" : "/Check.svg"}
                              alt="Icon"
                              height={20}
                              width={20}
                            />
                            <p className="font-normal">{p}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      className={`h-[50px] md:h-[58px] w-full rounded-[10px] flex justify-center items-center text-sm md:text-base ${
                        isEven
                          ? "bg-[#0C31A1] text-white"
                          : "border border-[#0C31A1] text-[#0C31A1]"
                      }`}>
                      Get Started
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* testimony */}
        <TestimonialCarousel />
        {/* getting started */}
        <div className="space-y-4 flex flex-col items-center my-20">
          <h2 className="font-bold text-center text-2xl md:text-[52px]">
            Get started with <span className="text-[#0C31A1]">KiKi</span>
          </h2>
          <p className="text-center text-[#797878] font-normal text-sm md:text-2xl">
            Convert more conversations to sales.{" "}
            <br className="hidden md:block" />
            Stay ahead of your competition - sign up today!
          </p>
          <div className="flex flex-col md:flex-row justify-center items-center gap-5 md:gap-20 md:mt-10">
            <div className="w-full">
              <div className="relative size-[300px] md:size-[250px]">
                <Image src={"/get-started-1.svg"} alt="Step 1" fill />
              </div>
              <div className="space-y-2">
                <p className="text-xl text-center font-light">01</p>
                <p className="text-xl text-center font-bold whitespace-nowrap">
                  Create your account
                </p>
              </div>
            </div>
            <div className="w-full">
              <div className="relative size-[300px] md:size-[250px]">
                <Image src={"/get-started-2.svg"} alt="Step 2" fill />
              </div>
              <div className="space-y-2">
                <p className="text-xl text-center font-light">02</p>
                <p className="text-xl text-center font-bold whitespace-nowrap">
                  Connect your sales channel
                </p>
              </div>
            </div>
            <div className="w-full">
              <div className="relative size-[300px] md:size-[250px]">
                <Image src={"/get-started-3.svg"} alt="Step 3" fill />
              </div>
              <div className="space-y-2">
                <p className="text-xl text-center font-light">03</p>
                <p className="text-xl text-center font-bold whitespace-nowrap">
                  Verify your account
                </p>
              </div>
            </div>
          </div>
          <div className="w-full md:w-[280px] mt-10">
            <Button
              content="Start For Free"
              variant="primary"
              icon={<GoArrowUp />}
            />
          </div>
        </div>
        <FAQ />
      </section>
      <LandingFooter />
    </>
  );
}
