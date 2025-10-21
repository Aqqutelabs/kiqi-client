"use client";

import { Search } from "lucide-react";
import { useState } from "react";

type SearchProps = {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    name: string;
    placeholder?: string;
}

export default function SearchInput({
    value,
    onChange,
    name,
    placeholder = "Search",
}: SearchProps) {
    const [isFocused, setIsFocused] = useState(false);
  return (
    <div className={`h-10 w-[260px] outline-none border border-[#F0F2F5] group rounded-lg px-3.5 text-sm flex gap-1 items-center ${isFocused ? 'border-blue-500' : 'border-gray-300'}`}>
        <Search size={24} color="#98A2B3" />
        <input
        value={value}
        onChange={onChange}
        name={name}
        placeholder={placeholder}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="outline-none h-4/5 px-2.5 w-full"
      />
    </div>
  )}