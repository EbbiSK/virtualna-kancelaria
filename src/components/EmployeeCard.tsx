import type { Employee, PresenceStatus, Room } from '../types';

type EmployeeWithStatus = Employee & {
  status: PresenceStatus;
  lastActiveAt: string;
};

type Props = {
  employee: EmployeeWithStatus;
  rooms: Room[];
  currentUserId: string;
  getPresenceColor: (status: PresenceStatus) => string;
  getPresenceLabel: (status: PresenceStatus) => string;
  getRoomName: (rooms: Room[], roomId: string) => string;
  timeAgo: (iso: string) => string;
  moveEmployeeToRoom: (employeeId: string, roomId: string) => void;
  onOpenDm?: (employeeId: string) => void;
};

export default function EmployeeCard({
  employee,
  rooms,
  currentUserId,
  getPresenceColor,
  getPresenceLabel,
  getRoomName,
  timeAgo,
  moveEmployeeToRoom,
  onOpenDm,
}: Props) {
  return (
    <div style={styles.card}>
      <div style={styles.avatar}>{employee.avatar}</div>

      <div style={{ flex: 1 }}>
        <div style={styles.topRow}>
          <div>
            <div style={styles.name}>{employee.name}</div>
            <div style={styles.meta}>{employee.position}</div>
          </div>

          <div
            style={{
              ...styles.badge,
              borderColor: getPresenceColor(employee.status),
              color: getPresenceColor(employee.status),
            }}
          >
            <span
              style={{
                ...styles.dot,
                background: getPresenceColor(employee.status),
              }}
            />
            {getPresenceLabel(employee.status)}
          </div>
        </div>

        <div style={styles.info}>Miestnosť: {getRoomName(rooms, employee.currentRoomId)}</div>
        <div style={styles.info}>Posledná aktivita: {timeAgo(employee.lastActiveAt)}</div>
      </div>

      <div style={styles.actions}>
        <select
          value={employee.currentRoomId}
          onChange={(e) => moveEmployeeToRoom(employee.id, e.target.value)}
          style={styles.select}
        >
          {rooms.map((room) => (
            <option key={room.id} value={room.id}>
              {room.name}
            </option>
          ))}
        </select>

        {employee.id !== currentUserId && onOpenDm && (
          <button style={styles.button} onClick={() => onOpenDm(employee.id)}>
            DM
          </button>
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    display: 'flex',
    gap: 14,
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    background: '#f9fafb',
    border: '1px solid #e5e7eb',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 14,
    display: 'grid',
    placeItems: 'center',
    fontSize: 26,
    background: '#fff',
    border: '1px solid #e5e7eb',
    flexShrink: 0,
  },
  topRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 10,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  name: {
    fontSize: 16,
    fontWeight: 800,
    color: '#111827',
  },
  meta: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  info: {
    marginTop: 10,
    fontSize: 13,
    color: '#6b7280',
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
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: '50%',
    display: 'inline-block',
  },
  actions: {
    marginTop: 12,
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
  },
  select: {
    padding: '10px 12px',
    borderRadius: 12,
    border: '1px solid #d1d5db',
    background: '#fff',
    minWidth: 160,
  },
  button: {
    padding: '10px 12px',
    borderRadius: 12,
    border: '1px solid #d1d5db',
    background: '#ffffff',
    color: '#111827',
    fontWeight: 700,
    cursor: 'pointer',
  },
};