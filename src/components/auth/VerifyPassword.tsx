// 'use client';
// import { useRouter } from 'next/navigation';
// import { AuthLayout } from '@/components/templates/AuthLayout';
// import { Card } from '@/components/atoms/Card';
// import { Button } from '@/components/atoms/Button';
// import React, { useState, useRef } from 'react';

// // A simple OTP input molecule
// const OtpInput = ({ length = 6, onComplete }: { length?: number, onComplete: (otp: string) => void }) => {
//     const [otp, setOtp] = useState(new Array(length).fill(""));
//     const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

//     const handleChange = (element: HTMLInputElement, index: number) => {
//         const value = element.value.replace(/[^0-9]/g, "");
//         if (value.length > 1) return;

//         const newOtp = [...otp];
//         newOtp[index] = value;
//         setOtp(newOtp);

//         if (value && index < length - 1) {
//             inputRefs.current[index + 1]?.focus();
//         }

//         if (newOtp.join("").length === length) {
//             onComplete(newOtp.join(""));
//         }
//     };
    
//     // ... Add handleKeyDown for backspace etc. for better UX

//     return (
//         <div className="flex justify-center gap-2 sm:gap-4">
//             {otp.map((data, index) => (
//                 <input
//                     key={index}
//                     ref={el => inputRefs.current[index] = el}
//                     type="text"
//                     maxLength={1}
//                     value={data}
//                     onChange={e => handleChange(e.target, index)}
//                     className="w-10 h-10 sm:w-12 sm:h-12 text-center text-lg font-semibold bg-gray-100 rounded-md border-0 focus:ring-2 focus:ring-[#3366FF]"
//                 />
//             ))}
//         </div>
//     );
// };


// const VerifyOtpPage = () => {
//     const router = useRouter();
    
//     const handleOtpComplete = (otp: string) => {
//         console.log('OTP Entered:', otp);
//         // You would typically verify the OTP here before proceeding
//         router.push('/auth/reset-password/confirm');
//     };
    
//     return (
//         <AuthLayout>
//             <Card>
//                 <div className="text-center mb-6">
//                     <h2 className="text-2xl font-bold text-gray-800">Reset Password</h2>
//                     <p className="text-gray-500 text-sm mt-2">Enter the 6 digit code sent to your Email</p>
//                 </div>
//                 <div className="space-y-6">
//                    <OtpInput onComplete={handleOtpComplete} />
//                    <Button onClick={() => handleOtpComplete("mock")} className="w-full">Next</Button>
//                 </div>
//             </Card>
//         </AuthLayout>
//     );
// }

// export default VerifyOtpPage;