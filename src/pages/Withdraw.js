import React, { useState } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { 
  DollarSign, 
  AlertTriangle, 
  Calendar, 
  TrendingUp, 
  Clock,
  CheckCircle,
  Info,
  ArrowRight,
  Coins
} from 'lucide-react';
import { format, addDays, isBefore, formatDistanceToNow } from 'date-fns';

const Withdraw = () => {
  const { 
    isConnected, 
    stakedAmount, 
    calculateYield, 
    isLoading 
  } = useWallet();
  
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Mock staking data for demonstration
  const mockStakes = [
    {
      id: 1,
      amount: 1000,
      duration: 30,
      stakeDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
      maturityDate: addDays(new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), 30),
      apr: 10
    },
    {
      id: 2,
      amount: 2500,
      duration: 60,
      stakeDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000), // 25 days ago
      maturityDate: addDays(new Date(Date.now() - 25 * 24 * 60 * 60 * 1000), 60),
      apr: 12
    }
  ];

  const totalStaked = mockStakes.reduce((sum, stake) => sum + stake.amount, 0);
  const totalEarned = mockStakes.reduce((sum, stake) => {
    const daysStaked = Math.floor((new Date() - stake.stakeDate) / (1000 * 60 * 60 * 24));
    return sum + calculateYield(stake.amount, Math.min(daysStaked, stake.duration));
  }, 0);

  const calculatePenalty = (amount) => {
    const earlyWithdrawals = mockStakes.filter(stake => 
      isBefore(new Date(), stake.maturityDate) && 
      amount > 0
    );
    
    if (earlyWithdrawals.length === 0) return 0;
    
    // 10% penalty for early withdrawal
    return Math.min(amount, totalStaked) * 0.10;
  };

  const calculateAvailableAmount = () => {
    const maturedStakes = mockStakes.filter(stake => 
      !isBefore(new Date(), stake.maturityDate)
    );
    return maturedStakes.reduce((sum, stake) => sum + stake.amount, 0);
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount) return;

    const amount = parseFloat(withdrawAmount);
    const penalty = calculatePenalty(amount);
    const finalAmount = amount - penalty;

    // Simulate withdrawal process
    console.log('Withdrawing:', finalAmount, 'USDC with penalty:', penalty);
    
    // Here you would call the actual withdrawal function
    // const success = await withdrawUSDC(amount);
    
    setShowConfirmModal(false);
    setWithdrawAmount('');
  };

  const availableAmount = calculateAvailableAmount();
  const penalty = calculatePenalty(parseFloat(withdrawAmount) || 0);
  const finalAmount = Math.max(0, (parseFloat(withdrawAmount) || 0) - penalty);

  if (!isConnected) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <DollarSign className="h-8 w-8 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Wallet Not Connected</h2>
        <p className="text-gray-600">Please connect your Freighter wallet to withdraw funds.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-16">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center mb-2">
          <DollarSign className="h-6 w-6 mr-2 text-primary-600" />
          Withdraw USDC
        </h1>
        <p className="text-gray-600">
          Withdraw your staked USDC and earned yields. Note that early withdrawals may incur penalties.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Staking Overview */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Staked</p>
                  <p className="text-2xl font-bold text-gray-900">{totalStaked.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">USDC</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Coins className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Earned</p>
                  <p className="text-2xl font-bold text-green-600">{totalEarned.toFixed(4)}</p>
                  <p className="text-sm text-gray-500">USDC</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Available Now</p>
                  <p className="text-2xl font-bold text-primary-600">{availableAmount.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">USDC</p>
                </div>
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-primary-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Active Stakes */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Active Stakes</h2>
            <div className="space-y-4">
              {mockStakes.map((stake) => {
                const isMatured = !isBefore(new Date(), stake.maturityDate);
                const daysStaked = Math.floor((new Date() - stake.stakeDate) / (1000 * 60 * 60 * 24));
                const currentYield = calculateYield(stake.amount, Math.min(daysStaked, stake.duration));
                
                return (
                  <div key={stake.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-medium text-gray-900">
                            Stake #{stake.id} - {stake.amount.toLocaleString()} USDC
                          </h3>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            isMatured 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {isMatured ? 'Matured' : 'Active'}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div>
                            <p className="font-medium">Staked Date</p>
                            <p>{format(stake.stakeDate, 'MMM dd, yyyy')}</p>
                          </div>
                          <div>
                            <p className="font-medium">Maturity Date</p>
                            <p>{format(stake.maturityDate, 'MMM dd, yyyy')}</p>
                          </div>
                          <div>
                            <p className="font-medium">APR</p>
                            <p>{stake.apr}%</p>
                          </div>
                          <div>
                            <p className="font-medium">Current Yield</p>
                            <p className="text-green-600 font-semibold">{currentYield.toFixed(4)} USDC</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        {isMatured ? (
                          <div className="text-green-600">
                            <CheckCircle className="h-5 w-5 inline mr-1" />
                            <span className="font-medium">Ready to withdraw</span>
                          </div>
                        ) : (
                          <div className="text-yellow-600">
                            <Clock className="h-5 w-5 inline mr-1" />
                            <span className="font-medium">
                              {formatDistanceToNow(stake.maturityDate, { addSuffix: true })}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Withdraw Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Withdraw Funds</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount to Withdraw
                </label>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  max={totalStaked}
                  min="0"
                  step="0.01"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter amount"
                />
                <div className="flex justify-between mt-1 text-xs text-gray-500">
                  <span>Max: {totalStaked.toFixed(2)} USDC</span>
                  <button
                    onClick={() => setWithdrawAmount(availableAmount.toString())}
                    className="text-primary-600 hover:text-primary-700"
                  >
                    Use Available ({availableAmount.toFixed(2)})
                  </button>
                </div>
              </div>

              {withdrawAmount && (
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Withdrawal Amount:</span>
                    <span className="font-medium">{parseFloat(withdrawAmount).toFixed(2)} USDC</span>
                  </div>
                  
                  {penalty > 0 && (
                    <div className="flex justify-between text-sm text-red-600">
                      <span>Early Withdrawal Penalty (10%):</span>
                      <span className="font-medium">-{penalty.toFixed(2)} USDC</span>
                    </div>
                  )}
                  
                  <hr className="my-2" />
                  
                  <div className="flex justify-between text-sm font-semibold">
                    <span>You'll Receive:</span>
                    <span className="text-green-600">{finalAmount.toFixed(2)} USDC</span>
                  </div>
                </div>
              )}

              {penalty > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-800">Early Withdrawal Penalty</p>
                      <p className="text-sm text-red-600">
                        Withdrawing before maturity incurs a 10% penalty on the early withdrawal amount.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={() => setShowConfirmModal(true)}
                disabled={!withdrawAmount || parseFloat(withdrawAmount) <= 0 || parseFloat(withdrawAmount) > totalStaked}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Withdraw USDC
              </button>
            </div>

            {/* Info Box */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-start">
                <Info className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-800">Withdrawal Info</p>
                  <ul className="text-sm text-blue-600 mt-1 space-y-1">
                    <li>• Matured stakes can be withdrawn without penalty</li>
                    <li>• Early withdrawals incur a 10% penalty</li>
                    <li>• Yields are calculated up to withdrawal time</li>
                    <li>• Processing time: ~1-2 minutes</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Confirm Withdrawal
              </h3>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Withdrawal Amount:</span>
                    <span className="font-medium">{parseFloat(withdrawAmount).toFixed(2)} USDC</span>
                  </div>
                  
                  {penalty > 0 && (
                    <div className="flex justify-between text-red-600">
                      <span className="text-sm">Early Withdrawal Penalty:</span>
                      <span className="font-medium">-{penalty.toFixed(2)} USDC</span>
                    </div>
                  )}
                  
                  <hr className="my-2" />
                  
                  <div className="flex justify-between text-lg font-bold">
                    <span>You'll Receive:</span>
                    <span className="text-green-600">{finalAmount.toFixed(2)} USDC</span>
                  </div>
                </div>
              </div>

              {penalty > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                    <p className="text-sm text-red-800">
                      This withdrawal includes early withdrawal penalty. Consider waiting for maturity to avoid fees.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleWithdraw}
                  disabled={isLoading}
                  className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      Confirm Withdrawal
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Withdraw; 