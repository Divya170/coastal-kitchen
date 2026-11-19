import type { SiteSettings } from '@/lib/types';
import { Icon } from './Icons';

/**
 * Opening hours on a dark card. Every row stays a dashed "Hours to confirm" placeholder until the restaurant
 * confirms its hours in Settings; confirmed rows get the solid "Confirmed" badge, so the two are never confused.
 */
export function HoursTable({ settings }: { settings: SiteSettings }) {
  const v = settings.hoursVerified;
  return (
    <div className="on-abyss" style={{ borderRadius: 10, padding: 'clamp(24px, 3vw, 36px)' }}>
      <p className="label" style={{ display: 'flex', gap: 10, alignItems: 'center', color: '#F4C5BA' }}><Icon name="clock" size={18} sw={1.6} /> Opening hours</p>
      <h3 className="h3" style={{ marginTop: 14, color: '#FAF9F5' }}>{v ? settings.openStatus?.label ?? 'Opening hours' : 'Hours to be confirmed'}</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 16 }} aria-hidden="true">
        <span className="badge-ph">Placeholder</span><span className="badge-ok"><Icon name="check" size={12} sw={2.4} />Confirmed</span>
      </div>
      <table className="hours" style={{ marginTop: 14 }}>
        <caption className="sr">{v ? 'Opening hours, confirmed by the restaurant.' : 'Opening hours. All rows are placeholders until confirmed by the restaurant.'}</caption>
        <tbody>
          {settings.hoursDisplay.map((d) => (
            <tr key={d.day}>
              <th scope="row">{d.day}{d.isToday && v && <span className="sr"> (today)</span>}</th>
              <td>{d.confirmed ? <span className="badge-ok">{d.label}</span> : <span className="badge-ph">Hours to confirm</span>}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {!v && settings.phoneHref && <p className="hint" style={{ marginTop: 16 }}>Please call <a href={settings.phoneHref}>{settings.phone}</a> before visiting. Confirmed hours will be shown with the solid “Confirmed” label.</p>}
    </div>
  );
}
