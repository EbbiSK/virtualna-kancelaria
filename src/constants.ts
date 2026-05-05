import type { Room } from "./types";

export const STORAGE_KEY = "virtualna-kancelaria-rooms";
export const MESSAGES_KEY = "virtualna-kancelaria-messages";
export const USERS_KEY = "virtualna-kancelaria-users";
export const LOGGED_USER_KEY = "virtualna-kancelaria-logged-user";

export const DEFAULT_ROOMS: Room[] = [
  {
    id: "1",
    name: "Vega",
    createdAt: "2026-04-23",
    meetingTerm: "Pondelok 09:00",
    projectName: "Virtuálna kancelária",
    people: [{ id: "p1", name: "Jaro" }],
  },
  {
    id: "2",
    name: "Orion",
    createdAt: "2026-04-23",
    meetingTerm: "",
    projectName: "Onboarding",
    people: [],
  },
];