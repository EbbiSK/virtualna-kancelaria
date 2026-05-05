import type { Employee, PresenceStatus } from '../types';

type Props = {
  currentUser?: Employee;
  currentStatus: PresenceStatus;
  getPresenceColor: (status: PresenceStatus) => string;
  getPresenceLabel: (status: PresenceStatus) => string;
};

export default function CurrentUserCard({
  currentUser,
  currentStatus,
  getPresenceColor,
  getPresenceLabel,
}: Props) {
  if (!currentUser) return null;

  return (
    <div style={styles.currentUserBox}>
      <div style={styles.avatarBig}>{currentUser.avatar}</div>
      <div>
        <div style={styles.employeeName}>{currentUser.name}</div>
        <div style={styles.employeeMeta}>{currentUser.position}</div>
        <div
          style={{
            ...styles.badge,
            borderColor: getPresenceColor(currentStatus),
            color: getPresenceColor(currentStatus),
          }}
        >
          <span
            style={{
              ...styles.dot,
              background: getPresenceColor(currentStatus),
            }}
          />
          {getPresenceLabel(currentStatus)}
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  currentUserBox: {
    display: 'flex',
    gap: 14,
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    background: '#ffffff',
    border: '1px solid #e5e7eb',
    marginBottom: 16,
  },
  avatarBig: {
    width: 60,
    height: 60,
    borderRadius: 16,
    display: 'grid',
    placeItems: 'center',
    fontSize: 30,
    background: '#fff',
    border: '1px solid #e5e7eb',
    flexShrink: 0,
  },
  employeeName: {
    fontSize: 16,
    fontWeight: 800,
    color: '#111827',
  },
  employeeMeta: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    border: '1px solid #d1d5db',
    borderRadius: 999,
    padding: '6px 10px',
    fontSize: 12,
    fontWeight: 700,
    background: '#fff',
    marginTop: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: '50%',
    display: 'inline-block',
  },
};