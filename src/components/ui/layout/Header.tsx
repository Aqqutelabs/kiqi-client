'use client'; 
import React from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { logout } from '@/redux/slices/authSlice';
import { useRouter } from 'next/navigation';
import { User } from 'lucide-react';

const Header = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector(state => state.auth.user);
  console.log('i am the user', user);
  const displayName = user
    ? ('firstName' in user && 'lastName' in user && user.firstName && user.lastName
        ? `${user.firstName} ${user.lastName}`
        : 'name' in user && user.name
          ? user.name
          : 'User')
    : 'User';
  const email = user && 'email' in user ? user.email : '';

  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
  };

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
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gray-200">
            <ChevronDown className="hidden" /> {/* Hidden, just to keep import if needed */}
            <User className="h-6 w-6 text-gray-500" aria-label="User avatar" />
          </span>
        </div>
        <div className="hidden sm:block">
          <div className="text-sm font-semibold text-gray-800">{displayName}</div>
          <div className="text-xs text-gray-500">{email}</div>
        </div>
        <button
          type="button"
          className="p-1 rounded-full text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3366FF]"
          aria-haspopup="true"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;