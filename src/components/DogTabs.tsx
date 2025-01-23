import { useState, useRef } from 'react';
import { Dog } from '@/types';
import { DogGrid } from './DogGrid';

interface DogTabsProps {
  dogs: Dog[];
  onAddToCart: (dog: Dog) => void;
}

export function DogTabs({ dogs, onAddToCart }: DogTabsProps) {
  const [activeBreed, setActiveBreed] = useState<string>('all');
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Get unique breeds
  const breeds = ['all', ...new Set(dogs.map(dog => dog.breed))];
  
  // Filter dogs by breed
  const filteredDogs = activeBreed === 'all' 
    ? dogs 
    : dogs.filter(dog => dog.breed === activeBreed);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftScroll(scrollLeft > 0);
      setShowRightScroll(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      const newScrollLeft = scrollContainerRef.current.scrollLeft + 
        (direction === 'left' ? -scrollAmount : scrollAmount);
      
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="w-full overflow-hidden">
      {/* Breed Tabs */}
      <div className="relative mb-6 border-b border-gray-200 dark:border-gray-700">
        {/* Left Scroll Button */}
        {showLeftScroll && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 shadow-md rounded-r-lg p-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            aria-label="Scroll left"
          >
            <svg 
              className="w-5 h-5 text-gray-600 dark:text-gray-300" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Right Scroll Button */}
        {showRightScroll && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 shadow-md rounded-l-lg p-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            aria-label="Scroll right"
          >
            <svg 
              className="w-5 h-5 text-gray-600 dark:text-gray-300" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {/* Tabs Container */}
        <div 
          ref={scrollContainerRef}
          onScroll={checkScroll}
          className="overflow-x-auto mx-8 custom-scrollbar"
        >
          <div className="inline-flex pb-2 min-w-max">
            {breeds.map((breed) => (
              <button
                key={breed}
                onClick={() => setActiveBreed(breed)}
                className={`
                  px-4 py-2 mr-2 whitespace-nowrap rounded-lg font-medium text-sm
                  ${activeBreed === breed
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }
                  transition-colors duration-200 last:mr-0
                `}
              >
                {breed.charAt(0).toUpperCase() + breed.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Dogs Grid */}
      <div className="w-full">
        <DogGrid dogs={filteredDogs} onAddToCart={onAddToCart} />
      </div>
    </div>
  );
} 