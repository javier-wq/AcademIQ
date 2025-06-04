import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import PomodoroPage from './pages/PomodoroPage';
import FlashcardsPage from './pages/FlashcardsPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard\" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="subjects" element={<div>Subjects Page</div>} />
            <Route path="calendar" element={<div>Calendar Page</div>} />
            <Route path="tasks" element={<div>Tasks Page</div>} />
            <Route path="teachers" element={<div>Teachers Page</div>} />
            <Route path="schedule" element={<div>Schedule Page</div>} />
            <Route path="pomodoro" element={<PomodoroPage />} />
            <Route path="files" element={<div>Files Page</div>} />
            <Route path="notes" element={<div>Notes Page</div>} />
            <Route path="flashcards" element={<FlashcardsPage />} />
            <Route path="quizzes" element={<div>Quizzes Page</div>} />
          </Route>
          
          <Route path="*" element={<Navigate to="/dashboard\" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;