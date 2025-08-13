import React from 'react';

const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="mb-8">
             {/* You can pass the KiQi logo as a prop or hardcode it */}
             <h1 className="text-3xl font-bold">KiQi</h1>
        </div>
        <div className="w-full max-w-md">
            {children}
        </div>
    </main>
  );
};

export default AuthLayout;