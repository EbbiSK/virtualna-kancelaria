import { Mic, Paperclip, Send, Users } from "lucide-react";
import { MessageBubble } from "./virtual-office/MessageBubble";
import { UserAvatar } from "./virtual-office/UserAvatar";
import type {
  DirectMessage,
  MessageAttachment,
  Person,
} from "../types/virtualOffice";

type DmPanelProps = {
  activeDmPerson: Person;
  dmThreadSummaries: Array<{
    person: Person;
    lastMessage: DirectMessage | null;
    count: number;
  }>;
  filteredDirectMessages: DirectMessage[];
  currentUserId: string;
  pendingDirectAttachment: MessageAttachment | null;
  draftDirectMessage: string;
  dmFileInputRef: React.RefObject<HTMLInputElement | null>;
  onOpenCall: () => void;
  onOpenProfile: () => void;
  onSelectThread: (person: Person) => void;
  onClearPendingAttachment: () => void;
  onDraftChange: (value: string) => void;
  onSendMessage: () => void;
  onDirectAttachmentPick: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

function formatMessageTime(value: string) {
  return new Date(value).toLocaleTimeString("sk-SK", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function DmPanel({
  activeDmPerson,
  dmThreadSummaries,
  filteredDirectMessages,
  currentUserId,
  pendingDirectAttachment,
  draftDirectMessage,
  dmFileInputRef,
  onOpenCall,
  onOpenProfile,
  onSelectThread,
  onClearPendingAttachment,
  onDraftChange,
  onSendMessage,
  onDirectAttachmentPick,
}: DmPanelProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <UserAvatar
            name={activeDmPerson.name}
            presence={activeDmPerson.presence}
          />
          <div>
            <h2 className="text-3xl font-semibold text-white">{activeDmPerson.name}</h2>
            <p className="text-sm text-slate-400">{activeDmPerson.role}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onOpenCall}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-slate-300 transition hover:bg-white/[0.06]"
          >
            <Mic size={18} />
          </button>
          <button
            type="button"
            onClick={onOpenProfile}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-slate-300 transition hover:bg-white/[0.06]"
          >
            <Users size={18} />
          </button>
        </div>
      </div>

      <div className="mb-4 rounded-[24px] border border-white/8 bg-[#16233d] p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white">Inbox</h3>
          <span className="text-sm text-slate-500">{dmThreadSummaries.length} konverzácií</span>
        </div>

        <div className="space-y-2">
          {dmThreadSummaries.map(({ person, lastMessage }) => (
            <button
              key={person.id}
              type="button"
              onClick={() => onSelectThread(person)}
              className={[
                "flex w-full items-center justify-between rounded-2xl p-3 text-left transition",
                activeDmPerson.id === person.id
                  ? "bg-emerald-500/10 ring-1 ring-emerald-400/20"
                  : "hover:bg-white/[0.03]",
              ].join(" ")}
            >
              <div className="flex items-center gap-3">
                <UserAvatar
                  name={person.name}
                  presence={person.presence}
                  compact
                />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white">{person.name}</p>
                  <p className="truncate text-xs text-slate-400">
                    {lastMessage
                      ? lastMessage.attachment && !lastMessage.content
                        ? `Príloha: ${lastMessage.attachment.name}`
                        : lastMessage.content
                      : "Zatiaľ bez správ"}
                  </p>
                </div>
              </div>
              {lastMessage ? (
                <span className="text-xs text-slate-500">
                  {formatMessageTime(lastMessage.createdAt)}
                </span>
              ) : null}
            </button>
          ))}
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col rounded-[24px] border border-white/8 bg-[#16233d] p-5">
        <div className="flex-1 space-y-3 overflow-y-auto pr-1">
          {filteredDirectMessages.map((message) => (
            <MessageBubble
              key={message.id}
              authorName={message.authorName}
              createdAt={message.createdAt}
              content={message.content}
              attachment={message.attachment}
              isOwn={message.authorId === currentUserId}
              tone="dm"
            />
          ))}
        </div>

        {pendingDirectAttachment ? (
          <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm text-white">
                  Pripravená príloha: {pendingDirectAttachment.name}
                </p>
                <p className="text-xs text-slate-400">
                  {pendingDirectAttachment.sizeLabel}
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
            onClick={() => dmFileInputRef.current?.click()}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-slate-300 transition hover:bg-white/[0.06]"
          >
            <Paperclip size={18} />
          </button>

          <input
            value={draftDirectMessage}
            onChange={(e) => onDraftChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSendMessage();
              }
            }}
            placeholder={`Napísať ${activeDmPerson.name}...`}
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
            ref={dmFileInputRef}
            type="file"
            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.txt"
            className="hidden"
            onChange={onDirectAttachmentPick}
          />
        </div>
      </div>
    </div>
  );
}