import { nowIso } from './utils';

export type MessageReaction = {
  emoji: string;
  userIds: string[];
};

export type RoomMessage = {
  id: string;
  roomId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  isEdited?: boolean;
  isPinned?: boolean;
  pinnedAt?: string;
  pinnedByUserId?: string;
  readBy: string[];
  reactions?: MessageReaction[];
  replyToMessageId?: string;
  replyToAuthorName?: string;
  replyToContent?: string;
};

export type DirectMessage = {
  id: string;
  conversationId: string;
  authorId: string;
  authorName: string;
  fromUserId: string;
  toUserId: string;
  content: string;
  createdAt: string;
  readBy: string[];
};

const ROOM_MESSAGES_KEY = 'virtual-office-room-messages';
const DIRECT_MESSAGES_KEY = 'virtual-office-direct-messages';
const MESSAGES_UPDATED_EVENT = 'virtual-office-messages-updated';

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

function generateId(prefix: string) {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function notifyMessagesUpdated() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(MESSAGES_UPDATED_EVENT));
  }
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function normalizeHandleCandidate(value: string) {
  return value.trim().replace(/\s+/g, '');
}

export function messageContainsMention(content: string, currentUserName?: string) {
  const text = content.toLowerCase();

  if (/@all\b/i.test(text) || /@channel\b/i.test(text) || /@everyone\b/i.test(text)) {
    return true;
  }

  if (!currentUserName?.trim()) return false;

  const compactName = normalizeHandleCandidate(currentUserName);
  if (!compactName) return false;

  const escapedOriginal = escapeRegExp(compactName);
  const escapedLower = escapeRegExp(compactName.toLowerCase());
  const escapedDashed = escapeRegExp(compactName.toLowerCase().replace(/\s+/g, '-'));
  const escapedUnderscored = escapeRegExp(compactName.toLowerCase().replace(/\s+/g, '_'));

  const patterns = [
    new RegExp(`@${escapedOriginal}(?![\\w-])`, 'i'),
    new RegExp(`@${escapedLower}(?![\\w-])`, 'i'),
    new RegExp(`@${escapedDashed}(?![\\w-])`, 'i'),
    new RegExp(`@${escapedUnderscored}(?![\\w-])`, 'i'),
  ];

  return patterns.some((pattern) => pattern.test(content));
}

export function getMessagesUpdatedEventName() {
  return MESSAGES_UPDATED_EVENT;
}

export function getConversationId(userA: string, userB: string) {
  return [userA, userB].sort().join('__');
}

export function readRoomMessages(): RoomMessage[] {
  return readLocalStorage<RoomMessage[]>(ROOM_MESSAGES_KEY, []).map((message) => ({
    ...message,
    reactions: message.reactions ?? [],
    isPinned: message.isPinned ?? false,
  }));
}

export function writeRoomMessages(messages: RoomMessage[]) {
  writeLocalStorage(ROOM_MESSAGES_KEY, messages);
  notifyMessagesUpdated();
}

export function addRoomMessage(input: {
  roomId: string;
  authorId: string;
  authorName: string;
  content: string;
  replyToMessageId?: string;
  replyToAuthorName?: string;
  replyToContent?: string;
}) {
  const message: RoomMessage = {
    id: generateId('roommsg'),
    roomId: input.roomId,
    authorId: input.authorId,
    authorName: input.authorName,
    content: input.content,
    createdAt: nowIso(),
    readBy: [input.authorId],
    reactions: [],
    replyToMessageId: input.replyToMessageId,
    replyToAuthorName: input.replyToAuthorName,
    replyToContent: input.replyToContent,
    isPinned: false,
  };

  const current = readRoomMessages();
  const next = [...current, message];
  writeRoomMessages(next);

  return message;
}

export function editRoomMessage(messageId: string, userId: string, nextContent: string) {
  const trimmedContent = nextContent.trim();
  if (!trimmedContent) {
    return readRoomMessages();
  }

  const current = readRoomMessages();
  let changed = false;

  const next = current.map((message) => {
    if (message.id !== messageId) return message;
    if (message.authorId !== userId) return message;
    if (message.content === trimmedContent) return message;

    changed = true;

    return {
      ...message,
      content: trimmedContent,
      updatedAt: nowIso(),
      isEdited: true,
    };
  });

  if (changed) {
    writeRoomMessages(next);
  }

  return next;
}

export function deleteRoomMessage(messageId: string, userId: string) {
  const current = readRoomMessages();

  const target = current.find((message) => message.id === messageId);
  if (!target || target.authorId !== userId) {
    return current;
  }

  const next = current.filter((message) => message.id !== messageId);
  writeRoomMessages(next);

  return next;
}

