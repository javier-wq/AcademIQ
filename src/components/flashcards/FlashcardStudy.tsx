import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { Flashcard } from '../../types';

interface FlashcardStudyProps {
  flashcards: Flashcard[];
  onClose: () => void;
}

const FlashcardStudy: React.FC<FlashcardStudyProps> = ({ flashcards, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownCards, setKnownCards] = useState<Set<string>>(new Set());
  const [shuffledCards, setShuffledCards] = useState<Flashcard[]>([]);
  
  // Shuffle cards when component mounts
  useEffect(() => {
    shuffleCards();
  }, [flashcards]);
  
  const shuffleCards = () => {
    const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
    setShuffledCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
    setKnownCards(new Set());
  };
  
  const handleNext = () => {
    if (currentIndex < shuffledCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };
  
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };
  
  const toggleFlip = () => {
    setIsFlipped(!isFlipped);
  };
  
  const markAsKnown = () => {
    const updatedKnown = new Set(knownCards);
    updatedKnown.add(shuffledCards[currentIndex].id);
    setKnownCards(updatedKnown);
    handleNext();
  };
  
  const currentCard = shuffledCards[currentIndex];
  
  if (!currentCard) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <p className="text-xl font-medium text-gray-700 mb-4">No flashcards available.</p>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Back to Flashcards
        </button>
      </div>
    );
  }
  
  const progress = ((currentIndex + 1) / shuffledCards.length) * 100;
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <span className="text-lg font-medium text-gray-700">
            {currentIndex + 1} of {shuffledCards.length}
          </span>
          <div className="text-sm text-gray-500">
            ({knownCards.size} marked as known)
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={shuffleCards}
            className="flex items-center gap-1 p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md"
          >
            <RotateCcw size={16} />
            <span>Shuffle</span>
          </button>
          <button
            onClick={onClose}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md"
          >
            Close
          </button>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-6">
        <div
          className="h-full bg-blue-600 transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      {/* Flashcard */}
      <div
        onClick={toggleFlip}
        className={`
          relative w-full h-80 cursor-pointer rounded-xl shadow-md 
          transition-all duration-500 transform-gpu 
          ${isFlipped ? 'scale-[0.98]' : ''}
        `}
      >
        <div
          className={`
            absolute inset-0 w-full h-full rounded-xl shadow-md p-8
            flex flex-col justify-center items-center
            bg-gradient-to-br from-blue-500 to-blue-600 text-white
            backface-hidden transition-opacity duration-500
            ${isFlipped ? 'opacity-0' : 'opacity-100'}
          `}
        >
          <div className="text-lg text-blue-100 mb-2">Question:</div>
          <div className="text-2xl font-medium text-center">{currentCard.question}</div>
          <div className="mt-6 text-sm text-blue-200">Click to reveal answer</div>
        </div>
        
        <div
          className={`
            absolute inset-0 w-full h-full rounded-xl shadow-md p-8
            flex flex-col justify-center items-center
            bg-gradient-to-br from-green-500 to-green-600 text-white
            backface-hidden transition-opacity duration-500
            ${isFlipped ? 'opacity-100' : 'opacity-0'}
          `}
        >
          <div className="text-lg text-green-100 mb-2">Answer:</div>
          <div className="text-xl font-medium text-center">{currentCard.answer}</div>
          <div className="mt-6 text-sm text-green-200">Click to see question again</div>
        </div>
      </div>
      
      {/* Controls */}
      <div className="flex justify-between items-center mt-8">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className={`
            flex items-center gap-1 px-4 py-2 rounded-md
            ${
              currentIndex === 0
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:bg-gray-100'
            }
          `}
        >
          <ChevronLeft size={20} />
          <span>Previous</span>
        </button>
        
        <button
          onClick={markAsKnown}
          className={`
            px-4 py-2 rounded-md
            ${
              knownCards.has(currentCard.id)
                ? 'bg-gray-100 text-gray-700'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }
          `}
        >
          {knownCards.has(currentCard.id) ? 'Marked as Known' : 'I Know This'}
        </button>
        
        <button
          onClick={handleNext}
          disabled={currentIndex === shuffledCards.length - 1}
          className={`
            flex items-center gap-1 px-4 py-2 rounded-md
            ${
              currentIndex === shuffledCards.length - 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:bg-gray-100'
            }
          `}
        >
          <span>Next</span>
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default FlashcardStudy;