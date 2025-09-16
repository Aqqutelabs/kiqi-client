"use client";

import Image from "next/image";
import { GoArrowUp } from "react-icons/go";
import { FaCircleCheck } from "react-icons/fa6";
import LandingCarousel from "@/components/landing/carousel";
import KiQiFeatures from "@/components/landing/kiqi-features";
import FAQ from "@/components/landing/faq";
import LandingFooter from "@/components/landing/footer";

type ButtonProps = {
  variant: "primary" | "secondary" | "plain";
  icon?: React.ReactNode;
  content: string;
};

function Button({ variant, icon, content }: ButtonProps) {
  const classes = `${
    variant === "primary"
      ? "bg-[#0C31A1] text-white"
      : variant === "secondary"
      ? "bg-transparent border border-white text-white"
      : "bg-white text-[#111111]"
  } h-[58px] w-full rounded-[10px] flex justify-center items-center relative text-sm`;
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
      title: "Tailor KiQi to your business",
      subtitle:
        "KiQi is not just your regular AI chatbot, it understands your business and it can help your business grow faster.",
      lists: [
        "Upload your business data with the help of our interactive bot",
        "Ask KiQi anything about your business",
        "Generate text & media for Ads",
      ],
    },
    {
      title: "Toggle KiQi on/off",
      subtitle:
        "Switch off AI mode and respond yourself when you want to.",
      lists: [
        "Respond to your customers instantly",
        "Professional & Polite",
        "Flexible",
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
            src={"/kiqi-logo.svg"}
            alt="KiQi 2025"
            height={66}
            width={140}
          />

          {/* links */}
          <ul className="hidden md:flex items-center gap-4">
            {navLinks.map((link, index) => (
              <li
                key={index}
                className="text-base text-[#111111] font-normal hover:text-[#0C31A1] cursor-pointer"
              >
                {link}
              </li>
            ))}
          </ul>

          {/* cta */}
          <div className="bg-[#111111] h-[58px] w-[260px] rounded-[10px] py-5 gap-10 hidden md:flex items-center justify-center">
            <p className="text-sm text-white cursor-pointer">Sign In</p>
            <p className="text-sm text-white cursor-pointer">Get Started</p>
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
              KiQi, <br className="hidden md:block" /> Your Easy To Use{" "}
              <br className="hidden md:block" /> AI Sales Assistant
            </h1>
            <p className="text-base md:text-xl font-light my-12">
              Swamped with business tasks and can't keep up{" "}
              <br className="hidden md:block" />
              with customer inquiries? Let KiQi handle it for you!
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
            One Click Is All It Takes To Connect KiQi With Your Top Sales
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
            <div key={index} className="md:h-[560px] rounded-[30px] bg-white p-8 space-y-4 md:space-y-10">
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

        <FAQ />
      </section>
      <LandingFooter />
    </>
  );
}
