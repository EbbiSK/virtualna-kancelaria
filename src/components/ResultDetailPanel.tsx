import type { GlobalSearchResult } from "./GlobalSearchResults";
import { AppButton } from "./AppButton";
import { AppIcon } from "./AppIcon";
import { AppCard } from "./AppCard";
import { EmptyState } from "./EmptyState";

type Props = {
  result: GlobalSearchResult | null;
  onClose: () => void;
  onOpen: (result: GlobalSearchResult) => void;
  onCopyTitle: (result: GlobalSearchResult) => void;
};

function getTypeLabel(type: GlobalSearchResult["type"]) {
  switch (type) {
    case "document":
      return "Dokument";
    case "person":
      return "Osoba";
    case "room":
      return "Miestnosť";
    case "tool":
      return "Nástroj";
    case "action":
      return "Akcia";
    default:
      return type;
  }
}

export function ResultDetailPanel({
  result,
  onClose,
  onOpen,
  onCopyTitle,
}: Props) {
  if (!result) {
    return (
      <AppCard>
        <EmptyState
          icon="search"
          title="Vyber výsledok"
          description="Klikni na dokument, človeka, miestnosť alebo nástroj a zobrazí sa detailný náhľad v tomto paneli."
        />
      </AppCard>
    );
  }

  return (
    <AppCard>
      <div className="rounded-[20px] border border-white/10 bg-[#0B1621] p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/60">
              <AppIcon name={result.type} />
              <span>{getTypeLabel(result.type)}</span>
            </div>

            <h3 className="text-xl font-semibold leading-tight text-white">
              {result.title}
            </h3>

            <p className="mt-2 text-sm leading-6 text-white/45">{result.path}</p>
          </div>

          <AppButton variant="subtle" size="sm" onClick={onClose}>
            Zavrieť
          </AppButton>
        </div>

        <div className="mt-6 space-y-5">
          <section>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35">
              Náhľad
            </p>
            <p className="mt-2 text-sm leading-7 text-white/75">
              {result.snippet}
            </p>
          </section>

          <section>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35">
              Cesta
            </p>
            <div className="mt-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/65">
              {result.path}
            </div>
          </section>

          {result.metadata && result.metadata.length > 0 ? (
            <section>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35">
                Metadata
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {result.metadata.map((item) => (
                  <span
                    key={`${result.id}-${item}`}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white/60"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </section>
          ) : null}

          <section>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35">
              Akcie
            </p>

            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <AppButton
                variant="primary"
                size="lg"
                fullWidth
                className="justify-start"
                onClick={() => onOpen(result)}
              >
                <div className="text-left">
                  <p className="text-sm font-semibold">Otvoriť</p>
                  <p className="mt-1 text-xs text-emerald-100/60">
                    Prejsť na detail výsledku
                  </p>
                </div>
              </AppButton>

              <AppButton
                variant="secondary"
                size="lg"
                fullWidth
                className="justify-start"
                onClick={() => onCopyTitle(result)}
              >
                <div className="text-left">
                  <p className="text-sm font-semibold text-white/90">
                    Kopírovať názov
                  </p>
                  <p className="mt-1 text-xs text-white/45">
                    Skopíruje title do schránky
                  </p>
                </div>
              </AppButton>
            </div>
          </section>
        </div>
      </div>
    </AppCard>
  );
}