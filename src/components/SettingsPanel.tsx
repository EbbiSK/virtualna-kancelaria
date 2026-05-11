type SettingsPanelProps = {
  avatar: string;
  onAvatarUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveAvatar: () => void;
};

export default function SettingsPanel({
  avatar,
  onAvatarUpload,
  onRemoveAvatar,
}: SettingsPanelProps) {
  return (
    <div className="rounded-3xl border border-zinc-100 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="text-3xl font-black text-zinc-900 dark:text-white">
        Nastavenia
      </h2>

      <p className="mt-2 text-zinc-500 dark:text-zinc-400">
        Spravuj svoj profil a vzhľad virtuálnej kancelárie.
      </p>

      <div className="mt-8 rounded-3xl border border-zinc-100 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-950">
        <h3 className="text-xl font-black text-zinc-900 dark:text-white">
          Profil používateľa
        </h3>

        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Nahraj si vlastný avatar. Zobrazí sa aj v sidebare.
        </p>

        <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-center">
          <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-green-500 to-orange-400 text-4xl font-black text-white shadow-lg">
            {avatar ? (
              <img
                src={avatar}
                alt="Avatar"
                className="h-full w-full object-cover"
              />
            ) : (
              "J"
            )}
          </div>

          <div className="space-y-4">
            <label className="inline-flex cursor-pointer items-center rounded-2xl bg-gradient-to-r from-green-500 to-orange-400 px-6 py-3 font-bold text-white shadow-md transition hover:scale-[1.02]">
              Nahrať avatar
              <input
                type="file"
                accept="image/*"
                onChange={onAvatarUpload}
                className="hidden"
              />
            </label>

            {avatar && (
              <button
                onClick={onRemoveAvatar}
                className="ml-3 rounded-2xl border border-zinc-200 px-6 py-3 font-bold text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Odstrániť
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}