import React, { useState, useEffect } from 'react';
import { Timer, History, BarChart } from 'lucide-react';
import PomodoroTimer from '../components/pomodoro/PomodoroTimer';
import { PomodoroSettings } from '../types';

const PomodoroPage: React.FC = () => {
  // Default timer settings
  const defaultSettings: PomodoroSettings = {
    focusDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    longBreakInterval: 4,
  };
  
  // Load settings from localStorage if available
  const [settings, setSettings] = useState<PomodoroSettings>(() => {
    const savedSettings = localStorage.getItem('pomodoroSettings');
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
  });
  
  // Stats for completed sessions
  const [stats, setStats] = useState({
    focusSessionsCompleted: 0,
    totalFocusMinutes: 0,
    lastCompletedAt: null as Date | null,
  });
  
  // Load stats from localStorage
  useEffect(() => {
    const savedStats = localStorage.getItem('pomodoroStats');
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }
  }, []);
  
  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('pomodoroSettings', JSON.stringify(settings));
  }, [settings]);
  
  // Save stats to localStorage when they change
  useEffect(() => {
    localStorage.setItem('pomodoroStats', JSON.stringify(stats));
  }, [stats]);
  
  // Handle timer completion
  const handleTimerComplete = () => {
    setStats(prev => ({
      ...prev,
      focusSessionsCompleted: prev.focusSessionsCompleted + 1,
      totalFocusMinutes: prev.totalFocusMinutes + settings.focusDuration,
      lastCompletedAt: new Date(),
    }));
  };
  
  // Handle settings change
  const handleSettingsChange = (newSettings: PomodoroSettings) => {
    setSettings(newSettings);
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Timer className="h-6 w-6 text-blue-600" />
        Pomodoro Timer
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
            <div className="flex flex-col items-center">
              <PomodoroTimer
                onComplete={handleTimerComplete}
                initialSettings={settings}
                onSettingsChange={handleSettingsChange}
              />
              
              <div className="mt-8 w-full max-w-md">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <History size={18} />
                  How to Use the Pomodoro Technique
                </h2>
                
                <ol className="space-y-3 text-gray-600 text-sm">
                  <li className="flex gap-2">
                    <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 font-medium text-xs">1</span>
                    <span>Set the timer for 25 minutes and focus on a single task until the timer rings.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 font-medium text-xs">2</span>
                    <span>Take a short 5-minute break.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 font-medium text-xs">3</span>
                    <span>After completing four pomodoros, take a longer break (15-30 minutes).</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 font-medium text-xs">4</span>
                    <span>Use the breaks to rest your mind and stretch, walk, or hydrate.</span>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <BarChart size={18} />
              Your Stats
            </h2>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500">Focus Sessions</div>
                <div className="text-2xl font-bold text-gray-800">{stats.focusSessionsCompleted}</div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500">Total Focus Time</div>
                <div className="text-2xl font-bold text-gray-800">{stats.totalFocusMinutes} mins</div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500">Current Settings</div>
                <div className="mt-2 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Focus:</span>
                    <span className="font-medium">{settings.focusDuration} mins</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Short Break:</span>
                    <span className="font-medium">{settings.shortBreakDuration} mins</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Long Break:</span>
                    <span className="font-medium">{settings.longBreakDuration} mins</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Long Break After:</span>
                    <span className="font-medium">{settings.longBreakInterval} sessions</span>
                  </div>
                </div>
              </div>
              
              {stats.lastCompletedAt && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500">Last Completed</div>
                  <div className="font-medium text-gray-800">
                    {new Date(stats.lastCompletedAt).toLocaleString()}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PomodoroPage;