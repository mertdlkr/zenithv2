import React, { useState } from 'react';
import { useInvoice } from '../contexts/InvoiceContext';
import { useWallet } from '../contexts/WalletContext';
import { 
  FileText, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  Filter,
  Search,
  Globe,
  Shield,
  RefreshCw,
  Calendar,
  Building,
  User,
  ArrowRight,
  MapPin,
  Award,
  Leaf,
  Zap,
  Star,
  ArrowUpRight
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

const OpenInvoices = () => {
  const { getOpenInvoices, calculateProjectedIncome } = useInvoice();
  const { stakedAmount } = useWallet();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCountry, setFilterCountry] = useState('');
  const [filterESG, setFilterESG] = useState(false);
  const [filterRecurring, setFilterRecurring] = useState(false);
  const [sortBy, setSortBy] = useState('amount');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const openInvoices = getOpenInvoices();

  // Filter and sort invoices
  const filteredInvoices = openInvoices
    .filter(invoice => {
      const matchesSearch = invoice.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           invoice.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCountry = !filterCountry || invoice.country === filterCountry;
      const matchesESG = !filterESG || invoice.esgFlag;
      const matchesRecurring = !filterRecurring || invoice.isRecurring;
      const matchesIndustry = selectedIndustry === 'all' || invoice.industry === selectedIndustry;
      return matchesSearch && matchesCountry && matchesESG && matchesRecurring && matchesIndustry;
    })
    .sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'amount':
          aValue = a.amount;
          bValue = b.amount;
          break;
        case 'deadline':
          aValue = new Date(a.deadline);
          bValue = new Date(b.deadline);
          break;
        case 'return':
          aValue = a.expectedReturn;
          bValue = b.expectedReturn;
          break;
        case 'created':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        default:
          aValue = a.amount;
          bValue = b.amount;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const totalValue = filteredInvoices.reduce((sum, inv) => sum + inv.amount, 0);
  const averageReturn = filteredInvoices.length > 0 
    ? filteredInvoices.reduce((sum, inv) => sum + inv.expectedReturn, 0) / filteredInvoices.length 
    : 0;

  const countries = [...new Set(openInvoices.map(invoice => invoice.country))];
  const totalStaked = 100000; // Mock total staked amount for demo

  const getStatusColor = (invoice) => {
    const daysLeft = Math.ceil((new Date(invoice.deadline) - new Date()) / (1000 * 60 * 60 * 24));
    if (daysLeft <= 7) return 'text-red-600 bg-red-100';
    if (daysLeft <= 30) return 'text-orange-600 bg-orange-100';
    return 'text-green-600 bg-green-100';
  };

  const getYieldRate = (invoice) => {
    const daysLeft = Math.ceil((new Date(invoice.deadline) - new Date()) / (1000 * 60 * 60 * 24));
    return Math.min(15, 3 + daysLeft * 0.1);
  };

  const industries = ['all', 'technology', 'healthcare', 'manufacturing', 'retail', 'services'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl p-8 text-white mb-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
          <div>
            <h1 className="text-4xl font-bold mb-3">Investment Opportunities 📈</h1>
            <p className="text-xl text-blue-100 mb-4">
              Discover tokenized invoices and start earning yield
            </p>
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                <span>High-Quality Assets</span>
              </div>
              <div className="flex items-center">
                <Zap className="h-5 w-5 mr-2" />
                <span>Instant Liquidity</span>
              </div>
              <div className="flex items-center">
                <Award className="h-5 w-5 mr-2" />
                <span>Verified Invoices</span>
              </div>
            </div>
          </div>
          <div className="mt-6 lg:mt-0 text-right">
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-4">
              <div className="text-3xl font-bold">{filteredInvoices.length}</div>
              <div className="text-blue-100">Open Opportunities</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Total Value Available</p>
              <p className="text-3xl font-bold text-gray-900">${totalValue.toLocaleString()}</p>
              <p className="text-sm text-green-600 font-medium">Investment Pool</p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center">
              <DollarSign className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Average Return</p>
              <p className="text-3xl font-bold text-gray-900">${averageReturn.toFixed(2)}</p>
              <p className="text-sm text-blue-600 font-medium">Expected Yield</p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">ESG Opportunities</p>
              <p className="text-3xl font-bold text-gray-900">
                {openInvoices.filter(inv => inv.esgFlag).length}
              </p>
              <p className="text-sm text-green-600 font-medium">Sustainable Investments</p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl flex items-center justify-center">
              <Leaf className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 mb-12">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by invoice ID, customer, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-lg"
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 font-semibold px-6 py-4 rounded-2xl transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <Filter className="h-5 w-5" />
            <span>Filters</span>
          </button>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Sort By */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors text-lg"
                >
                  <option value="amount">Amount (High to Low)</option>
                  <option value="deadline">Deadline (Earliest First)</option>
                  <option value="return">Expected Return (High to Low)</option>
                </select>
              </div>

              {/* Industry Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Industry</label>
                <select
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors text-lg"
                >
                  {industries.map(industry => (
                    <option key={industry} value={industry}>
                      {industry === 'all' ? 'All Industries' : industry.charAt(0).toUpperCase() + industry.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* ESG Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Sustainability</label>
                <label className="flex items-center p-4 bg-green-50 rounded-xl border-2 border-green-200 cursor-pointer hover:bg-green-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={filterESG}
                    onChange={(e) => setFilterESG(e.target.checked)}
                    className="w-5 h-5 text-green-600 border-2 border-green-300 rounded focus:ring-green-500"
                  />
                  <div className="ml-3 flex items-center">
                    <Leaf className="h-5 w-5 text-green-600 mr-2" />
                    <span className="text-green-700 font-medium">ESG Compliant Only</span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">
          {filteredInvoices.length} Investment{filteredInvoices.length !== 1 ? 's' : ''} Available
        </h2>
        <div className="text-gray-600">
          Total Value: <span className="font-bold text-gray-900">${totalValue.toLocaleString()}</span>
        </div>
      </div>

      {/* Invoice Cards */}
      {filteredInvoices.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-2xl p-12 text-center border border-gray-100">
          <div className="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Search className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-3">No invoices found</h3>
          <p className="text-gray-600 text-lg">
            Try adjusting your search criteria or filters to find more opportunities.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredInvoices.map((invoice) => {
            const daysLeft = Math.ceil((new Date(invoice.deadline) - new Date()) / (1000 * 60 * 60 * 24));
            const projectedIncome = calculateProjectedIncome(invoice.amount, stakedAmount, totalStaked);
            const yieldRate = getYieldRate(invoice);

            return (
              <div key={invoice.id} className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300 group cursor-pointer transform hover:-translate-y-1">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <DollarSign className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{invoice.id}</h3>
                      <p className="text-gray-600">{invoice.customerName}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    {invoice.esgFlag && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-200">
                        <Leaf className="h-3 w-3 mr-1" />
                        ESG
                      </span>
                    )}
                    <ArrowUpRight className="h-5 w-5 text-blue-600 group-hover:text-blue-700 group-hover:scale-110 transition-all duration-300" />
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-700 mb-6 text-lg leading-relaxed line-clamp-3">
                  {invoice.description}
                </p>

                {/* Amount Section */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-6 border border-blue-200">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                      ${invoice.amount.toLocaleString()}
                    </div>
                    <div className="text-blue-600 font-semibold">Invoice Amount</div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Expected Return</span>
                    <span className="text-2xl font-bold text-green-600">
                      +${invoice.expectedReturn.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Yield Rate</span>
                    <span className="text-lg font-bold text-blue-600">
                      {((invoice.expectedReturn / invoice.amount) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center text-gray-600 font-medium">
                      <Clock className="h-4 w-4 mr-2" />
                      Time to Maturity
                    </span>
                    <span className="font-bold text-gray-900">
                      {daysLeft} days
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center text-gray-600 font-medium">
                      <MapPin className="h-4 w-4 mr-2" />
                      Industry
                    </span>
                    <span className="font-bold text-gray-900 capitalize">
                      {invoice.industry || 'Technology'}
                    </span>
                  </div>
                </div>

                {/* Trust Score */}
                <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-2xl">
                  <span className="text-gray-600 font-medium">Trust Score</span>
                  <div className="flex items-center space-x-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < (invoice.trustScore || 4) 
                              ? 'text-yellow-400 fill-current' 
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-bold text-gray-900">
                      {invoice.trustScore || 4.2}/5
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => {
                    setSelectedInvoice(invoice);
                  }}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 group-hover:scale-105"
                >
                  Invest Now
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Invoice Detail Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-8">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                    <DollarSign className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedInvoice.id}</h2>
                    <p className="text-gray-600">{selectedInvoice.customerName}</p>
                  </div>
                  <div className="flex space-x-2">
                    {selectedInvoice.esgFlag && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-200">
                        <Leaf className="h-3 w-3 mr-1" />
                        ESG
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Amount Highlight */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8 mb-8 text-center border border-blue-200">
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  ${selectedInvoice.amount.toLocaleString()}
                </div>
                <div className="text-blue-600 font-semibold mb-4">Invoice Amount</div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      +${selectedInvoice.expectedReturn.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-600">Expected Return</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {((selectedInvoice.expectedReturn / selectedInvoice.amount) * 100).toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-600">Yield Rate</div>
                  </div>
                </div>
              </div>

              {/* Invoice Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
                    <h3 className="font-bold text-gray-900 mb-4 text-lg">Financial Details</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">Invoice Amount:</span>
                        <span className="font-bold text-gray-900">${selectedInvoice.amount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">Offer Amount:</span>
                        <span className="font-bold text-green-600">${(selectedInvoice.offerAmount || selectedInvoice.amount * 0.95).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">Expected Return:</span>
                        <span className="font-bold text-blue-600">${selectedInvoice.expectedReturn.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">Currency:</span>
                        <span className="font-bold text-gray-900">{selectedInvoice.currency || 'USDC'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
                    <h3 className="font-bold text-gray-900 mb-4 text-lg">Timeline</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">Created:</span>
                        <span className="font-bold text-gray-900">{format(new Date(selectedInvoice.createdAt || new Date()), 'MMM dd, yyyy')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">Deadline:</span>
                        <span className="font-bold text-gray-900">{format(new Date(selectedInvoice.deadline), 'MMM dd, yyyy')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">Time Left:</span>
                        <span className="font-bold text-orange-600">{Math.ceil((new Date(selectedInvoice.deadline) - new Date()) / (1000 * 60 * 60 * 24))} days</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
                    <h3 className="font-bold text-gray-900 mb-4 text-lg">Customer & Location</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">Customer:</span>
                        <span className="font-bold text-gray-900">{selectedInvoice.customerName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">Country:</span>
                        <span className="font-bold text-gray-900">{selectedInvoice.country || 'United States'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">Industry:</span>
                        <span className="font-bold text-gray-900 capitalize">{selectedInvoice.industry || 'Technology'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
                    <h3 className="font-bold text-gray-900 mb-4 text-lg">Investment Details</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">Yield Rate:</span>
                        <span className="font-bold text-blue-600">{getYieldRate(selectedInvoice).toFixed(1)}%</span>
                      </div>
                      {stakedAmount > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600 font-medium">Your Projected Income:</span>
                          <span className="font-bold text-orange-600">
                            ${calculateProjectedIncome(selectedInvoice.amount, stakedAmount, totalStaked).toFixed(2)}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">Early Payment Discount:</span>
                        <span className="font-bold text-gray-900">{selectedInvoice.earlyPaymentDiscount || 2}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">Trust Score:</span>
                        <div className="flex items-center space-x-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < (selectedInvoice.trustScore || 4) 
                                    ? 'text-yellow-400 fill-current' 
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="font-bold text-gray-900">
                            {selectedInvoice.trustScore || 4.2}/5
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="font-bold text-gray-900 mb-4 text-lg">Description</h3>
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                  <p className="text-gray-700 leading-relaxed text-lg">{selectedInvoice.description}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-4 px-6 rounded-2xl transition-all duration-300"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    // This would open the investment flow
                    console.log('Invest in', selectedInvoice.id);
                  }}
                  className="flex-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Invest Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default OpenInvoices; 