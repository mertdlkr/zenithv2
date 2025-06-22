import React, { createContext, useContext, useState, useEffect } from 'react';
import { stellarUtils } from '../utils/stellar';
import toast from 'react-hot-toast';

const WalletContext = createContext();

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

export const WalletProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [publicKey, setPublicKey] = useState('');
  const [usdcBalance, setUsdcBalance] = useState(0);
  const [xlmBalance, setXlmBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [stakedAmount, setStakedAmount] = useState(0);

  // Check if wallet is already connected on app load
  useEffect(() => {
    checkConnection();
  }, []);

  // Update balances when wallet is connected
  useEffect(() => {
    if (isConnected && publicKey) {
      updateBalances();
      // Update balances every 30 seconds
      const interval = setInterval(updateBalances, 30000);
      return () => clearInterval(interval);
    }
  }, [isConnected, publicKey]);

  const checkConnection = async () => {
    try {
      const freighterAvailable = await stellarUtils.isFreighterAvailable();
      if (freighterAvailable) {
        const publicKey = await stellarUtils.connectWallet();
        setPublicKey(publicKey);
        setIsConnected(true);
      }
    } catch (error) {
      console.log('Wallet not connected:', error.message);
    }
  };

  const connectWallet = async () => {
    setIsLoading(true);
    try {
      const freighterAvailable = await stellarUtils.isFreighterAvailable();
      
      if (!freighterAvailable) {
        toast.error('Freighter wallet not detected. Please install Freighter extension.');
        return false;
      }

      const walletPublicKey = await stellarUtils.connectWallet();
      setPublicKey(walletPublicKey);
      setIsConnected(true);
      
      toast.success('Wallet connected successfully!');
      return true;
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      toast.error('Failed to connect wallet. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setPublicKey('');
    setUsdcBalance(0);
    setXlmBalance(0);
    setStakedAmount(0);
    toast.success('Wallet disconnected');
  };

  const updateBalances = async () => {
    if (!publicKey) return;
    
    try {
      const [usdc, xlm] = await Promise.all([
        stellarUtils.getUSDCBalance(publicKey),
        stellarUtils.getXLMBalance(publicKey)
      ]);
      
      setUsdcBalance(usdc);
      setXlmBalance(xlm);
    } catch (error) {
      console.error('Failed to update balances:', error);
    }
  };

  const stakeUSDC = async (amount, duration) => {
    if (!isConnected || !publicKey) {
      toast.error('Please connect your wallet first');
      return false;
    }

    if (amount > usdcBalance) {
      toast.error('Insufficient USDC balance');
      return false;
    }

    setIsLoading(true);
    try {
      const transaction = await stellarUtils.createStakeTransaction(publicKey, amount, duration);
      const result = await stellarUtils.signAndSubmitTransaction(transaction);
      
      if (result.successful) {
        setStakedAmount(prev => prev + amount);
        await updateBalances();
        toast.success(`Successfully staked ${amount} USDC for ${duration} days!`);
        return true;
      } else {
        throw new Error('Transaction failed');
      }
    } catch (error) {
      console.error('Staking failed:', error);
      toast.error('Failed to stake USDC. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const calculateYield = (principal, duration) => {
    const APR = 0.10; // 10% APR
    return principal * (APR / 365) * duration;
  };

  const formatAddress = (address) => {
    return stellarUtils.formatAddress(address);
  };

  const value = {
    isConnected,
    publicKey,
    usdcBalance,
    xlmBalance,
    stakedAmount,
    isLoading,
    connectWallet,
    disconnectWallet,
    updateBalances,
    stakeUSDC,
    calculateYield,
    formatAddress
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}; 