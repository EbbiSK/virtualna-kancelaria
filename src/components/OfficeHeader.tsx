export default function OfficeHeader() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-green-100 bg-gradient-to-br from-green-600 via-green-500 to-orange-400 p-8 text-white shadow-xl dark:border-zinc-800">
      
      <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

      <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-orange-300/20 blur-3xl" />

      <div className="relative z-10">
        
        <div className="flex items-center gap-4">
          
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 text-3xl font-black backdrop-blur">
            E
          </div>

          <div>
            <h1 className="text-4xl font-black tracking-tight">
              Virtuálna Kancelária
            </h1>

            <p className="mt-2 text-green-50">
              Moderný realtime workspace pre tím Ebbi
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
          
          <div className="rounded-2xl bg-white/10 px-5 py-3 backdrop-blur">
            <div className="text-sm text-green-100">
              Online zamestnanci
            </div>

            <div className="mt-1 text-2xl font-black">
              24
            </div>
          </div>

          <div className="rounded-2xl bg-white/10 px-5 py-3 backdrop-blur">
            <div className="text-sm text-green-100">
              Aktívne meetingy
            </div>

            <div className="mt-1 text-2xl font-black">
              8
            </div>
          </div>

          <div className="rounded-2xl bg-white/10 px-5 py-3 backdrop-blur">
            <div className="text-sm text-green-100">
              Aktivita systému
            </div>

            <div className="mt-1 text-2xl font-black">
              92%
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}