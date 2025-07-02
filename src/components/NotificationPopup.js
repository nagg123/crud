import React, { useEffect } from 'react';

const NotificationPopup = ({ message, type, onClose }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // Auto-close after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className={`notification-popup ${type} show`}>
      {message}
    </div>
  );
};

export default NotificationPopup;