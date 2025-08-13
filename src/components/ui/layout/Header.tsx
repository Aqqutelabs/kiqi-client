'use client'; 
import React from 'react';
import { Search, ChevronDown } from 'lucide-react';


const Header = () => {
  return (
    <header className="flex-shrink-0 bg-white h-16 border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 lg:px-8">
      {/* Search Bar Section */}
      <div className="flex-1 min-w-0">
        <div className="relative w-full max-w-xs text-gray-400 focus-within:text-gray-600">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5" aria-hidden="true" />
          </div>
          <input
            id="search"
            name="search"
            className="block w-full bg-gray-100 border-transparent rounded-md py-2 pl-10 pr-3 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3366FF]"
            placeholder="Search anything that comes to mind"
            type="search"
          />
        </div>
      </div>

      {/* User Menu Section */}
      <div className="ml-4 flex items-center space-x-3">
        <div className="flex-shrink-0">
          <img
            className="h-9 w-9 rounded-full object-cover"
            src="https://i.pravatar.cc/150?u=obinnafestus" // Placeholder user avatar
            alt="User avatar"
          />
        </div>
        <div className="hidden sm:block">
          <div className="text-sm font-semibold text-gray-800">Obinna Festus</div>
          <div className="text-xs text-gray-500">Owner</div>
        </div>
        <button
          type="button"
          className="p-1 rounded-full text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3366FF]"
          aria-haspopup="true"
        >
          <ChevronDown size={20} />
        </button>
      </div>
    </header>
  );
};

export default Header;