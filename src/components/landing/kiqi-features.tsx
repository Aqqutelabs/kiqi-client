"use client";

import Image from "next/image";
import { useState } from "react";
import { LuCirclePlay } from "react-icons/lu";

export default function KiQiFeatures() {
    const features = [
        {id: 1, name: "Omnichannel Chat"},
        {id: 2, name: "Pending Orders"},
        {id: 3, name: "Knowledge Base"},
        {id: 4, name: "Analytics"},
    ];

    const [activeTab, setActiveTab] = useState(1);

    const changeTab = (index: number) => {
        setActiveTab(index);
    }

    return (
        <div className="h-fit bg-[#0C31A1] rounded-[30px] text-white p-5 md:p-10">
            <h1 className="text-center text-[52px] font-bold">KiQi Features</h1>
            <ul className="flex flex-col md:flex-row items-center gap-10 justify-center text-2xl font-normal my-10">
                {features.map(feature => (
                    <li 
                    key={feature.id}
                    onClick={() => changeTab(feature.id)}
                    className={`cursor-pointer transition-all duration-300 ${activeTab === feature.id ? 'underline font-bold' : ''}`}
                    >
                        {feature.name}
                    </li>
                ))}
            </ul>
            {activeTab === 1 && (
                <div className="relative w-full h-[620px]">
                    <Image src="/regions.svg" alt="Chat" fill/>
                </div>
            )}
            {activeTab === 2 && (
                <div className="relative w-full h-[620px]">
                    <Image src="/regions.svg" alt="Chat" fill/>
                </div>
            )}
            {activeTab === 3 && (
                <div className="relative w-full h-[620px]">
                    <Image src="/regions.svg" alt="Chat" fill/>
                </div>
            )}
            {activeTab === 4 && (
                <div className="relative w-full h-[620px]">
                    <Image src="/regions.svg" alt="Chat" fill/>
                </div>
            )}

            <div className="flex gap-2 items-center justify-center mt-6">
              <LuCirclePlay color="#fff" size={20} />
              <p className="text-lg">Watch full Demo Video</p>
            </div>
        </div>
    )
}