'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  MessageSquare,
  Palette,
  BookText,
  Puzzle,
  Contact,
  Mail,
  MessageCircle as SmsIcon, // Renaming to avoid conflict
  Share2,
  BarChart3,
  Wallet,
  Repeat,
  Users,
  UserCircle,
  Settings,
  LogOut,
  LucideIcon, // Import the base icon type
} from 'lucide-react';
import { clsx } from 'clsx';
import { Icon } from './IconComponent';
// import { Icon } from '@/components/atoms/Icon'; // Import our new Icon component

// --- DEFINE SPECIFIC TYPES FOR EACH NAVIGATION ITEM ---

type NavHeading = {
  type: 'heading';
  label: string;
};

type NavLinkItem = {
  type: 'link';
  href: string;
  label:string;
  icon: LucideIcon;
};

type NavAction = {
  type: 'logout';
  label: string;
  icon: LucideIcon;
};

// The main navigation array now uses a union of our specific types
const navigation: (NavHeading | NavLinkItem | NavAction)[] = [
  { type: 'heading', label: 'Dashboard' },
  { type: 'link', href: '/dashboard', label: 'Overview', icon: LayoutDashboard },

  { type: 'heading', label: 'Chatbot' },
  { type: 'link', href: '/dashboard/live-chats', label: 'Live Chats', icon: MessageSquare },
  { type: 'link', href: '/dashboard/customization', label: 'Customization', icon: Palette },
  { type: 'link', href: '/dashboard/knowledge-base', label: 'Knowledge Base', icon: BookText },
  { type: 'link', href: '/dashboard/integrations', label: 'Integrations', icon: Puzzle },
  { type: 'link', href: '/dashboard/contacts', label: 'Contacts', icon: Contact },

  { type: 'heading', label: 'Campaigns' },
  { type: 'link', href: '/dashboard/email-campaigns', label: 'Email Campaigns', icon: Mail },
  { type: 'link', href: '/dashboard/sms', label: 'SMS', icon: SmsIcon },
  { type: 'link', href: '/dashboard/social-media', label: 'Social Media', icon: Share2 },
  { type: 'link', href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },

  { type: 'heading', label: 'Finance' },
  { type: 'link', href: '/dashboard/wallet', label: 'Wallet', icon: Wallet },
  { type: 'link', href: '/dashboard/subscription', label: 'Subscription', icon: Repeat },

  { type: 'heading', label: 'System' },
  { type: 'link', href: '/dashboard/users', label: 'Users and Roles', icon: Users },
  { type: 'link', href: '/dashboard/profile', label: 'Profile', icon: UserCircle },
  { type: 'link', href: '/dashboard/settings', label: 'Settings', icon: Settings },
  { type: 'logout', label: 'Log out', icon: LogOut },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

  return (
    <aside className="w-64 flex-shrink-0 bg-white border-r border-gray-200 hidden md:flex flex-col">
      <div className="h-16 flex-shrink-0 flex items-center px-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">KiQi</h1>
      </div>
      <nav className="flex-1 overflow-y-auto p-4">
        {navigation.map((item, index) => {
          // Use a switch statement for clean type narrowing
          switch (item.type) {
            case 'heading':
              return (
                <h3 key={index} className="px-3 pt-4 pb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {item.label}
                </h3>
              );
            
            case 'logout':
              return (
                 <button key={index} className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors mt-2">
                  <Icon icon={item.icon} />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              );

            case 'link':
              const isActive = (item.href === '/dashboard')
                ? pathname === item.href
                : pathname.startsWith(item.href);
              
              return (
                <Link key={index} href={item.href} className={clsx(
                    'flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-sm font-medium',
                    {
                      'bg-[#E0E7FF] text-[#3366FF] font-semibold': isActive,
                      'text-gray-600 hover:bg-gray-100 hover:text-gray-900': !isActive,
                    }
                  )}>
                  <Icon
                    icon={item.icon}
                    className={clsx({ 'text-[#3366FF]': isActive })}
                    strokeWidth={isActive ? 2 : 1.5}
                  />
                  <span>{item.label}</span>
                </Link>
              );

            default:
              return null;
          }
        })}
      </nav>
    </aside>
  );
};