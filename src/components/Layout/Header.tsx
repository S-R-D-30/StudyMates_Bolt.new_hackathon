import React, { useState } from 'react';
import { BookOpen, User, MessageCircle, Search, ShoppingBag, ArrowLeft, Settings, Info, MessageSquare, Lock, LogOut, X, Send, Phone, Mail } from 'lucide-react';
import NotificationSystem from './NotificationSystem';
import type { User as UserType } from '../../types';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  timestamp: string;
}

interface HeaderProps {
  user: UserType | null;
  onLogout: () => void;
  currentView: string;
  onNavigate: (view: string) => void;
  onNavigateBack: () => void;
  showBackButton?: boolean;
  notifications: Notification[];
  onDismissNotification: (id: string) => void;
  onClearAllNotifications: () => void;
  isLoggedIn: boolean;
}

export default function Header({ 
  user, 
  onLogout, 
  currentView, 
  onNavigate, 
  onNavigateBack,
  showBackButton,
  notifications,
  onDismissNotification,
  onClearAllNotifications,
  isLoggedIn
}: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [feedbackData, setFeedbackData] = useState({
    name: user?.name || '',
    phone: '',
    subject: '',
    description: ''
  });
  const [passwordData, setPasswordData] = useState({
    code: '',
    newPassword: ''
  });

  const getPageTitle = () => {
    switch (currentView) {
      case 'home': return 'StudyMates';
      case 'dashboard': return 'Dashboard';
      case 'notes': return 'My Notes';
      case 'flipcards': return 'My Flip Card Sets';
      case 'profile': return 'Profile';
      case 'chat': return 'Messages';
      case 'explore': return 'Explore';
      case 'communities': return 'Communities';
      case 'study-sessions': return 'Study Sessions';
      case 'infovids': return 'Infovids';
      case 'store': return 'EduStore';
      case 'public-notes': return 'Public Notes';
      case 'public-flipcards': return 'Public Flip Cards';
      case 'public-communities': return 'Public Communities';
      case 'public-sessions': return 'Public Study Sessions';
      case 'public-infovids': return 'Public Infovids';
      case 'my-store': return 'My Store';
      default: return 'StudyMates';
    }
  };

  const handleNotificationToggle = () => {
    setShowNotifications(!showNotifications);
    setShowSettingsDropdown(false);
  };

  const handleSettingsToggle = () => {
    setShowSettingsDropdown(!showSettingsDropdown);
    setShowNotifications(false);
  };

  const handleOtherButtonClick = () => {
    setShowNotifications(false);
    setShowSettingsDropdown(false);
  };

  const handleAboutClick = () => {
    setShowAboutModal(true);
    setShowSettingsDropdown(false);
  };

  const handleFeedbackClick = () => {
    setShowFeedbackModal(true);
    setShowSettingsDropdown(false);
    setFeedbackData({ name: user?.name || '', phone: '', subject: '', description: '' });
  };

  const handleChangePasswordClick = () => {
    setShowChangePasswordModal(true);
    setShowSettingsDropdown(false);
    // Simulate sending code to email
    alert(`Verification code sent to ${user?.email}`);
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Feedback submitted:', feedbackData);
    alert('Thank you for your feedback! We appreciate your input.');
    setShowFeedbackModal(false);
    setFeedbackData({ name: user?.name || '', phone: '', subject: '', description: '' });
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordData.code || !passwordData.newPassword) {
      alert('Please fill in all fields');
      return;
    }
    console.log('Password change requested:', passwordData);
    alert('Password changed successfully!');
    setShowChangePasswordModal(false);
    setPasswordData({ code: '', newPassword: '' });
  };

  return (
    <>
      <header className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              {/* Back Button */}
              {showBackButton && currentView !== 'home' && (
                <button
                  onClick={onNavigateBack}
                  className="p-2 text-gray-400 hover:text-blue-400 hover:bg-gray-800 rounded-xl transition-all duration-200 md:block hidden"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              
              <div 
                className="flex items-center space-x-3 cursor-pointer"
                onClick={() => onNavigate('home')}
              >
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    {getPageTitle()}
                  </h1>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Desktop Navigation - Store, Search, Notifications */}
              <div className="hidden md:flex items-center space-x-2 sm:space-x-4">
                {/* Store */}
                <button
                  onClick={() => {
                    handleOtherButtonClick();
                    onNavigate('store');
                  }}
                  className={`p-2 sm:p-3 rounded-xl transition-all duration-200 ${
                    currentView === 'store'
                      ? 'bg-green-600 text-white'
                      : 'text-gray-400 hover:text-green-400 hover:bg-gray-800'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                {/* Search */}
                <button
                  onClick={() => {
                    handleOtherButtonClick();
                    onNavigate('explore');
                  }}
                  className={`p-2 sm:p-3 rounded-xl transition-all duration-200 ${
                    currentView === 'explore'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-400 hover:text-blue-400 hover:bg-gray-800'
                  }`}
                >
                  <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                {/* Chat */}
                <button
                  onClick={() => {
                    handleOtherButtonClick();
                    onNavigate('chat');
                  }}
                  className={`p-2 sm:p-3 rounded-xl transition-all duration-200 ${
                    currentView === 'chat'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                      : 'text-gray-400 hover:text-blue-400 hover:bg-gray-800'
                  }`}
                >
                  <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>

              {/* Notifications */}
              <NotificationSystem 
                notifications={notifications}
                onDismiss={onDismissNotification}
                onClearAll={onClearAllNotifications}
                showNotifications={showNotifications}
                onToggleNotifications={handleNotificationToggle}
              />

              {/* User Profile - Only show if logged in */}
              {isLoggedIn && user && (
                <button
                  onClick={() => {
                    handleOtherButtonClick();
                    onNavigate('profile');
                  }}
                  className="flex items-center space-x-2 sm:space-x-3 px-2 sm:px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-xl border border-gray-700 transition-all duration-200"
                >
                  <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-sm">
                    {user.profilePicture ? (
                      <img 
                        src={user.profilePicture} 
                        alt={user.name}
                        className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg object-cover"
                      />
                    ) : (
                      <User className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    )}
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-gray-300 hidden sm:block">{user.name}</span>
                </button>
              )}
              
              {/* Settings Dropdown */}
              <div className="relative">
                <button
                  onClick={handleSettingsToggle}
                  className="flex items-center space-x-2 px-2 sm:px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-all duration-200"
                >
                  <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                {showSettingsDropdown && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl z-50">
                    <div className="py-2">
                      <button
                        onClick={handleAboutClick}
                        className="w-full px-4 py-3 text-left text-gray-300 hover:bg-gray-800 transition-colors flex items-center space-x-3"
                      >
                        <Info className="w-4 h-4" />
                        <span>About Us</span>
                      </button>
                      <button
                        onClick={handleFeedbackClick}
                        className="w-full px-4 py-3 text-left text-gray-300 hover:bg-gray-800 transition-colors flex items-center space-x-3"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>Feedback</span>
                      </button>
                      {isLoggedIn && (
                        <button
                          onClick={handleChangePasswordClick}
                          className="w-full px-4 py-3 text-left text-gray-300 hover:bg-gray-800 transition-colors flex items-center space-x-3"
                        >
                          <Lock className="w-4 h-4" />
                          <span>Change Password</span>
                        </button>
                      )}
                      {isLoggedIn && (
                        <>
                          <hr className="border-gray-700 my-2" />
                          <button
                            onClick={() => {
                              setShowSettingsDropdown(false);
                              onLogout();
                            }}
                            className="w-full px-4 py-3 text-left text-red-400 hover:bg-gray-800 transition-colors flex items-center space-x-3"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Logout</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* About Us Modal */}
      {showAboutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-2xl p-6 sm:p-8 max-w-md w-full border border-gray-700 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl sm:text-2xl font-bold text-white">About StudyMates</h3>
              <button
                onClick={() => setShowAboutModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
            
            <div className="space-y-4 text-gray-300 text-sm sm:text-base">
              <p>
                <strong className="text-blue-400">StudyMates</strong> is a comprehensive learning platform designed to revolutionize how students collaborate, share knowledge, and achieve academic excellence together.
              </p>
              
              <p>
                Our platform empowers learners to upload notes, create AI-powered flashcards, join study communities, participate in collaborative sessions, and access a vast marketplace of educational resources.
              </p>
              
              <p>
                <strong>Created by:</strong> <span className="text-purple-400">Shivam R. Divakar</span>
              </p>
              
              <p>
                <strong>Built with:</strong> <span className="text-green-400">bolt.new AI</span> as the primary technology, leveraging cutting-edge artificial intelligence to enhance the learning experience.
              </p>
              
              <p>
                StudyMates bridges the gap between individual study and collaborative learning, making education more accessible, engaging, and effective for students worldwide.
              </p>
              
              <div className="bg-gray-800 p-4 rounded-xl mt-6">
                <p className="text-center text-blue-400 font-semibold">
                  "Your Growth, Our Community"
                </p>
              </div>
            </div>
            
            <button
              onClick={() => setShowAboutModal(false)}
              className="w-full mt-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 rounded-xl transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-2xl p-6 sm:p-8 max-w-md w-full border border-gray-700 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl sm:text-2xl font-bold text-white">Send Feedback</h3>
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
            
            <form onSubmit={handleFeedbackSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                <input
                  type="text"
                  value={feedbackData.name}
                  onChange={(e) => setFeedbackData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
                  placeholder="Your name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Phone Number <span className="text-gray-500">(Optional)</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={feedbackData.phone}
                    onChange={(e) => setFeedbackData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full pl-11 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
                    placeholder="Your phone number"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
                <input
                  type="text"
                  value={feedbackData.subject}
                  onChange={(e) => setFeedbackData(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
                  placeholder="Brief subject"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  value={feedbackData.description}
                  onChange={(e) => setFeedbackData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400 resize-none"
                  placeholder="Detailed feedback..."
                  required
                />
              </div>
              
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setShowFeedbackModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-600 text-gray-300 rounded-xl hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl transition-colors flex items-center justify-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showChangePasswordModal && isLoggedIn && user && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-2xl p-6 sm:p-8 max-w-md w-full border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl sm:text-2xl font-bold text-white">Change Password</h3>
              <button
                onClick={() => setShowChangePasswordModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
            
            <div className="mb-4 p-4 bg-blue-900/20 border border-blue-700 rounded-xl">
              <div className="flex items-center space-x-2 text-blue-400 mb-2">
                <Mail className="w-4 h-4" />
                <span className="text-sm font-medium">Verification Code Sent</span>
              </div>
              <p className="text-xs text-blue-300">
                A verification code has been sent to {user.email}
              </p>
            </div>
            
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Enter Code</label>
                <input
                  type="text"
                  value={passwordData.code}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, code: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
                  placeholder="6-digit verification code"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
                  placeholder="Enter new password"
                  required
                />
              </div>
              
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setShowChangePasswordModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-600 text-gray-300 rounded-xl hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl transition-colors flex items-center justify-center space-x-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>Change Password</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}