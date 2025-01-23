import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Header } from '@/components/Header';
import { IInvoice } from '@/models/Invoice';

export default function PaymentConfirmationPage() {
  const router = useRouter();
  const { id } = router.query;
  const [invoice, setInvoice] = useState<IInvoice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchInvoice();
    }
  }, [id]);

  const fetchInvoice = async () => {
    try {
      const response = await fetch(`/api/invoices/${id}`);
      const data = await response.json();
      setInvoice(data);
    } catch (error) {
      console.error('Error fetching invoice:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header title="Error" pageTitle="Error" />
        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-center">
            <p className="text-red-700 dark:text-red-300">Invoice not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Header title="Payment Confirmation" pageTitle="Payment Confirmation" />
      
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full mb-4">
              <svg
                className="w-8 h-8 text-green-500 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Payment Confirmed!
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Order details are listed below
            </p>
          </div>

          <div className="space-y-6">
            <div className="border-t dark:border-gray-700 pt-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                Order Summary
              </h2>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
                  Dogs
                </h3>
                {invoice.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {item.dogId.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {item.dogId.breed}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Quantity: {item.quantity}
                      </p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        ${item.price * item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {invoice.brilliantPads && invoice.brilliantPads.quantity > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
                    Brilliant Pads
                  </h3>
                  <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        Brilliant Pads
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Training Pads
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Quantity: {invoice.brilliantPads.quantity}
                      </p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        ${invoice.brilliantPads.quantity * invoice.brilliantPads.price}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t dark:border-gray-700 pt-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  Total Amount:
                </span>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${invoice.totalAmount}
                </span>
              </div>
            </div>

            <div className="border-t dark:border-gray-700 pt-6">
              <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                Customer Details
              </h2>
              <div className="bg-gray-50 dark:bg-gray-700 rounded p-4">
                <p className="text-gray-600 dark:text-gray-300">
                  Name: {invoice.customerName}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  Email: {invoice.customerEmail}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 