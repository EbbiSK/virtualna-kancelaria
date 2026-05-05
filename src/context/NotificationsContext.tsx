import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

export type NotificationType =
  | 'room_message'
  | 'dm_message'
  | 'room_invite'
  | 'mention'
  | 'system';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  roomId?: string;
  roomName?: string;
  senderId?: string;
  senderName?: string;
  dmUserId?: string;
  link?: string;
}

interface NotificationsContextValue {
  notifications: AppNotification[];
  unreadCount: number;
  permission: NotificationPermission | 'unsupported';
  addNotification: (
    notification: Omit<AppNotification, 'id' | 'createdAt' | 'read'> & {
      id?: string;
      createdAt?: string;
      read?: boolean;
    }
  ) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  requestBrowserPermission: () => Promise<NotificationPermission | 'unsupported'>;
}

const NotificationsContext = createContext<NotificationsContextValue | undefined>(undefined);

const STORAGE_KEY = 'virtual-office-notifications';
const MAX_NOTIFICATIONS = 100;

function isBrowserNotificationSupported() {
  return typeof window !== 'undefined' && 'Notification' in window;
}

function generateId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `notif_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>(
    isBrowserNotificationSupported() ? Notification.permission : 'unsupported'
  );

  const isInitialLoadRef = useRef(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;

      const parsed = JSON.parse(raw) as AppNotification[];
      if (Array.isArray(parsed)) {
        setNotifications(parsed);
      }
    } catch (error) {
      console.error('Failed to load notifications from localStorage:', error);
    }
  }, []);

  useEffect(() => {
    if (isInitialLoadRef.current) {
      isInitialLoadRef.current = false;
      return;
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    } catch (error) {
      console.error('Failed to save notifications to localStorage:', error);
    }
  }, [notifications]);

  const showBrowserNotification = useCallback((notification: AppNotification) => {
    if (!isBrowserNotificationSupported()) return;
    if (Notification.permission !== 'granted') return;

    const browserNotification = new Notification(notification.title, {
      body: notification.body,
      tag: notification.id,
    });

    browserNotification.onclick = () => {
      window.focus();

      if (notification.link) {
        window.location.href = notification.link;
      }
    };
  }, []);

  const addNotification = useCallback<
    NotificationsContextValue['addNotification']
  >(
    (notificationInput) => {
      const notification: AppNotification = {
        id: notificationInput.id ?? generateId(),
        createdAt: notificationInput.createdAt ?? new Date().toISOString(),
        read: notificationInput.read ?? false,
        type: notificationInput.type,
        title: notificationInput.title,
        body: notificationInput.body,
        roomId: notificationInput.roomId,
        roomName: notificationInput.roomName,
        senderId: notificationInput.senderId,
        senderName: notificationInput.senderName,
        dmUserId: notificationInput.dmUserId,
        link: notificationInput.link,
      };

      setNotifications((prev) => {
        const exists = prev.some((item) => item.id === notification.id);
        if (exists) return prev;

        return [notification, ...prev].slice(0, MAX_NOTIFICATIONS);
      });

      if (document.visibilityState !== 'visible') {
        showBrowserNotification(notification);
      }
    },
    [showBrowserNotification]
  );

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, read: true } : item))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const requestBrowserPermission = useCallback(async () => {
    if (!isBrowserNotificationSupported()) {
      setPermission('unsupported');
      return 'unsupported';
    }

    const result = await Notification.requestPermission();
    setPermission(result);
    return result;
  }, []);

  useEffect(() => {
    if (!isBrowserNotificationSupported()) return;

    const syncPermission = () => {
      setPermission(Notification.permission);
    };

    syncPermission();
    document.addEventListener('visibilitychange', syncPermission);

    return () => {
      document.removeEventListener('visibilitychange', syncPermission);
    };
  }, []);

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.read).length,
    [notifications]
  );

  const value = useMemo<NotificationsContextValue>(
    () => ({
      notifications,
      unreadCount,
      permission,
      addNotification,
      markAsRead,
      markAllAsRead,
      removeNotification,
      clearNotifications,
      requestBrowserPermission,
    }),
    [
      notifications,
      unreadCount,
      permission,
      addNotification,
      markAsRead,
      markAllAsRead,
      removeNotification,
      clearNotifications,
      requestBrowserPermission,
    ]
  );

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationsContext);

  if (!context) {
    throw new Error('useNotifications must be used within NotificationsProvider');
  }

  return context;
}