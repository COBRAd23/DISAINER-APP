import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../config/firebase';
import { ref, onValue, push, set } from 'firebase/database';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!auth.currentUser) return;

    const notifRef = ref(db, `notifications/${auth.currentUser.uid}`);
    const unsubscribe = onValue(notifRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const notifList = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        })).sort((a, b) => new Date(b.date) - new Date(a.date));
        
        setNotifications(notifList);
        setUnreadCount(notifList.filter(n => n.unread).length);
      } else {
        setNotifications([]);
        setUnreadCount(0);
      }
    });

    return () => unsubscribe();
  }, [auth.currentUser]);

  const addNotification = async (title, body, type = 'info') => {
    if (!auth.currentUser) return;
    const notifRef = ref(db, `notifications/${auth.currentUser.uid}`);
    await push(notifRef, {
      title,
      body,
      type,
      date: new Date().toISOString(),
      unread: true
    });
  };

  const markAllAsRead = async () => {
    if (!auth.currentUser || notifications.length === 0) return;
    
    // Simplest approach: iterate and update unread: false
    const updates = {};
    notifications.forEach(n => {
      if (n.unread) {
        updates[`${n.id}/unread`] = false;
      }
    });
    
    if (Object.keys(updates).length > 0) {
      const notifRef = ref(db, `notifications/${auth.currentUser.uid}`);
      // Wait, Firebase doesn't have an easy multi-update like this if we use set on children, 
      // let's do it safely:
      for (const id of Object.keys(updates)) {
        await set(ref(db, `notifications/${auth.currentUser.uid}/${id.split('/')[0]}/unread`), false);
      }
    }
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, addNotification, markAllAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
