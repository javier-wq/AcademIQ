import React, { useState, useEffect } from 'react';
import { 
  FlaskConical, 
  Plus, 
  Search, 
  Edit, 
  Trash, 
  BookOpen, 
  Filter 
} from 'lucide-react';
import FlashcardEditor from '../components/flashcards/FlashcardEditor';
import FlashcardStudy from '../components/flashcards/FlashcardStudy';
import { Flashcard } from '../types';

const FlashcardsPage: React.FC = () => {
  // Mock subjects
  const subjects = [
    { id: '1', name: 'Mathematics' },
    { id: '2', name: 'Physics' },
    { id: '3', name: 'Literature' },
    { id: '4', name: 'Computer Science' },
  ];
  
  // Mock flashcards with localStorage persistence
  const [flashcards, setFlashcards] = useState<Flashcard[]>(() => {
    const savedFlashcards = localStorage.getItem('flashcards');
    return savedFlashcards ? JSON.parse(savedFlashcards) : [
      {
        id: '1',
        question: 'What is the quadratic formula?',
        answer: 'x = (-b ± √(b² - 4ac)) / 2a',
        subjectId: '1',
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        question: 'What is Newton\'s second law of motion?',
        answer: 'F = ma (Force equals mass times acceleration)',
        subjectId: '2',
        createdAt: new Date().toISOString(),
      },
      {
        id: '3',
        question: 'Who wrote "Pride and Prejudice"?',
        answer: 'Jane Austen',
        subjectId: '3',
        createdAt: new Date().toISOString(),
      },
    ];
  });
  
  // Save flashcards to localStorage when they change
  useEffect(() => {
    localStorage.setItem('flashcards', JSON.stringify(flashcards));
  }, [flashcards]);
  
  const [isEditing, setIsEditing] = useState(false);
  const [isStudying, setIsStudying] = useState(false);
  const [editingFlashcard, setEditingFlashcard] = useState<Flashcard | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  
  const handleCreateFlashcard = () => {
    setEditingFlashcard(undefined);
    setIsEditing(true);
  };
  
  const handleEditFlashcard = (flashcard: Flashcard) => {
    setEditingFlashcard(flashcard);
    setIsEditing(true);
  };
  
  const handleDeleteFlashcard = (id: string) => {
    if (confirm('Are you sure you want to delete this flashcard?')) {
      setFlashcards(flashcards.filter(card => card.id !== id));
    }
  };
  
  const handleSaveFlashcard = (flashcardData: Omit<Flashcard, 'id' | 'createdAt'>) => {
    if (editingFlashcard) {
      // Update existing flashcard
      setFlashcards(flashcards.map(card => 
        card.id === editingFlashcard.id 
          ? { ...card, ...flashcardData } 
          : card
      ));
    } else {
      // Create new flashcard
      const newFlashcard: Flashcard = {
        id: Date.now().toString(),
        ...flashcardData,
        createdAt: new Date().toISOString(),
      };
      setFlashcards([...flashcards, newFlashcard]);
    }
    setIsEditing(false);
  };
  
  const handleStartStudying = () => {
    setIsStudying(true);
  };
  
  // Filter flashcards by search term and selected subject
  const filteredFlashcards = flashcards.filter(card => {
    const matchesSearch = searchTerm.trim() === '' || 
      card.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.answer.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSubject = selectedSubject === 'all' || card.subjectId === selectedSubject;
    
    return matchesSearch && matchesSubject;
  });
  
  // Get flashcards for study mode (filtered by selected subject)
  const studyFlashcards = flashcards.filter(card => 
    selectedSubject === 'all' || card.subjectId === selectedSubject
  );
  
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <FlaskConical className="h-6 w-6 text-blue-600" />
        Flashcards
      </h1>
      
      {isStudying ? (
        <FlashcardStudy 
          flashcards={studyFlashcards} 
          onClose={() => setIsStudying(false)} 
        />
      ) : isEditing ? (
        <FlashcardEditor
          initialFlashcard={editingFlashcard}
          subjects={subjects}
          onSave={handleSaveFlashcard}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <>
          {/* Filters and Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={16} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search flashcards..."
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter size={16} className="text-gray-400" />
                </div>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Subjects</option>
                  {subjects.map(subject => (
                    <option key={subject.id} value={subject.id}>{subject.name}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <button
                onClick={handleStartStudying}
                disabled={studyFlashcards.length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <BookOpen size={16} />
                Start Studying
              </button>
              
              <button
                onClick={handleCreateFlashcard}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Plus size={16} />
                Create Flashcard
              </button>
            </div>
          </div>
          
          {/* Flashcards Grid */}
          {filteredFlashcards.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <div className="text-gray-500 mb-4">No flashcards found</div>
              <button
                onClick={handleCreateFlashcard}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Plus size={16} />
                Create Your First Flashcard
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFlashcards.map(card => {
                const subject = subjects.find(s => s.id === card.subjectId);
                
                return (
                  <div key={card.id} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
                    <div className="p-4 border-b border-gray-100">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-gray-800 line-clamp-2">{card.question}</h3>
                        <div className="flex gap-1 ml-2">
                          <button
                            onClick={() => handleEditFlashcard(card)}
                            className="p-1 text-gray-500 hover:text-blue-600 rounded-full hover:bg-gray-100"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteFlashcard(card.id)}
                            className="p-1 text-gray-500 hover:text-red-600 rounded-full hover:bg-gray-100"
                          >
                            <Trash size={16} />
                          </button>
                        </div>
                      </div>
                      <div className="mt-1 text-xs text-gray-500">
                        {new Date(card.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="px-4 py-3 bg-gray-50">
                      <div className="flex justify-between items-center">
                        <div className="text-sm line-clamp-1 text-gray-600">
                          {card.answer.length > 100 
                            ? `${card.answer.substring(0, 100)}...` 
                            : card.answer}
                        </div>
                        {subject && (
                          <span className="ml-2 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                            {subject.name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FlashcardsPage;