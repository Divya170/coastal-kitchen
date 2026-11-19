import { emphasis } from '@/lib/api';

/** Renders "*words*" in a heading as the design's italic accent (ocean blue on light, soft coral on dark). */
export function Em({ text, onDark }: { text: string; onDark?: boolean }) {
  const { before, em, after } = emphasis(text);
  if (!em) return <>{text}</>;
  return <>{before}<em style={onDark ? { color: '#F4C5BA' } : undefined}>{em}</em>{after}</>;
}

export const plain = (t: string) => t.replace(/\*/g, '');
