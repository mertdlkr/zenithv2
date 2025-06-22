import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { WalletProvider } from './contexts/WalletContext';
import { InvoiceProvider } from './contexts/InvoiceContext';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import CreateInvoice from './pages/CreateInvoice';
import OpenInvoices from './pages/OpenInvoices';
import MyInvoices from './pages/MyInvoices';
import PayInvoice from './pages/PayInvoice';
import Withdraw from './pages/Withdraw';
import './App.css';

function App() {
  return (
    <WalletProvider>
      <InvoiceProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="pt-20">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/create-invoice" element={<CreateInvoice />} />
                <Route path="/open-invoices" element={<OpenInvoices />} />
                <Route path="/my-invoices" element={<MyInvoices />} />
                <Route path="/pay-invoice" element={<PayInvoice />} />
                <Route path="/withdraw" element={<Withdraw />} />
              </Routes>
            </main>
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  theme: {
                    primary: '#4aed88',
                  },
                },
              }}
            />
          </div>
        </Router>
      </InvoiceProvider>
    </WalletProvider>
  );
}

export default App;
