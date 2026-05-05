import { LockKeyhole, Mail, UserRound } from "lucide-react";

type AuthViewProps = {
  authMode: "login" | "register";
  setAuthMode: (mode: "login" | "register") => void;
  authEmail: string;
  setAuthEmail: (value: string) => void;
  authPassword: string;
  setAuthPassword: (value: string) => void;
  authMessage: string;
  setAuthMessage: (value: string) => void;
  handleLogin: () => void;
  handleRegister: () => void;
  goHome: () => void;
};

export default function AuthView({
  authMode,
  setAuthMode,
  authEmail,
  setAuthEmail,
  authPassword,
  setAuthPassword,
  authMessage,
  setAuthMessage,
  handleLogin,
  handleRegister,
  goHome,
}: AuthViewProps) {
  return (
    <main className="flex min-h-[calc(100vh-76px)] items-center justify-center bg-slate-100 px-6 py-12">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
        <button
          onClick={goHome}
          className="mb-6 rounded-xl border border-slate-300 px-4 py-2 text-sm"
        >
          ← Späť
        </button>

        <div className="mb-6 text-center">
          <div className="mb-3 flex justify-center">
            <div className="rounded-2xl bg-slate-950 p-3 text-white">
              <UserRound size={28} />
            </div>
          </div>

          <h1 className="text-3xl font-extrabold">
            {authMode === "login" ? "Prihlásenie" : "Registrácia"}
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            {authMode === "login"
              ? "Zadaj svoje prihlasovacie údaje"
              : "Vytvor si nový účet"}
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <div className="flex items-center gap-2 rounded-xl border border-slate-300 px-3 py-2">
              <Mail size={18} className="text-slate-400" />
              <input
                type="email"
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                className="w-full outline-none"
                placeholder="meno@email.sk"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Heslo</label>
            <div className="flex items-center gap-2 rounded-xl border border-slate-300 px-3 py-2">
              <LockKeyhole size={18} className="text-slate-400" />
              <input
                type="password"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                className="w-full outline-none"
                placeholder="Zadaj heslo"
              />
            </div>
          </div>

          {authMessage && (
            <div className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">
              {authMessage}
            </div>
          )}

          <button
            onClick={authMode === "login" ? handleLogin : handleRegister}
            className="w-full rounded-xl bg-slate-950 py-3 text-lg font-bold text-white"
          >
            {authMode === "login" ? "Prihlásiť sa" : "Registrovať sa"}
          </button>
        </div>

        <div className="mt-5 text-center text-sm">
          {authMode === "login" ? (
            <>
              Nemáš účet?{" "}
              <button
                onClick={() => {
                  setAuthMode("register");
                  setAuthMessage("");
                }}
                className="font-bold underline"
              >
                Registrácia
              </button>
            </>
          ) : (
            <>
              Už máš účet?{" "}
              <button
                onClick={() => {
                  setAuthMode("login");
                  setAuthMessage("");
                }}
                className="font-bold underline"
              >
                Prihlásenie
              </button>
            </>
          )}
        </div>
      </div>
    </main>
  );
}