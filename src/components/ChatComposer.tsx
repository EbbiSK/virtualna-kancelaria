import { useEffect, useRef } from 'react';
import type { CSSProperties, KeyboardEvent } from 'react';
import useAutoResizeTextarea from '../hooks/useAutoResizeTextarea';

type Props = {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  placeholder: string;
  buttonLabel: string;
  disabled?: boolean;
  maxHeight?: number;
  minHeight?: number;
  resetKeys?: ReadonlyArray<unknown>;
  onBlur?: () => void;
  autoFocus?: boolean;
};

export default function ChatComposer({
  value,
  onChange,
  onSend,
  placeholder,
  buttonLabel,
  disabled = false,
  maxHeight = 180,
  minHeight = 52,
  resetKeys = [],
  onBlur,
  autoFocus = false,
}: Props) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useAutoResizeTextarea(textareaRef, value, {
    maxHeight,
    resetKeys,
  });

  useEffect(() => {
    if (!autoFocus) return;

    const textarea = textareaRef.current;
    if (!textarea || disabled) return;

    window.requestAnimationFrame(() => {
      textarea.focus();
    });
  }, [autoFocus, disabled, ...resetKeys]);

  const isSendDisabled = disabled || !value.trim();

  const handleSend = () => {
    if (isSendDisabled) return;

    onSend();

    window.requestAnimationFrame(() => {
      const textarea = textareaRef.current;
      if (!textarea || disabled) return;

      textarea.style.height = '0px';
      textarea.focus();
    });
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={styles.composer}>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          ...styles.textarea,
          minHeight,
          maxHeight,
          ...(disabled ? styles.textareaDisabled : {}),
        }}
        rows={1}
        disabled={disabled}
        onBlur={onBlur}
        onKeyDown={handleKeyDown}
      />

      <button
        style={{
          ...styles.primaryButton,
          ...(isSendDisabled ? styles.primaryButtonDisabled : {}),
        }}
        onClick={handleSend}
        disabled={isSendDisabled}
      >
        {buttonLabel}
      </button>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  composer: {
    marginTop: 14,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  textarea: {
    width: '100%',
    borderRadius: 14,
    border: '1px solid #d1d5db',
    padding: 14,
    resize: 'none',
    overflowY: 'auto',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    fontSize: 14,
    lineHeight: 1.45,
    background: '#ffffff',
  },
  textareaDisabled: {
    opacity: 0.7,
    cursor: 'not-allowed',
    background: '#f9fafb',
  },
  primaryButton: {
    padding: '11px 14px',
    borderRadius: 12,
    border: '1px solid #2563eb',
    background: '#2563eb',
    color: '#ffffff',
    fontWeight: 700,
    cursor: 'pointer',
  },
  primaryButtonDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
};