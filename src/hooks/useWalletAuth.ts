// hooks/useWalletAuth.ts
"use client";

import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState, useCallback } from 'react';
import { useAppDispatch } from '@/redux/hooks';
import { useRouter } from 'next/navigation';
// import { web3Login } from '@/redux/slices/authSlice';
import { toast } from 'react-hot-toast';

export function useWalletAuth() {
  const { publicKey, signMessage, connected, disconnect } = useWallet();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isSigning, setIsSigning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Clear error when wallet connection changes
  useEffect(() => {
    setError(null);
  }, [connected]);

  // Handle wallet authentication
  // const signInWithWallet = useCallback(async () => {
  //   if (!publicKey) {
  //     setError('Wallet not connected');
  //     throw new Error('Wallet not connected');
  //   }

  //   if (!signMessage) {
  //     setError('Wallet does not support message signing');
  //     throw new Error('Wallet does not support message signing');
  //   }

  //   setIsSigning(true);
  //   setError(null);

  //   try {
  //     // Create a unique message to sign
  //     const timestamp = Date.now();
  //     const nonce = Math.random().toString(36).substring(2, 15);
  //     const message = `Welcome to KiKi! Please sign this message to authenticate.\n\nWallet: ${publicKey.toBase58()}\nTimestamp: ${timestamp}\nNonce: ${nonce}`;
      
  //     // Convert message to Uint8Array
  //     const encodedMessage = new TextEncoder().encode(message);
      
  //     // Request signature from wallet
  //     const signature = await signMessage(encodedMessage);
      
  //     // Convert signature to base58
  //     const signatureBase58 = Buffer.from(signature).toString('base64');

  //     // Dispatch to Redux (if you have web3Login action)
  //     const result = await dispatch(web3Login({
  //       publicKey: publicKey.toBase58(),
  //       signature: signatureBase58,
  //       message,
  //       timestamp,
  //       nonce
  //     }) as any);

  //     if (web3Login.fulfilled.match(result)) {
  //       toast.success('Wallet authentication successful!');
  //       router.push('/dashboard');
  //       return result.payload;
  //     } else {
  //       throw new Error(result.payload as string || 'Authentication failed');
  //     }
  //   } catch (error: any) {
  //     console.error('Wallet authentication error:', error);
      
  //     // Handle specific wallet errors
  //     if (error.name === 'WalletSignMessageError') {
  //       setError('Message signing was cancelled');
  //       toast.error('Message signing was cancelled');
  //     } else if (error.message?.includes('User rejected')) {
  //       setError('You rejected the signing request');
  //       toast.error('You rejected the signing request');
  //     } else {
  //       setError(error.message || 'Authentication failed');
  //       toast.error(error.message || 'Authentication failed');
  //     }
      
  //     throw error;
  //   } finally {
  //     setIsSigning(false);
  //   }
  // }, [publicKey, signMessage, dispatch, router]);

  // Handle wallet disconnect
  const handleDisconnect = useCallback(() => {
    disconnect();
    setError(null);
    toast.success('Wallet disconnected');
  }, [disconnect]);

  return {
    publicKey,
    connected,
    disconnect: handleDisconnect,
    // signInWithWallet,
    isSigning,
    error
  };
}