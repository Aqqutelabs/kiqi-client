"use client";

import { Modal } from "@/components/ui/Modal";
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWalletAuth } from '@/hooks/useWalletAuth';
import { useState } from 'react';
import Heading from "./TextHeading";
import { Button } from "./Button";

export default function ConnectWallet({ 
  isOpen, 
  onClose,
  mode = "signup"
}: {
  isOpen: boolean; 
  onClose: () => void;
  mode?: "signup" | "login";
}) {
  const { signInWithWallet, isSigning, publicKey, connected } = useWalletAuth();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSignIn = async () => {
    try {
      setError(null);
      await signInWithWallet();
      setSuccess(true);
      
      // Close modal after short delay to show success message
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 1500);
    } catch (error) {
      console.error('Authentication failed:', error);
      setError(error instanceof Error ? error.message : 'Authentication failed. Please try again.');
    }
  };

  const handleClose = () => {
    setError(null);
    setSuccess(false);
    onClose();
  };

  return (
    <Modal width="600px" isOpen={isOpen} onClose={handleClose}>
      <Heading 
        heading={mode === "signup" ? "Sign Up with Wallet" : "Sign In with Wallet"} 
        subtitle={mode === "signup" 
            ? "Connect your Solana wallet to create your account" 
            : "Connect your Solana wallet to sign in"}
        className="text-center"
      />
      
      <div className="space-y-6 my-6">
        
        {/* Error message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Success message */}
        {success && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-600 text-sm text-center font-medium">
              ✓ Successfully {mode === "signup" ? 'signed up' : 'signed in'}! Redirecting...
            </p>
          </div>
        )}
        
        {/* Wallet Connect Button */}
        <div className="flex justify-center">
          <WalletMultiButton className="bg-blue-500 hover:bg-blue-600" />
        </div>

        {/* Show connected state */}
        {connected && publicKey && !success && (
          <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-green-600 font-medium mb-2">✓ Wallet Connected!</p>
            <p className="text-xs text-gray-500 font-mono mb-4 break-all px-4">
              {publicKey.toString()}
            </p>
            <Button 
              onClick={handleSignIn}
              className="w-full max-w-xs mx-auto"
              disabled={isSigning}
            >
              {isSigning ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⏳</span>
                  Signing message...
                </span>
              ) : (
                `Complete ${mode === "signup" ? 'Sign Up' : 'Sign In'}`
              )}
            </Button>
          </div>
        )}

        {/* Instructions */}
        {!connected && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800 font-medium mb-2">
              Don't have a Solana wallet?
            </p>
            <ul className="text-xs text-blue-700 space-y-1 ml-4 list-disc">
              <li>Install <a href="https://phantom.app/" target="_blank" rel="noopener noreferrer" className="underline">Phantom</a> or <a href="https://solflare.com/" target="_blank" rel="noopener noreferrer" className="underline">Solflare</a></li>
              <li>Create a new wallet</li>
              <li>Click the connect button above</li>
            </ul>
          </div>
        )}
      </div>

      <div className="flex justify-center gap-3">
        <Button variant="outline" onClick={handleClose} disabled={isSigning}>
          Cancel
        </Button>
      </div>
    </Modal>
  );
}