import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import type { PresenceStatus } from '../types';
import ChatComposer from './ChatComposer';
import {
  addDirectMessage,
  getConversationId,
  getDirectConversationMessages,
  getUnreadDirectMessagesCount,
  markDirectConversationAsRead,
  readDirectMessages,
  type DirectMessage as StoredDirectMessage,
} from '../messages';
import {
  clearDirectMessageTyping,
  getDmTypingUpdatedEventName,
  getTypingUsersForConversation,
  setDirectMessageTyping,
} from '../typing';

type EmployeeForDm = {
  id: string;
  name: string;
  position: string;
  avatar: string;
  currentRoomId: string;
  status?: PresenceStatus;
  lastActiveAt?: string;
};

type Props = {
  employees: EmployeeForDm[];
  currentUserId: string;
  initialSelectedEmployeeId?: string;
};

function formatLastSeen(value?: string, status?: PresenceStatus) {
  if (status === 'online') {
    return 'Aktívny teraz';
  }

  if (!value) {
    return 'Naposledy neznáme';
  }

  const date = new Date(value);
  const diffMs = Date.now() - date.getTime();

  if (diffMs < 60_000) {
    return 'Aktívny pred chvíľou';
  }

  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 60) {
    return `Naposledy pred ${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `Naposledy pred ${hours} h`;
  }

  const days = Math.floor(hours / 24);
  if (days < 7) {
    return `Naposledy pred ${days} d`;
  }

  return `Naposledy ${date.toLocaleString('sk-SK', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })}`;
}

export default function DirectMessages({
  employees,
  currentUserId,
  initialSelectedEmployeeId,
}: Props) {
  const contacts = useMemo(
    () => employees.filter((e) => e.id !== currentUserId),
    [employees, currentUserId]
  );

  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>(
    initialSelectedEmployeeId && initialSelectedEmployeeId !== currentUserId
      ? initialSelectedEmployeeId
      : employees.find((e) => e.id !== currentUserId)?.id ?? ''
  );

  const [messages, setMessages] = useState<StoredDirectMessage[]>([]);
  const [dmInput, setDmInput] = useState('');
  const [typingTick, setTypingTick] = useState(0);

  const chatBoxRef = useRef<HTMLDivElement | null>(null);

  const selectedEmployee = useMemo(
    () => employees.find((e) => e.id === selectedEmployeeId),
    [employees, selectedEmployeeId]
  );

  const currentConversationId = useMemo(() => {
    if (!selectedEmployeeId) return '';
    return getConversationId(currentUserId, selectedEmployeeId);
  }, [currentUserId, selectedEmployeeId]);

  useEffect(() => {
    const validInitial =
      initialSelectedEmployeeId &&
      initialSelectedEmployeeId !== currentUserId &&
      contacts.some((contact) => contact.id === initialSelectedEmployeeId)
        ? initialSelectedEmployeeId
        : '';

    if (validInitial) {
      setSelectedEmployeeId(validInitial);
      return;
    }

    if (!selectedEmployeeId && contacts.length > 0) {
      setSelectedEmployeeId(contacts[0].id);
    }
  }, [contacts, currentUserId, initialSelectedEmployeeId, selectedEmployeeId]);

  useEffect(() => {
    setMessages(readDirectMessages());
  }, []);

  useEffect(() => {
    const handleRefresh = () => {
      setMessages(readDirectMessages());
    };

    const handleTypingRefresh = () => {
      setTypingTick((prev) => prev + 1);
    };

    const typingEventName = getDmTypingUpdatedEventName();

    window.addEventListener('focus', handleRefresh);
    window.addEventListener('storage', handleRefresh);
    window.addEventListener(typingEventName, handleTypingRefresh as EventListener);

    const interval = window.setInterval(() => {
      setMessages(readDirectMessages());
      setTypingTick((prev) => prev + 1);
    }, 1000);

    return () => {
      window.removeEventListener('focus', handleRefresh);
      window.removeEventListener('storage', handleRefresh);
      window.removeEventListener(typingEventName, handleTypingRefresh as EventListener);
      window.clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (!selectedEmployeeId) return;

    const next = markDirectConversationAsRead(currentUserId, selectedEmployeeId);
    setMessages(next);
  }, [currentUserId, selectedEmployeeId]);

  useEffect(() => {
    return () => {
      if (currentConversationId) {
        clearDirectMessageTyping(currentConversationId, currentUserId);
      }
    };
  }, [currentConversationId, currentUserId]);

  const conversations = useMemo(() => {
    return contacts
      .map((employee) => {
        const items = getDirectConversationMessages(currentUserId, employee.id);
        const latestMessage = items[items.length - 1];
        const unreadCount = getUnreadDirectMessagesCount(currentUserId, employee.id);

        return {
          employee,
          latestMessage,
          unreadCount,
        };
      })
      .sort((a, b) => {
        const aTime = a.latestMessage ? new Date(a.latestMessage.createdAt).getTime() : 0;
        const bTime = b.latestMessage ? new Date(b.latestMessage.createdAt).getTime() : 0;
        return bTime - aTime;
      });
  }, [contacts, currentUserId, messages]);

  const selectedMessages = useMemo(() => {
    if (!selectedEmployeeId) return [];

    return getDirectConversationMessages(currentUserId, selectedEmployeeId).sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }, [currentUserId, selectedEmployeeId, messages]);

  const groupedMessages = useMemo(() => {
    return selectedMessages.map((msg, index) => {
      const prev = selectedMessages[index - 1];
      const next = selectedMessages[index + 1];

      const isSameAsPrev = !!prev && prev.fromUserId === msg.fromUserId;
      const isSameAsNext = !!next && next.fromUserId === msg.fromUserId;

      return {
        msg,
        isFirstInGroup: !isSameAsPrev,
        isLastInGroup: !isSameAsNext,
      };
    });
  }, [selectedMessages]);

  const typingUsers = useMemo(() => {
    if (!currentConversationId) return [];
    return getTypingUsersForConversation(currentConversationId, currentUserId);
  }, [currentConversationId, currentUserId, typingTick]);

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

  const lastOwnMessageId = useMemo(() => {
    const ownMessages = selectedMessages.filter(
      (message) => message.fromUserId === currentUserId
    );

    return ownMessages.length > 0 ? ownMessages[ownMessages.length - 1].id : '';
  }, [selectedMessages, currentUserId]);

  useEffect(() => {
    if (!chatBoxRef.current) return;

    chatBoxRef.current.scrollTo({
      top: chatBoxRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [selectedMessages, typingLabel]);

  const openConversation = (employeeId: string) => {
    if (currentConversationId) {
      clearDirectMessageTyping(currentConversationId, currentUserId);
    }

    setSelectedEmployeeId(employeeId);

    const next = markDirectConversationAsRead(currentUserId, employeeId);
    setMessages(next);
  };

  const sendMessage = () => {
    const text = dmInput.trim();
    if (!text || !selectedEmployeeId) return;

    const currentUser = employees.find((employee) => employee.id === currentUserId);
    if (!currentUser) return;

    const newMessage = addDirectMessage({
      fromUserId: currentUserId,
      toUserId: selectedEmployeeId,
      authorId: currentUserId,
      authorName: currentUser.name,
      content: text,
    });

    setMessages((prev) =>
      [...prev, newMessage].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      )
    );

    setDmInput('');
    clearDirectMessageTyping(currentConversationId, currentUserId);
  };

  const handleInputChange = (value: string) => {
    setDmInput(value);

    if (!currentConversationId) return;

    const currentUser = employees.find((employee) => employee.id === currentUserId);
    if (!currentUser) return;

    if (value.trim()) {
      setDirectMessageTyping({
        conversationId: currentConversationId,
        userId: currentUserId,
        userName: currentUser.name,
      });
    } else {
      clearDirectMessageTyping(currentConversationId, currentUserId);
    }
  };

  return (
    <>
      <h1 style={styles.title}>Súkromné správy</h1>
      <p style={styles.subtitle}>Konverzácie medzi zamestnancami</p>

      <div style={styles.layout}>
        <div style={styles.card}>
          <div style={styles.sectionTitle}>Konverzácie</div>

          <div style={styles.list}>
            {conversations.length === 0 ? (
              <div style={styles.emptyState}>Zatiaľ nie sú žiadne konverzácie.</div>
            ) : (
              conversations.map(({ employee, latestMessage, unreadCount }) => (
                <button
                  key={employee.id}
                  onClick={() => openConversation(employee.id)}
                  style={{
                    ...styles.conversationCard,
                    ...(selectedEmployeeId === employee.id ? styles.conversationCardActive : {}),
                  }}
                >
                  <div style={styles.avatar}>{employee.avatar}</div>

                  <div style={styles.conversationContent}>
                    <div style={styles.topRow}>
                      <div>
                        <div style={styles.name}>{employee.name}</div>
                        <div style={styles.meta}>{employee.position}</div>
                        <div style={styles.lastSeenMini}>
                          {formatLastSeen(employee.lastActiveAt, employee.status)}
                        </div>
                      </div>

                      {unreadCount > 0 && <div style={styles.unreadBadge}>{unreadCount}</div>}
                    </div>

                    <div style={styles.preview}>
                      {latestMessage ? latestMessage.content : 'Zatiaľ bez správ'}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.sectionTitle}>
            {selectedEmployee ? `Chat s ${selectedEmployee.name}` : 'Vyber konverzáciu'}
          </div>

          {selectedEmployee && (
            <div style={styles.lastSeenHeader}>
              {formatLastSeen(selectedEmployee.lastActiveAt, selectedEmployee.status)}
            </div>
          )}

          {typingLabel && <div style={styles.typingIndicator}>{typingLabel}</div>}

          <div ref={chatBoxRef} style={styles.chatBox}>
            {groupedMessages.length === 0 ? (
              <div style={styles.emptyState}>V tejto konverzácii zatiaľ nie sú žiadne správy.</div>
            ) : (
              groupedMessages.map(({ msg, isFirstInGroup, isLastInGroup }) => {
                const author = employees.find((e) => e.id === msg.fromUserId);
                const mine = msg.fromUserId === currentUserId;
                const isLastOwnMessage = msg.id === lastOwnMessageId;
                const isSeenByOtherUser =
                  !!selectedEmployeeId && msg.readBy.includes(selectedEmployeeId);

                return (
                  <div
                    key={msg.id}
                    style={{
                      ...styles.messageGroupRow,
                      justifyContent: mine ? 'flex-end' : 'flex-start',
                      marginTop: isFirstInGroup ? 10 : 4,
                    }}
                  >
                    <div
                      style={{
                        ...styles.messageGroupBlock,
                        alignItems: mine ? 'flex-end' : 'flex-start',
                      }}
                    >
                      {isFirstInGroup && (
                        <div
                          style={{
                            ...styles.groupHeader,
                            justifyContent: mine ? 'flex-end' : 'flex-start',
                          }}
                        >
                          <span>
                            {author?.avatar ?? '🙂'} {msg.authorName ?? author?.name ?? 'Neznámy'}
                          </span>
                          <span>
                            {new Date(msg.createdAt).toLocaleTimeString('sk-SK', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      )}

                      <div
                        style={{
                          ...styles.messageBubble,
                          ...(mine ? styles.messageBubbleMine : styles.messageBubbleOther),
                          borderTopRightRadius: mine && !isFirstInGroup ? 8 : 14,
                          borderBottomRightRadius: mine && !isLastInGroup ? 8 : 14,
                          borderTopLeftRadius: !mine && !isFirstInGroup ? 8 : 14,
                          borderBottomLeftRadius: !mine && !isLastInGroup ? 8 : 14,
                        }}
                      >
                        <div style={styles.messageContent}>{msg.content}</div>
                      </div>

                      {mine && isLastOwnMessage && isLastInGroup && (
                        <div style={styles.seenStatus}>
                          {isSeenByOtherUser ? 'Prečítané' : 'Odoslané'}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <ChatComposer
            value={dmInput}
            onChange={handleInputChange}
            onSend={sendMessage}
            placeholder="Napíš súkromnú správu..."
            buttonLabel="Poslať správu"
            disabled={!selectedEmployeeId}
            resetKeys={[selectedEmployeeId]}
            autoFocus
            onBlur={() => {
              if (currentConversationId) {
                clearDirectMessageTyping(currentConversationId, currentUserId);
              }
            }}
          />
        </div>
      </div>
    </>
  );
}

const styles: Record<string, CSSProperties> = {
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
  layout: {
    display: 'grid',
    gridTemplateColumns: '0.95fr 1.25fr',
    gap: 20,
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
    marginBottom: 12,
    color: '#111827',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  conversationCard: {
    display: 'flex',
    gap: 14,
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    background: '#f9fafb',
    border: '1px solid #e5e7eb',
    cursor: 'pointer',
    textAlign: 'left',
  },
  conversationCardActive: {
    background: '#eff6ff',
    borderColor: '#2563eb',
  },
  conversationContent: {
    flex: 1,
    textAlign: 'left',
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
    alignItems: 'flex-start',
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
  lastSeenMini: {
    marginTop: 4,
    fontSize: 12,
    color: '#6b7280',
    fontWeight: 700,
  },
  lastSeenHeader: {
    marginBottom: 12,
    fontSize: 13,
    color: '#6b7280',
    fontWeight: 700,
  },
  unreadBadge: {
    minWidth: 24,
    height: 24,
    borderRadius: 999,
    background: '#2563eb',
    color: '#ffffff',
    display: 'grid',
    placeItems: 'center',
    fontSize: 12,
    fontWeight: 800,
    padding: '0 8px',
  },
  preview: {
    marginTop: 8,
    color: '#4b5563',
    fontSize: 13,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  typingIndicator: {
    marginBottom: 12,
    fontSize: 13,
    color: '#16a34a',
    fontWeight: 700,
    minHeight: 18,
  },
  chatBox: {
    minHeight: 320,
    maxHeight: 460,
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
  },
  messageBubbleMine: {
    background: '#dbeafe',
    borderColor: '#93c5fd',
  },
  messageBubbleOther: {
    background: '#ffffff',
    borderColor: '#e5e7eb',
  },
  messageContent: {
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    lineHeight: 1.45,
  },
  seenStatus: {
    marginTop: 6,
    fontSize: 12,
    color: '#6b7280',
    fontWeight: 700,
    paddingRight: 4,
  },
  emptyState: {
    padding: 20,
    borderRadius: 14,
    background: '#f9fafb',
    border: '1px dashed #d1d5db',
    color: '#6b7280',
  },
};