/** Stroke icons, the wave mark and the wordmark from the design. Decorative: aria-hidden. */
const P: Record<string, React.ReactNode> = {
  fish: <><path d="M2 12c3-3.6 6.5-5.5 10.5-5.5S19.5 9 22 12c-2.5 3-5.5 5.5-9.5 5.5S5 15.6 2 12z"/><path d="M6 9.2 3.2 6.5v11L6 14.8"/><circle cx="17" cy="11" r=".9"/></>,
  wave: <><path d="M2 9c2.5-2.5 5-2.5 7.5 0s5 2.5 7.5 0 3.5-2 5-1"/><path d="M2 15c2.5-2.5 5-2.5 7.5 0s5 2.5 7.5 0 3.5-2 5-1"/></>,
  cloche: <><path d="M4 16a8 8 0 0 1 16 0z"/><path d="M2 19h20"/><path d="M12 8V6"/><path d="M10 5.5h4"/></>,
  cutlery: <><path d="M7 3v7a2 2 0 0 0 2 2v9"/><path d="M5 3v5"/><path d="M11 3v5"/><path d="M5 8h6"/><path d="M17 3c-2.2 2-2.5 6-.5 9H17v9"/></>,
  glass: <><path d="M8 3h8l-.8 6.5a3.2 3.2 0 0 1-6.4 0L8 3z"/><path d="M12 13v8"/><path d="M8.5 21h7"/></>,
  shell: <><path d="M12 20c-5 0-8.5-3.8-8.5-8.2a8.5 8.5 0 0 1 17 0C20.5 16.2 17 20 12 20z"/><path d="M12 20V7"/><path d="M8 19.2l1.8-11"/><path d="M16 19.2l-1.8-11"/><path d="M4.6 16l4.9-8.6"/><path d="M19.4 16l-4.9-8.6"/></>,
  lamp: <><path d="M9 18h6"/><path d="M10 21h4"/><path d="M12 3a6 6 0 0 0-4 10.5c.6.6 1 1.4 1 2.5h6c0-1.1.4-1.9 1-2.5A6 6 0 0 0 12 3z"/></>,
  chair: <><path d="M6 21v-8h12v8"/><path d="M6 17h12"/><path d="M8 13V4h8v9"/></>,
  candle: <><path d="M12 3c1.6 2 1.6 3.6 0 5-1.6-1.4-1.6-3 0-5z"/><rect x="9.5" y="10" width="5" height="11" rx="1"/></>,
  spark: <><path d="M12 3v4"/><path d="M12 17v4"/><path d="M3 12h4"/><path d="M17 12h4"/><path d="m6 6 2.5 2.5"/><path d="m15.5 15.5 2.5 2.5"/><path d="m6 18 2.5-2.5"/><path d="m15.5 8.5 2.5-2.5"/></>,
  users: <><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.6-3.6 3.2-5.6 6.5-5.6s5.9 2 6.5 5.6"/><circle cx="17" cy="9" r="2.6"/><path d="M16.5 14.4c2.6.1 4.4 1.8 5 4.6"/></>,
  heart: <><path d="M12 20s-7.5-4.4-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10C19.5 15.6 12 20 12 20z"/></>,
  table: <><path d="M3 9h18"/><path d="M6 9v11"/><path d="M18 9v11"/><path d="M8 5h8"/></>,
  pin: <><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></>,
  phone: <><path d="M5 3h3.5l1.8 4.6-2.3 1.4a11 11 0 0 0 5 5l1.4-2.3L19 13.5V17a2 2 0 0 1-2.2 2A15.5 15.5 0 0 1 3 5.2 2 2 0 0 1 5 3z"/></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 6.5 8.5 6.5 8.5-6.5"/></>,
  clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></>,
  calendar: <><rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 10h17"/><path d="M8 3v4"/><path d="M16 3v4"/></>,
  copy: <><rect x="8.5" y="8.5" width="12" height="12" rx="2"/><path d="M15.5 8.5V5.5a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h3"/></>,
  check: <><path d="m4.5 12.5 5 5 10-11"/></>,
  close: <><path d="M6 6l12 12"/><path d="M18 6 6 18"/></>,
  prev: <><path d="m15 5-7 7 7 7"/></>,
  next: <><path d="m9 5 7 7-7 7"/></>,
  menu: <><path d="M3 7h18"/><path d="M3 12h18"/><path d="M3 17h12"/></>,
  pause: <><path d="M9 5v14"/><path d="M15 5v14"/></>,
  play: <><path d="M7 4.5v15l12-7.5z"/></>,
  minus: <><path d="M5 12h14"/></>,
  plus: <><path d="M12 5v14"/><path d="M5 12h14"/></>,
  send: <><path d="M21 3 10 14"/><path d="M21 3l-7 18-4-7-7-4z"/></>,
};
export const ICON_NAMES = Object.keys(P);

export function Icon({ name, size = 22, sw = 1.5 }: { name: string; size?: number; sw?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {P[name] ?? P.wave}
    </svg>
  );
}

/** Circle with two tide lines; the upper line in coral. */
export function Mark({ size = 42, ring = 'currentColor', wave = '#E98270' }: { size?: number; ring?: string; wave?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 42 42" fill="none" aria-hidden="true">
      <circle cx="21" cy="21" r="19.5" stroke={ring} strokeWidth="1.3" />
      <path d="M9 19c2-2 4-2 6 0s4 2 6 0 4-2 6 0 4 2 6 0" stroke={wave} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M9 25c2-2 4-2 6 0s4 2 6 0 4-2 6 0 4 2 6 0" stroke={ring} strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

export function LogoBody({ name, tagline }: { name: string; tagline: string }) {
  return (
    <>
      <Mark />
      <span><span className="logo-name">{name}</span><span className="logo-sub">{tagline}</span></span>
    </>
  );
}
