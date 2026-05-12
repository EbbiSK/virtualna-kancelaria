import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type UserSettingsContextType = {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  avatar: string;
  setAvatarFromFile: (file: File) => void;
  removeAvatar: () => void;
  activeUserId: number;
  setActiveUserId: (id: number) => void;
};

const UserSettingsContext = createContext<UserSettingsContextType | null>(null);

export function UserSettingsProvider({ children }: { children: ReactNode }) {
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("darkMode");
    return savedTheme === "true";
  });

  const [avatar, setAvatar] = useState(() => {
    return localStorage.getItem("userAvatar") || "";
  });

  const [activeUserId, setActiveUserIdState] = useState(() => {
    const savedUserId = localStorage.getItem("activeUserId");
    return savedUserId ? Number(savedUserId) : 1;
  });

  useEffect(() => {
    localStorage.setItem("darkMode", String(darkMode));
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("activeUserId", String(activeUserId));
  }, [activeUserId]);

  function setAvatarFromFile(file: File) {
    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result as string;

      setAvatar(result);
      localStorage.setItem("userAvatar", result);
    };

    reader.readAsDataURL(file);
  }

  function removeAvatar() {
    setAvatar("");
    localStorage.removeItem("userAvatar");
  }

  function setActiveUserId(id: number) {
    setActiveUserIdState(id);
  }

  return (
    <UserSettingsContext.Provider
      value={{
        darkMode,
        setDarkMode,
        avatar,
        setAvatarFromFile,
        removeAvatar,
        activeUserId,
        setActiveUserId,
      }}
    >
      {children}
    </UserSettingsContext.Provider>
  );
}

export function useUserSettings() {
  const context = useContext(UserSettingsContext);

  if (!context) {
    throw new Error("useUserSettings must be used inside UserSettingsProvider");
  }

  return context;
}