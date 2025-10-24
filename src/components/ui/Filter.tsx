"use client";

import { FilterIcon } from "lucide-react";
import { useState } from "react";

type FilterProps = {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
}

export default function Filter({
    value,
    onChange,
    placeholder = "Filter",
}: FilterProps) {
  return (
    <div className={`h-10 w-[84px] outline-none border border-gray-300 group rounded-lg px-2 text-sm flex items-center text-gray-400`}>
        <FilterIcon size={24} color="#98A2B3" />
        <div className="h-4/5 px-2.5 w-full flex justify-center items-center">Filter</div>
    </div>
  )}