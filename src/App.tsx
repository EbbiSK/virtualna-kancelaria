import { useEffect, useRef, useState } from "react";

import Header from "./components/Header";
import HomeView from "./components/HomeView";
import AuthView from "./components/AuthView";
import RoomsView from "./components/RoomsView";
import SettingsView from "./components/SettingsView";

import {
  DEFAULT_ROOMS,
  LOGGED_USER_KEY,
  MESSAGES_KEY,
  STORAGE_KEY,
  USERS_KEY,
} from "./constants";

import type {
  MessageAttachment,
  Room,
  RoomMessage,
  UserAccount,
} from "./types";

function resizeImage(file: File, callback: (dataUrl: string) => void) {
  const reader = new FileReader();

  reader.onload = () => {
    const img = new Image();

    img.onload = () => {
      const maxSize = 900;
      let width = img.width;
      let height = img.height;

      if (width > height && width > maxSize) {
        height = Math.round((height * maxSize) / width);
        width = maxSize;
      }

      if (height >= width && height > maxSize) {
        width = Math.round((width * maxSize) / height);
        height = maxSize;
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(img, 0, 0, width, height);

      callback(canvas.toDataURL("image/jpeg", 0.75));
    };

    img.src = String(reader.result || "");
  };

  reader.readAsDataURL(file);
}

export default function App() {
  const [view, setView] = useState<"home" | "rooms" | "settings" | "auth">("home");
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [openedRoomId, setOpenedRoomId] = useState<string | null>(null);
  const [newRoomName, setNewRoomName] = useState("");
  const [currentUserName, setCurrentUserName] = useState("Jaro");
  const [messageText, setMessageText] = useState("");
  const [activeCalls, setActiveCalls] = useState<Record<string, boolean>>({});
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authMessage, setAuthMessage] = useState("");

  const [loggedUserEmail, setLoggedUserEmail] = useState<string | null>(() =>
    localStorage.getItem(LOGGED_USER_KEY)
  );

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [rooms, setRooms] = useState<Room[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return DEFAULT_ROOMS;

    try {
      return JSON.parse(saved) as Room[];
    } catch {
      return DEFAULT_ROOMS;
    }
  });

  const [messages, setMessages] = useState<RoomMessage[]>(() => {
    const saved = localStorage.getItem(MESSAGES_KEY);
    if (!saved) return [];

    try {
      return JSON.parse(saved) as RoomMessage[];
    } catch {
      return [];
    }
  });

  const openedRoom = rooms.find((room) => room.id === openedRoomId) ?? null;
  const openedRoomMessages = messages.filter(
    (message) => message.roomId === openedRoomId
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rooms));
  }, [rooms]);

  useEffect(() => {
    try {
      localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
    } catch {
      alert("Fotka je príliš veľká na uloženie v prehliadači.");
    }
  }, [messages]);

  useEffect(() => {
    if (loggedUserEmail) {
      localStorage.setItem(LOGGED_USER_KEY, loggedUserEmail);
      setCurrentUserName(loggedUserEmail);
    } else {
      localStorage.removeItem(LOGGED_USER_KEY);
    }
  }, [loggedUserEmail]);

  const getUsers = (): UserAccount[] => {
    const savedUsers = localStorage.getItem(USERS_KEY);
    if (!savedUsers) return [];

    try {
      return JSON.parse(savedUsers) as UserAccount[];
    } catch {
      return [];
    }
  };

  const saveUsers = (users: UserAccount[]) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  };

  const handleRegister = () => {
    setAuthMessage("");

    if (!authEmail.trim() || !authPassword.trim()) {
      setAuthMessage("Zadaj email aj heslo.");
      return;
    }

    const email = authEmail.trim();
    const users = getUsers();

    const exists = users.some(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );

    if (exists) {
      setAuthMessage("Tento email už existuje.");
      return;
    }

    saveUsers([...users, { email, password: authPassword }]);

    setLoggedUserEmail(email);
    setAuthEmail("");
    setAuthPassword("");
    setView("home");
  };

  const handleLogin = () => {
    setAuthMessage("");

    if (!authEmail.trim() || !authPassword.trim()) {
      setAuthMessage("Zadaj email aj heslo.");
      return;
    }

    const email = authEmail.trim();

    const user = getUsers().find(
      (savedUser) =>
        savedUser.email.toLowerCase() === email.toLowerCase() &&
        savedUser.password === authPassword
    );

    if (!user) {
      setAuthMessage("Zlé prihlasovacie údaje.");
      return;
    }

    setLoggedUserEmail(user.email);
    setAuthEmail("");
    setAuthPassword("");
    setView("home");
  };

  const logout = () => {
    setLoggedUserEmail(null);
    setCurrentUserName("Jaro");
  };

  const addRoom = () => {
    if (!newRoomName.trim()) return;

    setRooms((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name: newRoomName.trim(),
        createdAt: "",
        meetingTerm: "",
        projectName: "",
        people: [],
      },
    ]);

    setNewRoomName("");
  };

  const updateRoom = <K extends keyof Room>(
    id: string,
    key: K,
    value: Room[K]
  ) => {
    setRooms((prev) =>
      prev.map((room) => (room.id === id ? { ...room, [key]: value } : room))
    );
  };

  const deleteRoom = (id: string) => {
    setRooms((prev) => prev.filter((room) => room.id !== id));
    setMessages((prev) => prev.filter((message) => message.roomId !== id));

    if (openedRoomId === id) {
      setOpenedRoomId(null);
    }
  };

  const addPerson = (roomId: string) => {
    const name = prompt("Meno:");
    if (!name?.trim()) return;

    setRooms((prev) =>
      prev.map((room) =>
        room.id === roomId
          ? {
              ...room,
              people: [
                ...room.people,
                {
                  id: Date.now().toString(),
                  name: name.trim(),
                },
              ],
            }
          : room
      )
    );
  };

  const removePerson = (roomId: string, personId: string) => {
    setRooms((prev) =>
      prev.map((room) =>
        room.id === roomId
          ? {
              ...room,
              people: room.people.filter((person) => person.id !== personId),
            }
          : room
      )
    );
  };

  const sendMessage = (attachment?: MessageAttachment) => {
    if (!openedRoomId) return;
    if (!messageText.trim() && !attachment) return;

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        roomId: openedRoomId,
        author: currentUserName.trim() || "Používateľ",
        text: messageText.trim(),
        createdAt: new Date().toLocaleString("sk-SK"),
        attachment,
      },
    ]);

    setMessageText("");
  };

  const handleFilePick = (file: File) => {
    if (!openedRoomId) return;

    if (!file.type.startsWith("image/")) {
      alert("Zatiaľ podporujeme iba obrázky.");
      return;
    }

    resizeImage(file, (dataUrl) => {
      sendMessage({
        name: file.name,
        type: "image/jpeg",
        dataUrl,
      });
    });
  };

  return (
    <div className="min-h-screen bg-white text-slate-950">
      <Header
        loggedUserEmail={loggedUserEmail}
        logout={logout}
        openAuth={() => {
          setAuthMode("login");
          setAuthMessage("");
          setView("auth");
        }}
      />

      {view === "home" && (
        <HomeView
          openRooms={() => {
            setOpenedRoomId(null);
            setView("rooms");
          }}
          openSettings={() => setView("settings")}
        />
      )}

      {view === "auth" && (
        <AuthView
          authMode={authMode}
          setAuthMode={setAuthMode}
          authEmail={authEmail}
          setAuthEmail={setAuthEmail}
          authPassword={authPassword}
          setAuthPassword={setAuthPassword}
          authMessage={authMessage}
          setAuthMessage={setAuthMessage}
          handleLogin={handleLogin}
          handleRegister={handleRegister}
          goHome={() => setView("home")}
        />
      )}

      {view === "rooms" && (
        <RoomsView
          rooms={rooms}
          openedRoom={openedRoom}
          openedRoomMessages={openedRoomMessages}
          setOpenedRoomId={setOpenedRoomId}
          goHome={() => {
            setOpenedRoomId(null);
            setView("home");
          }}
          activeCalls={activeCalls}
          setActiveCalls={setActiveCalls}
          currentUserName={currentUserName}
          setCurrentUserName={setCurrentUserName}
          messageText={messageText}
          setMessageText={setMessageText}
          sendMessage={sendMessage}
          fileInputRef={fileInputRef}
          handleFilePick={handleFilePick}
        />
      )}

      {view === "settings" && (
        <SettingsView
          rooms={rooms}
          newRoomName={newRoomName}
          setNewRoomName={setNewRoomName}
          addRoom={addRoom}
          updateRoom={updateRoom}
          deleteRoom={deleteRoom}
          addPerson={addPerson}
          removePerson={removePerson}
          goHome={() => setView("home")}
        />
      )}
    </div>
  );
}