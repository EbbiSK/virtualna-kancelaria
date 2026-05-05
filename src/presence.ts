import type { PresenceRecord, PresenceStatus, Employee } from './types';

const AWAY_AFTER_MS = 60_000;
const OFFLINE_AFTER_MS = 5 * 60_000;

export function createDefaultPresence(employees: Employee[]): Record<string, PresenceRecord> {
  const map: Record<string, PresenceRecord> = {};

  for (const emp of employees) {
    map[emp.id] = {
      employeeId: emp.id,
      status: 'offline',
      lastActiveAt: new Date(0).toISOString(),
      manual: false,
    };
  }

  return map;
}

export function resolvePresenceStatus(record?: PresenceRecord): PresenceStatus {
  if (!record) return 'offline';

  if (record.manual && (record.status === 'busy' || record.status === 'offline')) {
    return record.status;
  }

  const diff = Date.now() - new Date(record.lastActiveAt).getTime();

  if (diff >= OFFLINE_AFTER_MS) return 'offline';
  if (diff >= AWAY_AFTER_MS) return 'away';

  return 'online';
}

export function getPresenceColor(status: PresenceStatus) {
  switch (status) {
    case 'online':
      return '#22c55e';
    case 'away':
      return '#f59e0b';
    case 'busy':
      return '#ef4444';
    default:
      return '#9ca3af';
  }
}

export function getPresenceLabel(status: PresenceStatus) {
  switch (status) {
    case 'online':
      return 'Online';
    case 'away':
      return 'Away';
    case 'busy':
      return 'Busy';
    default:
      return 'Offline';
  }
}