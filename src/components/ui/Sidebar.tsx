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
  ChevronDown,
  ChevronUp,
  Pencil,
  List as ListIcon,
} from 'lucide-react';
import { clsx } from 'clsx';
import { Icon } from './IconComponent';
import { useAppDispatch } from '@/redux/hooks';
import { logout } from '@/redux/slices/authSlice';
import { useRouter } from 'next/navigation';
import { persistor } from '@/redux/store';

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
  { type: 'link', href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { type: 'heading', label: 'Campaigns' },
  { type: 'heading', label: 'Chatbot' },
  { type: 'heading', label: 'Finance' },
  { type: 'heading', label: 'System' },
  { type: 'logout', label: 'Log out', icon: LogOut },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const router = useRouter();

  // Dropdown state for Campaigns
  const [campaignsOpen, setCampaignsOpen] = React.useState(false);

  const handleLogout = async () => {
    dispatch(logout());
    await persistor.purge();
    router.push('/');
  };

    const [financeOpen, setFinanceOpen] = React.useState(false);
    const [systemsOpen, setSystemsOpen] = React.useState(false);
    const [chatbotOpen, setChatbotOpen] = React.useState(false);
  // Campaigns dropdown links
  const campaignLinks = [
    { href: '/email-campaigns/lists', label: 'Email Campaigns', icon: Mail },
    { href: '/email-campaigns/composer', label: 'Create Email Campaign', icon: Pencil },
    { href: '/email-campaigns/email-lists', label: 'Email Lists', icon: ListIcon },
  ];

  // Finance dropdown links
  const financeLinks = [
    { href: '/coming-soon', label: 'Wallet', icon: Wallet },
    { href: '/coming-soon', label: 'Subscription', icon: Repeat },
  ];

  // Systems dropdown links
  const systemsLinks = [
    { href: '/coming-soon', label: 'Users and Roles', icon: Users },
    { href: '/coming-soon', label: 'Profile', icon: UserCircle },
    { href: '/coming-soon', label: 'Settings', icon: Settings },
  ];

  // Chatbot dropdown links
  const chatbotLinks = [
    { href: '/coming-soon', label: 'Live Chats', icon: MessageSquare },
    { href: '/coming-soon', label: 'Customization', icon: Palette },
    { href: '/coming-soon', label: 'Knowledge Base', icon: BookText },
    { href: '/coming-soon', label: 'Integrations', icon: Puzzle },
    { href: '/coming-soon', label: 'Contacts', icon: Contact },
  ];

  return (
    <aside className="w-64 flex-shrink-0 bg-white border-r border-gray-200 hidden md:flex flex-col">
      <div className="h-16 flex-shrink-0 flex items-center px-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">KiQi</h1>
      </div>
      <nav className="flex-1 overflow-y-auto p-4">
        {navigation.map((item, index) => {
          switch (item.type) {
            case 'heading':
              if (item.label === 'Campaigns') {
                return (
                  <div key={index} className="mb-1">
                    <button
                      className="w-full flex items-center justify-between px-3 pt-4 pb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider focus:outline-none"
                      onClick={() => setCampaignsOpen((open) => !open)}
                      aria-expanded={campaignsOpen}
                    >
                      <span>{item.label}</span>
                      {campaignsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    <div
                      className={
                        'overflow-hidden transition-all duration-300' +
                        (campaignsOpen ? ' max-h-40 opacity-100' : ' max-h-0 opacity-0')
                      }
                    >
                      <ul className="pl-2">
                        {campaignLinks.map((linkObj, i) => {
                          const isActive = pathname.startsWith(linkObj.href);
                          return (
                            <li key={linkObj.href}>
                              <Link
                                href={linkObj.href}
                                className={clsx(
                                  'flex items-center space-x-3 px-3 py-2 rounded-lg transition-all text-sm font-medium',
                                  {
                                    'bg-[#E0E7FF] text-[#3366FF] font-semibold': isActive,
                                    'text-gray-600 hover:bg-gray-100 hover:text-gray-900': !isActive,
                                  }
                                )}
                              >
                                <Icon
                                  icon={linkObj.icon}
                                  className={clsx({ 'text-[#3366FF]': isActive })}
                                  strokeWidth={isActive ? 2 : 1.5}
                                />
                                <span>{linkObj.label}</span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                );
              }
              if (item.label === 'Finance') {
                return (
                  <div key={index} className="mb-1">
                    <button
                      className="w-full flex items-center justify-between px-3 pt-4 pb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider focus:outline-none"
                      onClick={() => setFinanceOpen((open) => !open)}
                      aria-expanded={financeOpen}
                    >
                      <span>{item.label}</span>
                      {financeOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    <div
                      className={
                        'overflow-hidden transition-all duration-300' +
                        (financeOpen ? ' max-h-40 opacity-100' : ' max-h-0 opacity-0')
                      }
                    >
                      <ul className="pl-2">
                        {financeLinks.map((linkObj) => {
                          const isActive = pathname.startsWith(linkObj.href);
                          return (
                            <li key={linkObj.href}>
                              <Link
                                href={linkObj.href}
                                className={clsx(
                                  'flex items-center space-x-3 px-3 py-2 rounded-lg transition-all text-sm font-medium',
                                  {
                                    'bg-[#E0E7FF] text-[#3366FF] font-semibold': isActive,
                                    'text-gray-600 hover:bg-gray-100 hover:text-gray-900': !isActive,
                                  }
                                )}
                              >
                                <Icon
                                  icon={linkObj.icon}
                                  className={clsx({ 'text-[#3366FF]': isActive })}
                                  strokeWidth={isActive ? 2 : 1.5}
                                />
                                <span>{linkObj.label}</span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                );
              }
              if (item.label === 'System') {
                return (
                  <div key={index} className="mb-1">
                    <button
                      className="w-full flex items-center justify-between px-3 pt-4 pb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider focus:outline-none"
                      onClick={() => setSystemsOpen((open) => !open)}
                      aria-expanded={systemsOpen}
                    >
                      <span>{item.label}</span>
                      {systemsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    <div
                      className={
                        'overflow-hidden transition-all duration-300' +
                        (systemsOpen ? ' max-h-40 opacity-100' : ' max-h-0 opacity-0')
                      }
                    >
                      <ul className="pl-2">
                        {systemsLinks.map((linkObj) => {
                          const isActive = pathname.startsWith(linkObj.href);
                          return (
                            <li key={linkObj.href}>
                              <Link
                                href={linkObj.href}
                                className={clsx(
                                  'flex items-center space-x-3 px-3 py-2 rounded-lg transition-all text-sm font-medium',
                                  {
                                    'bg-[#E0E7FF] text-[#3366FF] font-semibold': isActive,
                                    'text-gray-600 hover:bg-gray-100 hover:text-gray-900': !isActive,
                                  }
                                )}
                              >
                                <Icon
                                  icon={linkObj.icon}
                                  className={clsx({ 'text-[#3366FF]': isActive })}
                                  strokeWidth={isActive ? 2 : 1.5}
                                />
                                <span>{linkObj.label}</span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                );
              }
              if (item.label === 'Chatbot') {
                return (
                  <div key={index} className="mb-1">
                    <button
                      className="w-full flex items-center justify-between px-3 pt-4 pb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider focus:outline-none"
                      onClick={() => setChatbotOpen((open) => !open)}
                      aria-expanded={chatbotOpen}
                    >
                      <span>{item.label}</span>
                      {chatbotOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    <div
                      className={
                        'overflow-hidden transition-all duration-300' +
                        (chatbotOpen ? ' max-h-40 opacity-100' : ' max-h-0 opacity-0')
                      }
                    >
                      <ul className="pl-2">
                        {chatbotLinks.map((linkObj) => {
                          const isActive = pathname.startsWith(linkObj.href);
                          return (
                            <li key={linkObj.href}>
                              <Link
                                href={linkObj.href}
                                className={clsx(
                                  'flex items-center space-x-3 px-3 py-2 rounded-lg transition-all text-sm font-medium',
                                  {
                                    'bg-[#E0E7FF] text-[#3366FF] font-semibold': isActive,
                                    'text-gray-600 hover:bg-gray-100 hover:text-gray-900': !isActive,
                                  }
                                )}
                              >
                                <Icon
                                  icon={linkObj.icon}
                                  className={clsx({ 'text-[#3366FF]': isActive })}
                                  strokeWidth={isActive ? 2 : 1.5}
                                />
                                <span>{linkObj.label}</span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                );
              }
              return (
                <h3 key={index} className="px-3 pt-4 pb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {item.label}
                </h3>
              );
            
            case 'logout':
              return (
                 <button key={index} className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors mt-2"
                  onClick={handleLogout}
                 >
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