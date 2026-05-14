import type { ChangeEvent } from "react";

import SettingsPanel from "../components/SettingsPanel";
import { useUserSettings } from "../context/UserSettingsContext";

export default function SettingsPage() {
  const {
    darkMode,
    setDarkMode,
    avatar,
    setAvatarFromFile,
    removeAvatar,
  } = useUserSettings();

  function handleAvatarUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    setAvatarFromFile(file);
  }

  return (
    <SettingsPanel
      avatar={avatar}
      onAvatarUpload={handleAvatarUpload}
      onRemoveAvatar={removeAvatar}
      darkMode={darkMode}
      setDarkMode={setDarkMode}
    />
  );
}
