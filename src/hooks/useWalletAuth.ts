"use client";

import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';
import { useAppDispatch } from '@/redux/hooks';
import { useRouter } from 'next/navigation';
import bs58 from 'bs58';

export function useWalletAuth() {
  const { publicKey, signMessage, connected, disconnect } = useWallet();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isSigning, setIsSigning] = useState(false);

  // Handle wallet authentication
  const signInWithWallet = async () => {
    if (!publicKey || !signMessage) {
      throw new Error('Wallet not connected');
    }

    setIsSigning(true);

    try {
      // Create a message to sign (including timestamp to prevent replay attacks)
      const message = `Sign this message to authenticate with KiQi.\n\nWallet: ${publicKey.toBase58()}\nTimestamp: ${Date.now()}`;
      const encodedMessage = new TextEncoder().encode(message);
      
      // Request signature from wallet
      const signature = await signMessage(encodedMessage);
      const signatureBase58 = bs58.encode(signature);

      // Send to your backend API for verification
      const response = await fetch('/api/auth/wallet-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          publicKey: publicKey.toBase58(),
          signature: signatureBase58,
          message,
        }),
      });

      if (!response.ok) {
        throw new Error('Authentication failed');
      }

      const data = await response.json();

      // Dispatch login action to Redux (uncomment when ready)
      // dispatch(login(data.user, data.token));

      // Redirect to dashboard
      router.push('/dashboard');

      return data;
    } catch (error) {
      console.error('Wallet authentication error:', error);
      throw error;
    } finally {
      setIsSigning(false);
    }
  };

  return {
    publicKey,
    connected,
    disconnect,
    signInWithWallet,
    isSigning,
  };
}