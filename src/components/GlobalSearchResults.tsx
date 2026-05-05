import { useEffect, useRef } from "react";
import { highlightText } from "../utils/highlightMatches";
import { AppIcon } from "./AppIcon";
import { EmptyState } from "./EmptyState";

export type GlobalSearchResult = {
  id: string;
  title: string;
  path: string;
  snippet: string;
  type: "document" | "person" | "room" | "tool" | "action";
  metadata?: string[];
};

type ResultGroup = {
  label: string;
  items: GlobalSearchResult[];
};

type Props = {
  query: string;
  groups: ResultGroup[];
  activeIndex: number;
  selectedResultId?: string | null;
  onHover: (index: number) => void;
  onSelect: (result: GlobalSearchResult) => void;
};

function TypeBadge({ type }: { type: GlobalSearchResult["type"] }) {
  const labels: Record<GlobalSearchResult["type"], string> = {
    document: "Dokument",
    person: "Osoba",
    room: "Miestnosť",
    tool: "Nástroj",
    action: "Akcia",
  };

  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-white/55">
      <AppIcon name={type} />
      {labels[type]}
    </span>
  );
}

export function GlobalSearchResults({
  query,
  groups,
  activeIndex,
  selectedResultId,
  onHover,
  onSelect,
}: Props) {
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const flatResults = groups.flatMap((group) => group.items);

  useEffect(() => {
    const activeElement = itemRefs.current[activeIndex];
    activeElement?.scrollIntoView({
      block: "nearest",
      behavior: "smooth",
    });
  }, [activeIndex]);

  if (flatResults.length === 0) {
    return (
      <EmptyState
        compact
        icon="search"
        title="Žiadne výsledky"
        description="Skús iný výraz, kratší dopyt alebo slash command."
      />
    );
  }

  let runningIndex = -1;

  return (
    <div className="space-y-4">
      {groups.map((group) => {
        if (group.items.length === 0) return null;

        return (
          <section key={group.label}>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35">
                {group.label}
              </h3>
              <span className="text-[11px] text-white/25">
                {group.items.length}
              </span>
            </div>

            <div className="space-y-2">
              {group.items.map((result) => {
                runningIndex += 1;
                const index = runningIndex;
                const isActive = index === activeIndex;
                const isSelected = selectedResultId === result.id;

                return (
                  <button
                    key={result.id}
                    ref={(element) => {
                      itemRefs.current[index] = element;
                    }}
                    type="button"
                    onMouseEnter={() => onHover(index)}
                    onClick={() => onSelect(result)}
                    className={[
                      "group w-full rounded-2xl border px-4 py-3 text-left transition-all duration-200",
                      "focus:outline-none focus:ring-2 focus:ring-emerald-400/30",
                      isSelected
                        ? "border-sky-400/30 bg-sky-500/10 shadow-[0_10px_30px_rgba(14,165,233,0.10)]"
                        : isActive
                        ? "border-emerald-400/30 bg-emerald-500/10 shadow-[0_10px_30px_rgba(16,185,129,0.10)]"
                        : "border-white/8 bg-white/[0.03] hover:-translate-y-[1px] hover:border-white/15 hover:bg-white/[0.05]",
                    ].join(" ")}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-semibold text-white">
                            {highlightText(result.title, query)}
                          </p>
                          <TypeBadge type={result.type} />
                        </div>

                        <p className="mt-1 truncate text-xs text-white/45">
                          {highlightText(result.path, query)}
                        </p>

                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/70">
                          {highlightText(result.snippet, query)}
                        </p>

                        {result.metadata && result.metadata.length > 0 ? (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {result.metadata.map((item) => (
                              <span
                                key={`${result.id}-${item}`}
                                className="rounded-full border border-white/8 bg-white/[0.04] px-2.5 py-1 text-[11px] text-white/55"
                              >
                                {highlightText(item, query)}
                              </span>
                            ))}
                          </div>
                        ) : null}
                      </div>

                      <span
                        className={[
                          "shrink-0 rounded-xl border px-3 py-2 text-xs font-medium transition",
                          isSelected
                            ? "border-sky-400/20 bg-sky-500/12 text-sky-200"
                            : isActive
                            ? "border-emerald-400/20 bg-emerald-500/12 text-emerald-200"
                            : "border-white/10 bg-white/[0.04] text-white/50",
                        ].join(" ")}
                      >
                        Enter
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}