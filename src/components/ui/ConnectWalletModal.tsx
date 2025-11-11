"use client";

import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { X } from "lucide-react";
import { redirect } from "next/navigation";
import { useState } from "react";
import Heading from "./TextHeading";
import { Button } from "./Button";

export default function ConnectWallet({ isOpen, onClose }: {isOpen: boolean; onClose: () => void;}) {
  const [activeTab, setActiveTab] = useState<number | null>(null);
  const wallets = [
    { id: 1, name: "Metamask", img: "/wallet/metamask-fox.svg" },
    { id: 2, name: "Trust Wallet", img: "/wallet/trust_wallet.svg" },
    { id: 3, name: "WalletConnect", img: "/wallet/walletconnect.svg" },
    { id: 4, name: "Coinbase Wallet", img: "/wallet/coinbase.svg" },
    { id: 5, name: "Phantom Wallet", img: "/wallet/phantom-logo.svg" },
  ];
  return (
      <Modal width="600px" isOpen={isOpen} onClose={onClose}>
        {/* <p className="font-medium text-lg text-[#1B223C]">Connect Solana Wallet</p> */}
        <Heading heading="Connect Solana Wallet" className="text-center"/>
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
        <div className="flex justify-between items-center">
          <Button variant={"outline"} onClick={onClose}>Cancel</Button>
          <Button>Proceed</Button>
        </div>
      </Modal>
  );
}