export function pinRoomMessage(messageId: string, userId: string) {
  const current = readRoomMessages();
  const target = current.find((message) => message.id === messageId);

  if (!target) return current;

  const next = current.map((message) => {
    if (message.roomId !== target.roomId) {
      return message;
    }

    if (message.id === messageId) {
      return {
        ...message,
        isPinned: true,
        pinnedAt: nowIso(),
        pinnedByUserId: userId,
      };
    }

    if (message.isPinned) {
      return {
        ...message,
        isPinned: false,
        pinnedAt: undefined,
        pinnedByUserId: undefined,
      };
    }

    return message;
  });

  writeRoomMessages(next);
  return next;
}

export function unpinRoomMessage(messageId: string) {
  const current = readRoomMessages();
  let changed = false;

  const next = current.map((message) => {
    if (message.id !== messageId || !message.isPinned) {
      return message;
    }

    changed = true;

    return {
      ...message,
      isPinned: false,
      pinnedAt: undefined,
      pinnedByUserId: undefined,
    };
  });

  if (changed) {
    writeRoomMessages(next);
  }

  return next;
}

export function getPinnedRoomMessage(roomId: string) {
  return readRoomMessages().find((message) => message.roomId === roomId && message.isPinned) ?? null;
}

export function toggleRoomMessageReaction(messageId: string, emoji: string, userId: string) {
  const current = readRoomMessages();
  let changed = false;

  const next = current.map((message) => {
    if (message.id !== messageId) return message;

    const reactions = message.reactions ?? [];
    const existingReaction = reactions.find((reaction) => reaction.emoji === emoji);

    changed = true;

    if (!existingReaction) {
      return {
        ...message,
        reactions: [...reactions, { emoji, userIds: [userId] }],
      };
    }

    const hasReacted = existingReaction.userIds.includes(userId);

    const nextReactionUserIds = hasReacted
      ? existingReaction.userIds.filter((id) => id !== userId)
      : [...existingReaction.userIds, userId];

    const nextReactions = reactions
      .map((reaction) =>
        reaction.emoji === emoji
          ? { ...reaction, userIds: nextReactionUserIds }
          : reaction
      )
      .filter((reaction) => reaction.userIds.length > 0);

    return {
      ...message,
      reactions: nextReactions,
    };
  });

  if (changed) {
    writeRoomMessages(next);
  }

  return next;
}

