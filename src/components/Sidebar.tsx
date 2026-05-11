type SidebarProps = {
  activePage: string;
  setActivePage: (page: string) => void;
  avatar?: string;
};

const menu = [
  { name: "Dashboard", icon: "🏠" },
  { name: "Miestnosti", icon: "🏢" },
  { name: "Chat", icon: "💬" },
  { name: "Kalendár", icon: "📅" },
  { name: "Nastavenia", icon: "⚙️" },
];

export default function Sidebar({
  activePage,
  setActivePage,
  avatar,
}: SidebarProps) {
  return (
    <aside className="hidden w-72 flex-col border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 xl:flex">
      <div className="border-b border-zinc-100 p-6 dark:border-zinc-800">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-orange-400 text-2xl font-black text-white shadow-lg">
            E
          </div>

          <div>
            <h1 className="text-xl font-black text-zinc-900 dark:text-white">
              Ebbi Office
            </h1>

            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Virtual Workspace
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-2 p-4">
        {menu.map((item) => {
          const isActive = activePage === item.name;

          return (
            <button
              key={item.name}
              onClick={() => setActivePage(item.name)}
              className={`flex w-full items-center gap-4 rounded-2xl px-4 py-4 text-left transition-all duration-300 ${
                isActive
                  ? "bg-gradient-to-r from-green-500 to-orange-400 text-white shadow-lg"
                  : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
              }`}
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="font-semibold">{item.name}</span>
            </button>
          );
        })}
      </nav>

      <div className="border-t border-zinc-100 p-4 dark:border-zinc-800">
        <div className="flex items-center gap-3 rounded-2xl bg-zinc-100 p-3 dark:bg-zinc-800">
          <div className="relative">
            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-green-500 to-orange-400 font-black text-white">
              {avatar ? (
                <img
                  src={avatar}
                  alt="User avatar"
                  className="h-full w-full object-cover"
                />
              ) : (
                "J"
              )}
            </div>

            <div className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-green-500 dark:border-zinc-800" />
          </div>

          <div>
            <div className="font-semibold text-zinc-900 dark:text-white">
              Jaroslav
            </div>

            <div className="text-sm text-zinc-500 dark:text-zinc-400">
              Online
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}