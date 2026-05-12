<div className="rounded-3xl border border-zinc-100 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
  <h3 className="flex items-center gap-2 text-xl font-black text-zinc-900 dark:text-white">
    <UserPlus size={20} />
    Zamestnanci
  </h3>

  <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
    <input
      value={newEmployeeName}
      onChange={(event) => setNewEmployeeName(event.target.value)}
      placeholder="Meno"
      className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none focus:border-green-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
    />

    <input
      value={newEmployeeRole}
      onChange={(event) => setNewEmployeeRole(event.target.value)}
      placeholder="Pozícia"
      className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none focus:border-green-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
    />

    <button
      onClick={handleAddEmployee}
      className="flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-green-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-green-400"
    >
      <Plus size={16} />
      Pridať zamestnanca
    </button>
  </div>

  <div className="mt-5 space-y-3">
    {employees.map((employee) => (
      <div
        key={employee.id}
        className="grid cursor-pointer grid-cols-1 gap-3 rounded-xl bg-zinc-50 p-4 transition hover:bg-zinc-100 dark:bg-zinc-950 dark:hover:bg-zinc-900 md:grid-cols-[1fr_220px_auto]"
        onClick={() => navigate(`/employee/${employee.id}`)}
      >
        <div>
          <p className="font-bold text-zinc-900 dark:text-white">
            {employee.name}
          </p>

          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {employee.role}
          </p>
        </div>

        <select
          value={employee.roomId}
          onClick={(event) => event.stopPropagation()}
          onChange={(event) =>
            changeEmployeeRoom(employee.id, event.target.value)
          }
          className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-green-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
        >
          <option value="">Bez miestnosti</option>

          {rooms.map((room) => (
            <option key={room.id} value={room.id}>
              {room.name}
            </option>
          ))}
        </select>

        <button
          onClick={(event) => {
            event.stopPropagation();
            deleteEmployee(employee.id);
          }}
          className="rounded-xl px-4 py-3 text-red-600 transition hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <Trash2 size={17} />
        </button>
      </div>
    ))}
  </div>
</div>