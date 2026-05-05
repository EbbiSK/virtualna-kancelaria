import { useEffect, useMemo, useRef } from 'react';
import { useNotifications } from '../context/NotificationsContext';

type BaseMessage = {
  id: string;
  authorId: string;
  authorName?: string;
  content?: string;
  text?: string;
  createdAt?: string;
};

type RoomMessageLike = BaseMessage & {
  roomId: string;
};

type DirectMessageLike = BaseMessage & {
  conversationId?: string;
  toUserId?: string;
  fromUserId?: string;
};

type GetRoomName<T> = (roomId: string, message: T) => string;
type GetDmLink<T> = (message: T) => string | undefined;
type GetRoomLink<T> = (message: T) => string | undefined;
type ShouldNotify<T> = (message: T) => boolean;

interface UseRealtimeNotificationsParams<
  TRoomMessage extends RoomMessageLike,
  TDirectMessage extends DirectMessageLike
> {
  currentUserId: string;
  roomMessages: TRoomMessage[];
  directMessages: TDirectMessage[];
  getRoomName: GetRoomName<TRoomMessage>;
  getRoomLink?: GetRoomLink<TRoomMessage>;
  getDmLink?: GetDmLink<TDirectMessage>;
  shouldNotifyRoomMessage?: ShouldNotify<TRoomMessage>;
  shouldNotifyDirectMessage?: ShouldNotify<TDirectMessage>;
}

function getMessagePreview(message: { content?: string; text?: string }) {
  const raw = message.content ?? message.text ?? '';
  const trimmed = raw.trim();

  if (!trimmed) return 'Nová správa';
  if (trimmed.length <= 120) return trimmed;

  return `${trimmed.slice(0, 117)}...`;
}

export function useRealtimeNotifications<
  TRoomMessage extends RoomMessageLike,
  TDirectMessage extends DirectMessageLike
>({
  currentUserId,
  roomMessages,
  directMessages,
  getRoomName,
  getRoomLink,
  getDmLink,
  shouldNotifyRoomMessage,
  shouldNotifyDirectMessage,
}: UseRealtimeNotificationsParams<TRoomMessage, TDirectMessage>) {
  const { addNotification } = useNotifications();

  const initializedRef = useRef(false);
  const seenRoomMessageIdsRef = useRef<Set<string>>(new Set());
  const seenDirectMessageIdsRef = useRef<Set<string>>(new Set());

  const safeRoomMessages = useMemo(() => roomMessages ?? [], [roomMessages]);
  const safeDirectMessages = useMemo(() => directMessages ?? [], [directMessages]);

  useEffect(() => {
    if (!initializedRef.current) {
      for (const message of safeRoomMessages) {
        seenRoomMessageIdsRef.current.add(message.id);
      }

      for (const message of safeDirectMessages) {
        seenDirectMessageIdsRef.current.add(message.id);
      }

      initializedRef.current = true;
      return;
    }

    for (const message of safeRoomMessages) {
      const alreadySeen = seenRoomMessageIdsRef.current.has(message.id);
      if (alreadySeen) continue;

      seenRoomMessageIdsRef.current.add(message.id);

      const isOwnMessage = message.authorId === currentUserId;
      if (isOwnMessage) continue;

      if (shouldNotifyRoomMessage && !shouldNotifyRoomMessage(message)) {
        continue;
      }

      const roomName = getRoomName(message.roomId, message);

      addNotification({
        id: `room_${message.id}`,
        type: 'room_message',
        title: `Nová správa v miestnosti ${roomName}`,
        body: `${message.authorName ?? 'Používateľ'}: ${getMessagePreview(message)}`,
        roomId: message.roomId,
        roomName,
        senderId: message.authorId,
        senderName: message.authorName,
        createdAt: message.createdAt,
        link: getRoomLink?.(message),
      });
    }
  }, [
    addNotification,
    currentUserId,
    getRoomLink,
    getRoomName,
    safeRoomMessages,
    shouldNotifyRoomMessage,
  ]);

  useEffect(() => {
    if (!initializedRef.current) return;

    for (const message of safeDirectMessages) {
      const alreadySeen = seenDirectMessageIdsRef.current.has(message.id);
      if (alreadySeen) continue;

      seenDirectMessageIdsRef.current.add(message.id);

      const possibleSenderId = message.fromUserId ?? message.authorId;
      const isOwnMessage = possibleSenderId === currentUserId;
      if (isOwnMessage) continue;

      if (shouldNotifyDirectMessage && !shouldNotifyDirectMessage(message)) {
        continue;
      }

      addNotification({
        id: `dm_${message.id}`,
        type: 'dm_message',
        title: `Nová priama správa`,
        body: `${message.authorName ?? 'Používateľ'}: ${getMessagePreview(message)}`,
        senderId: possibleSenderId,
        senderName: message.authorName,
        dmUserId: possibleSenderId,
        createdAt: message.createdAt,
        link: getDmLink?.(message),
      });
    }
  }, [
    addNotification,
    currentUserId,
    getDmLink,
    safeDirectMessages,
    shouldNotifyDirectMessage,
  ]);
}