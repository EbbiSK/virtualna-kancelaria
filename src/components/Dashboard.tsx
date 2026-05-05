import { useMemo, useState } from 'react';
import type { PresenceStatus, Room } from '../types';
import StatCard from './StatCard';
import EmployeeCard from './EmployeeCard';

type EmployeeWithStatus = {
  id: string;
  name: string;
  position: string;
  avatar: string;
  currentRoomId: string;
  status: PresenceStatus;
  lastActiveAt: string;
};

type Props = {
  employees: EmployeeWithStatus[];
  rooms: Room[];
  currentUserId: string;
  getPresenceColor: (status: PresenceStatus) => string;
  getPresenceLabel: (status: PresenceStatus) => string;
  getRoomName: (rooms: Room[], roomId: string) => string;
  timeAgo: (iso: string) => string;
  moveEmployeeToRoom: (employeeId: string, roomId: string) => void;
};

export default function Dashboard({
  employees,
  rooms,
  currentUserId,
  getPresenceColor,
  getPresenceLabel,
  getRoomName,
  timeAgo,
  moveEmployeeToRoom,
}: Props) {
  const [employeeSearch, setEmployeeSearch] = useState('');

  const counts = useMemo(() => {
    return {
      total: employees.length,
      online: employees.filter((employee) => employee.status === 'online').length,
      away: employees.filter((employee) => employee.status === 'away').length,
      busy: employees.filter((employee) => employee.status === 'busy').length,
      offline: employees.filter((employee) => employee.status === 'offline').length,
    };
  }, [employees]);

  const filteredEmployees = useMemo(() => {
    const query = employeeSearch.trim().toLowerCase();

    if (!query) {
      return employees;
    }

    return employees.filter((employee) => {
      const roomName = getRoomName(rooms, employee.currentRoomId).toLowerCase();

      return (
        employee.name.toLowerCase().includes(query) ||
        employee.position.toLowerCase().includes(query) ||
        roomName.includes(query)
      );
    });
  }, [employeeSearch, employees, rooms, getRoomName]);

  return (
    <>
      <h1 style={styles.title}>Dashboard</h1>
      <p style={styles.subtitle}>Prehľad zamestnancov, statusov a miestností</p>

      <div style={styles.statsGrid}>
        <StatCard label="Spolu" value={counts.total} />
        <StatCard label="Online" value={counts.online} />
        <StatCard label="Away" value={counts.away} />
        <StatCard label="Busy" value={counts.busy} />
      </div>

      <div style={styles.card}>
        <div style={styles.sectionTitle}>Vyhľadávanie zamestnancov</div>
        <input
          value={employeeSearch}
          onChange={(e) => setEmployeeSearch(e.target.value)}
          placeholder="Hľadať meno, pozíciu alebo miestnosť..."
          style={styles.input}
        />
      </div>

      <div style={styles.card}>
        <div style={styles.sectionTitle}>Zamestnanci</div>

        {filteredEmployees.length === 0 ? (
          <div style={styles.emptyState}>Žiadny zamestnanec nevyhovuje hľadaniu.</div>
        ) : (
          <div style={styles.list}>
            {filteredEmployees.map((emp) => (
              <EmployeeCard
                key={emp.id}
                employee={emp}
                rooms={rooms}
                currentUserId={currentUserId}
                getPresenceColor={getPresenceColor}
                getPresenceLabel={getPresenceLabel}
                getRoomName={getRoomName}
                timeAgo={timeAgo}
                moveEmployeeToRoom={moveEmployeeToRoom}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

const styles: Record<string, React.CSSProperties> = {
  title: {
    margin: 0,
    fontSize: 34,
    fontWeight: 800,
    color: '#111827',
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 24,
    color: '#6b7280',
    fontSize: 16,
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
    gap: 16,
    marginBottom: 20,
  },
  card: {
    background: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: 18,
    padding: 18,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 800,
    marginBottom: 16,
    color: '#111827',
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    borderRadius: 12,
    border: '1px solid #d1d5db',
    fontSize: 14,
    boxSizing: 'border-box',
    background: '#fff',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  emptyState: {
    padding: 20,
    borderRadius: 14,
    background: '#f9fafb',
    border: '1px dashed #d1d5db',
    color: '#6b7280',
  },
};