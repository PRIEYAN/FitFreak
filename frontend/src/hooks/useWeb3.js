import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { API_CONFIG } from '../config/api';

export const useWeb3 = () => {
  const [account, setAccount] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [balance, setBalance] = useState('0');
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);

  // Check if MetaMask is installed
  const isWalletInstalled = useCallback(() => {
    return typeof window !== 'undefined' && window.ethereum;
  }, []);

  // Switch to Citrea Testnet
  const switchToCitreaNetwork = useCallback(async () => {
    if (!window.ethereum) return;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: API_CONFIG.CHAIN_ID }],
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: API_CONFIG.CHAIN_ID,
              chainName: 'Citrea Testnet',
              nativeCurrency: {
                name: 'Citrea',
                symbol: 'CBTC',
                decimals: 18,
              },
              rpcUrls: [API_CONFIG.RPC_URL],
              blockExplorerUrls: ['https://explorer.testnet.citrea.xyz'],
            }],
          });
        } catch (addError) {
          console.error('Failed to add Citrea network:', addError);
          throw new Error('Please add Citrea Testnet manually in MetaMask');
        }
      } else {
        throw switchError;
      }
    }
  }, []);

  // Connect wallet
  const connectWallet = useCallback(async () => {
    if (!isWalletInstalled()) {
      throw new Error('Please install MetaMask to continue');
    }

    setIsConnecting(true);
    setError(null);

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }

      const accountAddress = accounts[0];
      setAccount(accountAddress);

      // Switch to Citrea Testnet
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      if (chainId !== API_CONFIG.CHAIN_ID) {
        await switchToCitreaNetwork();
      }

      // Initialize provider and signer
      const ethProvider = new ethers.BrowserProvider(window.ethereum);
      const ethSigner = await ethProvider.getSigner();
      setProvider(ethProvider);
      setSigner(ethSigner);

      // Get balance
      try {
        const balance = await ethProvider.getBalance(accountAddress);
        setBalance(ethers.formatEther(balance));
      } catch (balanceError) {
        console.warn('Could not fetch balance:', balanceError);
        setBalance('0');
      }

      console.log('✅ Wallet connected:', accountAddress);
      return accountAddress;
    } catch (error) {
      console.error('Error connecting wallet:', error);
      
      if (error.code === -32603 && error.data?.cause?.isBrokenCircuitError) {
        setError('MetaMask circuit breaker is open. Please wait a moment and try again.');
      } else if (error.code === 4001) {
        setError('Connection rejected by user');
      } else {
        setError(error.message || 'Failed to connect wallet');
      }
      throw error;
    } finally {
      setIsConnecting(false);
    }
  }, [isWalletInstalled, switchToCitreaNetwork]);

  // Disconnect wallet
  const disconnectWallet = useCallback(async () => {
    setAccount(null);
    setProvider(null);
    setSigner(null);
    setBalance('0');
    setError(null);
  }, []);

  // Send transaction
  const sendTransaction = useCallback(async (toAddress, amount) => {
    if (!signer || !account) {
      throw new Error('Wallet not connected');
    }

    try {
      const tx = await signer.sendTransaction({
        to: toAddress,
        value: ethers.parseEther(amount.toString()),
      });

      const receipt = await tx.wait();
      return receipt.hash;
    } catch (error) {
      console.error('Error sending transaction:', error);
      throw error;
    }
  }, [signer, account]);

  // Listen for account changes
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = async (accounts) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else if (accounts[0] !== account) {
        setAccount(accounts[0]);
        if (provider) {
          try {
            const balance = await provider.getBalance(accounts[0]);
            setBalance(ethers.formatEther(balance));
          } catch (error) {
            console.warn('Could not fetch balance:', error);
          }
        }
      }
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    };
  }, [account, provider, disconnectWallet]);

  // Check if already connected on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (!isWalletInstalled()) return;

      try {
        const accounts = await window.ethereum.request({
          method: 'eth_accounts',
        });

        if (accounts.length > 0) {
          const accountAddress = accounts[0];
          setAccount(accountAddress);

          const ethProvider = new ethers.BrowserProvider(window.ethereum);
          const ethSigner = await ethProvider.getSigner();
          setProvider(ethProvider);
          setSigner(ethSigner);

          try {
            const balance = await ethProvider.getBalance(accountAddress);
            setBalance(ethers.formatEther(balance));
          } catch (error) {
            console.warn('Could not fetch balance:', error);
          }
        }
      } catch (error) {
        console.log('No previous connection found');
      }
    };

    checkConnection();
  }, [isWalletInstalled]);

  return {
    account,
    balance,
    isConnecting,
    error,
    isWalletInstalled: isWalletInstalled(),
    provider,
    signer,
    connectWallet,
    disconnectWallet,
    sendTransaction,
  };
};
