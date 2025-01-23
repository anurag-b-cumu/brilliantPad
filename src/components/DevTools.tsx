import { useState } from 'react';

export function DevTools() {
  const [message, setMessage] = useState('');

  const seedDatabase = async () => {
    try {
      const response = await fetch('/api/seed', {
        method: 'POST',
      });
      const data = await response.json();
      setMessage('Database seeded successfully!');
    } catch (error) {
      setMessage('Error seeding database');
    }
  };

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-gray-100 rounded-lg shadow">
      <button
        onClick={seedDatabase}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Seed Database
      </button>
      {message && <p className="mt-2 text-sm">{message}</p>}
    </div>
  );
} 