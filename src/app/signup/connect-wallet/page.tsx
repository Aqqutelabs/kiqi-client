"use client";

import { Card } from "@/components/ui/Card";
import AuthLayout from "@/components/ui/layout/AuthLayout";
import { X } from "lucide-react";
import { redirect } from "next/navigation";
import { useState } from "react";

export default function ConnectWallet() {
  const [activeTab, setActiveTab] = useState<number | null>(null);
  const wallets = [
    { id: 1, name: "Metamask", img: "/wallet/metamask-fox.svg" },
    { id: 2, name: "Trust Wallet", img: "/wallet/trust_wallet.svg" },
    { id: 3, name: "WalletConnect", img: "/wallet/walletconnect.svg" },
    { id: 4, name: "Coinbase Wallet", img: "/wallet/coinbase.svg" },
    { id: 5, name: "Phantom Wallet", img: "/wallet/phantom-logo.svg" },
  ];
  return (
    <AuthLayout>
      <Card className="w-[600px]">
        <div className="flex justify-between items-center">
          <p className="font-medium text-lg text-[#1B223C]">Connect Wallet</p>
          <X onClick={() => redirect("/signup")} className="cursor-pointer" />
        </div>
        <div className="space-y-4 my-4">
          {wallets.map((wallet) => {
            const isActive = activeTab === wallet.id;
            return (
              <div
                onClick={() => setActiveTab(wallet.id)}
                key={wallet.id}
                className={`border ${isActive ? 'border-[var(--primary)] shadow bg-blue-50' : 'border-[#E2E8F0]'} py-3 px-4 rounded-xl flex items-center gap-2 h-16 w-full cursor-pointer`}>
                <img src={wallet.img} alt={wallet.name} className="size-8" />
                <h4 className="font-medium text-base text-[#1B223C]">
                  {wallet.name}
                </h4>
              </div>
            );
          })}
        </div>
      </Card>
    </AuthLayout>
  );
}
