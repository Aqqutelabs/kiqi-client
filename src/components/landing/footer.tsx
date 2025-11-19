import Image from 'next/image'
import React from 'react'

export default function LandingFooter() {
    const year = new Date().getFullYear()
    return (
        <footer className="bg-slate-900 text-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <Image src="/assets/img/kiki.png" width={44} height={44} alt="KiKi" className="rounded-full" />
                        <div className="text-lg font-semibold">KiKi</div>
                    </div>
                    <p className="text-gray-300 max-w-xl">
                        KiKi is the email marketing platform built for founders, beginners, and busy owners.
                    </p>
                </div>

                <div className="flex justify-end items-start">
                    <nav>
                        <ul className="space-y-2 text-right">
                            <li><a href="#" className="text-gray-300">Home</a></li>
                            <li><a href="#" className="text-gray-300">Feature</a></li>
                            <li><a href="#" className="text-gray-300">Services</a></li>
                            <li><a href="#pricing" className="text-gray-300">Pricing</a></li>
                        </ul>
                    </nav>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 border-t border-slate-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
                <div>© {year} KiKi. All rights reserved.</div>
                <div className="flex gap-4">
                    <a href="#" className="text-gray-400">Privacy</a>
                    <a href="#" className="text-gray-400">Terms</a>
                </div>
            </div>
        </footer>
    )
}
