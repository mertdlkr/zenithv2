import React, { createContext, useContext, useState, useEffect } from 'react';
import { format, addDays, isBefore, isAfter } from 'date-fns';
import toast from 'react-hot-toast';

const InvoiceContext = createContext();

export const useInvoice = () => {
  const context = useContext(InvoiceContext);
  if (!context) {
    throw new Error('useInvoice must be used within an InvoiceProvider');
  }
  return context;
};

export const InvoiceProvider = ({ children }) => {
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    const mockInvoices = [
      {
        id: 'INV-001',
        nftId: 'NFT-001',
        amount: 5000,
        offerAmount: 4750, // 95% of face value
        deadline: addDays(new Date(), 30),
        customerName: 'ABC Corp',
        description: 'Web Development Services',
        status: 'open',
        creator: 'GCDNJUBQSX7AJWLJACMJ7I4BC3Z47BQUTMHEICZLE6MU4KQBRYG5JY6B',
        currency: 'USDC',
        country: 'Turkey',
        taxRate: 18,
        earlyPaymentDiscount: 3,
        isRecurring: false,
        esgFlag: false,
        createdAt: new Date(),
        expectedReturn: 5.2 // Calculated based on duration and rates
      },
      {
        id: 'INV-002',
        nftId: 'NFT-002',
        amount: 2500,
        offerAmount: 2375,
        deadline: addDays(new Date(), 45),
        customerName: 'XYZ Ltd',
        description: 'Marketing Campaign',
        status: 'open',
        creator: 'GBTG2POJVVSRBQSZVA3IYJEZJQLPTIVVYOYRLTZEAEFXMVUSWLUW3G2L',
        currency: 'USDC',
        country: 'Germany',
        taxRate: 19,
        earlyPaymentDiscount: 2,
        isRecurring: true,
        esgFlag: true,
        createdAt: new Date(),
        expectedReturn: 6.8
      },
      {
        id: 'INV-003',
        nftId: 'NFT-003',
        amount: 1200,
        offerAmount: 1140,
        deadline: addDays(new Date(), 15),
        customerName: 'DEF Inc',
        description: 'Logo Design',
        status: 'done',
        creator: 'GCDNJUBQSX7AJWLJACMJ7I4BC3Z47BQUTMHEICZLE6MU4KQBRYG5JY6B',
        currency: 'USDC',
        country: 'USA',
        taxRate: 8.5,
        earlyPaymentDiscount: 1,
        isRecurring: false,
        esgFlag: false,
        createdAt: new Date(),
        expectedReturn: 2.1,
        paidAt: new Date()
      }
    ];
    setInvoices(mockInvoices);
  }, []);

  const createInvoice = async (invoiceData) => {
    setIsLoading(true);
    try {
      // Calculate offer amount and discount rate
      const deadline = new Date(invoiceData.deadline);
      const daysUntilDeadline = Math.ceil((deadline - new Date()) / (1000 * 60 * 60 * 24));
      const discountRate = Math.min(0.15, 0.02 + (daysUntilDeadline * 0.001));
      const offerAmount = invoiceData.amount * (1 - discountRate);
      
      // Calculate expected return for investors
      const expectedReturn = invoiceData.amount * 0.001 * daysUntilDeadline;

      const newInvoice = {
        id: `INV-${String(invoices.length + 1).padStart(3, '0')}`,
        nftId: `NFT-${String(invoices.length + 1).padStart(3, '0')}`,
        ...invoiceData,
        offerAmount: Math.round(offerAmount * 100) / 100,
        expectedReturn: Math.round(expectedReturn * 100) / 100,
        status: 'pending', // Initially pending, then becomes 'open' after verification
        createdAt: new Date(),
        deadline: new Date(invoiceData.deadline)
      };

      setInvoices(prev => [...prev, newInvoice]);
      
      // Simulate NFT minting delay
      setTimeout(() => {
        setInvoices(prev => 
          prev.map(inv => 
            inv.id === newInvoice.id 
              ? { ...inv, status: 'open' }
              : inv
          )
        );
        toast.success('Invoice NFT minted successfully! Invoice is now open for funding.');
      }, 2000);

      toast.success('Invoice created successfully! Minting NFT...');
      return newInvoice;
    } catch (error) {
      console.error('Failed to create invoice:', error);
      toast.error('Failed to create invoice. Please try again.');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getOpenInvoices = () => {
    return invoices.filter(invoice => invoice.status === 'open');
  };

  const getUserInvoices = (userPublicKey) => {
    return invoices.filter(invoice => invoice.creator === userPublicKey);
  };

  const getInvoicesForPayment = (userPublicKey) => {
    // This would typically check if the user is the customer of the invoice
    // For demo, we'll return invoices where the user might be the payer
    return invoices.filter(invoice => 
      invoice.status === 'open' && 
      isBefore(new Date(), invoice.deadline)
    );
  };

  const payInvoice = async (invoiceId, paymentMethod = 'wallet') => {
    setIsLoading(true);
    try {
      const invoice = invoices.find(inv => inv.id === invoiceId);
      if (!invoice) {
        throw new Error('Invoice not found');
      }

      if (invoice.status !== 'open') {
        throw new Error('Invoice is not available for payment');
      }

      // Check if paid early for cashback
      const isPaidEarly = isBefore(new Date(), invoice.deadline);
      const cashback = isPaidEarly ? invoice.amount * 0.03 : 0;

      // Update invoice status
      setInvoices(prev => 
        prev.map(inv => 
          inv.id === invoiceId 
            ? { 
                ...inv, 
                status: 'done', 
                paidAt: new Date(),
                cashback: cashback,
                paymentMethod 
              }
            : inv
        )
      );

      const message = isPaidEarly 
        ? `Invoice paid successfully! You received ${cashback.toFixed(2)} USDC cashback for early payment.`
        : 'Invoice paid successfully!';
      
      toast.success(message);
      return true;
    } catch (error) {
      console.error('Failed to pay invoice:', error);
      toast.error('Failed to pay invoice. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const calculateProjectedIncome = (invoiceAmount, userStake, totalStake) => {
    if (totalStake === 0) return 0;
    const invoiceRate = 0.05; // 5% rate for demo
    return invoiceAmount * invoiceRate * (userStake / totalStake);
  };

  const getInvoiceById = (invoiceId) => {
    return invoices.find(invoice => invoice.id === invoiceId);
  };

  const updateInvoiceStatus = (invoiceId, newStatus) => {
    setInvoices(prev => 
      prev.map(inv => 
        inv.id === invoiceId 
          ? { ...inv, status: newStatus }
          : inv
      )
    );
  };

  const value = {
    invoices,
    isLoading,
    createInvoice,
    getOpenInvoices,
    getUserInvoices,
    getInvoicesForPayment,
    payInvoice,
    calculateProjectedIncome,
    getInvoiceById,
    updateInvoiceStatus
  };

  return (
    <InvoiceContext.Provider value={value}>
      {children}
    </InvoiceContext.Provider>
  );
}; 