import { useState } from 'react';
import { CartItem, CustomerData } from '@/types';
import { useRouter } from 'next/router';

interface CartProps {
  items: CartItem[];
  onUpdateQuantity: (index: number, quantity: number) => void;
  onGenerateInvoice: (customerData: CustomerData) => void;
  invoiceStatus: 'idle' | 'sending' | 'sent' | 'paid';
  currentInvoice?: IInvoice | null;
}

export function Cart({ items, onUpdateQuantity, onGenerateInvoice, invoiceStatus, currentInvoice }: CartProps) {
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [showForm, setShowForm] = useState(false);
  const router = useRouter();

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerateInvoice({ name: customerName, email: customerEmail });
    setShowForm(false);
    setCustomerName('');
    setCustomerEmail('');
  };

  const renderPaymentStatus = () => {
    switch (invoiceStatus) {
      case 'sending':
        return (
          <div className="text-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Sending invoice...</p>
          </div>
        );
      case 'sent':
        return (
          <div className="space-y-4">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="animate-pulse flex items-center justify-center mb-2">
                <svg
                  className="w-6 h-6 text-blue-500 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-blue-700 dark:text-blue-300 mb-2">
                Invoice sent successfully!
              </p>
              <p className="text-sm text-blue-600 dark:text-blue-400">
                Simulating payment process...
              </p>
            </div>
            {currentInvoice && (
              <div className="border-t dark:border-gray-700 pt-4">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Invoice Details
                </h3>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Sent to: {currentInvoice.customerEmail}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Amount: ${currentInvoice.totalAmount}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 italic">
                    (Payment will be confirmed in a few seconds...)
                  </p>
                </div>
              </div>
            )}
          </div>
        );
      case 'paid':
        return (
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
            <p className="text-green-700 dark:text-green-300 mb-2">
              Payment Confirmed!
            </p>
            <p className="text-sm text-green-600 dark:text-green-400 mb-4">
              Redirecting to order details...
            </p>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-500 mx-auto"></div>
          </div>
        );
      default:
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Customer Name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border dark:border-gray-600 rounded text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="email"
              placeholder="Customer Email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border dark:border-gray-600 rounded text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
              >
                Send Invoice
              </button>
            </div>
          </form>
        );
    }
  };

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Shopping Cart</h2>
      
      {invoiceStatus === 'idle' ? (
        <>
          <div className="flex-1 overflow-auto">
            {items.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                Your cart is empty
              </div>
            ) : (
              items.map((item, index) => (
                <div key={item._id} className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">{item.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{item.breed}</p>
                    </div>
                    <button
                      onClick={() => onUpdateQuantity(index, 0)}
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1"
                      title="Remove from cart"
                    >
                      <svg
                        className="h-5 w-5"
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
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <label className="text-sm text-gray-600 dark:text-gray-300">Quantity:</label>
                      <div className="flex items-center border dark:border-gray-600 rounded">
                        <button
                          onClick={() => onUpdateQuantity(index, Math.max(1, item.quantity - 1))}
                          className="px-2 py-1 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => onUpdateQuantity(index, parseInt(e.target.value) || 1)}
                          className="w-12 text-center border-x dark:border-gray-600 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                        <button
                          onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                          className="px-2 py-1 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">${item.price * item.quantity}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-4 pt-4 border-t dark:border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold text-gray-900 dark:text-white">Total:</span>
              <span className="text-xl font-bold text-gray-900 dark:text-white">${total}</span>
            </div>

            {!showForm ? (
              <button
                onClick={() => setShowForm(true)}
                className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                disabled={items.length === 0}
              >
                {items.length === 0 ? 'Add items to cart' : 'Generate Invoice'}
              </button>
            ) : (
              renderPaymentStatus()
            )}
          </div>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          {renderPaymentStatus()}
        </div>
      )}
    </div>
  );
} 