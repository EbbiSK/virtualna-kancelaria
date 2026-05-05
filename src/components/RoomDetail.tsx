import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import type { PresenceStatus, Room } from '../types';
import EmployeeCard from './EmployeeCard';
import ChatComposer from './ChatComposer';
import {
  addRoomMessage,
  deleteRoomMessage,
  editRoomMessage,
  getPinnedRoomMessage,
  markRoomMessagesAsRead,
  getMessagesUpdatedEventName,
  messageContainsMention,
  pinRoomMessage,
  readRoomMessages,
  toggleRoomMessageReaction,
  unpinRoomMessage,
  type RoomMessage as StoredRoomMessage,
} from '../messages';
import {
  clearRoomTyping,
  getRoomTypingUpdatedEventName,
  getTypingUsersForRoom,
  setRoomTyping,
} from '../roomTyping';

type EmployeeWithStatus = {
  id: string;
  name: string;
  position: string;
  avatar: string;
  currentRoomId: string;
  status: PresenceStatus;
  lastActiveAt: string;
};

type RoomTask = {
  id: string;
  roomId: string;
  title: string;
  done: boolean;
};

type Props = {
  rooms: Room[];
  selectedRoomId: string;
  employees: EmployeeWithStatus[];
  currentUserId: string;
  getRoomName: (rooms: Room[], roomId: string) => string;
  getPresenceColor: (status: PresenceStatus) => string;
  getPresenceLabel: (status: PresenceStatus) => string;
  timeAgo: (iso: string) => string;
  moveEmployeeToRoom: (employeeId: string, roomId: string) => void;
  tasks: RoomTask[];
  addTask: (roomId: string, title: string) => void;
  toggleTask: (taskId: string) => void;
};

const QUICK_REACTIONS = ['👍', '❤️', '🎉', '👀'];