export function getRoomMessages(roomId: string) {
  return readRoomMessages()
    .filter((message) => message.roomId === roomId)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export function markRoomMessagesAsRead(roomId: string, userId: string) {
  const current = readRoomMessages();
  let changed = false;

  const next = current.map((message) => {
    const isSameRoom = message.roomId === roomId;
    const alreadyRead = message.readBy.includes(userId);

    if (!isSameRoom || alreadyRead) {
      return message;
    }

    changed = true;

    return {
      ...message,
      readBy: [...message.readBy, userId],
    };
  });

  if (changed) {
    writeRoomMessages(next);
  }

  return next;
}

export function getUnreadRoomMessagesCount(roomId: string, userId: string) {
  return getRoomMessages(roomId).filter(
    (message) => message.authorId !== userId && !message.readBy.includes(userId)
  ).length;
}

export function getAllUnreadRoomMessagesCount(userId: string) {
  return readRoomMessages().filter(
    (message) => message.authorId !== userId && !message.readBy.includes(userId)
  ).length;
}

export function getUnreadRoomMessagesCountByRoom(userId: string) {
  const messages = readRoomMessages();

  return messages.reduce<Record<string, number>>((acc, message) => {
    if (message.authorId !== userId && !message.readBy.includes(userId)) {
      acc[message.roomId] = (acc[message.roomId] ?? 0) + 1;
    }
    return acc;
  }, {});
}

export function getUnreadRoomMentionsCountByRoom(userId: string, currentUserName: string) {
  const messages = readRoomMessages();

  return messages.reduce<Record<string, number>>((acc, message) => {
    const isUnread = message.authorId !== userId && !message.readBy.includes(userId);

    if (!isUnread) return acc;

    if (messageContainsMention(message.content, currentUserName)) {
      acc[message.roomId] = (acc[message.roomId] ?? 0) + 1;
    }

    return acc;
  }, {});
}

export function getUnreadRoomStateByRoom(userId: string, currentUserName: string) {
  const messages = readRoomMessages();

  return messages.reduce<
    Record<
      string,
      {
        unreadCount: number;
        mentionCount: number;
        hasUnread: boolean;
        hasMention: boolean;
      }
    >
  >((acc, message) => {
    const isUnread = message.authorId !== userId && !message.readBy.includes(userId);
    if (!isUnread) return acc;

    const prev = acc[message.roomId] ?? {
      unreadCount: 0,
      mentionCount: 0,
      hasUnread: false,
      hasMention: false,
    };

    const hasMentionInMessage = messageContainsMention(message.content, currentUserName);

    acc[message.roomId] = {
      unreadCount: prev.unreadCount + 1,
      mentionCount: prev.mentionCount + (hasMentionInMessage ? 1 : 0),
      hasUnread: true,
      hasMention: prev.hasMention || hasMentionInMessage,
    };

    return acc;
  }, {});
}

export function deleteRoomMessages(roomId: string) {
  const current = readRoomMessages();
  const next = current.filter((message) => message.roomId !== roomId);

  if (next.length !== current.length) {
    writeRoomMessages(next);
  }

  return next;
}

export function readDirectMessages(): DirectMessage[] {
  return readLocalStorage<DirectMessage[]>(DIRECT_MESSAGES_KEY, []);
}

export function writeDirectMessages(messages: DirectMessage[]) {
  writeLocalStorage(DIRECT_MESSAGES_KEY, messages);
  notifyMessagesUpdated();
}

export function addDirectMessage(input: {
  fromUserId: string;
  toUserId: string;
  authorId: string;
  authorName: string;
  content: string;
}) {
  const conversationId = getConversationId(input.fromUserId, input.toUserId);

  const message: DirectMessage = {
    id: generateId('dm'),
    conversationId,
    authorId: input.authorId,
    authorName: input.authorName,
    fromUserId: input.fromUserId,
    toUserId: input.toUserId,
    content: input.content,
    createdAt: nowIso(),
    readBy: [input.fromUserId],
  };

  const current = readDirectMessages();
  const next = [...current, message];
  writeDirectMessages(next);

  return message;
}

export function getDirectConversationMessages(userA: string, userB: string) {
  const conversationId = getConversationId(userA, userB);

  return readDirectMessages()
    .filter((message) => message.conversationId === conversationId)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export function markDirectConversationAsRead(currentUserId: string, otherUserId: string) {
  const conversationId = getConversationId(currentUserId, otherUserId);
  const current = readDirectMessages();

  let changed = false;

  const next = current.map((message) => {
    const isSameConversation = message.conversationId === conversationId;
    const isIncoming = message.toUserId === currentUserId;
    const alreadyRead = message.readBy.includes(currentUserId);

    if (!isSameConversation || !isIncoming || alreadyRead) {
      return message;
    }

    changed = true;

    return {
      ...message,
      readBy: [...message.readBy, currentUserId],
    };
  });

  if (changed) {
    writeDirectMessages(next);
  }

  return next;
}

export function getUnreadDirectMessagesCount(currentUserId: string, otherUserId: string) {
  return getDirectConversationMessages(currentUserId, otherUserId).filter(
    (message) =>
      message.toUserId === currentUserId &&
      message.fromUserId === otherUserId &&
      !message.readBy.includes(currentUserId)
  ).length;
}

export function getAllUnreadDirectMessagesCount(currentUserId: string) {
  return readDirectMessages().filter(
    (message) => message.toUserId === currentUserId && !message.readBy.includes(currentUserId)
  ).length;
}

export function getRoomMessagesCountByRoom() {
  const messages = readRoomMessages();

  return messages.reduce<Record<string, number>>((acc, message) => {
    acc[message.roomId] = (acc[message.roomId] ?? 0) + 1;
    return acc;
  }, {});
}

export function seedDemoMessages() {
  const existingRoomMessages = readRoomMessages();
  const existingDirectMessages = readDirectMessages();

  if (existingRoomMessages.length === 0) {
    const demoRoomMessages: RoomMessage[] = [
      {
        id: generateId('roommsg'),
        roomId: 'room-1',
        authorId: 'emp-2',
        authorName: 'Petra',
        content: 'Ahojte, dnes riešime prioritne onboarding flow.',
        createdAt: nowIso(),
        readBy: ['emp-2'],
        reactions: [],
        isPinned: false,
      },
      {
        id: generateId('roommsg'),
        roomId: 'room-2',
        authorId: 'emp-3',
        authorName: 'Marek',
        content: 'Prosím pozrite posledný návrh dashboardu.',
        createdAt: nowIso(),
        readBy: ['emp-3'],
        reactions: [],
        isPinned: false,
      },
    ];

    writeRoomMessages(demoRoomMessages);
  }

  if (existingDirectMessages.length === 0) {
    const demoDirectMessages: DirectMessage[] = [
      {
        id: generateId('dm'),
        conversationId: getConversationId('emp-1', 'emp-2'),
        authorId: 'emp-2',
        authorName: 'Petra',
        fromUserId: 'emp-2',
        toUserId: 'emp-1',
        content: 'Máš chvíľu na krátky call?',
        createdAt: nowIso(),
        readBy: ['emp-2'],
      },
      {
        id: generateId('dm'),
        conversationId: getConversationId('emp-1', 'emp-2'),
        authorId: 'emp-1',
        authorName: 'Jaroslav',
        fromUserId: 'emp-1',
        toUserId: 'emp-2',
        content: 'Jasné, napíš mi o 10 minút.',
        createdAt: nowIso(),
        readBy: ['emp-1', 'emp-2'],
      },
    ];

    writeDirectMessages(demoDirectMessages);
  }
}

export function clearAllMessages() {
  writeRoomMessages([]);
  writeDirectMessages([]);
}

export const MESSAGE_STORAGE_KEYS = {
  roomMessages: ROOM_MESSAGES_KEY,
  directMessages: DIRECT_MESSAGES_KEY,
} as const;