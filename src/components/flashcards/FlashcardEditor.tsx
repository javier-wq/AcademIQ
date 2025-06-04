import React, { useState } from 'react';
import { Flashcard } from '../../types';
import { Save, X } from 'lucide-react';

interface FlashcardEditorProps {
  initialFlashcard?: Flashcard;
  subjects: { id: string; name: string }[];
  onSave: (flashcard: Omit<Flashcard, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

const FlashcardEditor: React.FC<FlashcardEditorProps> = ({
  initialFlashcard,
  subjects,
  onSave,
  onCancel,
}) => {
  const [question, setQuestion] = useState(initialFlashcard?.question || '');
  const [answer, setAnswer] = useState(initialFlashcard?.answer || '');
  const [subjectId, setSubjectId] = useState(initialFlashcard?.subjectId || (subjects[0]?.id || ''));
  const [errors, setErrors] = useState<{ question?: string; answer?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    const newErrors: { question?: string; answer?: string } = {};
    
    if (!question.trim()) {
      newErrors.question = 'Question is required';
    }
    
    if (!answer.trim()) {
      newErrors.answer = 'Answer is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    onSave({
      question,
      answer,
      subjectId,
    });
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          {initialFlashcard ? 'Edit Flashcard' : 'Create Flashcard'}
        </h2>
        <button
          onClick={onCancel}
          className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
        >
          <X size={20} />
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
              Subject
            </label>
            <select
              id="subject"
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-1">
              Question
            </label>
            <textarea
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={3}
              className={`w-full px-3 py-2 border ${
                errors.question ? 'border-red-300' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Enter your question here..."
            />
            {errors.question && (
              <p className="mt-1 text-sm text-red-600">{errors.question}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-1">
              Answer
            </label>
            <textarea
              id="answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={4}
              className={`w-full px-3 py-2 border ${
                errors.answer ? 'border-red-300' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Enter your answer here..."
            />
            {errors.answer && (
              <p className="mt-1 text-sm text-red-600">{errors.answer}</p>
            )}
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="mr-3 px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Save size={16} />
            Save Flashcard
          </button>
        </div>
      </form>
    </div>
  );
};

export default FlashcardEditor;