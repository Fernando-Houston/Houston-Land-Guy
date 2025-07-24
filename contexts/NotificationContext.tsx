'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'market' | 'deal';
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
  priority: 'low' | 'medium' | 'high';
  category: 'market' | 'deal' | 'system' | 'update' | 'alert';
  icon?: string;
  data?: Record<string, any>;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
  getNotificationsByCategory: (category: string) => Notification[];
  preferences: NotificationPreferences;
  updatePreferences: (prefs: Partial<NotificationPreferences>) => void;
}

interface NotificationPreferences {
  enableSound: boolean;
  enableDesktop: boolean;
  enableEmail: boolean;
  marketAlerts: boolean;
  dealAlerts: boolean;
  priceAlerts: boolean;
  newListings: boolean;
  systemUpdates: boolean;
  maxNotifications: number;
}

const defaultPreferences: NotificationPreferences = {
  enableSound: true,
  enableDesktop: true,
  enableEmail: false,
  marketAlerts: true,
  dealAlerts: true,
  priceAlerts: true,
  newListings: true,
  systemUpdates: true,
  maxNotifications: 50
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [preferences, setPreferences] = useState<NotificationPreferences>(defaultPreferences);

  // Load preferences and notifications from localStorage on mount
  useEffect(() => {
    const savedPrefs = localStorage.getItem('notification-preferences');
    const savedNotifications = localStorage.getItem('notifications');
    
    if (savedPrefs) {
      try {
        setPreferences(JSON.parse(savedPrefs));
      } catch (error) {
        console.error('Failed to parse notification preferences:', error);
      }
    }

    if (savedNotifications) {
      try {
        const parsed = JSON.parse(savedNotifications);
        const notificationsWithDates = parsed.map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp)
        }));
        setNotifications(notificationsWithDates);
      } catch (error) {
        console.error('Failed to parse notifications:', error);
      }
    }

    // Generate some initial notifications for demo
    if (!savedNotifications) {
      generateInitialNotifications();
    }
  }, []);

  // Save to localStorage when notifications change
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem('notification-preferences', JSON.stringify(preferences));
  }, [preferences]);

  // Request desktop notification permission
  useEffect(() => {
    if (preferences.enableDesktop && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }
  }, [preferences.enableDesktop]);

  const generateInitialNotifications = () => {
    const initialNotifications: Omit<Notification, 'id' | 'timestamp' | 'read'>[] = [
      {
        title: 'Market Alert: The Heights',
        message: 'Price increase of 15.3% detected in The Heights area. 5 new listings above market value.',
        type: 'market',
        priority: 'high',
        category: 'market',
        actionUrl: '/intelligence/portfolio',
        actionLabel: 'View Analysis',
        data: { zipCode: '77008', priceChange: 15.3 }
      },
      {
        title: 'New Deal Opportunity',
        message: 'High-scoring deal found: 1234 Heights Blvd - 92% match score, 14.1% ROI potential.',
        type: 'deal',
        priority: 'high',
        category: 'deal',
        actionUrl: '/intelligence/deal-flow',
        actionLabel: 'View Deal',
        data: { dealScore: 92, roi: 14.1 }
      },
      {
        title: 'Price Drop Alert',
        message: 'Property in Memorial reduced by $50,000. Now $675,000 (was $725,000).',
        type: 'warning',
        priority: 'medium',
        category: 'alert',
        actionUrl: '/properties/memorial',
        actionLabel: 'View Property'
      },
      {
        title: 'Market Report Ready',
        message: 'Your weekly Houston market intelligence report is now available.',
        type: 'info',
        priority: 'low',
        category: 'update',
        actionUrl: '/reports/weekly',
        actionLabel: 'View Report'
      }
    ];

    initialNotifications.forEach(notification => {
      addNotification(notification);
    });
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      read: false
    };

    setNotifications(prev => {
      const updated = [newNotification, ...prev];
      // Limit notifications based on preferences
      return updated.slice(0, preferences.maxNotifications);
    });

    // Show desktop notification if enabled
    if (preferences.enableDesktop && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(newNotification.title, {
        body: newNotification.message,
        icon: '/icons/icon-192x192.png',
        tag: newNotification.id
      });
    }

    // Play sound if enabled
    if (preferences.enableSound) {
      playNotificationSound();
    }
  };

  const playNotificationSound = () => {
    try {
      const audio = new Audio('/sounds/notification.mp3');
      audio.volume = 0.3;
      audio.play().catch(() => {
        // Silently fail if audio can't play
      });
    } catch (error) {
      // Silently fail if audio isn't available
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const getNotificationsByCategory = (category: string) => {
    return notifications.filter(notification => notification.category === category);
  };

  const updatePreferences = (prefs: Partial<NotificationPreferences>) => {
    setPreferences(prev => ({ ...prev, ...prefs }));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
    getNotificationsByCategory,
    preferences,
    updatePreferences
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}