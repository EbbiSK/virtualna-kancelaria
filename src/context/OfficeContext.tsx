import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Room = {
  id: number;
  name: string;
};

export type Employee = {
  id: number;
  name: string;
  role: string;
  roomId: number | "";
};

type OfficeContextType = {
  rooms: Room[];
  employees: Employee[];
  addRoom: (name: string) => void;
  deleteRoom: (roomId: number) => void;
  addEmployee: (name: string, role: string) => void;
  deleteEmployee: (employeeId: number) => void;
  changeEmployeeRoom: (employeeId: number, roomId: string) => void;
};

const defaultRooms: Room[] = [
  { id: 1, name: "Manažment" },
  { id: 2, name: "Marketing" },
  { id: 3, name: "IT kancelária" },
  { id: 4, name: "Support" },
];

const defaultEmployees: Employee[] = [
  { id: 1, name: "Jaro", role: "CEO", roomId: 1 },
  { id: 2, name: "Michaela", role: "Marketing", roomId: 2 },
  { id: 3, name: "Peter", role: "Developer", roomId: 3 },
];

const OfficeContext = createContext<OfficeContextType | null>(null);

export function OfficeProvider({ children }: { children: ReactNode }) {
  const [rooms, setRooms] = useState<Room[]>(() => {
    const saved = localStorage.getItem("officeRooms");
    return saved ? JSON.parse(saved) : defaultRooms;
  });

  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem("officeEmployees");
    return saved ? JSON.parse(saved) : defaultEmployees;
  });

  useEffect(() => {
    localStorage.setItem("officeRooms", JSON.stringify(rooms));
  }, [rooms]);

  useEffect(() => {
    localStorage.setItem("officeEmployees", JSON.stringify(employees));
  }, [employees]);

  function addRoom(name: string) {
    if (!name.trim()) return;

    setRooms((currentRooms) => [
      ...currentRooms,
      {
        id: Date.now(),
        name,
      },
    ]);
  }

  function deleteRoom(roomId: number) {
    setRooms((currentRooms) =>
      currentRooms.filter((room) => room.id !== roomId)
    );

    setEmployees((currentEmployees) =>
      currentEmployees.map((employee) =>
        employee.roomId === roomId ? { ...employee, roomId: "" } : employee
      )
    );
  }

  function addEmployee(name: string, role: string) {
    if (!name.trim()) return;

    setEmployees((currentEmployees) => [
      ...currentEmployees,
      {
        id: Date.now(),
        name,
        role: role || "Zamestnanec",
        roomId: "",
      },
    ]);
  }

  function deleteEmployee(employeeId: number) {
    setEmployees((currentEmployees) =>
      currentEmployees.filter((employee) => employee.id !== employeeId)
    );
  }

  function changeEmployeeRoom(employeeId: number, roomId: string) {
    setEmployees((currentEmployees) =>
      currentEmployees.map((employee) =>
        employee.id === employeeId
          ? { ...employee, roomId: roomId ? Number(roomId) : "" }
          : employee
      )
    );
  }

  return (
    <OfficeContext.Provider
      value={{
        rooms,
        employees,
        addRoom,
        deleteRoom,
        addEmployee,
        deleteEmployee,
        changeEmployeeRoom,
      }}
    >
      {children}
    </OfficeContext.Provider>
  );
}

export function useOffice() {
  const context = useContext(OfficeContext);

  if (!context) {
    throw new Error("useOffice must be used inside OfficeProvider");
  }

  return context;
}