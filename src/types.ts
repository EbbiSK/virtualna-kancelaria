export type Person = {
  id: string;
  name: string;
};

export type UserAccount = {
  email: string;
  password: string;
};

export type MessageAttachment = {
  name: string;
  type: string;
  dataUrl: string;
};

export type RoomMessage = {
  id: string;
  roomId: string;
  author: string;
  text: string;
  createdAt: string;
  attachment?: MessageAttachment;
};

export type Room = {
  id: string;
  name: string;
  createdAt: string;
  meetingTerm: string;
  projectName: string;
  people: Person[];
};