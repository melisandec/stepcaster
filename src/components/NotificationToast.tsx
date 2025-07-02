import React, { useEffect, useState } from 'react';
import { Notification } from '../types/gamification';
import './NotificationToast.css';

interface NotificationToastProps {
  notification: Notification;
  onClose: () => void;
  duration?: number;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ 
  notification, 
  onClose, 
  duration = 5000 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Show notification
    const showTimer = setTimeout(() => setIsVisible(true), 100);
    
    // Auto-hide notification
    const hideTimer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(onClose, 300); // Wait for exit animation
    }, duration);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [duration, onClose]);

  const getNotificationIcon = (type: string): string => {
    switch (type) {
      case 'achievement': return '🏆';
      case 'level_up': return '🎊';
      case 'quest_complete': return '📋';
      case 'streak': return '🔥';
      case 'event': return '🎉';
      default: return '📢';
    }
  };

  const getNotificationColor = (type: string): string => {
    switch (type) {
      case 'achievement': return '#ffd700';
      case 'level_up': return '#667eea';
      case 'quest_complete': return '#48bb78';
      case 'streak': return '#ed8936';
      case 'event': return '#9f7aea';
      default: return '#4a5568';
    }
  };

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(onClose, 300);
  };

  return (
    <div 
      className={`notification-toast ${isVisible ? 'visible' : ''} ${isExiting ? 'exiting' : ''}`}
      style={{ borderLeftColor: getNotificationColor(notification.type) }}
    >
      <div className="notification-icon">
        {getNotificationIcon(notification.type)}
      </div>
      <div className="notification-content">
        <h4 className="notification-title">{notification.title}</h4>
        <p className="notification-message">{notification.message}</p>
        <span className="notification-time">
          {notification.timestamp.toLocaleTimeString()}
        </span>
      </div>
      <button className="notification-close" onClick={handleClose}>
        ×
      </button>
    </div>
  );
};

interface NotificationContainerProps {
  notifications: Notification[];
  onClose: (notificationId: string) => void;
}

export const NotificationContainer: React.FC<NotificationContainerProps> = ({ 
  notifications, 
  onClose 
}) => {
  return (
    <div className="notification-container">
      {notifications.slice(0, 3).map((notification) => (
        <NotificationToast
          key={notification.id}
          notification={notification}
          onClose={() => onClose(notification.id)}
        />
      ))}
    </div>
  );
}; 