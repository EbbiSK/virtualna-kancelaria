import { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  DoorOpen,
  Video,
  MessageSquare,
  ArrowLeft,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  PhoneOff,
} from "lucide-react";

import { useOffice } from "../context/OfficeContext";

function createSlug(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export default function RoomsGrid() {
  const navigate = useNavigate();
  const location = useLocation();
  const { roomSlug } = useParams();

  const { rooms } = useOffice();

  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);

  const selectedRoom =
    rooms.find((room) => createSlug(room.name) === roomSlug) || null;

  const isMeetingRoute =
    location.pathname === `/rooms/${roomSlug}/meeting`;

  const savedProfile = localStorage.getItem("employee-profile-1");
  const profile = savedProfile ? JSON.parse(savedProfile) : null;

  const firstName = profile?.firstName || "Jaro";
  const lastName = profile?.lastName || "Pospíšil";

  const fullName = `${firstName} ${lastName}`;
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

  if (selectedRoom && isMeetingRoute) {
    return (
      <div className="fixed inset-0 z-[100] bg-zinc-950 text-white">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-zinc-800 px-8 py-5">
            <div>
              <h2 className="text-xl font-black">
                Meeting · {selectedRoom.name}
              </h2>

              <p className="mt-1 text-sm text-zinc-400">
                Prihlásený používateľ: {fullName}
              </p>
            </div>

            <button
              onClick={() =>
                navigate(`/rooms/${createSlug(selectedRoom.name)}`)
              }
              className="rounded-2xl bg-zinc-900 px-5 py-3 text-sm font-bold text-zinc-300 transition hover:bg-zinc-800"
            >
              Zavrieť
            </button>
          </div>

          <div className="grid flex-1 grid-cols-1 gap-6 p-8 xl:grid-cols-[1fr_320px]">
            <div className="flex items-center justify-center rounded-3xl bg-zinc-900">
              <div className="text-center">
                {cameraOn ? (
                  <>
                    <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-green-600 text-4xl font-black text-white">
                      {initials}
                    </div>

                    <h3 className="mt-6 text-2xl font-black">
                      {fullName}
                    </h3>

                    <p className="mt-2 text-sm text-green-400">
                      Kamera zapnutá
                    </p>
                  </>
                ) : (
                  <>
                    <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-zinc-800 text-zinc-500">
                      <CameraOff size={42} />
                    </div>

                    <h3 className="mt-6 text-2xl font-black">
                      {fullName}
                    </h3>

                    <p className="mt-2 text-sm text-red-400">
                      Kamera vypnutá
                    </p>
                  </>
                )}
              </div>
            </div>

            <div className="rounded-3xl bg-zinc-900 p-6">
              <h3 className="text-lg font-black">
                Účastníci
              </h3>

              <div className="mt-5 rounded-2xl bg-zinc-800 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-600 text-sm font-black text-white">
                    {initials}
                  </div>

                  <div>
                    <p className="font-bold">
                      {fullName}
                    </p>

                    <p className="text-xs text-green-400">
                      Online
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-zinc-800 p-4 text-sm text-zinc-400">
                V miestnosti je aktuálne prihlásený používateľ.
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 border-t border-zinc-800 px-8 py-5">
            <button
              onClick={() => setMicOn(!micOn)}
              className={`flex h-14 w-14 items-center justify-center rounded-2xl transition ${
                micOn
                  ? "bg-zinc-800 hover:bg-zinc-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {micOn ? <Mic size={22} /> : <MicOff size={22} />}
            </button>

            <button
              onClick={() => setCameraOn(!cameraOn)}
              className={`flex h-14 w-14 items-center justify-center rounded-2xl transition ${
                cameraOn
                  ? "bg-zinc-800 hover:bg-zinc-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {cameraOn ? <Camera size={22} /> : <CameraOff size={22} />}
            </button>

            <button
              onClick={() =>
                navigate(`/rooms/${createSlug(selectedRoom.name)}`)
              }
              className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-600 transition hover:bg-red-700"
            >
              <PhoneOff size={22} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (selectedRoom) {
    return (
      <div className="rounded-3xl border border-zinc-100 bg-white p-8 shadow-sm">
        <button
          onClick={() => navigate("/rooms")}
          className="mb-10 flex items-center gap-2 rounded-2xl bg-zinc-50 px-4 py-3 text-sm font-bold text-zinc-700 transition hover:bg-zinc-100"
        >
          <ArrowLeft size={16} />
          Späť
        </button>

        <div className="flex min-h-[360px] flex-col justify-between">
          <div className="flex items-start justify-between gap-8">
            <div>
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-green-50 text-green-700">
                <DoorOpen size={28} />
              </div>

              <h2 className="mt-8 text-5xl font-black tracking-tight text-green-800">
                {selectedRoom.name}
              </h2>

              <p className="mt-4 text-xl text-zinc-500">
                Virtuálna miestnosť
              </p>
            </div>

            <h3 className="mt-12 text-base font-black text-green-800">
              {fullName}
            </h3>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
            <button
              onClick={() =>
                navigate(`/rooms/${createSlug(selectedRoom.name)}/meeting`)
              }
              className="rounded-3xl border border-zinc-100 bg-zinc-50 p-8 text-left transition hover:border-green-200 hover:bg-green-50"
            >
              <Video className="text-green-700" size={28} />

              <h3 className="mt-6 text-2xl font-black text-green-800">
                Meeting
              </h3>

              <p className="mt-3 text-sm text-zinc-500">
                Spusti virtuálny meeting
              </p>
            </button>

            <button
              onClick={() =>
                navigate(`/chat/${createSlug(selectedRoom.name)}`)
              }
              className="rounded-3xl border border-zinc-100 bg-zinc-50 p-8 text-left transition hover:border-green-200 hover:bg-green-50"
            >
              <MessageSquare className="text-green-700" size={28} />

              <h3 className="mt-6 text-2xl font-black text-green-800">
                Chat
              </h3>

              <p className="mt-3 text-sm text-zinc-500">
                Otvor chat miestnosti
              </p>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-zinc-100 bg-white p-8 shadow-sm">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-zinc-900">
            Miestnosti
          </h2>

          <p className="mt-2 text-zinc-500">
            Virtuálne kancelárie
          </p>
        </div>

        <span className="rounded-2xl bg-green-50 px-4 py-3 text-sm font-bold text-green-700">
          {rooms.length} miestností
        </span>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {rooms.map((room) => (
          <button
            key={room.id}
            onClick={() => {
              const isLoggedIn =
                localStorage.getItem("ebbi-auth") === "true";

              if (!isLoggedIn) return;

              navigate(`/rooms/${createSlug(room.name)}`);
            }}
            className="rounded-3xl border border-zinc-100 bg-zinc-50 p-7 text-left transition hover:border-green-200 hover:bg-green-50"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-green-700 shadow-sm">
              <DoorOpen size={24} />
            </div>

            <h3 className="mt-6 text-2xl font-black text-zinc-900">
              {room.name}
            </h3>

            <p className="mt-2 text-sm text-zinc-500">
              Vstúpiť ako prihlásený používateľ
            </p>

            <div className="mt-6 rounded-2xl bg-green-600 px-5 py-3 text-center text-sm font-black text-white shadow-sm transition hover:bg-green-700">
              Vstúpiť do miestnosti
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}