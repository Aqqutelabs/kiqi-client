'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const ComingSoonPage = () => {
  const router = useRouter();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-cyan-50 to-cyan-100 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="bg-white shadow-xl rounded-2xl p-10 max-w-md w-full flex flex-col items-center border border-cyan-100"
      >
        <svg width="64" height="64" fill="none" viewBox="0 0 64 64" className="mb-6">
          <circle cx="32" cy="32" r="32" fill="#06b6d4" fillOpacity="0.1"/>
          <path d="M32 18v14l10 6" stroke="#06b6d4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <h1 className="text-2xl font-bold text-cyan-700 mb-2">Coming Soon</h1>
        <p className="text-gray-600 text-center mb-6">We're working hard to bring you this feature. Stay tuned for updates and new tools to help you manage your business even better!</p>
        <Button onClick={() => router.back()} className="w-full">Go Back</Button>
      </motion.div>
      {/* <div className="mt-8 text-gray-400 text-xs">&copy; {new Date().getFullYear()} Kiqi CRM. All rights reserved.</div> */}
    </div>
  );
};

export default ComingSoonPage;
