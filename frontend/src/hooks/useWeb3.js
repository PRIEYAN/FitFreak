import { useState, useEffect, useCallback } from 'react';
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { API_CONFIG } from '../config/api';

// Solana Configuration
const SOLANA_NETWORK = 'devnet'; // or 'mainnet-beta' for production
const SOLANA_RPC_URL = API_CONFIG.RPC_URL || 'https://api.devnet.solana.com';

export const useWeb3 = () => {
  const [account, setAccount] = useState(null);
  const [publicKey, setPublicKey] = useState(null);
  const [connection, setConnection] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [balance, setBalance] = useState(0);

  // Initialize Solana connection
  useEffect(() => {
    const conn = new Connection(SOLANA_RPC_URL, 'confirmed');
    setConnection(conn);
  }, []);

  // Check if Solana wallet is installed
  const isWalletInstalled = useCallback(() => {
    return typeof window !== 'undefined' && 
           (window.solana || window.phantom || window.solflare);
  }, []);

  // Get wallet provider
  const getWalletProvider = useCallback(() => {
    if (typeof window === 'undefined') return null;
    
    // Check for Phantom first (most popular)
    if (window.phantom?.solana) {
      return window.phantom.solana;
    }
    
    // Check for Solflare
    if (window.solflare) {
      return window.solflare;
    }
    
    // Check for generic Solana provider
    if (window.solana) {
      return window.solana;
    }
    
    return null;
  }, []);

  // Connect wallet
  const connectWallet = useCallback(async () => {
    if (!isWalletInstalled()) {
      throw new Error('Please install a Solana wallet (Phantom, Solflare) to continue');
    }

    setIsConnecting(true);
    setError(null);

    try {
      const provider = getWalletProvider();
      
      if (!provider) {
        throw new Error('No Solana wallet provider found');
      }

      // Request connection
      const response = await provider.connect();
      const pubKey = new PublicKey(response.publicKey);
      
      setPublicKey(pubKey);
      setAccount(pubKey.toBase58());

      // Get balance
      if (connection) {
        try {
          const balance = await connection.getBalance(pubKey);
          setBalance(balance / LAMPORTS_PER_SOL);
        } catch (balanceError) {
          console.warn('Could not fetch balance:', balanceError);
          setBalance(0);
        }
      }

      console.log('✅ Wallet connected:', pubKey.toBase58());
      return pubKey.toBase58();
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setError(error.message);
      throw error;
    } finally {
      setIsConnecting(false);
    }
  }, [isWalletInstalled, getWalletProvider, connection]);

  // Disconnect wallet
  const disconnectWallet = useCallback(async () => {
    try {
      const provider = getWalletProvider();
      if (provider && provider.disconnect) {
        await provider.disconnect();
      }
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    } finally {
      setAccount(null);
      setPublicKey(null);
      setBalance(0);
      setError(null);
    }
  }, [getWalletProvider]);

  // Send transaction
  const sendTransaction = useCallback(async (toAddress, amount) => {
    if (!publicKey || !connection) {
      throw new Error('Wallet not connected');
    }

    const provider = getWalletProvider();
    if (!provider) {
      throw new Error('Wallet provider not found');
    }

    try {
      const toPubkey = new PublicKey(toAddress);
      const lamports = amount * LAMPORTS_PER_SOL;

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: toPubkey,
          lamports: lamports,
        })
      );

      // Get recent blockhash
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      // Sign and send transaction
      const signed = await provider.signTransaction(transaction);
      const signature = await connection.sendRawTransaction(signed.serialize());
      
      // Confirm transaction
      await connection.confirmTransaction(signature, 'confirmed');

      return signature;
    } catch (error) {
      console.error('Error sending transaction:', error);
      throw error;
    }
  }, [publicKey, connection, getWalletProvider]);

  // Listen for wallet events
  useEffect(() => {
    const provider = getWalletProvider();
    if (!provider) return;

    const handleAccountChange = (publicKey) => {
      if (publicKey) {
        const pubKey = new PublicKey(publicKey);
        setPublicKey(pubKey);
        setAccount(pubKey.toBase58());
        
        // Update balance
        if (connection) {
          connection.getBalance(pubKey).then(balance => {
            setBalance(balance / LAMPORTS_PER_SOL);
          });
        }
      } else {
        disconnectWallet();
      }
    };

    const handleDisconnect = () => {
      disconnectWallet();
    };

    // Phantom wallet events
    if (provider.on) {
      provider.on('accountChanged', handleAccountChange);
      provider.on('disconnect', handleDisconnect);
    }

    return () => {
      if (provider.removeListener) {
        provider.removeListener('accountChanged', handleAccountChange);
        provider.removeListener('disconnect', handleDisconnect);
      }
    };
  }, [connection, getWalletProvider, disconnectWallet]);

  // Check if already connected on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (!isWalletInstalled()) return;

      try {
        const provider = getWalletProvider();
        if (provider && provider.isConnected) {
          const response = await provider.connect({ onlyIfTrusted: true });
          if (response) {
            const pubKey = new PublicKey(response.publicKey);
            setPublicKey(pubKey);
            setAccount(pubKey.toBase58());
            
            if (connection) {
              const balance = await connection.getBalance(pubKey);
              setBalance(balance / LAMPORTS_PER_SOL);
            }
          }
        }
      } catch (error) {
        // User hasn't connected before, ignore
        console.log('No previous connection found');
      }
    };

    if (connection) {
      checkConnection();
    }
  }, [isWalletInstalled, getWalletProvider, connection]);

  return {
    // State
    account,
    publicKey,
    connection,
    balance,
    isConnecting,
    error,
    isWalletInstalled: isWalletInstalled(),
    
    // Actions
    connectWallet,
    disconnectWallet,
    sendTransaction,
  };
};
