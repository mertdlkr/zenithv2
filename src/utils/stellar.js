import * as StellarSdk from '@stellar/stellar-sdk';
import { isConnected, getPublicKey, signTransaction, isAllowed } from '@stellar/freighter-api';

// Stellar network configuration
const HORIZON_URL = 'https://horizon-testnet.stellar.org';
const NETWORK_PASSPHRASE = StellarSdk.Networks.TESTNET;

const server = new StellarSdk.Horizon.Server(HORIZON_URL);

// Stellar utilities
export const stellarUtils = {
  // Check if Freighter wallet is available
  async isFreighterAvailable() {
    try {
      // Check if Freighter is installed
      if (typeof window !== 'undefined' && window.freighterApi) {
        return await isConnected();
      }
      return false;
    } catch (error) {
      console.error('Freighter not available:', error);
      return false;
    }
  },

  // Check if user has previously connected to this app
  async checkIfConnected() {
    try {
      return await isAllowed();
    } catch (error) {
      console.error('Error checking connection status:', error);
      return false;
    }
  },

  // Get connected public key without requesting permission
  async getConnectedPublicKey() {
    try {
      const allowed = await isAllowed();
      if (allowed) {
        return await getPublicKey();
      }
      return null;
    } catch (error) {
      console.error('Error getting connected public key:', error);
      return null;
    }
  },

  // Connect to Freighter wallet (requests permission)
  async connectWallet() {
    try {
      // First check if Freighter is available
      const available = await this.isFreighterAvailable();
      if (!available) {
        throw new Error('Freighter wallet is not available');
      }

      // Request access to the wallet
      const publicKey = await getPublicKey();
      
      if (!publicKey) {
        throw new Error('Failed to get public key from Freighter');
      }

      console.log('Connected to Freighter wallet:', this.formatAddress(publicKey));
      return publicKey;
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      
      // Provide more specific error messages
      if (error.message.includes('User declined access')) {
        throw new Error('User declined access to Freighter wallet');
      } else if (error.message.includes('Freighter is locked')) {
        throw new Error('Freighter wallet is locked');
      } else {
        throw new Error('Failed to connect to Freighter wallet: ' + error.message);
      }
    }
  },

  // Get account balance for USDC
  async getUSDCBalance(publicKey) {
    try {
      const account = await server.loadAccount(publicKey);
      const usdcBalance = account.balances.find(
        balance => balance.asset_code === 'USDC' && 
        balance.asset_issuer === 'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5' // Testnet USDC issuer
      );
      return usdcBalance ? parseFloat(usdcBalance.balance) : 0;
    } catch (error) {
      console.error('Error getting USDC balance:', error);
      // Return mock balance for demo if account doesn't exist
      if (error.message.includes('Account not found')) {
        console.log('Account not found, returning demo balance');
        return 1000; // Demo balance
      }
      return 0;
    }
  },

  // Get native XLM balance
  async getXLMBalance(publicKey) {
    try {
      const account = await server.loadAccount(publicKey);
      const xlmBalance = account.balances.find(balance => balance.asset_type === 'native');
      return xlmBalance ? parseFloat(xlmBalance.balance) : 0;
    } catch (error) {
      console.error('Error getting XLM balance:', error);
      // Return mock balance for demo if account doesn't exist
      if (error.message.includes('Account not found')) {
        console.log('Account not found, returning demo balance');
        return 100; // Demo balance
      }
      return 0;
    }
  },

  // Create stake transaction
  async createStakeTransaction(publicKey, amount, duration) {
    try {
      // For demo purposes, we'll create a simple payment transaction
      // In production, this would interact with a smart contract
      
      let account;
      try {
        account = await server.loadAccount(publicKey);
      } catch (error) {
        if (error.message.includes('Account not found')) {
          // For demo purposes, create a mock transaction
          console.log('Account not found, creating demo transaction');
          throw new Error('Demo mode: Account not funded on testnet');
        }
        throw error;
      }

      const usdcAsset = new StellarSdk.Asset('USDC', 'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5');
      
      const transaction = new StellarSdk.TransactionBuilder(account, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: NETWORK_PASSPHRASE
      })
      .addOperation(StellarSdk.Operation.payment({
        destination: 'GCDNJUBQSX7AJWLJACMJ7I4BC3Z47BQUTMHEICZLE6MU4KQBRYG5JY6B', // Platform treasury (placeholder)
        asset: usdcAsset,
        amount: amount.toString()
      }))
      .addMemo(StellarSdk.Memo.text(`STAKE:${duration}:${Date.now()}`))
      .setTimeout(300)
      .build();

      return transaction;
    } catch (error) {
      console.error('Error creating stake transaction:', error);
      throw error;
    }
  },

  // Sign and submit transaction
  async signAndSubmitTransaction(transaction) {
    try {
      console.log('Requesting transaction signature from Freighter...');
      
      const signedTransactionXDR = await signTransaction(transaction.toXDR(), {
        network: NETWORK_PASSPHRASE,
        networkPassphrase: NETWORK_PASSPHRASE,
        accountToSign: transaction.source
      });

      console.log('Transaction signed, submitting to network...');
      
      const signedTransaction = StellarSdk.TransactionBuilder.fromXDR(
        signedTransactionXDR,
        NETWORK_PASSPHRASE
      );

      const transactionResult = await server.submitTransaction(signedTransaction);
      
      console.log('Transaction submitted successfully:', transactionResult.hash);
      return transactionResult;
    } catch (error) {
      console.error('Error signing/submitting transaction:', error);
      
      if (error.message.includes('User declined')) {
        throw new Error('User declined to sign the transaction');
      } else if (error.message.includes('Account not found')) {
        // For demo purposes, simulate successful transaction
        console.log('Demo mode: Simulating successful transaction');
        return { successful: true, hash: 'demo_' + Date.now() };
      }
      
      throw error;
    }
  },

  // Format address for display
  formatAddress(address) {
    if (!address) return '';
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  },

  // Validate Stellar address
  isValidStellarAddress(address) {
    try {
      StellarSdk.Keypair.fromPublicKey(address);
      return true;
    } catch {
      return false;
    }
  },

  // Get network info
  getNetworkInfo() {
    return {
      network: 'testnet',
      horizonUrl: HORIZON_URL,
      networkPassphrase: NETWORK_PASSPHRASE
    };
  }
};

export default stellarUtils; 