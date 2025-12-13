"use client";

import { Modal } from "@/components/ui/Modal";
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWalletAuth } from '@/hooks/useWalletAuth';
import { useState } from 'react';
import Heading from "./TextHeading";
import { Button } from "./Button";
import BASE_URL from "@/lib/utils/baseUrl";
import axios from "axios";
import toast from "react-hot-toast";

interface ConnectWalletProps {
  isOpen: boolean;
  onClose: () => void;
  redeemAmount: string; // value from first modal
}

export default function ConnectWallet({
  isOpen,
  onClose,
  redeemAmount,
}: ConnectWalletProps) {
  const [loading, setLoading] = useState(false);

  const handleProceed = async () => {
    const token =
      typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("persist:root") || "{}").auth
          ? JSON.parse(
              JSON.parse(localStorage.getItem("persist:root") || "{}").auth
            ).token
          : null
        : null;
    try {
      setLoading(true);

      const provider = window.phantom?.solana;
      if (!provider?.isPhantom) {
        toast.error("Phantom not installed");
        return;
      }

      const resp = await provider.connect();
      const walletId = resp.publicKey.toString();
      console.log(walletId);
      //const walletId = "7x9qKJf8tZpFf13mNwYTT4bHbAhE7rG5L8q1ZA9i5mA"; // replace with actual wallet later

      const res = await axios.post(
        `${BASE_URL}/api/v1/conversions`,
        {
          amount: Number(redeemAmount),
          solanaWallet: walletId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Conversion response:", res.data);
      onClose();
    } catch (err) {
      console.error("Conversion failed:", err);
    } finally {
      setLoading(false);
    }
  };
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
      <Heading heading="Connect Solana Wallet" className="text-center" />
      <div className="space-y-4 my-4">
        {wallets.map((wallet) => {
          const isActive = activeTab === wallet.id;
          return (
            <div
              onClick={() => setActiveTab(wallet.id)}
              key={wallet.id}
              className={`border ${
                isActive
                  ? "border-[var(--primary)] shadow bg-blue-50"
                  : "border-[#E2E8F0]"
              } py-3 px-4 rounded-xl flex items-center gap-2 h-16 w-full cursor-pointer`}
            >
              <img src={wallet.img} alt={wallet.name} className="size-8" />
              <h4 className="font-medium text-base text-[#1B223C]">
                {wallet.name}
              </h4>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between items-center">
        <Button variant={"outline"} onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleProceed}>Proceed</Button>
      </div>
    </Modal>
  );
}