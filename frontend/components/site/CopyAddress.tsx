'use client';

import { useEffect, useRef, useState } from 'react';
import { Icon } from './Icons';

/** Copies the address to the clipboard and announces it. Hidden if the clipboard isn't available. */
export function CopyAddress({ text }: { text: string }) {
  const [ok, setOk] = useState(false);
  const [supported, setSupported] = useState(false);
  const t = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => { setSupported(!!navigator.clipboard); return () => clearTimeout(t.current); }, []);
  if (!supported) return null;
  const copy = () => navigator.clipboard.writeText(text).then(() => { setOk(true); clearTimeout(t.current); t.current = setTimeout(() => setOk(false), 2500); }, () => {});
  return (
    <>
      <button type="button" className="copy-btn" onClick={copy}>{ok ? <><Icon name="check" size={16} sw={2} />Copied</> : <><Icon name="copy" size={16} sw={1.7} />Copy address</>}</button>
      <span className="sr" role="status">{ok ? 'Address copied to clipboard.' : ''}</span>
    </>
  );
}
