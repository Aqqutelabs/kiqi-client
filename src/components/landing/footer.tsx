"use client";
import Image from "next/image";
import {
  FaSnapchatSquare,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaWhatsapp,
  FaFacebookMessenger,
} from "react-icons/fa";

export default function LandingFooter() {
  const footerLinks = ["Product", "Pricing", "Blog", "Download"];

  const cta = [
    {id: 1, image: "/google-play.svg", name: "Google Play", text: "GET IT ON"},
    {id: 2, image: "/app-store.svg", name: "App Store", text: "Download on the"},
  ];

  return (
    <div className="bg-[#111111] p-6 md:p-12 text-white">
      {/* main footer */}
      <div className="flex flex-col-reverse md:flex-row justify-between mb-20 h-3/4 gap-5 md:gap-0">
      {/* links and button */}
        <div className="w-full flex flex-col justify-between">
          {/* links */}
          <ul className="flex flex-col items-start gap-4">
            {footerLinks.map((link, index) => (
              <li key={index} className="text-xl font-normal cursor-pointer">
                {link}
              </li>
            ))}
          </ul>

          <div className="flex flex-col md:flex-row gap-5 md:items-center mt-5">
            {cta.map(c => (
                <div key={c.id} className="p-2 border border-[#A6A6A6] rounded flex gap-3">
                    <Image
                    src={c.image}
                    alt="Icon"
                    height={25}
                    width={25}
                    />
                    <p>
                        <span className="block text-xs">{c.text}</span>
                        <span className="bloack text-lg">{c.name}</span>
                    </p>
                </div>
            ))}
          </div>
        </div>
        {/* kiqi info and subscribe */}
        <div className="w-full flex flex-col justify-between">
            <Image
            src={"footer-logo.svg"}
            alt="Kiqi Logo"
            height={165}
            width={160}
            />
            <p className="text-[22px] leading-10 my-3">KiQi is an AI chatbot that helps business owners automate conversations with their customers, keep track of their revenue, chat with their business knowledge base and so much more.</p>

            <div className="space-y-5">
                <h3 className="text-[22px] leading-10 font-bold">Stay Up To Date</h3>
                <div className="h-[66px] border border-[#A6A6A6] rounded-full flex justify-between items-center relative">
                    <input type="text" className="outline-none px-5" placeholder="Enter Your Email" />
                    <button className="h-[60px] bg-[#0C31A1] w-[100px] md:w-[220px] rounded-full flex justify-center items-center absolute right-0">Subscribe</button>
                </div>
            </div>
        </div>
      </div>

      {/* copyright and media links */}
      <div className="border-t border-[#2E2E2F] flex flex-col md:flex-row items-center py-5 gap-5 md:gap-0">
        <div className="space-y-1 w-full">
          <p className="space-x-2 whitespace-nowrap">
            <span>Kiqi</span>
            <span>&copy;</span>
            <span>2024 All rights reserved.</span>
          </p>
          <p className="text-sm text-[#797878]">
            Privacy Policy Terms of service
          </p>
        </div>
        <div className="flex items-center gap-5 text-xl w-full">
          <FaSnapchatSquare />
          <FaInstagram />
          <FaLinkedin />
          <FaYoutube />
          <FaWhatsapp />
          <FaFacebookMessenger />
        </div>
      </div>
    </div>
  );
}
