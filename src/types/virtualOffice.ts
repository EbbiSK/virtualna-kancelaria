export type Presence = "online" | "away" | "offline";

export type Person = {
  id: string;
  name: string;
  role: string;
  project: string;
  presence: Presence;
};

export type Room = {
  id: string;
  name: string;
  project: string;
  people: Person[];
  status: "active" | "quiet" | "available";
  position: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
};

export type MessageAttachment = {
  kind: "image" | "file";
  name: string;
  sizeLabel: string;
  mimeType: string;
  url: string;
};

export type RoomMessage = {
  id: string;
  roomId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
  attachment?: MessageAttachment;
};

export type DirectMessage = {
  id: string;
  threadKey: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
  attachment?: MessageAttachment;
};

export type PanelMode = "activity" | "room" | "dm";

export type RoomCallState = {
  roomId: string;
  startedById: string;
  participantIds: string[];
  startedAt: string;
};