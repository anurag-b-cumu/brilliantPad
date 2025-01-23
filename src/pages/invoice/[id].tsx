import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { IInvoice } from '@/models/Invoice';
import { IDog } from '@/models/Dog';
import { Header } from '@/components/Header';

interface InvoicePageProps {
  invoice: IInvoice & {
    items: Array<{
      dogId: IDog;
      quantity: number;
      price: number;
    }>;
  };
}

export default function InvoicePage() {
  const router = useRouter();
  const { id } = router.query;
  const [invoice, setInvoice] = useState<InvoicePageProps['invoice'] | null>(null);
  const [showBrilliantPads, setShowBrilliantPads] = useState(false);
  const [brilliantPadsCount, setBrilliantPadsCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');

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
    }
  };

  const handleCheckout = async () => {
    if (!invoice) return;

    setLoading(true);
    setPaymentStatus('processing');

    try {
      // Simulate payment processing for 2 seconds
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Always succeed for demonstration
      setPaymentStatus('success');

      // Update invoice status
      await fetch(`/api/invoices/${invoice._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'paid',
          brilliantPads: showBrilliantPads ? {
            quantity: brilliantPadsCount,
            price: 100 // $100 per pad
          } : undefined
        }),
      });

      // Redirect to success page after showing success message
      setTimeout(() => {
        router.push(`/invoice/success?session_id=mock_session_${invoice._id}`);
      }, 1500);

    } catch (error) {
      console.error('Error processing payment:', error);
      setPaymentStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveBrilliantPads = () => {
    setShowBrilliantPads(false);
    setBrilliantPadsCount(0);
  };

  if (!invoice) {
    return <div className="p-6">Loading...</div>;
  }

  const totalDogPrice = invoice.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const brilliantPadsPrice = brilliantPadsCount * 100; // $100 per pad
  const totalPrice = totalDogPrice + brilliantPadsPrice;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Header title="Invoice Details" pageTitle="Invoice" />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Invoice Details</h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Selected Dogs</h2>
          {invoice.items.map((item, index) => (
            <div key={index} className="flex justify-between items-center mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">{item.dogId.name}</h3>
                <p className="text-gray-600 dark:text-gray-300">{item.dogId.breed}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-600 dark:text-gray-300">Quantity: {item.quantity}</p>
                <p className="font-medium text-gray-900 dark:text-white">${item.price * item.quantity}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Brilliant Pads</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Would you like to add Brilliant Pads to your order? Each pad costs $100.
          </p>
          
          {!showBrilliantPads ? (
            <button
              onClick={() => setShowBrilliantPads(true)}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Yes, I'm Interested
            </button>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-4">
                  <label className="text-gray-700 dark:text-gray-300">Quantity:</label>
                  <div className="flex items-center border dark:border-gray-600 rounded bg-white dark:bg-gray-800">
                    <button
                      onClick={() => setBrilliantPadsCount(Math.max(1, brilliantPadsCount - 1))}
                      className="px-3 py-1 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={brilliantPadsCount}
                      onChange={(e) => setBrilliantPadsCount(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-16 text-center border-x dark:border-gray-600 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => setBrilliantPadsCount(brilliantPadsCount + 1)}
                      className="px-3 py-1 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">
                    Total: ${brilliantPadsCount * 100}
                  </span>
                </div>
                <button
                  onClick={handleRemoveBrilliantPads}
                  className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                  title="Remove Brilliant Pads"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold text-gray-900 dark:text-white">Total Amount:</span>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">${totalPrice}</span>
          </div>

          {paymentStatus === 'success' ? (
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <svg
                  className="w-6 h-6 text-green-500 dark:text-green-400"
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
              <p className="text-green-700 dark:text-green-300">
                Payment Successful! Redirecting...
              </p>
            </div>
          ) : paymentStatus === 'error' ? (
            <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <svg
                  className="w-6 h-6 text-red-500 dark:text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <p className="text-red-700 dark:text-red-300">
                Payment failed. Please try again.
              </p>
            </div>
          ) : (
            <button
              onClick={handleCheckout}
              disabled={loading || paymentStatus === 'processing'}
              className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 dark:disabled:bg-gray-600 transition-colors relative"
            >
              {paymentStatus === 'processing' ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Processing Payment...
                </div>
              ) : (
                'Proceed to Checkout'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 