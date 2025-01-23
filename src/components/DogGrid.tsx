import { Dog } from '@/types';

interface DogGridProps {
  dogs: Dog[];
  onAddToCart: (dog: Dog) => void;
}

export function DogGrid({ dogs, onAddToCart }: DogGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {dogs.map((dog) => (
        <div key={dog._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="relative pt-[56.25%]"> {/* 16:9 aspect ratio */}
            <img 
              src={dog.image || '/placeholder-dog.jpg'} 
              alt={dog.name}
              className="absolute top-0 left-0 w-full h-full object-cover"
            />
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{dog.name}</h3>
            <p className="text-gray-600 dark:text-gray-400">{dog.breed}</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{dog.description}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xl font-bold text-gray-900 dark:text-white">${dog.price}</span>
              <button
                onClick={() => onAddToCart(dog)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 