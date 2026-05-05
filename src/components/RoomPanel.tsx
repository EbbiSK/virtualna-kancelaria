import {
  Image as ImageIcon,
  Paperclip,
  Send,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { getPresenceMeta, getRoomTone } from "../lib/virtualOffice";
import { MessageBubble } from "./virtual-office/MessageBubble";
import { UserAvatar } from "./virtual-office/UserAvatar";
import type {
  MessageAttachment,
  Person,
  Room,
  RoomCallState,
  RoomMessage,
} from "../types/virtualOffice";

type RoomPanelProps = {
  room: Room;
  currentUserId: string;
  currentRoomMessages: RoomMessage[];
  enteredRoomCall: RoomCallState | null;
  isCurrentUserInEnteredRoomCall: boolean;
  draftMessage: string;
  pendingRoomAttachment: MessageAttachment | null;
  roomFileInputRef: React.RefObject<HTMLInputElement | null>;
  onClose: () => void;
  onStartCall: () => void;
  onJoinCall: () => void;
  onLeaveCall: () => void;
  onShareLink: () => void;
  onSelectPerson: (person: Person) => void;
  onInvitePerson: () => void;
  onDraftMessageChange: (value: string) => void;
  onSendMessage: () => void;
  onClearPendingAttachment: () => void;
  onRoomAttachmentPick: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export function RoomPanel({
  room,
  currentUserId,
  currentRoomMessages,
  enteredRoomCall,
  isCurrentUserInEnteredRoomCall,
  draftMessage,
  pendingRoomAttachment,
  roomFileInputRef,
  onClose,
  onStartCall,
  onJoinCall,
  onLeaveCall,
  onShareLink,
  onSelectPerson,
  onInvitePerson,
  onDraftMessageChange,
  onSendMessage,
  onClearPendingAttachment,
  onRoomAttachmentPick,
}: RoomPanelProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="mb-5 flex items-start justify-between">
        <h2 className="text-4xl font-semibold text-white">V miestnosti</h2>
        <button
          type="button"
          onClick={onClose}
          className="rounded-2xl p-2 text-slate-500 transition hover:bg-white/[0.05] hover:text-white"
        >
          <X size={22} />
        </button>
      </div>

      <div className="rounded-[24px] border border-white/8 bg-[#16233d] p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-emerald-500/15 p-3 text-emerald-300">
              <Users size={24} />
            </div>
            <div>
              <p className="text-4xl font-semibold text-white">{room.name}</p>
              <p className="mt-1 text-xl text-slate-300">{room.project}</p>
            </div>
          </div>

          <span
            className={[
              "rounded-full px-3 py-1 text-base",
              getRoomTone(room.status).pill,
            ].join(" ")}
          >
            {getRoomTone(room.status).label}
          </span>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-white/[0.03] p-4">
            <p className="text-sm text-slate-400">Ľudia</p>
            <p className="mt-1 text-3xl font-semibold text-white">
              {room.people.length}
            </p>
          </div>

          <div className="rounded-2xl bg-white/[0.03] p-4">
            <p className="text-sm text-slate-400">Hovor</p>
            <p className="mt-1 text-3xl font-semibold text-white">
              {enteredRoomCall ? "Aktívny" : "Neaktívny"}
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          {enteredRoomCall ? (
            isCurrentUserInEnteredRoomCall ? (
              <button
                type="button"
                onClick={onLeaveCall}
                className="rounded-2xl bg-emerald-600 px-4 py-3 text-lg font-medium text-white transition hover:bg-emerald-500"
              >
                Ukončiť hovor
              </button>
            ) : (
              <button
                type="button"
                onClick={onJoinCall}
                className="rounded-2xl bg-emerald-600 px-4 py-3 text-lg font-medium text-white transition hover:bg-emerald-500"
              >
                Pripojiť sa
              </button>
            )
          ) : (
            <button
              type="button"
              onClick={onStartCall}
              className="rounded-2xl bg-emerald-600 px-4 py-3 text-lg font-medium text-white transition hover:bg-emerald-500"
            >
              Začať hovor
            </button>
          )}

          <button
            type="button"
            onClick={onShareLink}
            className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-lg font-medium text-slate-200 transition hover:bg-white/[0.06]"
          >
            Zdieľať odkaz
          </button>
        </div>
      </div>

      <div className="mt-5 rounded-[24px] border border-white/8 bg-[#16233d] p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-2xl font-semibold text-white">Ľudia v miestnosti</h3>
          <button
            type="button"
            onClick={onInvitePerson}
            className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-slate-300 transition hover:bg-white/[0.06]"
          >
            <span className="flex items-center gap-2">
              <UserPlus size={16} />
              Pozvať človeka
            </span>
          </button>
        </div>

        <div className="space-y-3">
          {room.people.map((person) => {
            const presence = getPresenceMeta(person.presence);
            const isInCall = enteredRoomCall?.participantIds.includes(person.id);

            return (
              <div
                key={person.id}
                className="flex items-center justify-between rounded-2xl p-3 hover:bg-white/[0.03]"
              >
                <button
                  type="button"
                  onClick={() => onSelectPerson(person)}
                  className="flex items-center gap-3 text-left"
                >
                  <UserAvatar name={person.name} presence={person.presence} />
                  <div>
                    <p className="text-lg font-medium text-white">{person.name}</p>
                    <p className="text-sm text-slate-400">{person.role}</p>
                  </div>
                </button>

                <div className="flex items-center gap-3">
                  {isInCall ? (
                    <span className="text-sm text-rose-300">• V hovore</span>
                  ) : null}
                  <span className={["rounded-full px-3 py-1 text-sm", presence.badge].join(" ")}>
                    {presence.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-5 flex min-h-0 flex-1 flex-col rounded-[24px] border border-white/8 bg-[#16233d] p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-2xl font-semibold text-white">Konverzácia</h3>
          <span className="text-sm text-slate-500">{currentRoomMessages.length} správ</span>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto pr-1">
          {currentRoomMessages.map((message) => (
            <MessageBubble
              key={message.id}
              authorName={message.authorName}
              createdAt={message.createdAt}
              content={message.content}
              attachment={message.attachment}
              isOwn={message.authorId === currentUserId}
              tone="room"
            />
          ))}
        </div>

        {pendingRoomAttachment ? (
          <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm text-white">
                  Pripravená príloha: {pendingRoomAttachment.name}
                </p>
                <p className="text-xs text-slate-400">
                  {pendingRoomAttachment.sizeLabel}
                </p>
              </div>
              <button
                type="button"
                onClick={onClearPendingAttachment}
                className="rounded-xl border border-white/10 px-3 py-1 text-xs text-slate-300"
              >
                Zrušiť
              </button>
            </div>
          </div>
        ) : null}

        <div className="mt-4 flex items-center gap-3">
          <button
            type="button"
            onClick={() => roomFileInputRef.current?.click()}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-slate-300 transition hover:bg-white/[0.06]"
          >
            <Paperclip size={18} />
          </button>

          <button
            type="button"
            onClick={() => roomFileInputRef.current?.click()}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-slate-300 transition hover:bg-white/[0.06]"
          >
            <ImageIcon size={18} />
          </button>

          <input
            value={draftMessage}
            onChange={(e) => onDraftMessageChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSendMessage();
              }
            }}
            placeholder="Napísať správu..."
            className="h-14 flex-1 rounded-2xl border border-white/10 bg-[#111c31] px-4 text-lg text-white outline-none placeholder:text-slate-500"
          />

          <button
            type="button"
            onClick={onSendMessage}
            className="rounded-2xl bg-violet-600 p-4 text-white transition hover:bg-violet-500"
          >
            <Send size={18} />
          </button>

          <input
            ref={roomFileInputRef}
            type="file"
            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.txt"
            className="hidden"
            onChange={onRoomAttachmentPick}
          />
        </div>
      </div>
    </div>
  );
}