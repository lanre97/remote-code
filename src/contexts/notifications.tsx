'use client'

import { createContext, useState, useEffect } from "react";

interface Notification {
  type: 'success' | 'error' | 'info';
  message: string;
}

export const NotificationsContext = createContext<{
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
}>({
  notifications: [],
  addNotification: () => {},
});

export default function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Notification) => {
    setNotifications((notifications) => [...notifications, notification]);
  }

  const removeNotification = (index: number) => {
    setNotifications((notifications) => {
      const newNotifications = [...notifications];
      newNotifications.splice(index, 1);
      return newNotifications;
    });
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setNotifications([]);
    }, 5000);
    return () => clearTimeout(timer);
  }, [notifications]);

  return (
    <NotificationsContext.Provider value={{ notifications, addNotification }}>
      {children}
      <div className="fixed bottom-4 right-4 flex flex-col items-end">
        {notifications.map((notification, index) => {
          if (notification.type === 'success') {
            return (
              <div key={index} className="bg-green-500 text-white p-4 rounded-md mb-4 flex justify-between items-center max-w-fit">
                {notification.message}
                <button onClick={() => removeNotification(index)} className="ml-2 text-xs h-5 aspect-square border rounded-full">X</button>
              </div>
            );
          }
          if (notification.type === 'error') {
            return (
              <div key={index} className="bg-red-500 text-white p-4 rounded-md mb-4 flex justify-between items-center max-w-fit">
                {notification.message}
                <button onClick={() => removeNotification(index)} className="ml-2 text-xs h-5 aspect-square border rounded-full">X</button>
              </div>
            );
          }
          if (notification.type === 'info') {
            return (
              <div key={index} className="bg-blue-500 text-white p-4 rounded-md mb-4 flex justify-between items-center max-w-fit">
                {notification.message}
                <button onClick={() => removeNotification(index)} className="ml-2 text-xs h-5 aspect-square border rounded-full">X</button>
              </div>
            );
          }
          return null;
        })}
      </div>
    </NotificationsContext.Provider>
  );
}
  