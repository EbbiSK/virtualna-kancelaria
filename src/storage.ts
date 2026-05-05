const ROOMS_KEY = 'virtual-office-rooms';
const TASKS_KEY = 'virtual-office-room-tasks';

export function readStoredRooms<T>(fallback: T): T {
  try {
    const raw = window.localStorage.getItem(ROOMS_KEY);
    if (!raw) return fallback;

    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeStoredRooms<T>(rooms: T) {
  try {
    window.localStorage.setItem(ROOMS_KEY, JSON.stringify(rooms));
  } catch {
    // ignore
  }
}

export function readStoredTasks<T>(fallback: T): T {
  try {
    const raw = window.localStorage.getItem(TASKS_KEY);
    if (!raw) return fallback;

    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeStoredTasks<T>(tasks: T) {
  try {
    window.localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  } catch {
    // ignore
  }
}