import type { SiteSettings } from '@/lib/types';

/**
 * Live Google Maps embed (Settings → map embed URL; seeded with an address search, so no coordinates are invented).
 * If the embed is cleared, the design's illustrated preview links to Google Maps instead.
 */
export function MapPanel({ settings, style }: { settings: SiteSettings; style?: React.CSSProperties }) {
  if (settings.mapEmbedUrl) {
    return (
      <div className="map" style={style}>
        <iframe className="map-frame" src={settings.mapEmbedUrl} title={`Map showing ${settings.businessName}, ${settings.fullAddress}`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
      </div>
    );
  }
  const street = settings.addressLine1.replace(/^\d+\s*/, '').toUpperCase();
  return (
    <a className="map zoom-host" href={settings.mapsUrl} target="_blank" rel="noopener noreferrer" aria-label={`Map preview of ${settings.fullAddress}. Opens Google Maps in a new tab`} style={style}>
      <svg className="zoom" viewBox="0 0 800 500" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" aria-hidden="true" style={{ position: 'absolute', inset: 0 }}>
        <rect width="800" height="500" fill="#E9DDC9" />
        <path d="M0 380 C160 340 260 420 420 380 S680 330 800 360 V500 H0Z" fill="#B9D3D6" />
        <g stroke="#FAF9F5" strokeWidth="18" fill="none"><path d="M-20 210 L820 180" /><path d="M300 -20 L340 400" /></g>
        <g stroke="#FAF9F5" strokeWidth="7" fill="none"><path d="M-20 90 L820 64" /><path d="M110 -20 L140 380" /><path d="M560 -20 L540 380" /><path d="M700 -20 L690 360" /></g>
        <text x="420" y="176" fontFamily="Manrope, sans-serif" fontSize="13" fontWeight="700" letterSpacing="3" fill="#5C6766" transform="rotate(-2 420 176)">{street}</text>
        <g transform="translate(330 196)"><circle r="42" fill="#E98270" opacity=".18" /><path d="M0 22s-18-16-18-30a18 18 0 0 1 36 0C18 6 0 22 0 22z" fill="#174A5B" transform="translate(0 -22)" /><circle cy="-30" r="6.5" fill="#FAF9F5" /></g>
      </svg>
      <span className="map-tag">Map preview · Open in Google Maps ↗</span>
    </a>
  );
}
