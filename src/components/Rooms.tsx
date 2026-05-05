import { useEffect, useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import type { PresenceStatus, Room } from '../types';
import {
  getUnreadRoomStateByRoom,
  readRoomMessages,
  type RoomMessage,
} from '../messages';

type EmployeeForRooms = {
  id: string;
  name: string;
  currentRoomId: string;
  status: PresenceStatus;
};

type Props = {
  rooms: Room[];
  selectedRoomId: string;
  employees: EmployeeForRooms[];
  currentUserId: string;
  onSelectRoom: (roomId: string) => void;
  onAddRoom: (name: string) => void;
  onDeleteRoom: (roomId: string) => void;
  getPresenceColor: (status: PresenceStatus) => string;
};

type UnreadPreviewByRoom = Record<
  string,
  {
    message: RoomMessage;
    isMention: boolean;
  }
>;

function truncatePreview(value: string, max = 72) {
  return value.length > max ? `${value.slice(0, max)}…` : value;
}

export default function Rooms({
  rooms,
  selectedRoomId,
  employees,
  currentUserId,
  onSelectRoom,
  onAddRoom,
  onDeleteRoom,
  getPresenceColor,
}: Props) {
  const [newRoomName, setNewRoomName] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [unreadByRoom, setUnreadByRoom] = useState<Record<string, number>>({});
  const [unreadStateByRoom, setUnreadStateByRoom] = useState<
    Record<
      string,
      {
        unreadCount: number;
        mentionCount: number;
        hasUnread: boolean;
        hasMention: boolean;
      }
    >
  >({});
  const [unreadPreviewByRoom, setUnreadPreviewByRoom] = useState<UnreadPreviewByRoom>({});

  const currentUser = useMemo(
    () => employees.find((employee) => employee.id === currentUserId),
    [employees, currentUserId]
  );

  useEffect(() => {
    const refreshUnread = () => {
      const currentUserName = currentUser?.name ?? '';
      const normalizedUserName = currentUserName.toLowerCase().trim();
      const roomStates = getUnreadRoomStateByRoom(currentUserId, currentUserName);
      const roomMessages = readRoomMessages();

      const previewMap = roomMessages.reduce<UnreadPreviewByRoom>((acc, message) => {
        const roomState = roomStates[message.roomId];
        const isUnread = message.authorId !== currentUserId && !message.readBy.includes(currentUserId);

        if (!isUnread || !roomState) {
          return acc;
        }

        const existing = acc[message.roomId];
        const isMention =
          Boolean(normalizedUserName) &&
          roomState.hasMention &&
          message.content.toLowerCase().includes(normalizedUserName);

        if (!existing) {
          acc[message.roomId] = {
            message,
            isMention,
          };
          return acc;
        }

        const existingTime = new Date(existing.message.createdAt).getTime();
        const nextTime = new Date(message.createdAt).getTime();

        if (nextTime > existingTime) {
          acc[message.roomId] = {
            message,
            isMention,
          };
        }

        return acc;
      }, {});

      const unreadCounts = Object.entries(roomStates).reduce<Record<string, number>>((acc, [roomId, state]) => {
        acc[roomId] = state.unreadCount;
        return acc;
      }, {});

      setUnreadByRoom(unreadCounts);
      setUnreadStateByRoom(roomStates);
      setUnreadPreviewByRoom(previewMap);
    };

    refreshUnread();

    window.addEventListener('focus', refreshUnread);
    window.addEventListener('storage', refreshUnread);

    const interval = window.setInterval(refreshUnread, 1000);

    return () => {
      window.removeEventListener('focus', refreshUnread);
      window.removeEventListener('storage', refreshUnread);
      window.clearInterval(interval);
    };
  }, [currentUserId, currentUser?.name]);

  const roomStats = useMemo(() => {
    return rooms.map((room) => {
      const roomEmployees = employees.filter((employee) => employee.currentRoomId === room.id);
      const onlineCount = roomEmployees.filter((employee) => employee.status === 'online').length;
      const unreadState = unreadStateByRoom[room.id];
      const unreadPreview = unreadPreviewByRoom[room.id];

      return {
        room,
        totalCount: roomEmployees.length,
        onlineCount,
        unreadCount: unreadByRoom[room.id] ?? 0,
        hasMention: unreadState?.hasMention ?? false,
        mentionCount: unreadState?.mentionCount ?? 0,
        unreadPreview,
      };
    });
  }, [rooms, employees, unreadByRoom, unreadStateByRoom, unreadPreviewByRoom]);

  const filteredRoomStats = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();

    if (!normalizedSearch) {
      return roomStats;
    }

    return roomStats.filter(({ room }) => {
      return (
        room.name.toLowerCase().includes(normalizedSearch) ||
        room.floor.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [roomStats, searchValue]);

  const totalOnline = useMemo(() => {
    return roomStats.reduce((sum, room) => sum + room.onlineCount, 0);
  }, [roomStats]);

  const totalUnread = useMemo(() => {
    return roomStats.reduce((sum, room) => sum + room.unreadCount, 0);
  }, [roomStats]);

  const handleAddRoom = () => {
    const name = newRoomName.trim();
    if (!name) return;

    onAddRoom(name);
    setNewRoomName('');
  };

  return (
    <div style={styles.card}>
      <div style={styles.headerRow}>
        <div>
          <h2 style={styles.title}>Miestnosti</h2>
          <p style={styles.subtitle}>Správa virtuálnych miestností</p>
        </div>
      </div>

      <div style={styles.summaryGrid}>
        <div style={styles.summaryItem}>
          <div style={styles.summaryValue}>{rooms.length}</div>
          <div style={styles.summaryLabel}>miestností</div>
        </div>
        <div style={styles.summaryItem}>
          <div style={styles.summaryValue}>{totalOnline}</div>
          <div style={styles.summaryLabel}>ľudí online</div>
        </div>
        <div style={styles.summaryItem}>
          <div style={styles.summaryValue}>{totalUnread}</div>
          <div style={styles.summaryLabel}>neprečítané</div>
        </div>
      </div>

      <div style={styles.addRoomBox}>
        <input
          value={newRoomName}
          onChange={(e) => setNewRoomName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddRoom();
            }
          }}
          placeholder="Názov novej miestnosti..."
          style={styles.input}
        />
        <button
          onClick={handleAddRoom}
          disabled={!newRoomName.trim()}
          style={{
            ...styles.primaryButton,
            ...(!newRoomName.trim() ? styles.primaryButtonDisabled : {}),
          }}
        >
          Pridať miestnosť
        </button>
      </div>

      <input
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder="Hľadať miestnosť alebo poschodie..."
        style={styles.searchInput}
      />

      <div style={styles.list}>
        {filteredRoomStats.length === 0 ? (
          <div style={styles.emptyBox}>Nenašla sa žiadna miestnosť.</div>
        ) : (
          filteredRoomStats.map(
            ({ room, totalCount, onlineCount, unreadCount, hasMention, mentionCount, unreadPreview }) => {
              const isSelected = selectedRoomId === room.id;

              return (
                <div
                  key={room.id}
                  style={{
                    ...styles.roomCard,
                    ...(isSelected ? styles.roomCardActive : {}),
                    ...(hasMention ? styles.roomCardMention : {}),
                  }}
                >
                  <button onClick={() => onSelectRoom(room.id)} style={styles.roomMainButton}>
                    <div style={styles.roomTopRow}>
                      <div style={styles.roomTitleWrap}>
                        <div style={styles.roomName}># {room.name}</div>

                        {hasMention && mentionCount > 0 && (
                          <div style={styles.mentionBadge}>
                            @{mentionCount > 99 ? '99+' : mentionCount}
                          </div>
                        )}

                        {!hasMention && unreadCount > 0 && (
                          <div style={styles.unreadBadge}>
                            {unreadCount > 99 ? '99+' : unreadCount}
                          </div>
                        )}
                      </div>

                      <div style={styles.roomBadge}>{totalCount}</div>
                    </div>

                    <div style={styles.roomMeta}>
                      <span
                        style={{
                          ...styles.onlineDot,
                          background: onlineCount > 0 ? getPresenceColor('online') : '#d1d5db',
                        }}
                      />
                      {onlineCount} online / {totalCount} spolu
                    </div>

                    {unreadPreview ? (
                      <div
                        style={{
                          ...styles.unreadPreviewBox,
                          ...(hasMention ? styles.unreadPreviewBoxMention : {}),
                        }}
                      >
                        <div
                          style={{
                            ...styles.unreadPreviewAuthor,
                            ...(hasMention ? styles.unreadPreviewAuthorMention : {}),
                          }}
                        >
                          {unreadPreview.message.authorName}
                        </div>
                        <div
                          style={{
                            ...styles.unreadPreviewText,
                            ...(hasMention ? styles.unreadPreviewTextMention : {}),
                          }}
                        >
                          {truncatePreview(unreadPreview.message.content)}
                        </div>
                      </div>
                    ) : (
                      <div style={styles.floorText}>{room.floor}</div>
                    )}
                  </button>

                  <button
                    onClick={() => onDeleteRoom(room.id)}
                    disabled={rooms.length <= 1}
                    title={
                      rooms.length <= 1
                        ? 'Poslednú miestnosť nie je možné zmazať'
                        : 'Zmazať miestnosť'
                    }
                    style={{
                      ...styles.deleteButton,
                      ...(rooms.length <= 1 ? styles.deleteButtonDisabled : {}),
                    }}
                  >
                    Zmazať
                  </button>
                </div>
              );
            }
          )
        )}
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  card: {
    background: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: 18,
    padding: 18,
    marginBottom: 20,
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 12,
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  title: {
    margin: 0,
    fontSize: 24,
    fontWeight: 800,
    color: '#111827',
  },
  subtitle: {
    margin: '6px 0 0',
    color: '#6b7280',
    fontSize: 14,
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
    gap: 10,
    marginBottom: 16,
  },
  summaryItem: {
    border: '1px solid #e5e7eb',
    background: '#f9fafb',
    borderRadius: 14,
    padding: '12px 14px',
  },
  summaryValue: {
    fontSize: 22,
    fontWeight: 900,
    color: '#111827',
    lineHeight: 1,
  },
  summaryLabel: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: 700,
    color: '#6b7280',
  },
  addRoomBox: {
    display: 'flex',
    gap: 12,
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  input: {
    flex: 1,
    minWidth: 240,
    padding: '12px 14px',
    borderRadius: 12,
    border: '1px solid #d1d5db',
    fontSize: 14,
    boxSizing: 'border-box',
    background: '#fff',
  },
  searchInput: {
    width: '100%',
    padding: '12px 14px',
    borderRadius: 12,
    border: '1px solid #d1d5db',
    fontSize: 14,
    boxSizing: 'border-box',
    background: '#fff',
    marginBottom: 18,
  },
  primaryButton: {
    padding: '11px 14px',
    borderRadius: 12,
    border: '1px solid #2563eb',
    background: '#2563eb',
    color: '#ffffff',
    fontWeight: 700,
    cursor: 'pointer',
  },
  primaryButtonDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  emptyBox: {
    padding: 18,
    borderRadius: 14,
    border: '1px dashed #d1d5db',
    background: '#f9fafb',
    color: '#6b7280',
    fontSize: 14,
    fontWeight: 700,
    textAlign: 'center',
  },
  roomCard: {
    display: 'flex',
    gap: 12,
    alignItems: 'stretch',
    padding: 12,
    borderRadius: 14,
    background: '#f9fafb',
    border: '1px solid #e5e7eb',
    transition: 'border-color 160ms ease, background 160ms ease, box-shadow 160ms ease',
  },
  roomCardActive: {
    background: '#eff6ff',
    borderColor: '#2563eb',
  },
  roomCardMention: {
    borderColor: '#fdba74',
    boxShadow: '0 0 0 1px rgba(249, 115, 22, 0.10)',
  },
  roomMainButton: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    textAlign: 'left',
    padding: 0,
  },
  roomTopRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 10,
    alignItems: 'center',
  },
  roomTitleWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    minWidth: 0,
    flexWrap: 'wrap',
  },
  roomName: {
    fontSize: 16,
    fontWeight: 800,
    color: '#111827',
  },
  unreadBadge: {
    minWidth: 22,
    height: 22,
    borderRadius: 999,
    background: '#2563eb',
    color: '#ffffff',
    display: 'grid',
    placeItems: 'center',
    fontSize: 12,
    fontWeight: 800,
    padding: '0 7px',
    flexShrink: 0,
  },
  mentionBadge: {
    minWidth: 26,
    height: 22,
    borderRadius: 999,
    background: '#f97316',
    color: '#ffffff',
    display: 'grid',
    placeItems: 'center',
    fontSize: 12,
    fontWeight: 900,
    padding: '0 8px',
    flexShrink: 0,
  },
  roomBadge: {
    minWidth: 28,
    height: 28,
    borderRadius: 999,
    background: '#e5e7eb',
    color: '#111827',
    display: 'grid',
    placeItems: 'center',
    fontSize: 12,
    fontWeight: 800,
    padding: '0 8px',
  },
  roomMeta: {
    marginTop: 8,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    color: '#6b7280',
    fontSize: 13,
  },
  unreadPreviewBox: {
    marginTop: 10,
    padding: '10px 12px',
    borderRadius: 12,
    background: '#ffffff',
    border: '1px solid #e5e7eb',
  },
  unreadPreviewBoxMention: {
    background: '#fff7ed',
    borderColor: '#fdba74',
  },
  unreadPreviewAuthor: {
    fontSize: 12,
    fontWeight: 800,
    color: '#475569',
    marginBottom: 4,
  },
  unreadPreviewAuthorMention: {
    color: '#c2410c',
  },
  unreadPreviewText: {
    fontSize: 13,
    lineHeight: 1.4,
    color: '#334155',
    fontWeight: 600,
    wordBreak: 'break-word',
  },
  unreadPreviewTextMention: {
    color: '#9a3412',
  },
  floorText: {
    marginTop: 6,
    color: '#6b7280',
    fontSize: 12,
    fontWeight: 700,
  },
  onlineDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    flexShrink: 0,
  },
  deleteButton: {
    padding: '0 12px',
    borderRadius: 12,
    border: '1px solid #ef4444',
    background: '#ffffff',
    color: '#ef4444',
    fontWeight: 700,
    cursor: 'pointer',
    minWidth: 90,
  },
  deleteButtonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
};