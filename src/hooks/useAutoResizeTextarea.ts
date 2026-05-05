import { useEffect } from 'react';
import type { RefObject } from 'react';

type Options = {
  maxHeight?: number;
  resetKeys?: ReadonlyArray<unknown>;
};

export default function useAutoResizeTextarea(
  textareaRef: RefObject<HTMLTextAreaElement | null>,
  value: string,
  options?: Options
) {
  const maxHeight = options?.maxHeight ?? 180;
  const resetKeys = options?.resetKeys ?? [];

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = '0px';
    textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
  }, [textareaRef, value, maxHeight, ...resetKeys]);
}