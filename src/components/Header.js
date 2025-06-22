import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';
import { 
  Wallet, 
  Search, 
  FileText, 
  User, 
  ChevronDown,
  LogOut,
  Menu,
  X,
  Star
} from 'lucide-react';

const Header = () => {
  const location = useLocation();
  const { 
    isConnected, 
    publicKey, 
    usdcBalance, 
    stakedAmount, 
    connectWallet, 
    disconnectWallet,
    formatAddress,
    isLoading 
  } = useWallet();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Implement search functionality
      console.log('Searching for:', searchQuery);
    }
  };

  const navItems = [
    { path: '/', label: 'Dashboard', icon: null },
    { path: '/create-invoice', label: 'Create Invoice', icon: FileText },
    { path: '/open-invoices', label: 'Open Invoices', icon: null },
    { path: '/my-invoices', label: 'My Invoices', icon: User },
    { path: '/pay-invoice', label: 'Pay Invoice', icon: null },
    { path: '/withdraw', label: 'Withdraw', icon: null }
  ];

  return (
    <header className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">Z</span>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Star className="h-2 w-2 text-yellow-800" />
                </div>
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Zenith
                </span>
                <div className="text-xs text-gray-500 font-medium">Invoice Finance</div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search invoices..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-80 pl-12 pr-4 py-3 border-2 border-gray-200 rounded-2xl leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-sm"
              />
            </form>

            {/* Navigation Links */}
            <nav className="flex space-x-1">
              {navItems.slice(1, 4).map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-300 ${
                    location.pathname === item.path
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    {item.icon && <item.icon className="h-4 w-4" />}
                    <span>{item.label}</span>
                  </div>
                </Link>
              ))}
            </nav>

            {/* Wallet Info */}
            {isConnected && (
              <div className="flex items-center space-x-6">
                <div className="text-right">
                  <div className="font-bold text-gray-900 text-lg">
                    {stakedAmount.toFixed(2)} <span className="text-sm text-blue-600">USDC Staked</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Balance: <span className="font-semibold text-green-600">{usdcBalance.toFixed(2)} USDC</span>
                  </div>
                </div>
                
                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-3 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 rounded-2xl p-3 transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div className="hidden xl:block text-left">
                      <div className="text-sm font-semibold text-gray-700">
                        {formatAddress(publicKey)}
                      </div>
                      <div className="text-xs text-gray-500">Connected</div>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </button>

                  {/* User Dropdown */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl py-2 z-50 border border-gray-100">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">Connected Wallet</p>
                        <p className="text-xs text-gray-500 font-mono bg-gray-50 rounded-lg px-2 py-1 mt-1">
                          {formatAddress(publicKey)}
                        </p>
                      </div>
                      <Link
                        to="/my-invoices"
                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <FileText className="h-4 w-4 mr-3 text-gray-400" />
                        My Invoices
                      </Link>
                      <Link
                        to="/withdraw"
                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Wallet className="h-4 w-4 mr-3 text-gray-400" />
                        Withdraw Funds
                      </Link>
                      <button
                        onClick={() => {
                          disconnectWallet();
                          setShowUserMenu(false);
                        }}
                        className="flex items-center w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        Disconnect Wallet
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Connect Wallet Button */}
            {!isConnected && (
              <button
                onClick={connectWallet}
                disabled={isLoading}
                className="flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Wallet className="h-5 w-5" />
                <span>{isLoading ? 'Connecting...' : 'Connect Wallet'}</span>
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="inline-flex items-center justify-center p-3 rounded-xl text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors"
            >
              {showMobileMenu ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {showMobileMenu && (
          <div className="lg:hidden border-t border-gray-200 py-6 bg-white">
            <div className="space-y-3">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="relative px-1 mb-6">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search invoices..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-2xl leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:bg-white focus:border-blue-500 transition-all text-sm"
                />
              </form>

              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setShowMobileMenu(false)}
                  className={`block px-4 py-3 text-base font-semibold rounded-xl transition-colors ${
                    location.pathname === item.path
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {item.icon && <item.icon className="h-5 w-5" />}
                    <span>{item.label}</span>
                  </div>
                </Link>
              ))}
              
              {/* Mobile wallet section */}
              <div className="border-t border-gray-200 pt-6 mt-6">
                {isConnected ? (
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 border border-blue-200">
                      <div className="text-center">
                        <div className="font-bold text-gray-900 text-lg mb-1">
                          {stakedAmount.toFixed(2)} USDC
                        </div>
                        <div className="text-sm text-blue-600 font-medium mb-2">Staked Amount</div>
                        <div className="text-sm text-gray-600">
                          Balance: <span className="font-semibold text-green-600">{usdcBalance.toFixed(2)} USDC</span>
                        </div>
                        <div className="text-xs text-gray-500 font-mono mt-2 bg-white rounded-lg px-2 py-1">
                          {formatAddress(publicKey)}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        disconnectWallet();
                        setShowMobileMenu(false);
                      }}
                      className="flex items-center justify-center space-x-2 w-full text-red-600 hover:bg-red-50 py-3 rounded-xl transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Disconnect Wallet</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      connectWallet();
                      setShowMobileMenu(false);
                    }}
                    disabled={isLoading}
                    className="flex items-center justify-center space-x-3 w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 rounded-2xl transition-all duration-300 disabled:opacity-50"
                  >
                    <Wallet className="h-5 w-5" />
                    <span>{isLoading ? 'Connecting...' : 'Connect Wallet'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header; 