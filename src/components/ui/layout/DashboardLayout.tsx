'use client';
import React from 'react';
import { Sidebar } from '../Sidebar';

// You would also create and import a Header organism here
// import { Header } from '@/components/organisms/Header'; 

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* <Header /> You would place the top header here */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4 sm:p-6 md:p-8">
            {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;