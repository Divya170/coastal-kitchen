'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { Drawer, ErrorPanel, TableSkeleton, useDebounced, useToast } from '@/components/admin/ui';
import { adminDownload, adminFetch } from '@/lib/admin-api';
import { formatDate, formatReceived, formatTime, telHref } from '@/lib/admin-format';
import type { Reservation, ReservationStatus, SiteSettings } from '@/lib/types';

interface Page { items: Reservation[]; total: number; page: number; pageSize: number; pages: number; today: string }
type When = 'all' | 'upcoming' | 'today' | 'past';

const STATUSES: { value: ReservationStatus; label: string; action: string }[] = [
  { value: 'new', label: 'New', action: 'Mark as new' },
  { value: 'confirmed', label: 'Confirmed', action: 'Confirm' },
  { value: 'declined', label: 'Declined', action: 'Decline' },
  { value: 'archived', label: 'Archived', action: 'Archive' },
];


function ReservationsInner() {
  const params = useSearchParams();
  const [data, setData] = useState<Page | null>(null);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'all' | ReservationStatus>((params.get('status') as ReservationStatus) || 'all');
  const [when, setWhen] = useState<When>((params.get('when') as When) || 'upcoming');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [sort, setSort] = useState<'date' | 'newest' | 'oldest'>('date');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Reservation | null>(null);
  const [notes, setNotes] = useState('');
  const [busy, setBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [site, setSite] = useState<Pick<SiteSettings, 'businessName' | 'phone' | 'fullAddress'> | null>(null);
  const toast = useToast();
  const q = useDebounced(search);
  const rangeError = from && to && from > to ? 'The “from” date is after the “to” date.' : '';

  const qs = useMemo(() => {
    const p = new URLSearchParams({ status, when, sort, page: String(page), pageSize: '20' });
    if (q.trim()) p.set('search', q.trim());
    if (from && !rangeError) p.set('from', from);
    if (to && !rangeError) p.set('to', to);
    return p.toString();
  }, [q, status, when, from, to, sort, page, rangeError]);

  const load = useCallback(async () => {
    setError('');
    try { setData(await adminFetch<Page>(`/admin/reservations?${qs}`)); }
    catch (e) { setError(e instanceof Error ? e.message : 'Could not load reservation inquiries.'); }
  }, [qs]);

  useEffect(() => { setData(null); load(); }, [load]);
  useEffect(() => { setPage(1); }, [q, status, when, from, to, sort]);
  useEffect(() => {
    adminFetch<SiteSettings>('/admin/settings').then(setSite).catch(() => undefined);
    const id = Number(params.get('open'));
    if (id) adminFetch<Reservation>(`/admin/reservations/${id}`).then(openRow).catch(() => undefined);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function openRow(r: Reservation) { setSelected(r); setNotes(r.adminNotes ?? ''); setConfirmDelete(false); }
  const close = useCallback(() => setSelected(null), []);

  async function update(patch: Partial<Pick<Reservation, 'status' | 'adminNotes'>>, msg: string) {
    if (!selected) return;
    setBusy(true);
    try {
      const saved = await adminFetch<Reservation>(`/admin/reservations/${selected.id}`, { method: 'PATCH', body: JSON.stringify(patch) });
      setSelected(saved);
      if (patch.adminNotes !== undefined) setNotes(saved.adminNotes ?? '');
      toast.show(msg);
      load();
    } catch (e) { toast.show(e instanceof Error ? e.message : 'Update failed.', true); }
    finally { setBusy(false); }
  }

  async function remove() {
    if (!selected) return;
    setBusy(true);
    try {
      await adminFetch(`/admin/reservations/${selected.id}`, { method: 'DELETE' });
      toast.show('Reservation inquiry deleted.');
      setSelected(null);
      load();
    } catch (e) { toast.show(e instanceof Error ? e.message : 'Delete failed.', true); }
    finally { setBusy(false); }
  }

  async function exportCsv() {
    try { await adminDownload(`/admin/reservations/export.csv?${qs}`, 'coastal-kitchen-reservations.csv'); }
    catch (e) { toast.show(e instanceof Error ? e.message : 'Export failed.', true); }
  }

  const clearFilters = () => { setSearch(''); setStatus('all'); setWhen('all'); setFrom(''); setTo(''); };
  const filtered = !!(q || status !== 'all' || when !== 'all' || from || to);
  const biz = site?.businessName || 'Coastal Kitchen';

  const emails = useMemo(() => {
    if (!selected) return null;
    const first = selected.name.split(' ')[0];
    const when = `${formatDate(selected.date, { weekday: 'long', month: 'long', day: 'numeric' })} at ${formatTime(selected.time)}`;
    const party = `${selected.guests} ${selected.guests === 1 ? 'guest' : 'guests'}`;
    const sign = `\n\nWarm regards,\n${biz}${site?.phone ? `\n${site.phone}` : ''}${site?.fullAddress ? `\n${site.fullAddress}` : ''}`;
    const confirm = `Hi ${first},\n\nThank you for your reservation inquiry (${selected.reference}). We’re happy to confirm your table for ${party} on ${when}.\n\nIf anything changes, just reply to this email or give us a call.${sign}`;
    const decline = `Hi ${first},\n\nThank you for your reservation inquiry (${selected.reference}) for ${party} on ${when}. Unfortunately we can’t accommodate that time.\n\n[Suggest an alternative date or time here.]${sign}`;
    const mk = (subject: string, body: string) => `mailto:${selected.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    return {
      confirm: mk(`Your table at ${biz} is confirmed · ${formatDate(selected.date, { month: 'short', day: 'numeric' })}`, confirm),
      decline: mk(`Your reservation inquiry at ${biz}`, decline),
    };
  }, [selected, biz, site]);

  return (
    <>
      <div className="adm-head">
        <div>
          <h1 className="adm-h1">Reservations</h1>
          <p className="adm-sub">Reservation <strong>inquiries</strong> from the website. Guests are told their table is not booked yet. Check availability, contact the guest by phone or email (pre-filled below), then mark the request Confirmed or Declined. No email is sent automatically.</p>
        </div>
        <button type="button" className="adm-btn ghost" onClick={exportCsv}>Export CSV</button>
      </div>

      <div className="adm-toolbar">
        <input className="input" type="search" placeholder="Search name, email, phone, reference or requests…" aria-label="Search reservations" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select className="input" aria-label="When" value={when} onChange={(e) => setWhen(e.target.value as When)}>
          <option value="upcoming">Upcoming</option><option value="today">Today</option><option value="past">Past</option><option value="all">Any date</option>
        </select>
        <select className="input" aria-label="Status" value={status} onChange={(e) => setStatus(e.target.value as typeof status)}>
          <option value="all">All statuses</option>
          {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <select className="input" aria-label="Sort" value={sort} onChange={(e) => setSort(e.target.value as typeof sort)}>
          <option value="date">By preferred date</option><option value="newest">Newest received</option><option value="oldest">Oldest received</option>
        </select>
      </div>
      <div className="adm-toolbar">
        <label className="hint" htmlFor="r-from">From</label>
        <input id="r-from" className="input" type="date" value={from} onChange={(e) => setFrom(e.target.value)} aria-invalid={!!rangeError} />
        <label className="hint" htmlFor="r-to">To</label>
        <input id="r-to" className="input" type="date" value={to} onChange={(e) => setTo(e.target.value)} aria-invalid={!!rangeError} />
        {filtered && <button type="button" className="adm-btn ghost sm" onClick={clearFilters}>Clear filters</button>}
        {rangeError && <p className="err" role="alert" style={{ flexBasis: '100%' }}>{rangeError}</p>}
      </div>

      {error ? <ErrorPanel message={error} onRetry={load} /> : !data ? <TableSkeleton cols={6} /> : data.items.length === 0 ? (
        <div className="adm-empty">
          {filtered ? 'No reservation inquiries match these filters.' : 'No reservation inquiries yet. They appear here as soon as a guest sends the form on the Reservations page.'}
          {filtered && <div style={{ marginTop: 14 }}><button type="button" className="adm-btn ghost sm" onClick={clearFilters}>Clear filters</button></div>}
        </div>
      ) : (
        <>
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead><tr><th scope="col">Preferred date</th><th scope="col">Guests</th><th scope="col">Guest</th><th scope="col">Phone</th><th scope="col">Received</th><th scope="col">Status</th></tr></thead>
              <tbody>
                {data.items.map((r) => (
                  <tr key={r.id} className={`clickable ${selected?.id === r.id ? 'selected' : ''}`} onClick={() => openRow(r)} tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') openRow(r); }} aria-label={`${r.name}, ${r.guests} guests, ${formatDate(r.date)} ${formatTime(r.time)}, ${r.status}`}>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      <span className="res-when">{formatDate(r.date, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                      {r.date === data.today && <span className="res-today">Today</span>}
                      <br /><span className="hint">{formatTime(r.time)}</span>
                    </td>
                    <td><strong>{r.guests}</strong></td>
                    <td><strong>{r.name}</strong><br /><span className="hint" style={{ wordBreak: 'break-all' }}>{r.email}</span>{r.requests && <><br /><span className="hint">Has special requests</span></>}</td>
                    <td style={{ whiteSpace: 'nowrap' }} onClick={(e) => e.stopPropagation()}><a href={telHref(r.phone)}>{r.phone}</a></td>
                    <td style={{ whiteSpace: 'nowrap' }}>{formatReceived(r.createdAt)}<br /><span className="hint">{r.reference}</span></td>
                    <td><span className={`pill pill-${r.status}`}>{r.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="pager">
            <span>{data.total} total · page {data.page} of {data.pages}</span>
            <button type="button" className="adm-btn ghost sm" disabled={data.page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</button>
            <button type="button" className="adm-btn ghost sm" disabled={data.page >= data.pages} onClick={() => setPage((p) => p + 1)}>Next</button>
          </div>
        </>
      )}

      {selected && emails && (
        <Drawer
          title={`${selected.name} · ${selected.guests} ${selected.guests === 1 ? 'guest' : 'guests'}`}
          onClose={close}
          footer={
            <>
              {confirmDelete ? (
                <span style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 13 }}>Delete permanently?</span>
                  <button type="button" className="adm-btn danger sm" disabled={busy} onClick={remove}>Yes, delete</button>
                  <button type="button" className="adm-btn ghost sm" onClick={() => setConfirmDelete(false)}>Cancel</button>
                </span>
              ) : <button type="button" className="adm-btn danger ghost sm" onClick={() => setConfirmDelete(true)}>Delete</button>}
              <a className="adm-btn" href={telHref(selected.phone)}>Call {selected.phone}</a>
            </>
          }
        >
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <span className={`pill pill-${selected.status}`}>{selected.status}</span>
            <span className="hint">{selected.reference} · received {new Date(selected.createdAt).toLocaleString()}</span>
          </div>
          <div className="adm-card">
            <p className="res-when" style={{ fontSize: 26 }}>{formatDate(selected.date, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
            <p style={{ marginTop: 6 }}>{formatTime(selected.time)} · {selected.guests} {selected.guests === 1 ? 'guest' : 'guests'}</p>
          </div>
          <dl className="adm-dl">
            <dt className="hint">Email</dt><dd><a href={`mailto:${selected.email}`}>{selected.email}</a></dd>
            <dt className="hint">Phone</dt><dd><a href={telHref(selected.phone)}>{selected.phone}</a></dd>
            <dt className="hint">Special requests</dt><dd style={{ whiteSpace: 'pre-line' }}>{selected.requests || <span className="hint">None</span>}</dd>
          </dl>
          <div>
            <p style={{ fontWeight: 600, fontSize: 13, marginBottom: 8 }}>Status</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }} role="group" aria-label="Set status">
              {STATUSES.filter((s) => s.value !== 'new' || selected.status !== 'new').map((s) => (
                <button key={s.value} type="button" className={`adm-btn sm ${selected.status === s.value ? '' : 'ghost'} ${s.value === 'declined' ? 'danger' : ''}`} aria-pressed={selected.status === s.value} disabled={busy || selected.status === s.value} onClick={() => update({ status: s.value }, `Marked as ${s.label.toLowerCase()}.`)}>
                  {selected.status === s.value ? s.label : s.action}
                </button>
              ))}
            </div>
            <p className="hint" style={{ marginTop: 8 }}>Confirm only after you’ve spoken to or emailed the guest. Changing the status here doesn’t notify them.</p>
          </div>
          <div className="adm-card" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <p style={{ fontWeight: 600, fontSize: 13 }}>Contact the guest</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <a className="adm-btn sm" href={emails.confirm}>Email: confirm your table</a>
              <a className="adm-btn ghost sm" href={emails.decline}>Email: can’t accommodate</a>
              <a className="adm-btn ghost sm" href={telHref(selected.phone)}>Call</a>
            </div>
            <p className="hint">Opens your email app with a pre-filled message to edit before sending.</p>
          </div>
          <div className="field">
            <label htmlFor="r-notes">Internal notes</label>
            <textarea id="r-notes" className="input" rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g. Called 3:10 PM, left voicemail · Prefers the window table" />
            <div><button type="button" className="adm-btn ghost sm" disabled={busy || notes === (selected.adminNotes ?? '')} onClick={() => update({ adminNotes: notes }, 'Notes saved.')}>Save notes</button></div>
          </div>
        </Drawer>
      )}
      {toast.node}
    </>
  );
}

export default function ReservationsPage() {
  return <Suspense fallback={<TableSkeleton cols={6} />}><ReservationsInner /></Suspense>;
}
