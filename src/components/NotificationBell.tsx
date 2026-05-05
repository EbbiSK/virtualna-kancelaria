import { useMemo, useState } from 'react';
import { useNotifications } from '../context/NotificationsContext';

function formatTime(value: string) {
  const date = new Date(value);

  return new Intl.DateTimeFormat('sk-SK', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
  }).format(date);
}

export default function NotificationBell() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    requestBrowserPermission,
    permission,
  } = useNotifications();

  const [open, setOpen] = useState(false);

  const sortedNotifications = useMemo(() => {
    return [...notifications].sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [notifications]);

  return (
    <div style={styles.wrapper}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        style={styles.bellButton}
        title="Notifikácie"
      >
        <span style={styles.bellIcon}>🔔</span>

        {unreadCount > 0 && (
          <span style={styles.badge}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div style={styles.dropdown}>
          <div style={styles.header}>
            <div>
              <div style={styles.title}>Notifikácie</div>
              <div style={styles.subtitle}>
                {unreadCount === 0
                  ? 'Žiadne neprečítané'
                  : `${unreadCount} neprečítaných`}
              </div>
            </div>

            <button type="button" onClick={markAllAsRead} style={styles.headerAction}>
              Označiť všetko ako prečítané
            </button>
          </div>

          {permission !== 'granted' && (
            <div style={styles.permissionBox}>
              <div style={styles.permissionText}>
                Browser notifikácie nie sú povolené.
              </div>
              <button
                type="button"
                onClick={requestBrowserPermission}
                style={styles.permissionButton}
              >
                Povoliť
              </button>
            </div>
          )}

          <div style={styles.list}>
            {sortedNotifications.length === 0 ? (
              <div style={styles.emptyState}>Zatiaľ tu nie sú žiadne notifikácie.</div>
            ) : (
              sortedNotifications.map((notification) => (
                <div
                  key={notification.id}
                  style={{
                    ...styles.item,
                    ...(notification.read ? styles.itemRead : styles.itemUnread),
                  }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      markAsRead(notification.id);
                      if (notification.link) {
                        window.location.href = notification.link;
                      }
                      setOpen(false);
                    }}
                    style={styles.itemMain}
                  >
                    <div style={styles.itemTopRow}>
                      <div style={styles.itemTitle}>{notification.title}</div>
                      {!notification.read && <span style={styles.dot} />}
                    </div>

                    <div style={styles.itemBody}>{notification.body}</div>

                    <div style={styles.itemMeta}>
                      {notification.senderName ? `${notification.senderName} • ` : ''}
                      {formatTime(notification.createdAt)}
                    </div>
                  </button>

                  <div style={styles.itemActions}>
                    {!notification.read && (
                      <button
                        type="button"
                        onClick={() => markAsRead(notification.id)}
                        style={styles.itemActionButton}
                      >
                        Prečítať
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => removeNotification(notification.id)}
                      style={styles.itemActionDanger}
                    >
                      Zmazať
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    position: 'relative',
  },
  bellButton: {
    position: 'relative',
    width: 44,
    height: 44,
    borderRadius: 999,
    border: '1px solid #d1d5db',
    background: '#ffffff',
    cursor: 'pointer',
    fontSize: 18,
  },
  bellIcon: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    minWidth: 22,
    height: 22,
    padding: '0 6px',
    borderRadius: 999,
    background: '#dc2626',
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid #ffffff',
  },
  dropdown: {
    position: 'absolute',
    top: 52,
    right: 0,
    width: 380,
    maxHeight: 520,
    overflow: 'hidden',
    background: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: 16,
    boxShadow: '0 20px 50px rgba(0,0,0,0.12)',
    zIndex: 1000,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
    padding: 16,
    borderBottom: '1px solid #e5e7eb',
  },
  title: {
    fontSize: 16,
    fontWeight: 800,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
    color: '#6b7280',
  },
  headerAction: {
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    color: '#2563eb',
    fontWeight: 700,
    fontSize: 13,
  },
  permissionBox: {
    margin: 12,
    padding: 12,
    borderRadius: 12,
    background: '#eff6ff',
    border: '1px solid #bfdbfe',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  permissionText: {
    fontSize: 13,
    color: '#1e3a8a',
  },
  permissionButton: {
    border: 'none',
    borderRadius: 10,
    background: '#2563eb',
    color: '#ffffff',
    padding: '8px 12px',
    cursor: 'pointer',
    fontWeight: 700,
  },
  list: {
    maxHeight: 420,
    overflowY: 'auto',
    padding: 12,
  },
  emptyState: {
    padding: 24,
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 14,
  },
  item: {
    borderRadius: 14,
    border: '1px solid #e5e7eb',
    marginBottom: 10,
    overflow: 'hidden',
  },
  itemUnread: {
    background: '#f8fbff',
  },
  itemRead: {
    background: '#ffffff',
    opacity: 0.92,
  },
  itemMain: {
    width: '100%',
    textAlign: 'left',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    padding: 14,
  },
  itemTopRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  itemTitle: {
    fontWeight: 800,
    fontSize: 14,
    color: '#111827',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    background: '#2563eb',
    flexShrink: 0,
  },
  itemBody: {
    marginTop: 8,
    fontSize: 14,
    color: '#374151',
    lineHeight: 1.45,
  },
  itemMeta: {
    marginTop: 8,
    fontSize: 12,
    color: '#6b7280',
  },
  itemActions: {
    display: 'flex',
    gap: 8,
    padding: '0 14px 14px 14px',
  },
  itemActionButton: {
    border: '1px solid #d1d5db',
    borderRadius: 10,
    background: '#ffffff',
    padding: '7px 10px',
    cursor: 'pointer',
    fontSize: 12,
    fontWeight: 700,
  },
  itemActionDanger: {
    border: '1px solid #fecaca',
    borderRadius: 10,
    background: '#fff1f2',
    color: '#b91c1c',
    padding: '7px 10px',
    cursor: 'pointer',
    fontSize: 12,
    fontWeight: 700,
  },
};