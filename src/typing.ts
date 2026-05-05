import { nowIso } from './utils';

export type DirectMessageTypingState = {
  conversationId: string;
  userId: string;
  userName: string;
  startedAt: string;
  expiresAt: string;
};

const DM_TYPING_KEY = 'virtual-office-dm-typing';
const DM_TYPING_UPDATED_EVENT = 'virtual-office-dm-typing-updated';
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

function notifyTypingUpdated() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(DM_TYPING_UPDATED_EVENT));
  }
}

export function getDmTypingUpdatedEventName() {
  return DM_TYPING_UPDATED_EVENT;
}

export function readDirectMessageTypingStates(): DirectMessageTypingState[] {
  const states = readLocalStorage<DirectMessageTypingState[]>(DM_TYPING_KEY, []);
  const now = Date.now();

  const filtered = states.filter(
    (state) => new Date(state.expiresAt).getTime() > now
  );

  if (filtered.length !== states.length) {
    writeLocalStorage(DM_TYPING_KEY, filtered);
  }

  return filtered;
}

export function writeDirectMessageTypingStates(states: DirectMessageTypingState[]) {
  writeLocalStorage(DM_TYPING_KEY, states);
  notifyTypingUpdated();
}

export function setDirectMessageTyping(input: {
  conversationId: string;
  userId: string;
  userName: string;
  ttlMs?: number;
}) {
  const ttlMs = input.ttlMs ?? DEFAULT_TYPING_TTL_MS;
  const now = Date.now();

  const nextState: DirectMessageTypingState = {
    conversationId: input.conversationId,
    userId: input.userId,
    userName: input.userName,
    startedAt: nowIso(),
    expiresAt: new Date(now + ttlMs).toISOString(),
  };

  const current = readDirectMessageTypingStates();

  const next = [
    ...current.filter(
      (state) =>
        !(
          state.conversationId === input.conversationId &&
          state.userId === input.userId
        )
    ),
    nextState,
  ];

  writeDirectMessageTypingStates(next);
  return nextState;
}

export function clearDirectMessageTyping(conversationId: string, userId: string) {
  const current = readDirectMessageTypingStates();

  const next = current.filter(
    (state) =>
      !(state.conversationId === conversationId && state.userId === userId)
  );

  writeDirectMessageTypingStates(next);
}

export function getTypingUsersForConversation(
  conversationId: string,
  excludeUserId?: string
) {
  return readDirectMessageTypingStates()
    .filter((state) => state.conversationId === conversationId)
    .filter((state) => (excludeUserId ? state.userId !== excludeUserId : true))
    .sort(
      (a, b) =>
        new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
    );
}