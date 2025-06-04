import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Calendar, 
  ListTodo, 
  Users, 
  Clock, 
  Timer, 
  FileText, 
  Pencil, 
  FlaskConical, 
  GraduationCap 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();

  const menuItems = [
    { path: '/dashboard', name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/subjects', name: 'Subjects', icon: <BookOpen size={20} /> },
    { path: '/calendar', name: 'Calendar', icon: <Calendar size={20} /> },
    { path: '/tasks', name: 'Tasks', icon: <ListTodo size={20} /> },
    { path: '/teachers', name: 'Teachers', icon: <Users size={20} /> },
    { path: '/schedule', name: 'Schedule', icon: <Clock size={20} /> },
    { path: '/pomodoro', name: 'Pomodoro', icon: <Timer size={20} /> },
    { path: '/files', name: 'Files', icon: <FileText size={20} /> },
    { path: '/notes', name: 'Notes', icon: <Pencil size={20} /> },
    { path: '/flashcards', name: 'Flashcards', icon: <FlaskConical size={20} /> },
    { path: '/quizzes', name: 'Quizzes', icon: <GraduationCap size={20} /> },
  ];

  const isActive = (path: string) => location.pathname === path;

  if (!user) return null;

  return (
    <div className="w-64 h-screen bg-white shadow-md flex-shrink-0 fixed left-0 top-0 z-10">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
          <GraduationCap className="h-6 w-6" />
          <span>StudyHub</span>
        </h1>
      </div>
      <nav className="mt-6">
        <ul>
          {menuItems.map((item) => (
            <li key={item.path} className="px-4 py-2">
              <Link
                to={item.path}
                className={`flex items-center gap-3 p-2 rounded-lg transition-all duration-200 ${
                  isActive(item.path)
                    ? 'bg-blue-50 text-blue-600 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;