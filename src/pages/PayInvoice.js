import React, { useState } from 'react';
import { useInvoice } from '../contexts/InvoiceContext';
import { useWallet } from '../contexts/WalletContext';
import { 
  CreditCard, 
  Wallet, 
  Clock, 
  DollarSign, 
  CheckCircle,
  AlertCircle,
  Calendar,
  Building,
  Globe,
  Gift,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { format, formatDistanceToNow, isBefore } from 'date-fns';

const PayInvoice = () => {
  const { getInvoicesForPayment, payInvoice, isLoading } = useInvoice();
  const { isConnected, usdcBalance } = useWallet();
  
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('wallet');
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const invoicesForPayment = getInvoicesForPayment();

  const handlePayment = async () => {
    if (!selectedInvoice) return;

    const success = await payInvoice(selectedInvoice.id, paymentMethod);
    if (success) {
      setShowPaymentModal(false);
      setSelectedInvoice(null);
    }
  };

  const calculateEarlyPaymentDiscount = (invoice) => {
    const isEarly = isBefore(new Date(), invoice.deadline);
    if (isEarly && invoice.earlyPaymentDiscount > 0) {
      return invoice.amount * (invoice.earlyPaymentDiscount / 100);
    }
    return 0;
  };

  const getFinalAmount = (invoice) => {
    const discount = calculateEarlyPaymentDiscount(invoice);
    return invoice.amount - discount;
  };

  if (!isConnected) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Wallet className="h-8 w-8 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Wallet Not Connected</h2>
        <p className="text-gray-600">Please connect your Freighter wallet to pay invoices.</p>
      </div>
    );
  }

  return (
    <div className="space-y-16">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center mb-2">
          <CreditCard className="h-6 w-6 mr-2 text-primary-600" />
          Pay Invoice
        </h1>
        <p className="text-gray-600">
          Complete payments for your outstanding invoices and earn early payment discounts
        </p>
      </div>

      {/* Balance Info */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium mb-1">Your USDC Balance</h3>
            <p className="text-3xl font-bold">{usdcBalance.toFixed(2)} USDC</p>
          </div>
          <div className="text-right">
            <p className="text-primary-100 text-sm">Available for payments</p>
            <p className="text-xl font-semibold">Ready to pay</p>
          </div>
        </div>
      </div>

      {/* Invoices List */}
      {invoicesForPayment.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">All caught up!</h3>
          <p className="text-gray-600">You don't have any outstanding invoices to pay.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Outstanding Invoices</h2>
            <p className="text-sm text-gray-600 mb-4">
              Pay early to receive discounts and help businesses with their cash flow.
            </p>
          </div>

          {invoicesForPayment.map((invoice) => {
            const isEarly = isBefore(new Date(), invoice.deadline);
            const discount = calculateEarlyPaymentDiscount(invoice);
            const finalAmount = getFinalAmount(invoice);
            const daysLeft = Math.ceil((new Date(invoice.deadline) - new Date()) / (1000 * 60 * 60 * 24));

            return (
              <div key={invoice.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">{invoice.id}</h3>
                      {isEarly && discount > 0 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <Gift className="h-3 w-3 mr-1" />
                          Early Discount Available
                        </span>
                      )}
                      {daysLeft <= 7 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Due Soon
                        </span>
                      )}
                    </div>

                    <p className="text-gray-600 mb-3">{invoice.description}</p>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center text-gray-500">
                        <Building className="h-4 w-4 mr-1" />
                        {invoice.customerName}
                      </div>
                      <div className="flex items-center text-gray-500">
                        <Globe className="h-4 w-4 mr-1" />
                        {invoice.country}
                      </div>
                      <div className="flex items-center text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        Due {format(new Date(invoice.deadline), 'MMM dd, yyyy')}
                      </div>
                      <div className="flex items-center text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        {formatDistanceToNow(new Date(invoice.deadline), { addSuffix: true })}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col lg:items-end space-y-2">
                    <div className="text-right">
                      {discount > 0 ? (
                        <div>
                          <p className="text-sm text-gray-500 line-through">
                            ${invoice.amount.toLocaleString()}
                          </p>
                          <p className="text-xl font-bold text-green-600">
                            ${finalAmount.toLocaleString()}
                          </p>
                          <p className="text-sm text-green-600 font-medium">
                            Save ${discount.toFixed(2)} ({invoice.earlyPaymentDiscount}% discount)
                          </p>
                        </div>
                      ) : (
                        <p className="text-xl font-bold text-gray-900">
                          ${invoice.amount.toLocaleString()}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        setSelectedInvoice(invoice);
                        setShowPaymentModal(true);
                      }}
                      className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center"
                    >
                      Pay Now
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Pay Invoice {selectedInvoice.id}
              </h3>

              {/* Invoice Summary */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Customer:</span>
                    <span className="font-medium">{selectedInvoice.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Original Amount:</span>
                    <span className="font-medium">${selectedInvoice.amount.toLocaleString()}</span>
                  </div>
                  
                  {calculateEarlyPaymentDiscount(selectedInvoice) > 0 && (
                    <>
                      <div className="flex justify-between text-green-600">
                        <span className="text-sm">Early Payment Discount:</span>
                        <span className="font-medium">-${calculateEarlyPaymentDiscount(selectedInvoice).toFixed(2)}</span>
                      </div>
                      <hr className="my-2" />
                    </>
                  )}
                  
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total to Pay:</span>
                    <span className="text-primary-600">${getFinalAmount(selectedInvoice).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Choose Payment Method</h4>
                <div className="space-y-3">
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="wallet"
                      checked={paymentMethod === 'wallet'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="text-primary-600 focus:ring-primary-500"
                    />
                    <div className="ml-3 flex items-center justify-between w-full">
                      <div className="flex items-center">
                        <Wallet className="h-5 w-5 text-primary-600 mr-2" />
                        <div>
                          <p className="font-medium text-gray-900">Connected Wallet</p>
                          <p className="text-sm text-gray-500">Pay with your USDC balance</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {usdcBalance.toFixed(2)} USDC
                        </p>
                        <p className="text-xs text-gray-500">Available</p>
                      </div>
                    </div>
                  </label>

                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="fiat"
                      checked={paymentMethod === 'fiat'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="text-primary-600 focus:ring-primary-500"
                    />
                    <div className="ml-3 flex items-center">
                      <CreditCard className="h-5 w-5 text-green-600 mr-2" />
                      <div>
                        <p className="font-medium text-gray-900">Pay with Fiat</p>
                        <p className="text-sm text-gray-500">Bank transfer, card payment via Moonpay</p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Balance Warning */}
              {paymentMethod === 'wallet' && usdcBalance < getFinalAmount(selectedInvoice) && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-red-800">Insufficient Balance</p>
                      <p className="text-sm text-red-600">
                        You need ${(getFinalAmount(selectedInvoice) - usdcBalance).toFixed(2)} more USDC
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePayment}
                  disabled={
                    isLoading || 
                    (paymentMethod === 'wallet' && usdcBalance < getFinalAmount(selectedInvoice))
                  }
                  className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : paymentMethod === 'fiat' ? (
                    <>
                      Pay via Moonpay
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </>
                  ) : (
                    <>
                      <Wallet className="h-4 w-4 mr-2" />
                      Pay ${getFinalAmount(selectedInvoice).toLocaleString()}
                    </>
                  )}
                </button>
              </div>

              {/* Additional Info */}
              <div className="mt-4 text-xs text-gray-500 space-y-1">
                <p>• Payments are processed immediately on the blockchain</p>
                <p>• Early payment discounts are applied automatically</p>
                <p>• Transaction fees may apply depending on network conditions</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayInvoice; 