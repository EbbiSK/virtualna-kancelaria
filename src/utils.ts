export function nowIso() {
  return new Date().toISOString();
}

export function generateId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function timeAgo(iso: string) {
  const diff = Math.max(0, Date.now() - new Date(iso).getTime());
  const sec = Math.floor(diff / 1000);

  if (sec < 10) return 'práve teraz';
  if (sec < 60) return `pred ${sec} s`;

  const min = Math.floor(sec / 60);
  if (min < 60) return `pred ${min} min`;

  const h = Math.floor(min / 60);
  if (h < 24) return `pred ${h} h`;

  const d = Math.floor(h / 24);
  return `pred ${d} d`;
}

export function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('sk-SK', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatBytes(bytes?: number) {
  if (!bytes && bytes !== 0) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}