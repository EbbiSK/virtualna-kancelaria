import type { Room } from "./types";

export const initialRooms: Room[] = [
  {
    id: "room-1",
    name: "Lobby",
    createdAt: "2026-04-23",
    meetingTerm: "",
    projectName: "Recepcia",
    people: [],
  },
  {
    id: "room-2",
    name: "Development",
    createdAt: "2026-04-23",
    meetingTerm: "",
    projectName: "Vývoj",
    people: [],
  },
  {
    id: "room-3",
    name: "Marketing",
    createdAt: "2026-04-23",
    meetingTerm: "",
    projectName: "Marketing",
    people: [],
  },
];

export const initialEmployees = [
  {
    id: "emp-1",
    name: "Jaroslav",
    position: "Frontend Developer",
    avatar: "🧑‍💻",
    currentRoomId: "room-2",
    status: "online",
    lastActiveAt: new Date().toISOString(),
  },
  {
    id: "emp-2",
    name: "Petra",
    position: "Product Manager",
    avatar: "👩‍💼",
    currentRoomId: "room-1",
    status: "busy",
    lastActiveAt: new Date().toISOString(),
  },
  {
    id: "emp-3",
    name: "Marek",
    position: "Designer",
    avatar: "🎨",
    currentRoomId: "room-3",
    status: "away",
    lastActiveAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
  },
];