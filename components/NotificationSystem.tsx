'use client';

import { useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { TrendingUp, DollarSign, AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react';
import { useNotifications } from '@/contexts/NotificationContext';

interface ToastNotificationProps {
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'market' | 'deal';
  actionUrl?: string;
  actionLabel?: string;
}

const ToastNotification = ({ title, message, type, actionUrl, actionLabel }: ToastNotificationProps) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case 'market':
        return <TrendingUp className="w-5 h-5 text-blue-600" />;
      case 'deal':
        return <DollarSign className="w-5 h-5 text-green-600" />;
      default:
        return <Info className="w-5 h-5 text-gray-600" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-orange-50 border-orange-200';
      case 'market':
        return 'bg-blue-50 border-blue-200';
      case 'deal':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className={`${getBgColor()} border rounded-lg p-4 shadow-lg max-w-sm`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900">{title}</p>
          <p className="text-sm text-gray-700 mt-1">{message}</p>
          {actionUrl && actionLabel && (
            <a
              href={actionUrl}
              className="inline-block mt-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
            >
              {actionLabel} →
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default function NotificationSystem() {
  const { addNotification, preferences } = useNotifications();

  // Simulate real-time notifications for demo
  useEffect(() => {
    if (!preferences.marketAlerts && !preferences.dealAlerts) return;

    const notifications = [
      {
        title: 'Price Alert: Memorial',
        message: 'Average price increased 8.2% in the last 30 days',
        type: 'market' as const,
        priority: 'medium' as const,
        category: 'market' as const,
        actionUrl: '/intelligence/portfolio',
        actionLabel: 'View Analysis'
      },
      {
        title: 'New Deal Match',
        message: 'Found property matching your criteria - 89% score',
        type: 'deal' as const,
        priority: 'high' as const,
        category: 'deal' as const,
        actionUrl: '/intelligence/deal-flow',
        actionLabel: 'View Deal'
      },
      {
        title: 'Market Update',
        message: 'The Heights showing strong buyer activity',
        type: 'info' as const,
        priority: 'low' as const,
        category: 'market' as const,
        actionUrl: '/market-reports',
        actionLabel: 'Read More'
      }
    ];

    // Randomly show notifications every 30-60 seconds
    const showRandomNotification = () => {
      if (Math.random() > 0.3) return; // 30% chance

      const notification = notifications[Math.floor(Math.random() * notifications.length)];
      
      // Check preferences
      if (notification.category === 'market' && !preferences.marketAlerts) return;
      if (notification.category === 'deal' && !preferences.dealAlerts) return;

      addNotification(notification);

      // Also show toast
      toast.custom((t) => (
        <ToastNotification
          title={notification.title}
          message={notification.message}
          type={notification.type}
          actionUrl={notification.actionUrl}
          actionLabel={notification.actionLabel}
        />
      ), {
        duration: 5000,
        position: 'top-right'
      });
    };

    const interval = setInterval(showRandomNotification, 45000); // Every 45 seconds
    
    // Show one immediately after 10 seconds
    const timeout = setTimeout(showRandomNotification, 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [addNotification, preferences]);

  // Show toast for important system events
  const showSystemToast = (title: string, message: string, type: 'success' | 'error' | 'info') => {
    toast.custom((t) => (
      <ToastNotification
        title={title}
        message={message}
        type={type}
      />
    ), {
      duration: 4000,
      position: 'top-right'
    });
  };

  // Listen for system events
  useEffect(() => {
    const handleOnline = () => {
      showSystemToast('Connection Restored', 'Real-time data sync resumed', 'success');
    };

    const handleOffline = () => {
      showSystemToast('Connection Lost', 'Working in offline mode', 'warning');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        duration: 5000,
        style: {
          background: 'transparent',
          boxShadow: 'none',
          padding: 0,
          margin: 0
        }
      }}
    />
  );
}