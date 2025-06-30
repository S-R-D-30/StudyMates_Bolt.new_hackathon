import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, Bell } from 'lucide-react';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  timestamp: string;
}

interface NotificationSystemProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
  onClearAll: () => void;
  showNotifications?: boolean;
  onToggleNotifications?: () => void;
}

export default function NotificationSystem({ 
  notifications, 
  onDismiss, 
  onClearAll, 
  showNotifications = false,
  onToggleNotifications 
}: NotificationSystemProps) {
  const [lastNotificationId, setLastNotificationId] = useState<string | null>(null);
  const [currentToastNotification, setCurrentToastNotification] = useState<Notification | null>(null);

  useEffect(() => {
    // Only show toast for the latest notification if it's new
    if (notifications.length > 0) {
      const latestNotification = notifications[0];
      
      // Only show toast if this is a new notification
      if (latestNotification.id !== lastNotificationId) {
        setLastNotificationId(latestNotification.id);
        setCurrentToastNotification(latestNotification);
        
        // Auto dismiss after 4 seconds
        setTimeout(() => {
          setCurrentToastNotification(null);
        }, 4000);
      }
    }
  }, [notifications, lastNotificationId]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'error': return <AlertCircle className="w-5 h-5 text-red-400" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-yellow-400" />;
      default: return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  const getToastColor = (type: string) => {
    switch (type) {
      case 'success': return 'from-green-500 to-emerald-600 border-green-400';
      case 'error': return 'from-red-500 to-red-600 border-red-400';
      case 'warning': return 'from-yellow-500 to-orange-600 border-yellow-400';
      default: return 'from-blue-500 to-blue-600 border-blue-400';
    }
  };

  const handleToastDismiss = () => {
    setCurrentToastNotification(null);
  };

  return (
    <>
      {/* Bell Icon with Badge */}
      <div className="relative">
        <button 
          onClick={onToggleNotifications}
          className="p-3 text-gray-400 hover:text-blue-400 hover:bg-gray-800 rounded-xl transition-all duration-200 relative"
        >
          <Bell className="w-5 h-5" />
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
          )}
        </button>

        {/* Notifications Dropdown */}
        {showNotifications && (
          <div className="absolute right-0 top-full mt-2 w-80 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl z-50 max-h-96 overflow-y-auto">
            <div className="p-4 border-b border-gray-700 flex items-center justify-between">
              <h3 className="font-semibold text-white">Notifications</h3>
              {notifications.length > 0 && (
                <button
                  onClick={onClearAll}
                  className="text-sm text-red-400 hover:text-red-300 transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>
            
            <div className="max-h-64 overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div key={notification.id} className="p-4 border-b border-gray-700 hover:bg-gray-800 transition-colors">
                    <div className="flex items-start space-x-3">
                      {getIcon(notification.type)}
                      <div className="flex-1">
                        <h4 className="font-medium text-white text-sm">{notification.title}</h4>
                        <p className="text-gray-400 text-xs mt-1">{notification.message}</p>
                        <p className="text-gray-500 text-xs mt-2">
                          {new Date(notification.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <button
                        onClick={() => onDismiss(notification.id)}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <Bell className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No notifications</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Toast Notification - Only show latest one */}
      {currentToastNotification && (
        <div className="fixed top-20 right-4 z-50 animate-slide-in-right">
          <div
            className={`bg-gradient-to-r ${getToastColor(currentToastNotification.type)} border-l-4 p-4 rounded-lg shadow-lg max-w-sm`}
          >
            <div className="flex items-start space-x-3">
              {getIcon(currentToastNotification.type)}
              <div className="flex-1">
                <h4 className="font-medium text-white text-sm">{currentToastNotification.title}</h4>
                <p className="text-white text-opacity-90 text-xs mt-1">{currentToastNotification.message}</p>
              </div>
              <button
                onClick={handleToastDismiss}
                className="text-white text-opacity-70 hover:text-opacity-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </>
  );
}