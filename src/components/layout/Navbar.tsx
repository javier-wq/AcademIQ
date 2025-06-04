import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bell, User, LogOut, Menu } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!user) return null;

  return (
    <div className="h-16 bg-white shadow-sm fixed top-0 right-0 left-0 z-20 ml-64">
      <div className="flex items-center justify-between h-full px-6">
        <div className="md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-gray-600 rounded-md hover:bg-gray-100"
          >
            <Menu size={20} />
          </button>
        </div>
        
        <div className="flex-1 md:ml-4">
          <h2 className="text-lg font-semibold text-gray-700">Welcome back, {user.name}</h2>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="p-2 text-gray-600 rounded-full hover:bg-gray-100 relative">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 p-2 text-gray-600 rounded-md hover:bg-gray-100"
            >
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center">
                <User size={16} />
              </div>
              <span className="hidden md:inline">{user.name}</span>
            </button>
            
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;