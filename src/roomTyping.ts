import { nowIso } from './utils';

export type RoomTypingState = {
  roomId: string;
  userId: string;
  userName: string;
  startedAt: string;
  expiresAt: string;
};

const ROOM_TYPING_KEY = 'virtual-office-room-typing';
const ROOM_TYPING_UPDATED_EVENT = 'virtual-office-room-typing-updated';
const DEFAULT_TYPING_TTL_MS = 3000;

function readLocalStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeLocalStorage<T>(key: string, value: T) {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

function notifyRoomTypingUpdated() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(ROOM_TYPING_UPDATED_EVENT));
  }
}

export function getRoomTypingUpdatedEventName() {
  return ROOM_TYPING_UPDATED_EVENT;
}

export function readRoomTypingStates(): RoomTypingState[] {
  const states = readLocalStorage<RoomTypingState[]>(ROOM_TYPING_KEY, []);
  const now = Date.now();

  const filtered = states.filter(
    (state) => new Date(state.expiresAt).getTime() > now
  );

  if (filtered.length !== states.length) {
    writeLocalStorage(ROOM_TYPING_KEY, filtered);
  }

  return filtered;
}

export function writeRoomTypingStates(states: RoomTypingState[]) {
  writeLocalStorage(ROOM_TYPING_KEY, states);
  notifyRoomTypingUpdated();
}

export function setRoomTyping(input: {
  roomId: string;
  userId: string;
  userName: string;
  ttlMs?: number;
}) {
  const ttlMs = input.ttlMs ?? DEFAULT_TYPING_TTL_MS;
  const now = Date.now();

  const nextState: RoomTypingState = {
    roomId: input.roomId,
    userId: input.userId,
    userName: input.userName,
    startedAt: nowIso(),
    expiresAt: new Date(now + ttlMs).toISOString(),
  };

  const current = readRoomTypingStates();

  const next = [
    ...current.filter(
      (state) =>
        !(state.roomId === input.roomId && state.userId === input.userId)
    ),
    nextState,
  ];

  writeRoomTypingStates(next);
  return nextState;
}

export function clearRoomTyping(roomId: string, userId: string) {
  const current = readRoomTypingStates();

  const next = current.filter(
    (state) => !(state.roomId === roomId && state.userId === userId)
  );

  writeRoomTypingStates(next);
}

export function clearAllRoomTypingForRoom(roomId: string) {
  const current = readRoomTypingStates();
  const next = current.filter((state) => state.roomId !== roomId);

  if (next.length !== current.length) {
    writeRoomTypingStates(next);
  }
}

export function getTypingUsersForRoom(roomId: string, excludeUserId?: string) {
  return readRoomTypingStates()
    .filter((state) => state.roomId === roomId)
    .filter((state) => (excludeUserId ? state.userId !== excludeUserId : true))
    .sort(
      (a, b) =>
        new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
    );
}