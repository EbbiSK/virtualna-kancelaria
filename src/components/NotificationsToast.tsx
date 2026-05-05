import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { useNotifications } from '../context/NotificationsContext';
import type { AppNotification } from '../context/NotificationsContext';

const AUTO_HIDE_MS = 5000;
const MAX_VISIBLE_TOASTS = 3;

function formatTime(value: string) {
  const date = new Date(value);

  return new Intl.DateTimeFormat('sk-SK', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function playNotificationSound() {
  if (typeof window === 'undefined') return;

  const AudioContextClass =
    window.AudioContext ||
    (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

  if (!AudioContextClass) return;

  try {
    const audioContext = new AudioContextClass();
    const now = audioContext.currentTime;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, now);
    oscillator.frequency.exponentialRampToValueAtTime(660, now + 0.12);

    gainNode.gain.setValueAtTime(0.0001, now);
    gainNode.gain.exponentialRampToValueAtTime(0.08, now + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start(now);
    oscillator.stop(now + 0.22);

    oscillator.onended = () => {
      void audioContext.close();
    };
  } catch {
    // ticho zlyhá, UI ostane funkčné
  }
}

export default function NotificationsToast() {
  const { notifications, markAsRead, removeNotification } = useNotifications();

  const initializedRef = useRef(false);
  const knownIdsRef = useRef<Set<string>>(new Set());
  const timersRef = useRef<Map<string, number>>(new Map());

  const [visibleToastIds, setVisibleToastIds] = useState<string[]>([]);

  useEffect(() => {
    if (!initializedRef.current) {
      for (const notification of notifications) {
        knownIdsRef.current.add(notification.id);
      }

      initializedRef.current = true;
      return;
    }

    const newlyArrived = notifications.filter(
      (notification) =>
        !knownIdsRef.current.has(notification.id) && !notification.read
    );

    for (const notification of notifications) {
      knownIdsRef.current.add(notification.id);
    }

    if (newlyArrived.length === 0) {
      return;
    }

    playNotificationSound();

    const sortedNew = [...newlyArrived].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    setVisibleToastIds((prev) => {
      const merged = [...sortedNew.map((item) => item.id), ...prev];
      const unique = Array.from(new Set(merged));
      return unique.slice(0, MAX_VISIBLE_TOASTS);
    });
  }, [notifications]);

  useEffect(() => {
    const currentIds = new Set(notifications.map((item) => item.id));

    setVisibleToastIds((prev) => prev.filter((id) => currentIds.has(id)));

    for (const [id, timer] of timersRef.current.entries()) {
      if (!currentIds.has(id)) {
        window.clearTimeout(timer);
        timersRef.current.delete(id);
      }
    }
  }, [notifications]);

  useEffect(() => {
    for (const id of visibleToastIds) {
      if (timersRef.current.has(id)) continue;

      const timer = window.setTimeout(() => {
        setVisibleToastIds((prev) => prev.filter((item) => item !== id));
        timersRef.current.delete(id);
      }, AUTO_HIDE_MS);

      timersRef.current.set(id, timer);
    }

    return () => {
      // cleanup len pri unmount
    };
  }, [visibleToastIds]);

  useEffect(() => {
    return () => {
      for (const timer of timersRef.current.values()) {
        window.clearTimeout(timer);
      }
      timersRef.current.clear();
    };
  }, []);

  const visibleToasts = useMemo<AppNotification[]>(() => {
    const byId = new Map(notifications.map((notification) => [notification.id, notification]));
    const result: AppNotification[] = [];

    for (const id of visibleToastIds) {
      const notification = byId.get(id);
      if (notification) {
        result.push(notification);
      }
    }

    return result.slice(0, MAX_VISIBLE_TOASTS);
  }, [notifications, visibleToastIds]);

  const hideToast = (id: string) => {
    setVisibleToastIds((prev) => prev.filter((item) => item !== id));

    const timer = timersRef.current.get(id);
    if (timer) {
      window.clearTimeout(timer);
      timersRef.current.delete(id);
    }
  };

  const handleOpen = (id: string, link?: string) => {
    markAsRead(id);
    hideToast(id);

    if (link) {
      window.location.hash = link.startsWith('#') ? link : `#${link}`;
    }
  };

  const handleDismiss = (id: string) => {
    hideToast(id);
  };

  return (
    <div style={styles.wrapper}>
      {visibleToasts.map((toast) => (
        <div key={toast.id} style={styles.toast}>
          <button
            type="button"
            onClick={() => handleOpen(toast.id, toast.link)}
            style={styles.mainButton}
          >
            <div style={styles.header}>
              <div style={styles.title}>{toast.title}</div>
              <div style={styles.time}>{formatTime(toast.createdAt)}</div>
            </div>

            <div style={styles.body}>{toast.body}</div>

            {(toast.roomName || toast.senderName) && (
              <div style={styles.meta}>
                {toast.senderName ? `${toast.senderName}` : ''}
                {toast.senderName && toast.roomName ? ' • ' : ''}
                {toast.roomName ? toast.roomName : ''}
              </div>
            )}
          </button>

          <div style={styles.actions}>
            <button
              type="button"
              onClick={() => handleDismiss(toast.id)}
              style={styles.secondaryButton}
            >
              Zavrieť
            </button>

            <button
              type="button"
              onClick={() => {
                markAsRead(toast.id);
                removeNotification(toast.id);
                hideToast(toast.id);
              }}
              style={styles.dangerButton}
            >
              Zmazať
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  wrapper: {
    position: 'fixed',
    right: 20,
    bottom: 20,
    zIndex: 3000,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    width: 360,
    maxWidth: 'calc(100vw - 32px)',
    pointerEvents: 'none',
  },
  toast: {
    background: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: 16,
    boxShadow: '0 16px 40px rgba(0,0,0,0.14)',
    overflow: 'hidden',
    pointerEvents: 'auto',
  },
  mainButton: {
    width: '100%',
    textAlign: 'left',
    border: 'none',
    background: '#ffffff',
    cursor: 'pointer',
    padding: 14,
  },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: 800,
    color: '#111827',
    lineHeight: 1.35,
  },
  time: {
    fontSize: 12,
    color: '#6b7280',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },
  body: {
    marginTop: 8,
    fontSize: 14,
    color: '#374151',
    lineHeight: 1.45,
  },
  meta: {
    marginTop: 8,
    fontSize: 12,
    color: '#6b7280',
    fontWeight: 700,
  },
  actions: {
    display: 'flex',
    gap: 8,
    padding: '0 14px 14px 14px',
  },
  secondaryButton: {
    border: '1px solid #d1d5db',
    borderRadius: 10,
    background: '#ffffff',
    padding: '8px 10px',
    cursor: 'pointer',
    fontSize: 12,
    fontWeight: 700,
  },
  dangerButton: {
    border: '1px solid #fecaca',
    borderRadius: 10,
    background: '#fff1f2',
    color: '#b91c1c',
    padding: '8px 10px',
    cursor: 'pointer',
    fontSize: 12,
    fontWeight: 700,
  },
};