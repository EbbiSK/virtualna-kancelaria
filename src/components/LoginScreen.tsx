import { useState } from "react";
import { LogIn } from "lucide-react";

type LoginScreenProps = {
  onLogin: (email: string, password: string) => void;
};

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState("jaro@ebbi.sk");
  const [password, setPassword] = useState("password");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim() || !password.trim()) return;

    onLogin(email.trim(), password.trim());
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950">
      <div className="w-full max-w-md rounded-3xl border border-zinc-100 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-600 text-xl font-black text-white">
            E
          </div>

          <h1 className="mt-5 text-3xl font-black tracking-tight text-zinc-900 dark:text-white">
            Ebbi Office
          </h1>

          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Prihlás sa do virtuálnej kancelárie.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-bold text-zinc-700 dark:text-zinc-300">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="meno@ebbi.sk"
              className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-semibold text-zinc-900 outline-none transition focus:border-green-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-zinc-700 dark:text-zinc-300">
              Heslo
            </label>

            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-semibold text-zinc-900 outline-none transition focus:border-green-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
            />
          </div>

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-green-600 px-5 py-4 text-sm font-black text-white transition hover:bg-green-700"
          >
            <LogIn size={18} />
            Prihlásiť sa
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-zinc-400">
          Demo login: ľubovoľný email a heslo.
        </p>
      </div>
    </div>
  );
}