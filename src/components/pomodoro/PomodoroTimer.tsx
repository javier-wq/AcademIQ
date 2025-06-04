import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Settings } from 'lucide-react';
import { PomodoroSettings } from '../../types';

interface PomodoroTimerProps {
  onComplete: () => void;
  initialSettings: PomodoroSettings;
  onSettingsChange: (settings: PomodoroSettings) => void;
}

const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ 
  onComplete, 
  initialSettings,
  onSettingsChange
}) => {
  const [settings, setSettings] = useState<PomodoroSettings>(initialSettings);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [mode, setMode] = useState<'focus' | 'shortBreak' | 'longBreak'>('focus');
  const [timeLeft, setTimeLeft] = useState(settings.focusDuration * 60);
  const [currentSession, setCurrentSession] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  
  // Settings form state
  const [formSettings, setFormSettings] = useState<PomodoroSettings>(settings);
  
  const intervalRef = useRef<number | null>(null);
  
  // Effect to handle timer countdown
  useEffect(() => {
    if (isActive && !isPaused) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(intervalRef.current!);
            handleTimerComplete();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, isPaused]);
  
  // Calculate progress percentage
  const calculateProgress = () => {
    const totalTime = mode === 'focus' 
      ? settings.focusDuration * 60 
      : mode === 'shortBreak' 
        ? settings.shortBreakDuration * 60 
        : settings.longBreakDuration * 60;
        
    return ((totalTime - timeLeft) / totalTime) * 100;
  };
  
  // Format time as mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Handle timer completion
  const handleTimerComplete = () => {
    // Play sound
    const audio = new Audio('/notification.mp3');
    audio.play().catch(() => {
      // Handle cases where browser blocks autoplay
      console.log('Audio play was prevented by the browser');
    });
    
    if (mode === 'focus') {
      // Check if it's time for a long break
      if (currentSession % settings.longBreakInterval === 0) {
        setMode('longBreak');
        setTimeLeft(settings.longBreakDuration * 60);
      } else {
        setMode('shortBreak');
        setTimeLeft(settings.shortBreakDuration * 60);
      }
    } else {
      // If we just finished a break, start a new focus session
      setMode('focus');
      setTimeLeft(settings.focusDuration * 60);
      
      if (mode === 'longBreak') {
        // Reset session counter after a long break
        setCurrentSession(1);
      } else {
        setCurrentSession((prev) => prev + 1);
      }
    }
    
    onComplete();
    setIsActive(true);
  };
  
  // Start or resume timer
  const startTimer = () => {
    setIsActive(true);
    setIsPaused(false);
  };
  
  // Pause timer
  const pauseTimer = () => {
    setIsPaused(true);
  };
  
  // Reset timer
  const resetTimer = () => {
    clearInterval(intervalRef.current!);
    setIsActive(false);
    setIsPaused(false);
    setMode('focus');
    setTimeLeft(settings.focusDuration * 60);
    setCurrentSession(1);
  };
  
  // Handle settings form submission
  const handleSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSettings(formSettings);
    onSettingsChange(formSettings);
    
    // Update current timer if needed
    if (mode === 'focus') {
      setTimeLeft(formSettings.focusDuration * 60);
    } else if (mode === 'shortBreak') {
      setTimeLeft(formSettings.shortBreakDuration * 60);
    } else {
      setTimeLeft(formSettings.longBreakDuration * 60);
    }
    
    setShowSettings(false);
  };
  
  // Get background color based on current mode
  const getBackgroundColor = () => {
    switch (mode) {
      case 'focus':
        return 'from-blue-500 to-blue-600';
      case 'shortBreak':
        return 'from-green-500 to-green-600';
      case 'longBreak':
        return 'from-purple-500 to-purple-600';
    }
  };
  
  return (
    <div className="flex flex-col items-center">
      {/* Timer display */}
      <div className="w-64 h-64 relative mb-8">
        <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${getBackgroundColor()} shadow-lg flex items-center justify-center`}>
          <div className="bg-white bg-opacity-10 rounded-full w-56 h-56 flex flex-col items-center justify-center text-white">
            <div className="text-4xl font-bold mb-2">{formatTime(timeLeft)}</div>
            <div className="capitalize text-sm font-medium">
              {mode === 'focus' ? 'Focus Time' : mode === 'shortBreak' ? 'Short Break' : 'Long Break'}
            </div>
            <div className="text-xs mt-2">Session {currentSession}</div>
          </div>
        </div>
        
        {/* Progress ring */}
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle
            cx="32"
            cy="32"
            r="30"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="4"
            strokeDasharray="188.5"
            strokeDashoffset="0"
            style={{ transformOrigin: 'center', transform: 'scale(4)' }}
          />
          <circle
            cx="32"
            cy="32"
            r="30"
            fill="none"
            stroke="white"
            strokeWidth="4"
            strokeDasharray="188.5"
            strokeDashoffset={188.5 - (188.5 * calculateProgress()) / 100}
            style={{ transformOrigin: 'center', transform: 'scale(4)' }}
            className="transition-all duration-1000"
          />
        </svg>
      </div>
      
      {/* Control buttons */}
      <div className="flex gap-4 mb-6">
        {!isActive || isPaused ? (
          <button 
            onClick={startTimer}
            className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 text-white shadow hover:bg-blue-700 transition-colors"
          >
            <Play size={24} />
          </button>
        ) : (
          <button 
            onClick={pauseTimer}
            className="flex items-center justify-center w-12 h-12 rounded-full bg-amber-500 text-white shadow hover:bg-amber-600 transition-colors"
          >
            <Pause size={24} />
          </button>
        )}
        
        <button 
          onClick={resetTimer}
          className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 text-gray-700 shadow hover:bg-gray-200 transition-colors"
        >
          <RotateCcw size={20} />
        </button>
        
        <button 
          onClick={() => setShowSettings(true)}
          className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 text-gray-700 shadow hover:bg-gray-200 transition-colors"
        >
          <Settings size={20} />
        </button>
      </div>
      
      {/* Mode selector */}
      <div className="flex gap-2 text-sm">
        <button
          onClick={() => {
            setMode('focus');
            setTimeLeft(settings.focusDuration * 60);
            setIsActive(false);
          }}
          className={`px-4 py-2 rounded-full transition-colors ${
            mode === 'focus'
              ? 'bg-blue-100 text-blue-700 font-medium'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Focus
        </button>
        
        <button
          onClick={() => {
            setMode('shortBreak');
            setTimeLeft(settings.shortBreakDuration * 60);
            setIsActive(false);
          }}
          className={`px-4 py-2 rounded-full transition-colors ${
            mode === 'shortBreak'
              ? 'bg-green-100 text-green-700 font-medium'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Short Break
        </button>
        
        <button
          onClick={() => {
            setMode('longBreak');
            setTimeLeft(settings.longBreakDuration * 60);
            setIsActive(false);
          }}
          className={`px-4 py-2 rounded-full transition-colors ${
            mode === 'longBreak'
              ? 'bg-purple-100 text-purple-700 font-medium'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Long Break
        </button>
      </div>
      
      {/* Settings modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Timer Settings</h2>
            
            <form onSubmit={handleSettingsSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Focus Duration (minutes)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={formSettings.focusDuration}
                    onChange={(e) => setFormSettings({
                      ...formSettings,
                      focusDuration: parseInt(e.target.value)
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Short Break Duration (minutes)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={formSettings.shortBreakDuration}
                    onChange={(e) => setFormSettings({
                      ...formSettings,
                      shortBreakDuration: parseInt(e.target.value)
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Long Break Duration (minutes)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={formSettings.longBreakDuration}
                    onChange={(e) => setFormSettings({
                      ...formSettings,
                      longBreakDuration: parseInt(e.target.value)
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Long Break Interval (sessions)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={formSettings.longBreakInterval}
                    onChange={(e) => setFormSettings({
                      ...formSettings,
                      longBreakInterval: parseInt(e.target.value)
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowSettings(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PomodoroTimer;