import React, { useState } from 'react';
import { useInvoice } from '../contexts/InvoiceContext';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  DollarSign, 
  Calendar, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Upload, 
  AlertCircle,
  CheckCircle,
  Leaf,
  Star,
  Zap,
  Calculator,
  Award,
  TrendingUp
} from 'lucide-react';

const CreateInvoice = () => {
  const { createInvoice } = useInvoice();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    amount: '',
    currency: 'USDC',
    deadline: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerAddress: '',
    description: '',
    esgFlag: false,
    earlyPaymentDiscount: '2',
    industry: 'technology',
    file: null
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setErrors(prev => ({ ...prev, file: 'File size must be less than 10MB' }));
        return;
      }
      setFormData(prev => ({ ...prev, file }));
      setErrors(prev => ({ ...prev, file: '' }));
    }
  };

  const validateStep = (stepNumber) => {
    const newErrors = {};
    
    if (stepNumber === 1) {
      if (!formData.amount || parseFloat(formData.amount) <= 0) {
        newErrors.amount = 'Please enter a valid amount';
      }
      if (!formData.deadline) {
        newErrors.deadline = 'Please select a deadline';
      } else {
        const selectedDate = new Date(formData.deadline);
        const today = new Date();
        if (selectedDate <= today) {
          newErrors.deadline = 'Deadline must be in the future';
        }
      }
      if (!formData.description.trim()) {
        newErrors.description = 'Please provide a description';
      }
    }
    
    if (stepNumber === 2) {
      if (!formData.customerName.trim()) {
        newErrors.customerName = 'Customer name is required';
      }
      if (!formData.customerEmail.trim()) {
        newErrors.customerEmail = 'Customer email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.customerEmail)) {
        newErrors.customerEmail = 'Please enter a valid email address';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(2)) return;
    
    setIsSubmitting(true);
    
    try {
      const invoiceData = {
        ...formData,
        amount: parseFloat(formData.amount),
        earlyPaymentDiscount: parseFloat(formData.earlyPaymentDiscount),
        expectedReturn: parseFloat(formData.amount) * 0.05, // 5% return
        offerAmount: parseFloat(formData.amount) * 0.95, // 95% of face value
        trustScore: 4.2,
        country: 'United States'
      };
      
      const success = await createInvoice(invoiceData);
      
      if (success) {
        navigate('/my-invoices');
      } else {
        setErrors({ submit: 'Failed to create invoice. Please try again.' });
      }
    } catch (error) {
      setErrors({ submit: 'An error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const expectedReturn = formData.amount ? (parseFloat(formData.amount) * 0.05).toFixed(2) : '0.00';
  const offerAmount = formData.amount ? (parseFloat(formData.amount) * 0.95).toFixed(2) : '0.00';
  const processingFee = formData.amount ? (parseFloat(formData.amount) * 0.02).toFixed(2) : '0.00';

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
              {/* Hero Section */}
        <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-3xl shadow-2xl p-8 text-white">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
          <div>
            <h1 className="text-4xl font-bold mb-3">Create Invoice NFT 🚀</h1>
            <p className="text-xl text-green-100 mb-4">
              Transform your unpaid invoice into a tradeable NFT for instant liquidity
            </p>
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center">
                <Zap className="h-5 w-5 mr-2" />
                <span>Instant Funding</span>
              </div>
              <div className="flex items-center">
                <Award className="h-5 w-5 mr-2" />
                <span>95% of Face Value</span>
              </div>
              <div className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                <span>Blockchain Secured</span>
              </div>
            </div>
          </div>
          <div className="mt-6 lg:mt-0 text-right">
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-4">
              <div className="text-3xl font-bold">Step {step}/2</div>
              <div className="text-green-100">Create Process</div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className={`flex items-center space-x-3 ${step >= 1 ? 'text-green-600' : 'text-gray-400'}`}>
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${step >= 1 ? 'bg-green-100' : 'bg-gray-100'}`}>
              <FileText className="h-5 w-5" />
            </div>
            <span className="font-semibold">Invoice Details</span>
          </div>
          <div className="flex-1 mx-4">
            <div className="h-2 bg-gray-200 rounded-full">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${step >= 2 ? 'bg-green-500' : 'bg-gray-300'}`}
                style={{ width: step >= 2 ? '100%' : '0%' }}
              ></div>
            </div>
          </div>
          <div className={`flex items-center space-x-3 ${step >= 2 ? 'text-green-600' : 'text-gray-400'}`}>
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${step >= 2 ? 'bg-green-100' : 'bg-gray-100'}`}>
              <User className="h-5 w-5" />
            </div>
            <span className="font-semibold">Customer Info</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
            <form onSubmit={handleSubmit}>
              {step === 1 && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Invoice Details</h2>
                    
                    {/* Amount & Currency */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-gray-700 mb-3">
                          Invoice Amount *
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <DollarSign className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="number"
                            name="amount"
                            value={formData.amount}
                            onChange={handleInputChange}
                            min="1"
                            step="0.01"
                            className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl text-lg font-semibold focus:outline-none focus:ring-4 transition-all ${
                              errors.amount 
                                ? 'border-red-300 focus:border-red-500 focus:ring-red-100' 
                                : 'border-gray-200 focus:border-green-500 focus:ring-green-100'
                            }`}
                            placeholder="Enter amount"
                          />
                        </div>
                        {errors.amount && (
                          <p className="mt-2 text-sm text-red-600 flex items-center">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            {errors.amount}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3">
                          Currency
                        </label>
                        <select
                          name="currency"
                          value={formData.currency}
                          onChange={handleInputChange}
                          className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl text-lg font-semibold focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all"
                        >
                          <option value="USDC">USDC</option>
                          <option value="XLM">XLM</option>
                        </select>
                      </div>
                    </div>

                    {/* Deadline */}
                    <div className="mb-8">
                      <label className="block text-sm font-bold text-gray-700 mb-3">
                        Payment Deadline *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Calendar className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="date"
                          name="deadline"
                          value={formData.deadline}
                          onChange={handleInputChange}
                          min={new Date().toISOString().split('T')[0]}
                          className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl text-lg font-semibold focus:outline-none focus:ring-4 transition-all ${
                            errors.deadline 
                              ? 'border-red-300 focus:border-red-500 focus:ring-red-100' 
                              : 'border-gray-200 focus:border-green-500 focus:ring-green-100'
                          }`}
                        />
                      </div>
                      {errors.deadline && (
                        <p className="mt-2 text-sm text-red-600 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {errors.deadline}
                        </p>
                      )}
                    </div>

                    {/* Industry */}
                    <div className="mb-8">
                      <label className="block text-sm font-bold text-gray-700 mb-3">
                        Industry
                      </label>
                      <select
                        name="industry"
                        value={formData.industry}
                        onChange={handleInputChange}
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl text-lg font-semibold focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all"
                      >
                        <option value="technology">Technology</option>
                        <option value="healthcare">Healthcare</option>
                        <option value="manufacturing">Manufacturing</option>
                        <option value="retail">Retail</option>
                        <option value="services">Services</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    {/* Description */}
                    <div className="mb-8">
                      <label className="block text-sm font-bold text-gray-700 mb-3">
                        Invoice Description *
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={4}
                        className={`w-full px-4 py-4 border-2 rounded-2xl text-lg resize-none focus:outline-none focus:ring-4 transition-all ${
                          errors.description 
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-100' 
                            : 'border-gray-200 focus:border-green-500 focus:ring-green-100'
                        }`}
                        placeholder="Describe the goods or services provided..."
                      />
                      {errors.description && (
                        <p className="mt-2 text-sm text-red-600 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {errors.description}
                        </p>
                      )}
                    </div>

                    {/* ESG & Discount */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3">
                          Early Payment Discount (%)
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Calculator className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="number"
                            name="earlyPaymentDiscount"
                            value={formData.earlyPaymentDiscount}
                            onChange={handleInputChange}
                            min="0"
                            max="10"
                            step="0.1"
                            className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl text-lg font-semibold focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3">
                          Sustainability
                        </label>
                        <label className="flex items-center p-4 bg-green-50 rounded-2xl border-2 border-green-200 cursor-pointer hover:bg-green-100 transition-colors">
                          <input
                            type="checkbox"
                            name="esgFlag"
                            checked={formData.esgFlag}
                            onChange={handleInputChange}
                            className="w-5 h-5 text-green-600 border-2 border-green-300 rounded focus:ring-green-500"
                          />
                          <div className="ml-3 flex items-center">
                            <Leaf className="h-5 w-5 text-green-600 mr-2" />
                            <span className="text-green-700 font-medium">ESG Compliant</span>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleNext}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center"
                    >
                      Next Step
                      <FileText className="h-5 w-5 ml-2" />
                    </button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Information</h2>
                    
                    {/* Customer Name */}
                    <div className="mb-6">
                      <label className="block text-sm font-bold text-gray-700 mb-3">
                        Customer/Company Name *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="customerName"
                          value={formData.customerName}
                          onChange={handleInputChange}
                          className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl text-lg font-semibold focus:outline-none focus:ring-4 transition-all ${
                            errors.customerName 
                              ? 'border-red-300 focus:border-red-500 focus:ring-red-100' 
                              : 'border-gray-200 focus:border-green-500 focus:ring-green-100'
                          }`}
                          placeholder="Enter customer name"
                        />
                      </div>
                      {errors.customerName && (
                        <p className="mt-2 text-sm text-red-600 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {errors.customerName}
                        </p>
                      )}
                    </div>

                    {/* Contact Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3">
                          Email Address *
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="email"
                            name="customerEmail"
                            value={formData.customerEmail}
                            onChange={handleInputChange}
                            className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl text-lg font-semibold focus:outline-none focus:ring-4 transition-all ${
                              errors.customerEmail 
                                ? 'border-red-300 focus:border-red-500 focus:ring-red-100' 
                                : 'border-gray-200 focus:border-green-500 focus:ring-green-100'
                            }`}
                            placeholder="customer@example.com"
                          />
                        </div>
                        {errors.customerEmail && (
                          <p className="mt-2 text-sm text-red-600 flex items-center">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            {errors.customerEmail}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3">
                          Phone Number
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Phone className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="tel"
                            name="customerPhone"
                            value={formData.customerPhone}
                            onChange={handleInputChange}
                            className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl text-lg font-semibold focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all"
                            placeholder="+1 (555) 123-4567"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Address */}
                    <div className="mb-6">
                      <label className="block text-sm font-bold text-gray-700 mb-3">
                        Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <MapPin className="h-5 w-5 text-gray-400" />
                        </div>
                        <textarea
                          name="customerAddress"
                          value={formData.customerAddress}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl text-lg resize-none focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all"
                          placeholder="Enter customer address"
                        />
                      </div>
                    </div>

                    {/* File Upload */}
                    <div className="mb-6">
                      <label className="block text-sm font-bold text-gray-700 mb-3">
                        Supporting Documents
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-green-400 transition-colors">
                        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <div className="text-lg font-semibold text-gray-600 mb-2">
                          Drop files here or click to upload
                        </div>
                        <div className="text-sm text-gray-500 mb-4">
                          PDF, PNG, JPG up to 10MB
                        </div>
                        <input
                          type="file"
                          onChange={handleFileChange}
                          accept=".pdf,.png,.jpg,.jpeg"
                          className="hidden"
                          id="file-upload"
                        />
                        <label
                          htmlFor="file-upload"
                          className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-xl cursor-pointer transition-colors"
                        >
                          Choose File
                        </label>
                        {formData.file && (
                          <div className="mt-4 flex items-center justify-center text-green-600">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            {formData.file.name}
                          </div>
                        )}
                        {errors.file && (
                          <p className="mt-2 text-sm text-red-600 flex items-center justify-center">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            {errors.file}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Error Message */}
                  {errors.submit && (
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center text-red-700">
                      <AlertCircle className="h-5 w-5 mr-2" />
                      {errors.submit}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-4 px-6 rounded-2xl transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Creating...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-5 w-5 mr-2" />
                          Create Invoice NFT
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Calculation Summary */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Calculator className="h-6 w-6 mr-2 text-green-600" />
              Financial Summary
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Invoice Amount</span>
                <span className="text-2xl font-bold text-gray-900">
                  ${formData.amount ? parseFloat(formData.amount).toLocaleString() : '0.00'}
                </span>
              </div>
              
              <div className="bg-green-50 rounded-2xl p-4 border border-green-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-green-700 font-medium">You'll Receive</span>
                  <span className="text-2xl font-bold text-green-700">
                    ${offerAmount}
                  </span>
                </div>
                <div className="text-sm text-green-600">95% of invoice value</div>
              </div>
              
              <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-blue-700 font-medium">Investor Return</span>
                  <span className="text-2xl font-bold text-blue-700">
                    ${expectedReturn}
                  </span>
                </div>
                <div className="text-sm text-blue-600">5% yield for investors</div>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Processing Fee</span>
                  <span className="font-bold text-gray-900">${processingFee}</span>
                </div>
                <div className="text-sm text-gray-500 mt-1">2% platform fee</div>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 border border-green-200">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Star className="h-6 w-6 mr-2 text-yellow-500" />
              Benefits
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center mt-0.5">
                  <Zap className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Instant Liquidity</div>
                  <div className="text-sm text-gray-600">Get paid immediately instead of waiting</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center mt-0.5">
                  <Award className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Blockchain Security</div>
                  <div className="text-sm text-gray-600">Secured by Stellar network</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-xl flex items-center justify-center mt-0.5">
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Attract Investors</div>
                  <div className="text-sm text-gray-600">Access global liquidity pool</div>
                </div>
              </div>
            </div>
          </div>

          {/* Help */}
          <div className="bg-gray-50 rounded-3xl p-6 border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-3">Need Help?</h3>
            <p className="text-sm text-gray-600 mb-4">
              Our team is here to help you tokenize your invoice successfully.
            </p>
            <button className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-xl transition-colors">
              Contact Support
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default CreateInvoice; 