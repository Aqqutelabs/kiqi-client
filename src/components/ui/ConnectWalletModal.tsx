// components/ui/ConnectWalletModal.tsx
"use client";

import { Modal } from "@/components/ui/Modal";
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWalletAuth } from '@/hooks/useWalletAuth';
import { useState, useEffect } from 'react';
import Heading from "./TextHeading";
import { Button } from "./Button";
import BASE_URL from "@/lib/utils/baseUrl";
import axios from "axios";
import toast from "react-hot-toast";
import { useWallet } from '@solana/wallet-adapter-react';
import { toast } from "react-hot-toast";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

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
  mode?: "signup" | "login";
}) {
  const { 
    // signInWithWallet, 
    isSigning, publicKey, error, disconnect } = useWalletAuth();
  const { connected, connecting } = useWallet();
  const [localError, setLocalError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Reset states when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setLocalError(null);
      setSuccess(false);
    }
  }, [isOpen]);

  // Sync error from hook
  useEffect(() => {
    if (error) {
      setLocalError(error);
    }
  }, [error]);

  const handleSignIn = async () => {
    try {
      setLocalError(null);
      // await signInWithWallet();
      setSuccess(true);
      
      toast.success(`${mode === "signup" ? 'Signed up' : 'Signed in'} successfully with wallet!`);
      
      // Close modal after short delay to show success message
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 1500);
    } catch (error) {
      console.error('Authentication failed:', error);
      // Error is already handled in the hook and set via useEffect
    }
  };

  const handleClose = () => {
    setLocalError(null);
    setSuccess(false);
    onClose();
  };

  // Handle modal close with cleanup
  const handleModalClose = () => {
    if (!success && connected) {
      disconnect();
    }
    handleClose();
  };

  return (
    <Modal width="600px" isOpen={isOpen} onClose={handleModalClose}>
      <Heading 
        heading={mode === "signup" ? "Sign Up with Wallet" : "Sign In with Wallet"} 
        subtitle={mode === "signup" 
            ? "Connect your Solana wallet to create your account" 
            : "Connect your Solana wallet to sign in"}
        className="text-center"
      />
      
      <div className="space-y-6 my-6">
        
        {/* Error message */}
        {localError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-600 text-sm font-medium">Authentication Error</p>
              <p className="text-red-500 text-sm mt-1">{localError}</p>
            </div>
          </div>
        )}

        {/* Success message */}
        {success && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-green-600 text-sm font-medium">Success!</p>
              <p className="text-green-500 text-sm mt-1">
                ✓ Successfully {mode === "signup" ? 'signed up' : 'signed in'}! Redirecting...
              </p>
            </div>
          </div>
        )}
        
        {/* Wallet Connect Button */}
        <div className="flex justify-center">
          <WalletMultiButton 
            className="!bg-blue-500 hover:!bg-blue-600 !text-white !font-medium !py-2 !px-4 !rounded-lg !transition-colors"
          />
        </div>

        {/* Loading state */}
        {connecting && (
          <div className="text-center p-4">
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
              <p className="text-sm text-gray-600">Connecting to wallet...</p>
            </div>
          </div>
        )}

        {/* Show connected state */}
        {connected && publicKey && !success && !connecting && (
          <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200 space-y-4">
            <div className="flex items-center justify-center gap-2">
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              <p className="text-green-600 font-medium">✓ Wallet Connected</p>
            </div>
            
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-xs text-gray-500 mb-1">Wallet Address:</p>
              <p className="text-xs text-gray-700 font-mono break-all">
                {publicKey.toString()}
              </p>
            </div>
            
            <div className="space-y-2">
              <Button 
                onClick={handleSignIn}
                className="w-full"
                disabled={isSigning}
              >
                {isSigning ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing message...
                  </span>
                ) : (
                  `Complete ${mode === "signup" ? 'Sign Up' : 'Sign In'}`
                )}
              </Button>
              
              <Button 
                variant="outline"
                onClick={disconnect}
                className="w-full text-sm"
                disabled={isSigning}
              >
                Disconnect Wallet
              </Button>
            </div>
          </div>
        )}

        {/* Instructions */}
        {!connected && !connecting && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800 font-medium mb-2">
              Don't have a Solana wallet?
            </p>
            <ul className="text-xs text-blue-700 space-y-1 ml-4 list-disc">
              <li>Install <a href="https://phantom.app/" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-900 font-medium">Phantom</a> or <a href="https://solflare.com/" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-900 font-medium">Solflare</a></li>
              <li>Create a new wallet (save your recovery phrase!)</li>
              <li>Click the connect button above</li>
              <li>Approve the connection in your wallet extension</li>
            </ul>
            <div className="mt-3 pt-3 border-t border-blue-200">
              <p className="text-xs text-blue-600">
                <span className="font-medium">Note:</span> You'll need to sign a message to verify ownership of the wallet.
              </p>
            </div>
          </div>
        )}

        {/* Additional Info */}
        <div className="text-xs text-gray-500 text-center space-y-1">
          <p>By connecting your wallet, you agree to our Terms of Service and Privacy Policy.</p>
          <p>Your wallet address will be used to create your account.</p>
          <p className="text-gray-400">No funds will be transferred. Only signature verification is required.</p>
        </div>
      </div>

      <div className="flex justify-center gap-3 pt-4 border-t">
        <Button 
          variant="outline" 
          onClick={handleModalClose} 
          disabled={isSigning || connecting}
        >
          Cancel
        </Button>
        <Button onClick={handleProceed}>Proceed</Button>
      </div>
    </Modal>
  );
}