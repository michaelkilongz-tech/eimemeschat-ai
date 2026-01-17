'use client';

import { auth } from '../lib/firebase'
import { signOut } from 'firebase/auth';
import { User, LogOut, Sun, Moon, MessageSquare } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

export default function Header() {
  const [darkMode, setDarkMode] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    // Check for saved theme
    const isDark = localStorage.getItem('theme') === 'dark' || 
                   (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    }

    // Get user email
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user?.email) {
        setUserEmail(user.email);
      }
    });

    return () => unsubscribe();
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Error logging out');
    }
  };

  return (
    <header className="sticky top-0 z-10 border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left side */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-deepseek-green rounded-lg">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              EimemesChat AI
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Powered by Groq
            </p>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle theme"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            )}
          </button>

          {/* User Info */}
          <div className="flex items-center gap-3 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <User className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            <span className="text-sm text-gray-700 dark:text-gray-300 truncate max-w-[150px]">
              {userEmail || 'Loading...'}
            </span>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
              }
