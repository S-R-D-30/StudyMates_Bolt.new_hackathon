import React from 'react';
import { Home, FileText, Brain, User, MessageCircle, Users, Video, Calendar, ShoppingBag, Search } from 'lucide-react';

interface BottomNavProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export default function BottomNav({ currentView, onNavigate }: BottomNavProps) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'explore', label: 'Search', icon: Search },
    { id: 'store', label: 'Store', icon: ShoppingBag },
    { id: 'chat', label: 'Chat', icon: MessageCircle },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900/90 backdrop-blur-sm border-t border-gray-700 px-2 py-2 md:hidden shadow-lg z-50">
      <div className="flex justify-around items-center">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center space-y-1 py-2 px-2 rounded-xl transition-all duration-200 min-w-0 flex-1 ${
              currentView === item.id
                ? 'text-blue-400 bg-gradient-to-t from-blue-900/50 to-transparent'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            <item.icon className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-xs font-medium truncate w-full text-center">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}