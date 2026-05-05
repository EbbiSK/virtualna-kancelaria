import type { Room } from "../types";

export const mockRooms: Room[] = [
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