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
      setIsLoading(true);
      const freighterAvailable = await stellarUtils.isFreighterAvailable();
      if (freighterAvailable) {
        // Check if user has previously connected
        const isAlreadyConnected = await stellarUtils.checkIfConnected();
        if (isAlreadyConnected) {
          const publicKey = await stellarUtils.getConnectedPublicKey();
          if (publicKey) {
            setPublicKey(publicKey);
            setIsConnected(true);
            console.log('Auto-connected to wallet:', stellarUtils.formatAddress(publicKey));
          }
        }
      }
    } catch (error) {
      console.log('Wallet auto-connection failed:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const connectWallet = async () => {
    setIsLoading(true);
    try {
      // First check if Freighter is available
      const freighterAvailable = await stellarUtils.isFreighterAvailable();
      
      if (!freighterAvailable) {
        toast.error(
          'Freighter wallet not detected. Please install Freighter extension.',
          {
            duration: 5000,
            action: {
              label: 'Install',
              onClick: () => window.open('https://freighter.app/', '_blank')
            }
          }
        );
        return false;
      }

      // Request connection to Freighter
      const walletPublicKey = await stellarUtils.connectWallet();
      
      if (!walletPublicKey) {
        toast.error('Failed to get wallet address. Please try again.');
        return false;
      }

      setPublicKey(walletPublicKey);
      setIsConnected(true);
      
      toast.success(`Wallet connected: ${stellarUtils.formatAddress(walletPublicKey)}`, {
        duration: 4000
      });
      
      // Load balances after connection
      await updateBalances();
      
      return true;
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      
      if (error.message.includes('User declined access')) {
        toast.error('Wallet connection was declined. Please approve the connection to continue.');
      } else if (error.message.includes('Freighter is locked')) {
        toast.error('Freighter wallet is locked. Please unlock your wallet and try again.');
      } else {
        toast.error('Failed to connect wallet. Please ensure Freighter is installed and unlocked.');
      }
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      // Clear wallet state
      setIsConnected(false);
      setPublicKey('');
      setUsdcBalance(0);
      setXlmBalance(0);
      setStakedAmount(0);
      
      // Note: Freighter doesn't have a programmatic disconnect method
      // The user needs to disconnect from the Freighter extension itself
      toast.success('Wallet disconnected locally. To fully disconnect, please use the Freighter extension.', {
        duration: 6000
      });
    } catch (error) {
      console.error('Error during disconnect:', error);
      toast.error('Error disconnecting wallet');
    }
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
      
      // Also update staked amount from localStorage or API
      const savedStakedAmount = localStorage.getItem(`staked_${publicKey}`);
      if (savedStakedAmount) {
        setStakedAmount(parseFloat(savedStakedAmount));
      }
    } catch (error) {
      console.error('Failed to update balances:', error);
      // Don't show error toast for balance updates as they happen automatically
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
      // For demo purposes, we'll simulate staking
      // In production, this would interact with a smart contract
      
      toast.loading('Creating stake transaction...', { id: 'stake-loading' });
      
      const transaction = await stellarUtils.createStakeTransaction(publicKey, amount, duration);
      
      toast.loading('Please approve the transaction in Freighter...', { id: 'stake-loading' });
      
      const result = await stellarUtils.signAndSubmitTransaction(transaction);
      
      if (result.successful) {
        const newStakedAmount = stakedAmount + amount;
        setStakedAmount(newStakedAmount);
        
        // Save staked amount to localStorage
        localStorage.setItem(`staked_${publicKey}`, newStakedAmount.toString());
        
        await updateBalances();
        
        toast.success(`Successfully staked ${amount} USDC for ${duration} days!`, { id: 'stake-loading' });
        return true;
      } else {
        throw new Error('Transaction failed');
      }
    } catch (error) {
      console.error('Staking failed:', error);
      
      if (error.message.includes('User declined')) {
        toast.error('Transaction was declined in Freighter', { id: 'stake-loading' });
      } else {
        toast.error('Failed to stake USDC. Please try again.', { id: 'stake-loading' });
      }
      
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