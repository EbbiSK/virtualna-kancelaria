import { Fragment, type ReactNode } from "react";

const DEFAULT_HIGHLIGHT_CLASSNAME =
  "rounded bg-emerald-500/15 px-0.5 text-emerald-200 ring-1 ring-inset ring-emerald-400/20";

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function tokenizeSearchQuery(query: string): string[] {
  return Array.from(
    new Set(
      query
        .trim()
        .split(/\s+/)
        .map((token) => token.trim())
        .filter(Boolean)
        .sort((a, b) => b.length - a.length)
    )
  );
}

type Range = {
  start: number;
  end: number;
};

function mergeRanges(ranges: Range[]): Range[] {
  if (ranges.length === 0) return [];

  const sorted = [...ranges].sort((a, b) => a.start - b.start || a.end - b.end);
  const merged: Range[] = [sorted[0]];

  for (let i = 1; i < sorted.length; i += 1) {
    const current = sorted[i];
    const last = merged[merged.length - 1];

    if (current.start <= last.end) {
      last.end = Math.max(last.end, current.end);
    } else {
      merged.push({ ...current });
    }
  }

  return merged;
}

export function getHighlightRanges(text: string, query: string): Range[] {
  if (!text || !query.trim()) return [];

  const tokens = tokenizeSearchQuery(query);
  if (tokens.length === 0) return [];

  const ranges: Range[] = [];

  for (const token of tokens) {
    const regex = new RegExp(escapeRegExp(token), "gi");
    let match: RegExpExecArray | null = null;

    while ((match = regex.exec(text)) !== null) {
      ranges.push({
        start: match.index,
        end: match.index + match[0].length,
      });

      if (match.index === regex.lastIndex) {
        regex.lastIndex += 1;
      }
    }
  }

  return mergeRanges(ranges);
}

function getFuzzyRangesForToken(text: string, token: string): Range[] {
  if (!text || !token) return [];

  const lowerText = text.toLowerCase();
  const lowerToken = token.toLowerCase();

  let searchFrom = 0;
  const ranges: Range[] = [];

  for (let i = 0; i < lowerToken.length; i += 1) {
    const character = lowerToken[i];
    const foundIndex = lowerText.indexOf(character, searchFrom);

    if (foundIndex === -1) {
      return [];
    }

    ranges.push({
      start: foundIndex,
      end: foundIndex + 1,
    });

    searchFrom = foundIndex + 1;
  }

  return mergeRanges(ranges);
}

export function getFuzzyHighlightRanges(text: string, query: string): Range[] {
  if (!text || !query.trim()) return [];

  const tokens = tokenizeSearchQuery(query);
  if (tokens.length === 0) return [];

  const exact = getHighlightRanges(text, query);
  if (exact.length > 0) return exact;

  const fuzzyRanges: Range[] = [];

  for (const token of tokens) {
    const tokenRanges = getFuzzyRangesForToken(text, token);
    if (tokenRanges.length === 0) continue;
    fuzzyRanges.push(...tokenRanges);
  }

  return mergeRanges(fuzzyRanges);
}

export function highlightText(
  text: string,
  query: string,
  className: string = DEFAULT_HIGHLIGHT_CLASSNAME
): ReactNode {
  if (!text) return text;

  const ranges = getFuzzyHighlightRanges(text, query);
  if (ranges.length === 0) return text;

  const nodes: ReactNode[] = [];
  let cursor = 0;

  ranges.forEach((range, i) => {
    if (cursor < range.start) {
      nodes.push(
        <Fragment key={`text-${i}-${cursor}`}>
          {text.slice(cursor, range.start)}
        </Fragment>
      );
    }

    nodes.push(
      <mark key={`mark-${i}-${range.start}`} className={className}>
        {text.slice(range.start, range.end)}
      </mark>
    );

    cursor = range.end;
  });

  if (cursor < text.length) {
    nodes.push(<Fragment key={`tail-${cursor}`}>{text.slice(cursor)}</Fragment>);
  }

  return <>{nodes}</>;
}