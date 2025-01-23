import { useState, useEffect } from 'react';
import { SearchBar } from '@/components/SearchBar';
import { DogTabs } from '@/components/DogTabs';
import { Cart } from '@/components/Cart';
import { Dog } from '@/types';
import { Header } from '@/components/Header';
import { useRouter } from 'next/router';
import { IDog } from '@/models/Dog';
import { IInvoice } from '@/models/Invoice';
import { CartItem, CustomerData } from '@/types';

export default function StorePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [cartItems, setCartItems] = useState<(Dog & { quantity: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sendingInvoice, setSendingInvoice] = useState(false);
  const [invoiceStatus, setInvoiceStatus] = useState<'idle' | 'sending' | 'sent' | 'paid'>('idle');
  const [invoiceId, setInvoiceId] = useState<string | null>(null);
  const [currentInvoice, setCurrentInvoice] = useState<IInvoice | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchDogs();
  }, []);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (invoiceStatus === 'sent' && invoiceId) {
      intervalId = setInterval(async () => {
        try {
          const response = await fetch(`/api/invoices/${invoiceId}`);
          const data = await response.json();
          
          if (data.status === 'paid') {
            setInvoiceStatus('paid');
            setCartItems([]); // Clear cart after successful payment
            clearInterval(intervalId);
            
            // Wait a moment to show the success message before redirecting
            setTimeout(() => {
              router.push(`/payment-confirmation/${invoiceId}`);
            }, 2000);
          }
        } catch (error) {
          console.error('Error checking payment status:', error);
        }
      }, 2000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [invoiceStatus, invoiceId, router]);

  const fetchDogs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/dogs');
      const data = await response.json();
      setDogs(data);
    } catch (error) {
      setError('Failed to load dogs. Please try again later.');
      console.error('Error fetching dogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDogs = dogs.filter(
    (dog) =>
      dog.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dog.breed.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddToCart = (dog: Dog) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item._id === dog._id);
      if (existingItem) {
        return prev.map((item) =>
          item._id === dog._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...dog, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (index: number, quantity: number) => {
    setCartItems((prev) => {
      if (quantity <= 0) {
        return prev.filter((_, i) => i !== index);
      }
      return prev.map((item, i) =>
        i === index ? { ...item, quantity } : item
      );
    });
  };

  const handleGenerateInvoice = async (customerData: CustomerData) => {
    setSendingInvoice(true);
    setInvoiceStatus('sending');

    try {
      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerData,
          items: cartItems,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate invoice');
      }

      const invoice = await response.json();
      setInvoiceId(invoice._id);
      setCurrentInvoice(invoice);
      setInvoiceStatus('sent');

    } catch (error) {
      console.error('Error generating invoice:', error);
      alert('Failed to generate invoice. Please try again.');
      setInvoiceStatus('idle');
    } finally {
      setSendingInvoice(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Header title="Brilliant Pad Store" pageTitle="Store" />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6 max-w-full">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Available Dogs</h2>
              <SearchBar onSearch={setSearchQuery} />
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
              ) : error ? (
                <div className="text-center text-red-500 py-8">{error}</div>
              ) : filteredDogs.length === 0 ? (
                <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                  No dogs found matching your search.
                </div>
              ) : (
                <DogTabs dogs={filteredDogs} onAddToCart={handleAddToCart} />
              )}
            </div>
          </div>

          {/* Cart Sidebar */}
          <div className="lg:w-[320px] flex-shrink-0">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 sticky top-8">
              <Cart
                items={cartItems}
                onUpdateQuantity={handleUpdateQuantity}
                onGenerateInvoice={handleGenerateInvoice}
                invoiceStatus={invoiceStatus}
                currentInvoice={currentInvoice}
              />
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white dark:bg-gray-800 border-t dark:border-gray-700 mt-auto transition-colors duration-200">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-gray-500 dark:text-gray-400">
            © 2024 Brilliant Pad Store. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
} 