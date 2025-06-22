import * as StellarSdk from '@stellar/stellar-sdk';
import { isConnected, getPublicKey, signTransaction } from '@stellar/freighter-api';

// Stellar network configuration
const HORIZON_URL = 'https://horizon-testnet.stellar.org';
const NETWORK_PASSPHRASE = StellarSdk.Networks.TESTNET;

const server = new StellarSdk.Horizon.Server(HORIZON_URL);

// Stellar utilities
export const stellarUtils = {
  // Check if Freighter wallet is available
  async isFreighterAvailable() {
    try {
      return await isConnected();
    } catch (error) {
      console.error('Freighter not available:', error);
      return false;
    }
  },

  // Connect to Freighter wallet
  async connectWallet() {
    try {
      const publicKey = await getPublicKey();
      return publicKey;
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw new Error('Failed to connect to Freighter wallet');
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
      return 0;
    }
  },

  // Create stake transaction
  async createStakeTransaction(publicKey, amount, duration) {
    try {
      const account = await server.loadAccount(publicKey);
      const usdcAsset = new StellarSdk.Asset('USDC', 'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5');
      
      // For demo purposes, we'll use a payment operation
      // In production, this would be a smart contract call
      const transaction = new StellarSdk.TransactionBuilder(account, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: NETWORK_PASSPHRASE
      })
      .addOperation(StellarSdk.Operation.payment({
        destination: 'GCDNJUBQSX7AJWLJACMJ7I4BC3Z47BQUTMHEICZLE6MU4KQBRYG5JY6B', // Platform treasury (placeholder)
        asset: usdcAsset,
        amount: amount.toString()
      }))
      .addMemo(StellarSdk.Memo.text(`STAKE:${duration}`))
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
      const signedTransaction = await signTransaction(transaction.toXDR(), {
        network: NETWORK_PASSPHRASE,
        networkPassphrase: NETWORK_PASSPHRASE,
        accountToSign: transaction.source
      });

      const transactionResult = await server.submitTransaction(signedTransaction);
      return transactionResult;
    } catch (error) {
      console.error('Error signing/submitting transaction:', error);
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
  }
};

export default stellarUtils; 