import { Paperclip } from "lucide-react";
import { formatMessageTime } from "../../lib/virtualOffice";
import type { MessageAttachment } from "../../types/virtualOffice";

function AttachmentPreview({
  attachment,
}: {
  attachment: MessageAttachment;
}) {
  if (attachment.kind === "image") {
    return (
      <div className="mt-3 overflow-hidden rounded-2xl border border-white/10 bg-black/20">
        <img
          src={attachment.url}
          alt={attachment.name}
          className="max-h-[220px] w-full object-cover"
        />
        <div className="flex items-center justify-between gap-2 border-t border-white/10 px-3 py-2 text-[11px] text-slate-400">
          <span className="truncate">{attachment.name}</span>
          <span>{attachment.sizeLabel}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-3 rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-3">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-white/10 p-2 text-slate-300">
          <Paperclip size={16} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-white">{attachment.name}</p>
          <p className="text-xs text-slate-400">
            {attachment.mimeType} · {attachment.sizeLabel}
          </p>
        </div>
      </div>
    </div>
  );
}

type MessageBubbleProps = {
  authorName: string;
  createdAt: string;
  content: string;
  attachment?: MessageAttachment;
  isOwn: boolean;
  tone?: "room" | "dm";
};

export function MessageBubble({
  authorName,
  createdAt,
  content,
  attachment,
  isOwn,
  tone = "room",
}: MessageBubbleProps) {
  const ownTone =
    tone === "dm"
      ? "border-blue-400/20 bg-blue-500/10"
      : "border-emerald-400/20 bg-emerald-500/10";

  return (
    <div className={["flex", isOwn ? "justify-end" : "justify-start"].join(" ")}>
      <div
        className={[
          "max-w-[88%] rounded-2xl border px-4 py-3",
          isOwn ? ownTone : "border-white/10 bg-white/[0.03]",
        ].join(" ")}
      >
        <div className="mb-1 flex items-center gap-2">
          <span className="text-sm font-semibold text-white">{authorName}</span>
          <span className="text-xs text-slate-500">{formatMessageTime(createdAt)}</span>
        </div>

        {content ? <p className="text-sm leading-6 text-slate-200">{content}</p> : null}
        {attachment ? <AttachmentPreview attachment={attachment} /> : null}
      </div>
    </div>
  );
}