function truncateReplyPreview(value?: string, max = 90) {
  if (!value) return '';
  return value.length > max ? `${value.slice(0, max)}…` : value;
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function renderHighlightedText(text: string, query: string): ReactNode {
  if (!query.trim()) {
    return text;
  }

  const pattern = new RegExp(`(${escapeRegExp(query)})`, 'gi');
  const parts = text.split(pattern);

  return parts.map((part, index) => {
    const isMatch = part.toLowerCase() === query.toLowerCase();

    if (!isMatch) {
      return <span key={`${part}-${index}`}>{part}</span>;
    }

    return (
      <mark key={`${part}-${index}`} style={styles.inlineHighlight}>
        {part}
      </mark>
    );
  });
}

export default function RoomDetail({
  rooms,
  selectedRoomId,
  employees,
  currentUserId,
  getRoomName,
  getPresenceColor,
  getPresenceLabel,
  timeAgo,
  moveEmployeeToRoom,
  tasks,
  addTask,
  toggleTask,
}: Props) {
  const [messages, setMessages] = useState<StoredRoomMessage[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [taskInput, setTaskInput] = useState('');
  const [typingTick, setTypingTick] = useState(0);
  const [firstUnreadMessageId, setFirstUnreadMessageId] = useState<string | null>(null);
  const [showUnreadDivider, setShowUnreadDivider] = useState(false);
  const [showScrollToLatest, setShowScrollToLatest] = useState(false);
  const [newMessagesCount, setNewMessagesCount] = useState(0);
  const [newMentionCount, setNewMentionCount] = useState(0);
  const [pulseScrollButton, setPulseScrollButton] = useState(false);
  const [replyTarget, setReplyTarget] = useState<StoredRoomMessage | null>(null);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [pinnedMessage, setPinnedMessage] = useState<StoredRoomMessage | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSearchIndex, setActiveSearchIndex] = useState(0);

  const chatBoxRef = useRef<HTMLDivElement | null>(null);
  const unreadDividerRef = useRef<HTMLDivElement | null>(null);
  const didInitialScrollRef = useRef(false);
  const previousLastMessageIdRef = useRef<string | null>(null);
  const pulseTimeoutRef = useRef<number | null>(null);
  const messageItemRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const currentUser = useMemo(
    () => employees.find((employee) => employee.id === currentUserId),
    [employees, currentUserId]
  );

  const normalizedSearchQuery = searchQuery.trim().toLowerCase();

  const isNearBottom = () => {
    const box = chatBoxRef.current;
    if (!box) return true;

    const distanceFromBottom = box.scrollHeight - box.scrollTop - box.clientHeight;
    return distanceFromBottom < 120;
  };

  const clearSessionIndicators = () => {
    setShowUnreadDivider(false);
    setNewMessagesCount(0);
    setNewMentionCount(0);
    setPulseScrollButton(false);

    if (pulseTimeoutRef.current) {
      window.clearTimeout(pulseTimeoutRef.current);
      pulseTimeoutRef.current = null;
    }
  };

  const triggerScrollButtonPulse = () => {
    setPulseScrollButton(true);

    if (pulseTimeoutRef.current) {
      window.clearTimeout(pulseTimeoutRef.current);
    }

    pulseTimeoutRef.current = window.setTimeout(() => {
      setPulseScrollButton(false);
      pulseTimeoutRef.current = null;
    }, 1400);
  };

  const updateScrollState = () => {
    const box = chatBoxRef.current;
    if (!box) return;

    const distanceFromBottom = box.scrollHeight - box.scrollTop - box.clientHeight;
    const nearBottom = distanceFromBottom < 120;

    setShowScrollToLatest(!nearBottom);

    if (nearBottom) {
      clearSessionIndicators();
    }
  };

  const refreshPinnedMessage = () => {
    setPinnedMessage(getPinnedRoomMessage(selectedRoomId));
  };

  useEffect(() => {
    didInitialScrollRef.current = false;
    setShowScrollToLatest(false);
    setNewMessagesCount(0);
    setNewMentionCount(0);
    setPulseScrollButton(false);
    setReplyTarget(null);
    setEditingMessageId(null);
    setEditingValue('');
    setSearchQuery('');
    setActiveSearchIndex(0);

    const beforeRead = readRoomMessages()
      .filter((message) => message.roomId === selectedRoomId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    const firstUnread = beforeRead.find(
      (message) =>
        message.authorId !== currentUserId && !message.readBy.includes(currentUserId)
    );

    setFirstUnreadMessageId(firstUnread?.id ?? null);
    setShowUnreadDivider(Boolean(firstUnread));

    const next = markRoomMessagesAsRead(selectedRoomId, currentUserId);
    const nextRoomMessages = next
      .filter((message) => message.roomId === selectedRoomId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    setMessages(nextRoomMessages);
    previousLastMessageIdRef.current = nextRoomMessages[nextRoomMessages.length - 1]?.id ?? null;
    refreshPinnedMessage();
  }, [selectedRoomId, currentUserId]);

  useEffect(() => {
    const handleTypingRefresh = () => {
      setTypingTick((prev) => prev + 1);
    };

    const refreshMessages = () => {
      const nearBottomBeforeRefresh = isNearBottom();

      const next = markRoomMessagesAsRead(selectedRoomId, currentUserId);
      const nextRoomMessages = next
        .filter((message) => message.roomId === selectedRoomId)
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

      const prevLastMessageId = previousLastMessageIdRef.current;
      const nextLastMessage = nextRoomMessages[nextRoomMessages.length - 1] ?? null;
      const hasNewLastMessage = Boolean(nextLastMessage && nextLastMessage.id !== prevLastMessageId);

      if (hasNewLastMessage && nextLastMessage && !nearBottomBeforeRefresh) {
        const isIncoming = nextLastMessage.authorId !== currentUserId;
        if (isIncoming) {
          setNewMessagesCount((prev) => prev + 1);

          if (messageContainsMention(nextLastMessage.content, currentUser?.name)) {
            setNewMentionCount((prev) => prev + 1);
          }

          triggerScrollButtonPulse();
        }
      }

      previousLastMessageIdRef.current = nextLastMessage?.id ?? null;
      setMessages(nextRoomMessages);
      refreshPinnedMessage();
    };

    const typingEventName = getRoomTypingUpdatedEventName();
    const messagesEventName = getMessagesUpdatedEventName();

    const interval = window.setInterval(() => {
      refreshMessages();
      setTypingTick((prev) => prev + 1);
    }, 1000);

    window.addEventListener(typingEventName, handleTypingRefresh as EventListener);
    window.addEventListener(messagesEventName, refreshMessages as EventListener);
    window.addEventListener('storage', refreshMessages);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener(typingEventName, handleTypingRefresh as EventListener);
      window.removeEventListener(messagesEventName, refreshMessages as EventListener);
      window.removeEventListener('storage', refreshMessages);

      if (pulseTimeoutRef.current) {
        window.clearTimeout(pulseTimeoutRef.current);
        pulseTimeoutRef.current = null;
      }
    };
  }, [selectedRoomId, currentUserId, currentUser?.name]);

  useEffect(() => {
    return () => {
      clearRoomTyping(selectedRoomId, currentUserId);
    };
  }, [selectedRoomId, currentUserId]);

  const selectedRoomEmployees = useMemo(
    () => employees.filter((emp) => emp.currentRoomId === selectedRoomId),
    [employees, selectedRoomId]
  );

  const selectedRoomMessages = useMemo(
    () =>
      messages
        .filter((msg) => msg.roomId === selectedRoomId)
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),
    [messages, selectedRoomId]
  );

  const filteredRoomMessages = useMemo(() => {
    if (!normalizedSearchQuery) return selectedRoomMessages;

    return selectedRoomMessages.filter((msg) => {
      const author = (msg.authorName ?? '').toLowerCase();
      const content = (msg.content ?? '').toLowerCase();
      const replyAuthor = (msg.replyToAuthorName ?? '').toLowerCase();
      const replyContent = (msg.replyToContent ?? '').toLowerCase();

      return (
        author.includes(normalizedSearchQuery) ||
        content.includes(normalizedSearchQuery) ||
        replyAuthor.includes(normalizedSearchQuery) ||
        replyContent.includes(normalizedSearchQuery)
      );
    });
  }, [selectedRoomMessages, normalizedSearchQuery]);

  useEffect(() => {
    if (!normalizedSearchQuery) {
      setActiveSearchIndex(0);
      return;
    }

    if (filteredRoomMessages.length === 0) {
      setActiveSearchIndex(0);
      return;
    }

    setActiveSearchIndex((prev) => Math.min(prev, filteredRoomMessages.length - 1));
  }, [normalizedSearchQuery, filteredRoomMessages.length]);

  const activeSearchMessageId = useMemo(() => {
    if (!normalizedSearchQuery) return null;
    if (filteredRoomMessages.length === 0) return null;
    return filteredRoomMessages[activeSearchIndex]?.id ?? null;
  }, [normalizedSearchQuery, filteredRoomMessages, activeSearchIndex]);

  useEffect(() => {
    if (!activeSearchMessageId) return;

    const node = messageItemRefs.current[activeSearchMessageId];
    if (!node) return;

    node.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  }, [activeSearchMessageId]);

  const groupedMessages = useMemo(() => {
    return filteredRoomMessages.map((msg, i) => {
      const prev = filteredRoomMessages[i - 1];
      const next = filteredRoomMessages[i + 1];
      const mine = msg.authorId === currentUserId;
      const hasMention = !mine && messageContainsMention(msg.content, currentUser?.name);
      const isUnreadDivider =
        !normalizedSearchQuery && showUnreadDivider && msg.id === firstUnreadMessageId;
      const isActiveSearchResult = normalizedSearchQuery && msg.id === activeSearchMessageId;

      return {
        msg,
        mine,
        hasMention,
        isUnreadDivider,
        isActiveSearchResult,
        isFirst: !prev || prev.authorId !== msg.authorId,
        isLast: !next || next.authorId !== msg.authorId,
      };
    });
  }, [
    filteredRoomMessages,
    currentUserId,
    currentUser?.name,
    firstUnreadMessageId,
    showUnreadDivider,
    normalizedSearchQuery,
    activeSearchMessageId,
  ]);

  const selectedRoomTasks = useMemo(
    () => tasks.filter((task) => task.roomId === selectedRoomId),
    [tasks, selectedRoomId]
  );

  const typingUsers = useMemo(() => {
    return getTypingUsersForRoom(selectedRoomId, currentUserId);
  }, [selectedRoomId, currentUserId, typingTick]);

  const typingLabel = useMemo(() => {
    if (typingUsers.length === 0) return '';

    if (typingUsers.length === 1) {
      return `${typingUsers[0].userName} píše...`;
    }

    if (typingUsers.length === 2) {
      return `${typingUsers[0].userName} a ${typingUsers[1].userName} píšu...`;
    }

    return 'Viacerí používatelia píšu...';
  }, [typingUsers]);

  const selectedRoom = useMemo(
    () => rooms.find((room) => room.id === selectedRoomId),
    [rooms, selectedRoomId]
  );

  const onlineCount = useMemo(
    () => selectedRoomEmployees.filter((employee) => employee.status === 'online').length,
    [selectedRoomEmployees]
  );

  useEffect(() => {
    const box = chatBoxRef.current;
    if (!box) return;

    const handleScroll = () => {
      updateScrollState();
    };

    box.addEventListener('scroll', handleScroll);
    updateScrollState();

    return () => {
      box.removeEventListener('scroll', handleScroll);
    };
  }, [selectedRoomId, groupedMessages.length, showUnreadDivider, normalizedSearchQuery]);

  useEffect(() => {
    if (!chatBoxRef.current || didInitialScrollRef.current === true) return;

    if (!normalizedSearchQuery && showUnreadDivider && firstUnreadMessageId && unreadDividerRef.current) {
      unreadDividerRef.current.scrollIntoView({
        block: 'center',
        behavior: 'auto',
      });
    } else {
      chatBoxRef.current.scrollTo({
        top: chatBoxRef.current.scrollHeight,
        behavior: 'auto',
      });
    }

    didInitialScrollRef.current = true;

    window.setTimeout(() => {
      updateScrollState();
    }, 0);
  }, [
    firstUnreadMessageId,
    groupedMessages.length,
    selectedRoomId,
    showUnreadDivider,
    normalizedSearchQuery,
  ]);

  useEffect(() => {
    if (!chatBoxRef.current) return;
    if (!didInitialScrollRef.current) return;

    const box = chatBoxRef.current;
    const nearBottom = isNearBottom();

    if (!nearBottom) {
      updateScrollState();
      return;
    }

    box.scrollTo({
      top: box.scrollHeight,
      behavior: 'smooth',
    });

    clearSessionIndicators();

    window.setTimeout(() => {
      updateScrollState();
    }, 200);
  }, [groupedMessages.length]);

  const scrollToLatest = () => {
    const box = chatBoxRef.current;
    if (!box) return;

    box.scrollTo({
      top: box.scrollHeight,
      behavior: 'smooth',
    });

    clearSessionIndicators();

    window.setTimeout(() => {
      updateScrollState();
    }, 250);
  };

  const goToPreviousSearchResult = () => {
    if (filteredRoomMessages.length === 0) return;
    setActiveSearchIndex((prev) =>
      prev === 0 ? filteredRoomMessages.length - 1 : prev - 1
    );
  };

  const goToNextSearchResult = () => {
    if (filteredRoomMessages.length === 0) return;
    setActiveSearchIndex((prev) =>
      prev === filteredRoomMessages.length - 1 ? 0 : prev + 1
    );
  };

  const refreshRoomMessagesInState = (nextMessages: StoredRoomMessage[]) => {
    setMessages(
      nextMessages
        .filter((message) => message.roomId === selectedRoomId)
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    );
    refreshPinnedMessage();
  };

  const handleToggleReaction = (messageId: string, emoji: string) => {
    const next = toggleRoomMessageReaction(messageId, emoji, currentUserId);
    refreshRoomMessagesInState(next);
  };

  const handleReply = (message: StoredRoomMessage) => {
    setReplyTarget(message);
    setEditingMessageId(null);
    setEditingValue('');
  };

  const clearReply = () => {
    setReplyTarget(null);
  };

  const startEditingMessage = (message: StoredRoomMessage) => {
    setEditingMessageId(message.id);
    setEditingValue(message.content);
    setReplyTarget(null);
  };

  const cancelEditingMessage = () => {
    setEditingMessageId(null);
    setEditingValue('');
  };

  const saveEditingMessage = (messageId: string) => {
    const next = editRoomMessage(messageId, currentUserId, editingValue);
    refreshRoomMessagesInState(next);
    setEditingMessageId(null);
    setEditingValue('');
  };

  const handleDeleteOwnMessage = (messageId: string) => {
    const confirmed = window.confirm('Naozaj chceš zmazať túto správu?');
    if (!confirmed) return;

    const next = deleteRoomMessage(messageId, currentUserId);
    refreshRoomMessagesInState(next);

    if (replyTarget?.id === messageId) {
      setReplyTarget(null);
    }

    if (editingMessageId === messageId) {
      setEditingMessageId(null);
      setEditingValue('');
    }
  };

  const handlePinMessage = (messageId: string) => {
    const next = pinRoomMessage(messageId, currentUserId);
    refreshRoomMessagesInState(next);
  };

  const handleUnpinMessage = (messageId: string) => {
    const next = unpinRoomMessage(messageId);
    refreshRoomMessagesInState(next);
  };

  const sendMessage = () => {
    const text = messageInput.trim();
    if (!text) return;
    if (!currentUser) return;

    const createdMessage = addRoomMessage({
      roomId: selectedRoomId,
      authorId: currentUserId,
      authorName: currentUser.name,
      content: text,
      replyToMessageId: replyTarget?.id,
      replyToAuthorName: replyTarget?.authorName,
      replyToContent: replyTarget?.content,
    });

    setMessages((prev) =>
      [...prev, createdMessage].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      )
    );

    setMessageInput('');
    setReplyTarget(null);
    clearRoomTyping(selectedRoomId, currentUserId);
    refreshPinnedMessage();
  };

  const handleMessageInputChange = (value: string) => {
    setMessageInput(value);

    if (!currentUser) return;

    if (value.trim()) {
      setRoomTyping({
        roomId: selectedRoomId,
        userId: currentUserId,
        userName: currentUser.name,
      });
    } else {
      clearRoomTyping(selectedRoomId, currentUserId);
    }
  };

  const handleAddTask = () => {
    const title = taskInput.trim();
    if (!title) return;

    addTask(selectedRoomId, title);
    setTaskInput('');
  };

  const latestBadgeLabel =
    newMessagesCount > 99 ? '99+' : newMessagesCount > 0 ? String(newMessagesCount) : '';

  return (
    <>
      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.title}>{getRoomName(rooms, selectedRoomId)}</h1>
          <p style={styles.subtitle}>Detail miestnosti, chat a úlohy</p>
        </div>

        <div style={styles.headerStats}>
          <div style={styles.headerStatChip}>
            <span
              style={{
                ...styles.onlineDot,
                background: onlineCount > 0 ? getPresenceColor('online') : '#d1d5db',
              }}
            />
            {onlineCount} online
          </div>

          <div style={styles.headerStatChip}>{selectedRoomEmployees.length} v miestnosti</div>

          {selectedRoom?.floor && <div style={styles.headerStatChipMuted}>{selectedRoom.floor}</div>}
        </div>
      </div>

      <div style={styles.grid}>
        <div style={styles.card}>
          <div style={styles.sectionTitle}>Ľudia v miestnosti</div>

          {selectedRoomEmployees.length === 0 ? (
            <div style={styles.emptyState}>V tejto miestnosti momentálne nikto nie je.</div>
          ) : (
            <div style={styles.list}>
              {selectedRoomEmployees.map((emp) => (
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

        <div style={styles.card}>
          <div style={styles.chatHeader}>
            <div style={styles.sectionTitleNoMargin}>Chat miestnosti</div>
            <div style={styles.chatMeta}>{selectedRoomMessages.length} správ</div>
          </div>

          {pinnedMessage && (
            <div style={styles.pinnedBox}>
              <div style={styles.pinnedTopRow}>
                <div style={styles.pinnedLabel}>📌 Pripnutá správa</div>
                <button
                  type="button"
                  onClick={() => handleUnpinMessage(pinnedMessage.id)}
                  style={styles.pinnedRemoveButton}
                >
                  Odopnúť
                </button>
              </div>
              <div style={styles.pinnedAuthor}>{pinnedMessage.authorName}</div>
              <div style={styles.pinnedContent}>
                {normalizedSearchQuery
                  ? renderHighlightedText(
                      truncateReplyPreview(pinnedMessage.content, 180),
                      normalizedSearchQuery
                    )
                  : truncateReplyPreview(pinnedMessage.content, 180)}
              </div>
            </div>
          )}

          <div style={styles.searchBarWrap}>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Hľadať v správach, autoroch alebo odpovediach..."
              style={styles.searchInput}
            />

            {searchQuery.trim() && (
              <>
                <div style={styles.searchNavWrap}>
                  <button
                    type="button"
                    onClick={goToPreviousSearchResult}
                    disabled={filteredRoomMessages.length === 0}
                    style={{
                      ...styles.searchNavButton,
                      ...(filteredRoomMessages.length === 0 ? styles.searchNavButtonDisabled : {}),
                    }}
                  >
                    ↑
                  </button>

                  <div style={styles.searchNavCounter}>
                    {filteredRoomMessages.length > 0
                      ? `${activeSearchIndex + 1} / ${filteredRoomMessages.length}`
                      : '0 / 0'}
                  </div>

                  <button
                    type="button"
                    onClick={goToNextSearchResult}
                    disabled={filteredRoomMessages.length === 0}
                    style={{
                      ...styles.searchNavButton,
                      ...(filteredRoomMessages.length === 0 ? styles.searchNavButtonDisabled : {}),
                    }}
                  >
                    ↓
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  style={styles.searchClearButton}
                >
                  Vymazať
                </button>
              </>
            )}
          </div>

          {searchQuery.trim() && (
            <div style={styles.searchInfo}>
              {filteredRoomMessages.length > 0
                ? `Nájdené správy: ${filteredRoomMessages.length}`
                : 'Žiadne správy nevyhovujú filtru.'}
            </div>
          )}

          <div style={styles.chatShell}>
            <div ref={chatBoxRef} style={styles.chatBox}>
              {groupedMessages.length === 0 ? (
                <div style={styles.emptyState}>
                  {searchQuery.trim()
                    ? 'Pre zadaný filter sa nenašli žiadne správy.'
                    : 'V tejto miestnosti zatiaľ nie sú žiadne správy.'}
                </div>
              ) : (
                groupedMessages.map(
                  ({
                    msg,
                    mine,
                    hasMention,
                    isUnreadDivider,
                    isActiveSearchResult,
                    isFirst,
                    isLast,
                  }) => {
                    const author = employees.find((e) => e.id === msg.authorId);
                    const isEditing = editingMessageId === msg.id;

                    return (
                      <div
                        key={msg.id}
                        ref={(node) => {
                          messageItemRefs.current[msg.id] = node;
                        }}
                        style={{
                          ...styles.messageItemWrap,
                          ...(isActiveSearchResult ? styles.messageItemWrapActiveSearch : {}),
                        }}
                      >
                        {isUnreadDivider && (
                          <div ref={unreadDividerRef} style={styles.unreadDividerWrap}>
                            <div style={styles.unreadDividerLine} />
                            <div style={styles.unreadDividerLabel}>Nové správy</div>
                            <div style={styles.unreadDividerLine} />
                          </div>
                        )}

                        <div
                          style={{
                            ...styles.messageGroupRow,
                            justifyContent: mine ? 'flex-end' : 'flex-start',
                            marginTop: isFirst ? 10 : 4,
                          }}
                        >
                          <div
                            style={{
                              ...styles.messageGroupBlock,
                              alignItems: mine ? 'flex-end' : 'flex-start',
                            }}
                          >
                            {isFirst && (
                              <div
                                style={{
                                  ...styles.groupHeader,
                                  justifyContent: mine ? 'flex-end' : 'flex-start',
                                }}
                              >
                                <span>
                                  {author?.avatar ?? '🙂'}{' '}
                                  {normalizedSearchQuery
                                    ? renderHighlightedText(
                                        msg.authorName ?? author?.name ?? 'Neznámy',
                                        normalizedSearchQuery
                                      )
                                    : msg.authorName ?? author?.name ?? 'Neznámy'}
                                </span>
                                <span>
                                  {timeAgo(msg.createdAt)}
                                  {msg.isEdited ? ' · upravené' : ''}
                                  {msg.isPinned ? ' · pripnuté' : ''}
                                </span>
                              </div>
                            )}

                            <div
                              style={{
                                ...styles.messageBubble,
                                ...(mine ? styles.messageBubbleMine : styles.messageBubbleOther),
                                ...(hasMention ? styles.messageBubbleMention : {}),
                                ...(msg.isPinned ? styles.messageBubblePinned : {}),
                                ...(isActiveSearchResult ? styles.messageBubbleSearchActive : {}),
                                borderTopRightRadius: mine && !isFirst ? 8 : 14,
                                borderBottomRightRadius: mine && !isLast ? 8 : 14,
                                borderTopLeftRadius: !mine && !isFirst ? 8 : 14,
                                borderBottomLeftRadius: !mine && !isLast ? 8 : 14,
                              }}
                            >
                              {msg.replyToContent && (
                                <div style={styles.replyQuote}>
                                  <div style={styles.replyQuoteAuthor}>
                                    Odpoveď na{' '}
                                    {normalizedSearchQuery
                                      ? renderHighlightedText(
                                          msg.replyToAuthorName ?? 'správu',
                                          normalizedSearchQuery
                                        )
                                      : msg.replyToAuthorName ?? 'správu'}
                                  </div>
                                  <div style={styles.replyQuoteText}>
                                    {normalizedSearchQuery
                                      ? renderHighlightedText(
                                          truncateReplyPreview(msg.replyToContent),
                                          normalizedSearchQuery
                                        )
                                      : truncateReplyPreview(msg.replyToContent)}
                                  </div>
                                </div>
                              )}

                              {msg.isPinned && <div style={styles.pinnedInlineBadge}>📌 Pripnuté</div>}
                              {hasMention && <div style={styles.mentionInlineBadge}>Mention</div>}

                              {isEditing ? (
                                <div style={styles.editBox}>
                                  <textarea
                                    value={editingValue}
                                    onChange={(e) => setEditingValue(e.target.value)}
                                    style={styles.editTextarea}
                                    rows={3}
                                  />
                                  <div style={styles.editActions}>
                                    <button
                                      type="button"
                                      onClick={() => saveEditingMessage(msg.id)}
                                      style={styles.editSaveButton}
                                      disabled={!editingValue.trim()}
                                    >
                                      Uložiť
                                    </button>
                                    <button
                                      type="button"
                                      onClick={cancelEditingMessage}
                                      style={styles.editCancelButton}
                                    >
                                      Zrušiť
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div style={styles.messageContent}>
                                  {normalizedSearchQuery
                                    ? renderHighlightedText(msg.content, normalizedSearchQuery)
                                    : msg.content}
                                </div>
                              )}
                            </div>

                            {!isEditing && (
                              <div
                                style={{
                                  ...styles.reactionsWrap,
                                  justifyContent: mine ? 'flex-end' : 'flex-start',
                                }}
                              >
                                <div style={styles.reactionList}>
                                  {(msg.reactions ?? []).map((reaction) => {
                                    const reactedByMe = reaction.userIds.includes(currentUserId);

                                    return (
                                      <button
                                        key={reaction.emoji}
                                        type="button"
                                        onClick={() => handleToggleReaction(msg.id, reaction.emoji)}
                                        style={{
                                          ...styles.reactionChip,
                                          ...(reactedByMe ? styles.reactionChipActive : {}),
                                        }}
                                      >
                                        <span>{reaction.emoji}</span>
                                        <span>{reaction.userIds.length}</span>
                                      </button>
                                    );
                                  })}
                                </div>

                                <div style={styles.quickReactionList}>
                                  {QUICK_REACTIONS.map((emoji) => {
                                    const reactedByMe = (msg.reactions ?? []).some(
                                      (reaction) =>
                                        reaction.emoji === emoji &&
                                        reaction.userIds.includes(currentUserId)
                                    );

                                    return (
                                      <button
                                        key={emoji}
                                        type="button"
                                        onClick={() => handleToggleReaction(msg.id, emoji)}
                                        style={{
                                          ...styles.quickReactionButton,
                                          ...(reactedByMe ? styles.quickReactionButtonActive : {}),
                                        }}
                                        title={`Reagovať ${emoji}`}
                                      >
                                        {emoji}
                                      </button>
                                    );
                                  })}
                                </div>

                                <button
                                  type="button"
                                  onClick={() => handleReply(msg)}
                                  style={styles.replyAction}
                                >
                                  Odpovedať
                                </button>

                                {!msg.isPinned ? (
                                  <button
                                    type="button"
                                    onClick={() => handlePinMessage(msg.id)}
                                    style={styles.messageAction}
                                  >
                                    Pripnúť
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => handleUnpinMessage(msg.id)}
                                    style={styles.messageAction}
                                  >
                                    Odopnúť
                                  </button>
                                )}

                                {mine && (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => startEditingMessage(msg)}
                                      style={styles.messageAction}
                                    >
                                      Upraviť
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteOwnMessage(msg.id)}
                                      style={styles.messageActionDanger}
                                    >
                                      Zmazať
                                    </button>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  }
                )
              )}
            </div>

            {showScrollToLatest && (
              <button
                type="button"
                onClick={scrollToLatest}
                style={{
                  ...styles.scrollToLatestButton,
                  ...(newMentionCount > 0 ? styles.scrollToLatestButtonMention : {}),
                  ...(pulseScrollButton ? styles.scrollToLatestButtonPulse : {}),
                }}
              >
                <span style={styles.scrollToLatestButtonText}>↓ Najnovšie správy</span>

                {newMessagesCount > 0 && (
                  <span
                    style={{
                      ...styles.scrollToLatestBadge,
                      ...(newMentionCount > 0 ? styles.scrollToLatestBadgeMention : {}),
                    }}
                  >
                    {newMentionCount > 0 ? `@ ${latestBadgeLabel}` : latestBadgeLabel}
                  </span>
                )}
              </button>
            )}
          </div>

          <div style={styles.typingFooter}>
            <div
              style={{
                ...styles.typingFooterInner,
                ...(typingLabel ? styles.typingFooterInnerActive : {}),
              }}
            >
              <span
                style={{
                  ...styles.typingDot,
                  ...(typingLabel ? styles.typingDotActive : {}),
                }}
              />
              <span style={styles.typingFooterText}>{typingLabel || ' '}</span>
            </div>
          </div>

          {replyTarget && (
            <div style={styles.replyComposerBox}>
              <div style={styles.replyComposerLabel}>
                Odpovedáš na {replyTarget.authorName}
              </div>
              <div style={styles.replyComposerPreview}>
                {truncateReplyPreview(replyTarget.content, 120)}
              </div>
              <button type="button" onClick={clearReply} style={styles.replyComposerCancel}>
                Zrušiť
              </button>
            </div>
          )}

          <div style={styles.composerWrap}>
            <ChatComposer
              value={messageInput}
              onChange={handleMessageInputChange}
              onSend={sendMessage}
              placeholder="Napíš správu do miestnosti..."
              buttonLabel="Poslať správu"
              resetKeys={[selectedRoomId]}
              autoFocus
              onBlur={() => {
                clearRoomTyping(selectedRoomId, currentUserId);
              }}
            />
          </div>
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.sectionTitle}>Úlohy v miestnosti</div>

        <ChatComposer
          value={taskInput}
          onChange={setTaskInput}
          onSend={handleAddTask}
          placeholder="Nová úloha..."
          buttonLabel="Pridať úlohu"
          maxHeight={140}
          minHeight={48}
          resetKeys={[selectedRoomId]}
        />

        <div style={styles.list}>
          {selectedRoomTasks.length === 0 ? (
            <div style={styles.emptyState}>V tejto miestnosti zatiaľ nie sú žiadne úlohy.</div>
          ) : (
            selectedRoomTasks.map((task) => (
              <div key={task.id} style={styles.taskRow}>
                <label style={styles.taskLabel}>
                  <input
                    type="checkbox"
                    checked={task.done}
                    onChange={() => toggleTask(task.id)}
                  />
                  <span
                    style={{
                      ...styles.taskText,
                      textDecoration: task.done ? 'line-through' : 'none',
                      color: task.done ? '#6b7280' : '#111827',
                    }}
                  >
                    {task.title}
                  </span>
                </label>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

const styles: Record<string, CSSProperties> = {
  pageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 16,
    marginBottom: 24,
    flexWrap: 'wrap',
  },
  title: {
    margin: 0,
    fontSize: 34,
    fontWeight: 800,
    color: '#111827',
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 0,
    color: '#6b7280',
    fontSize: 16,
  },
  headerStats: {
    display: 'flex',
    gap: 10,
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  headerStatChip: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 12px',
    borderRadius: 999,
    background: '#eff6ff',
    color: '#1d4ed8',
    border: '1px solid #bfdbfe',
    fontWeight: 700,
    fontSize: 13,
  },
  headerStatChipMuted: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 12px',
    borderRadius: 999,
    background: '#f3f4f6',
    color: '#4b5563',
    border: '1px solid #e5e7eb',
    fontWeight: 700,
    fontSize: 13,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1.1fr',
    gap: 20,
    marginBottom: 20,
  },
  card: {
    background: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: 18,
    padding: 18,
    marginBottom: 20,
    boxShadow: '0 10px 30px rgba(15, 23, 42, 0.04)',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 800,
    marginBottom: 16,
    color: '#111827',
  },
  sectionTitleNoMargin: {
    fontSize: 20,
    fontWeight: 800,
    margin: 0,
    color: '#111827',
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
  chatHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  chatMeta: {
    fontSize: 12,
    fontWeight: 700,
    color: '#64748b',
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: 999,
    padding: '8px 10px',
  },
  pinnedBox: {
    marginBottom: 12,
    padding: 12,
    borderRadius: 14,
    background: '#fff7ed',
    border: '1px solid #fdba74',
  },
  pinnedTopRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  pinnedLabel: {
    fontSize: 12,
    fontWeight: 900,
    color: '#c2410c',
  },
  pinnedRemoveButton: {
    borderRadius: 999,
    border: '1px solid #fdba74',
    background: '#ffffff',
    color: '#9a3412',
    padding: '6px 10px',
    fontSize: 12,
    fontWeight: 800,
    cursor: 'pointer',
  },
  pinnedAuthor: {
    fontSize: 13,
    fontWeight: 800,
    color: '#7c2d12',
    marginBottom: 4,
  },
  pinnedContent: {
    fontSize: 13,
    color: '#9a3412',
    lineHeight: 1.45,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
  searchBarWrap: {
    display: 'flex',
    gap: 10,
    marginBottom: 10,
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    minWidth: 240,
    padding: '11px 13px',
    borderRadius: 12,
    border: '1px solid #d1d5db',
    background: '#ffffff',
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box',
  },
  searchNavWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  searchNavButton: {
    width: 34,
    height: 34,
    borderRadius: 10,
    border: '1px solid #d1d5db',
    background: '#ffffff',
    color: '#111827',
    fontWeight: 900,
    cursor: 'pointer',
  },
  searchNavButtonDisabled: {
    opacity: 0.45,
    cursor: 'not-allowed',
  },
  searchNavCounter: {
    minWidth: 56,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 800,
    color: '#475569',
    padding: '8px 10px',
    borderRadius: 10,
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
  },
  searchClearButton: {
    borderRadius: 12,
    border: '1px solid #d1d5db',
    background: '#ffffff',
    color: '#374151',
    padding: '10px 12px',
    fontWeight: 800,
    cursor: 'pointer',
  },
  searchInfo: {
    marginBottom: 12,
    fontSize: 12,
    fontWeight: 700,
    color: '#64748b',
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: 12,
    padding: '8px 10px',
  },
  chatShell: {
    position: 'relative',
  },
  chatBox: {
    minHeight: 260,
    maxHeight: 420,
    overflowY: 'auto',
    border: '1px solid #e5e7eb',
    borderRadius: 14,
    background: '#f8fafc',
    padding: 14,
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
    scrollBehavior: 'smooth',
  },
  messageItemWrap: {
    borderRadius: 16,
    transition: 'background 160ms ease, box-shadow 160ms ease',
  },
  messageItemWrapActiveSearch: {
    background: 'rgba(59, 130, 246, 0.08)',
    boxShadow: '0 0 0 1px rgba(59, 130, 246, 0.16)',
  },
  scrollToLatestButton: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 14px',
    borderRadius: 999,
    border: '1px solid #2563eb',
    background: '#2563eb',
    color: '#ffffff',
    fontWeight: 800,
    fontSize: 13,
    cursor: 'pointer',
    boxShadow: '0 10px 24px rgba(37, 99, 235, 0.22)',
    zIndex: 2,
    transition: 'transform 160ms ease, box-shadow 160ms ease, background 160ms ease',
  },
  scrollToLatestButtonMention: {
    background: '#f97316',
    borderColor: '#ea580c',
    boxShadow: '0 12px 26px rgba(249, 115, 22, 0.26)',
  },
  scrollToLatestButtonPulse: {
    transform: 'scale(1.04)',
    boxShadow: '0 16px 30px rgba(37, 99, 235, 0.32)',
  },
  scrollToLatestButtonText: {
    whiteSpace: 'nowrap',
  },
  scrollToLatestBadge: {
    minWidth: 22,
    height: 22,
    borderRadius: 999,
    background: 'rgba(255,255,255,0.18)',
    color: '#ffffff',
    display: 'grid',
    placeItems: 'center',
    padding: '0 8px',
    fontSize: 12,
    fontWeight: 900,
    lineHeight: 1,
  },
  scrollToLatestBadgeMention: {
    background: 'rgba(255,255,255,0.24)',
  },
  typingFooter: {
    marginTop: 10,
    minHeight: 32,
  },
  typingFooterInner: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    minHeight: 32,
    padding: '7px 10px',
    borderRadius: 12,
    background: '#f8fafc',
    border: '1px solid #e5e7eb',
    color: '#94a3b8',
    transition: 'all 160ms ease',
  },
  typingFooterInnerActive: {
    background: '#f0fdf4',
    borderColor: '#86efac',
    color: '#166534',
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    background: '#cbd5e1',
    flexShrink: 0,
  },
  typingDotActive: {
    background: '#22c55e',
    boxShadow: '0 0 0 4px rgba(34, 197, 94, 0.15)',
  },
  typingFooterText: {
    fontSize: 13,
    fontWeight: 700,
    minHeight: 18,
    lineHeight: 1.3,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  replyComposerBox: {
    marginTop: 10,
    padding: 12,
    borderRadius: 14,
    border: '1px solid #cbd5e1',
    background: '#f8fafc',
  },
  replyComposerLabel: {
    fontSize: 12,
    fontWeight: 800,
    color: '#334155',
    marginBottom: 6,
  },
  replyComposerPreview: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 1.4,
  },
  replyComposerCancel: {
    marginTop: 10,
    border: '1px solid #d1d5db',
    background: '#ffffff',
    color: '#374151',
    borderRadius: 10,
    padding: '7px 10px',
    fontWeight: 700,
    cursor: 'pointer',
  },
  composerWrap: {
    marginTop: 12,
  },
  unreadDividerWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    margin: '14px 0 10px',
  },
  unreadDividerLine: {
    flex: 1,
    height: 1,
    background: '#f97316',
    opacity: 0.5,
  },
  unreadDividerLabel: {
    padding: '6px 10px',
    borderRadius: 999,
    background: '#fff7ed',
    border: '1px solid #fdba74',
    color: '#c2410c',
    fontSize: 12,
    fontWeight: 800,
    whiteSpace: 'nowrap',
  },
  messageGroupRow: {
    display: 'flex',
  },
  messageGroupBlock: {
    maxWidth: '80%',
    display: 'flex',
    flexDirection: 'column',
  },
  groupHeader: {
    display: 'flex',
    gap: 12,
    alignItems: 'center',
    marginBottom: 6,
    padding: '0 4px',
    fontSize: 12,
    color: '#6b7280',
  },
  messageBubble: {
    width: '100%',
    borderRadius: 14,
    padding: 12,
    border: '1px solid #d1d5db',
    boxSizing: 'border-box',
    marginTop: 2,
    position: 'relative',
  },
  messageBubbleMine: {
    background: '#dbeafe',
    borderColor: '#93c5fd',
  },
  messageBubbleOther: {
    background: '#ffffff',
    borderColor: '#e5e7eb',
  },
  messageBubbleMention: {
    background: '#fff7ed',
    borderColor: '#fdba74',
    boxShadow: '0 6px 16px rgba(249, 115, 22, 0.10)',
  },
  messageBubblePinned: {
    boxShadow: '0 0 0 2px rgba(249, 115, 22, 0.12)',
  },
  messageBubbleSearchActive: {
    boxShadow: '0 0 0 2px rgba(37, 99, 235, 0.22)',
    borderColor: '#60a5fa',
  },
  replyQuote: {
    marginBottom: 10,
    padding: '8px 10px',
    borderRadius: 10,
    borderLeft: '3px solid #94a3b8',
    background: 'rgba(148, 163, 184, 0.10)',
  },
  replyQuoteAuthor: {
    fontSize: 12,
    fontWeight: 800,
    color: '#334155',
    marginBottom: 4,
  },
  replyQuoteText: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 1.35,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
  pinnedInlineBadge: {
    display: 'inline-block',
    marginBottom: 8,
    marginRight: 8,
    padding: '4px 8px',
    borderRadius: 999,
    background: '#fb923c',
    color: '#ffffff',
    fontSize: 11,
    fontWeight: 800,
  },
  mentionInlineBadge: {
    display: 'inline-block',
    marginBottom: 8,
    padding: '4px 8px',
    borderRadius: 999,
    background: '#f97316',
    color: '#ffffff',
    fontSize: 11,
    fontWeight: 800,
  },
  inlineHighlight: {
    background: '#fde68a',
    color: '#111827',
    padding: '0 2px',
    borderRadius: 4,
  },
  messageContent: {
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    lineHeight: 1.45,
  },
  editBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  editTextarea: {
    width: '100%',
    resize: 'vertical',
    minHeight: 74,
    borderRadius: 12,
    border: '1px solid #cbd5e1',
    padding: 10,
    fontSize: 14,
    lineHeight: 1.45,
    boxSizing: 'border-box',
    outline: 'none',
    background: '#ffffff',
  },
  editActions: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
  },
  editSaveButton: {
    borderRadius: 10,
    border: '1px solid #2563eb',
    background: '#2563eb',
    color: '#ffffff',
    padding: '8px 12px',
    fontWeight: 800,
    cursor: 'pointer',
  },
  editCancelButton: {
    borderRadius: 10,
    border: '1px solid #d1d5db',
    background: '#ffffff',
    color: '#374151',
    padding: '8px 12px',
    fontWeight: 800,
    cursor: 'pointer',
  },
  reactionsWrap: {
    marginTop: 8,
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    alignItems: 'center',
  },
  reactionList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 6,
  },
  reactionChip: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    borderRadius: 999,
    border: '1px solid #d1d5db',
    background: '#ffffff',
    color: '#374151',
    padding: '5px 9px',
    fontSize: 12,
    fontWeight: 800,
    cursor: 'pointer',
  },
  reactionChipActive: {
    background: '#eff6ff',
    borderColor: '#93c5fd',
    color: '#1d4ed8',
  },
  quickReactionList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 6,
  },
  quickReactionButton: {
    width: 30,
    height: 30,
    borderRadius: 999,
    border: '1px solid #d1d5db',
    background: '#ffffff',
    fontSize: 14,
    cursor: 'pointer',
    display: 'grid',
    placeItems: 'center',
  },
  quickReactionButtonActive: {
    background: '#eff6ff',
    borderColor: '#93c5fd',
    boxShadow: '0 4px 10px rgba(37, 99, 235, 0.12)',
  },
  replyAction: {
    borderRadius: 999,
    border: '1px solid #d1d5db',
    background: '#ffffff',
    color: '#374151',
    padding: '6px 10px',
    fontSize: 12,
    fontWeight: 800,
    cursor: 'pointer',
  },
  messageAction: {
    borderRadius: 999,
    border: '1px solid #d1d5db',
    background: '#ffffff',
    color: '#374151',
    padding: '6px 10px',
    fontSize: 12,
    fontWeight: 800,
    cursor: 'pointer',
  },
  messageActionDanger: {
    borderRadius: 999,
    border: '1px solid #fecaca',
    background: '#ffffff',
    color: '#dc2626',
    padding: '6px 10px',
    fontSize: 12,
    fontWeight: 800,
    cursor: 'pointer',
  },
  taskRow: {
    padding: 14,
    borderRadius: 14,
    background: '#f9fafb',
    border: '1px solid #e5e7eb',
  },
  taskLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  taskText: {
    fontSize: 15,
    fontWeight: 600,
  },
  onlineDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    flexShrink: 0,
  },
};