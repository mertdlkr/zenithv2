import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';
import { useInvoice } from '../contexts/InvoiceContext';
import { 
  DollarSign, 
  FileText, 
  TrendingUp, 
  Users, 
  Plus,
  Coins,
  BarChart3,
  ArrowRight,
  Clock,
  CheckCircle,
  Zap,
  Target,
  Award,
  ArrowUpRight,
  Wallet
} from 'lucide-react';

const Dashboard = () => {
  const { 
    isConnected, 
    usdcBalance, 
    stakedAmount, 
    connectWallet, 
    stakeUSDC,
    calculateYield,
    isLoading 
  } = useWallet();
  
  const { getOpenInvoices, calculateProjectedIncome } = useInvoice();

  const [showStakeModal, setShowStakeModal] = useState(false);
  const [stakeAmount, setStakeAmount] = useState('');
  const [stakeDuration, setStakeDuration] = useState('30');

  const openInvoices = getOpenInvoices();
  const totalOpenInvoices = openInvoices.length;
  const totalInvoiceValue = openInvoices.reduce((sum, inv) => sum + inv.amount, 0);

  const handleStake = async () => {
    if (!stakeAmount || parseFloat(stakeAmount) <= 0) {
      return;
    }

    const success = await stakeUSDC(parseFloat(stakeAmount), parseInt(stakeDuration));
    if (success) {
      setStakeAmount('');
      setShowStakeModal(false);
    }
  };

  const expectedYield = calculateYield(parseFloat(stakeAmount) || 0, parseInt(stakeDuration));

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8">
          <div className="relative mb-8">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <span className="text-white font-bold text-3xl">Z</span>
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
              <Zap className="h-4 w-4 text-yellow-800" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4">
            Welcome to Zenith
          </h1>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Connect your Freighter wallet to access the tokenized invoice financing marketplace
          </p>
          <button
            onClick={connectWallet}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Connecting to Freighter...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <Wallet className="h-5 w-5 mr-3" />
                Connect Freighter Wallet
              </div>
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 min-h-[calc(100vh-5rem)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl p-8 text-white">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
          <div>
            <h1 className="text-4xl font-bold mb-3">Welcome Back! 👋</h1>
            <p className="text-xl text-blue-100 mb-4">
              Manage your invoices, stake USDC, and track your earnings
            </p>
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center">
                <Target className="h-5 w-5 mr-2" />
                <span>10% APR Available</span>
              </div>
              <div className="flex items-center">
                <Award className="h-5 w-5 mr-2" />
                <span>Instant Liquidity</span>
              </div>
            </div>
          </div>
          <div className="mt-6 lg:mt-0">
            <Link
              to="/create-invoice"
              className="bg-white text-purple-600 hover:bg-gray-100 font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Invoice
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">USDC Balance</p>
              <p className="text-3xl font-bold text-gray-900">{usdcBalance.toFixed(2)}</p>
              <p className="text-sm text-green-600 font-medium">Available</p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <DollarSign className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Staked Amount</p>
              <p className="text-3xl font-bold text-gray-900">{stakedAmount.toFixed(2)}</p>
              <p className="text-sm text-blue-600 font-medium">Earning 10% APR</p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Coins className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Open Invoices</p>
              <p className="text-3xl font-bold text-gray-900">{totalOpenInvoices}</p>
              <p className="text-sm text-purple-600 font-medium">Investment Opportunities</p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <FileText className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Total Value</p>
              <p className="text-3xl font-bold text-gray-900">${totalInvoiceValue.toLocaleString()}</p>
              <p className="text-sm text-orange-600 font-medium">Market Size</p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Stake USDC */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 hover:shadow-3xl transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Stake USDC</h2>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Coins className="h-6 w-6 text-white" />
            </div>
          </div>
          <p className="text-gray-600 mb-6 text-lg">
            Stake your USDC to earn yield from invoice financing
          </p>
          <div className="space-y-4 mb-8">
            <div className="flex justify-between text-lg">
              <span className="text-gray-600">Current APR</span>
              <span className="font-bold text-green-600">10.0%</span>
            </div>
            <div className="flex justify-between text-lg">
              <span className="text-gray-600">Your Staked</span>
              <span className="font-bold text-gray-900">{stakedAmount.toFixed(2)} USDC</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full">
              <div 
                className="h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((stakedAmount / 10000) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
          <button
            onClick={() => setShowStakeModal(true)}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Stake USDC
          </button>
        </div>

        {/* Create Invoice */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 hover:shadow-3xl transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Create Invoice</h2>
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <FileText className="h-6 w-6 text-white" />
            </div>
          </div>
          <p className="text-gray-600 mb-6 text-lg">
            Tokenize your unpaid invoices for immediate funding
          </p>
          <div className="space-y-4 mb-8">
            <div className="flex justify-between text-lg">
              <span className="text-gray-600">Funding Rate</span>
              <span className="font-bold text-green-600">95% of face value</span>
            </div>
            <div className="flex justify-between text-lg">
              <span className="text-gray-600">Processing Time</span>
              <span className="font-bold text-gray-900">~2 minutes</span>
            </div>
            <div className="bg-green-50 rounded-xl p-4">
              <div className="flex items-center text-green-700">
                <Zap className="h-5 w-5 mr-2" />
                <span className="font-medium">Instant liquidity available</span>
              </div>
            </div>
          </div>
          <Link
            to="/create-invoice"
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Invoice
          </Link>
        </div>
      </div>

      {/* Open Invoices Section */}
      <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Investment Opportunities</h2>
            <p className="text-gray-600">Discover and invest in tokenized invoices</p>
          </div>
          <Link
            to="/open-invoices"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center"
          >
            View All <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </div>

        {openInvoices.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FileText className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No open invoices yet</h3>
            <p className="text-gray-600">Be the first to create an invoice and attract investors!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {openInvoices.slice(0, 3).map((invoice) => (
              <div key={invoice.id} className="border border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                      <FileText className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{invoice.id}</h3>
                      <p className="text-sm text-gray-500">{invoice.customerName}</p>
                    </div>
                  </div>
                  {invoice.esgFlag && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      ESG
                    </span>
                  )}
                </div>
                
                <p className="text-gray-600 mb-4 line-clamp-2">{invoice.description}</p>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Amount</span>
                    <span className="font-bold text-gray-900">${invoice.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Expected Return</span>
                    <span className="font-bold text-green-600">${invoice.expectedReturn.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      {Math.ceil((new Date(invoice.deadline) - new Date()) / (1000 * 60 * 60 * 24))} days
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-blue-600 group-hover:text-blue-700" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Link
          to="/open-invoices"
          className="bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-2xl p-6 transition-all duration-300 border border-blue-200 group"
        >
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <BarChart3 className="h-7 w-7 text-white" />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-lg">Explore Investments</p>
              <p className="text-sm text-gray-600">Browse opportunities</p>
            </div>
          </div>
        </Link>

        <Link
          to="/pay-invoice"
          className="bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 rounded-2xl p-6 transition-all duration-300 border border-green-200 group"
        >
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <CheckCircle className="h-7 w-7 text-white" />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-lg">Pay Invoice</p>
              <p className="text-sm text-gray-600">Complete payments</p>
            </div>
          </div>
        </Link>

        <Link
          to="/withdraw"
          className="bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 rounded-2xl p-6 transition-all duration-300 border border-purple-200 group"
        >
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <DollarSign className="h-7 w-7 text-white" />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-lg">Withdraw USDC</p>
              <p className="text-sm text-gray-600">Access your earnings</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Stake Modal - Improved Design */}
      {showStakeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Coins className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Stake USDC</h3>
              <p className="text-gray-600 mt-2">Start earning yield on your USDC</p>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Amount to Stake
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    max={usdcBalance}
                    min="0"
                    step="0.01"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors text-lg"
                    placeholder="Enter amount"
                  />
                  <div className="absolute right-3 top-3 text-gray-500 font-medium">USDC</div>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Available: {usdcBalance.toFixed(2)} USDC
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Stake Duration
                </label>
                <select
                  value={stakeDuration}
                  onChange={(e) => setStakeDuration(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors text-lg"
                >
                  <option value="30">30 days (10% APR)</option>
                  <option value="60">60 days (11% APR)</option>
                  <option value="90">90 days (12% APR)</option>
                  <option value="180">180 days (15% APR)</option>
                </select>
              </div>

              {stakeAmount && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">Expected Yield</p>
                    <p className="text-3xl font-bold text-green-600">
                      {expectedYield.toFixed(4)} USDC
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Total return after {stakeDuration} days
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex space-x-4 mt-8">
              <button
                onClick={() => setShowStakeModal(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-6 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleStake}
                disabled={!stakeAmount || parseFloat(stakeAmount) <= 0 || parseFloat(stakeAmount) > usdcBalance || isLoading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Staking...
                  </div>
                ) : (
                  'Stake USDC'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default Dashboard; 