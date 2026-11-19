'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { Drawer, ErrorPanel, TableSkeleton, useDebounced, useToast } from '@/components/admin/ui';
import { adminDownload, adminFetch } from '@/lib/admin-api';
import { formatReceived } from '@/lib/admin-format';
import type { Inquiry, InquiryStatus } from '@/lib/types';

interface Page { items: Inquiry[]; total: number; page: number; pageSize: number; pages: number }
const STATUSES: { value: InquiryStatus; label: string }[] = [
  { value: 'new', label: 'New' }, { value: 'responded', label: 'Responded' }, { value: 'archived', label: 'Archived' },
];

function MessagesInner() {
  const params = useSearchParams();
  const [data, setData] = useState<Page | null>(null);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'all' | InquiryStatus>('all');
  const [sort, setSort] = useState<'newest' | 'oldest'>('newest');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Inquiry | null>(null);
  const [notes, setNotes] = useState('');
  const [busy, setBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const toast = useToast();
  const q = useDebounced(search);

  const qs = useMemo(() => {
    const p = new URLSearchParams({ status, sort, page: String(page), pageSize: '20' });
    if (q.trim()) p.set('search', q.trim());
    return p.toString();
  }, [q, status, sort, page]);

  const load = useCallback(async () => {
    setError('');
    try { setData(await adminFetch<Page>(`/admin/inquiries?${qs}`)); }
    catch (e) { setError(e instanceof Error ? e.message : 'Could not load messages.'); }
  }, [qs]);

  useEffect(() => { setData(null); load(); }, [load]);
  useEffect(() => { setPage(1); }, [q, status, sort]);
  useEffect(() => {
    const id = Number(params.get('open'));
    if (id) adminFetch<Inquiry>(`/admin/inquiries/${id}`).then(openRow).catch(() => undefined);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function openRow(i: Inquiry) { setSelected(i); setNotes(i.adminNotes ?? ''); setConfirmDelete(false); }
  const close = useCallback(() => setSelected(null), []);

  async function update(patch: Partial<Pick<Inquiry, 'status' | 'adminNotes'>>, msg: string) {
    if (!selected) return;
    setBusy(true);
    try {
      const saved = await adminFetch<Inquiry>(`/admin/inquiries/${selected.id}`, { method: 'PATCH', body: JSON.stringify(patch) });
      setSelected(saved);
      toast.show(msg);
      load();
    } catch (e) { toast.show(e instanceof Error ? e.message : 'Update failed.', true); }
    finally { setBusy(false); }
  }

  async function remove() {
    if (!selected) return;
    setBusy(true);
    try {
      await adminFetch(`/admin/inquiries/${selected.id}`, { method: 'DELETE' });
      toast.show('Message deleted.');
      setSelected(null);
      load();
    } catch (e) { toast.show(e instanceof Error ? e.message : 'Delete failed.', true); }
    finally { setBusy(false); }
  }

  async function exportCsv() {
    try { await adminDownload(`/admin/inquiries/export.csv?${qs}`, 'coastal-kitchen-messages.csv'); }
    catch (e) { toast.show(e instanceof Error ? e.message : 'Export failed.', true); }
  }

  const replyHref = selected
    ? `mailto:${selected.email}?subject=${encodeURIComponent(`Re: ${selected.subject} · Coastal Kitchen`)}&body=${encodeURIComponent(`Hi ${selected.name.split(' ')[0]},\n\nThank you for getting in touch with Coastal Kitchen.\n\n`)}`
    : '#';
  const filtered = !!(q || status !== 'all');

  return (
    <>
      <div className="adm-head">
        <div><h1 className="adm-h1">Messages</h1><p className="adm-sub">Questions and feedback from the Contact page. Reply by email, then mark them Responded. Table requests arrive under Reservations instead.</p></div>
        <button type="button" className="adm-btn ghost" onClick={exportCsv}>Export CSV</button>
      </div>

      <div className="adm-toolbar">
        <input className="input" type="search" placeholder="Search name, email, subject, reference or message…" aria-label="Search messages" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select className="input" aria-label="Status" value={status} onChange={(e) => setStatus(e.target.value as typeof status)}>
          <option value="all">All statuses</option>
          {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <select className="input" aria-label="Sort" value={sort} onChange={(e) => setSort(e.target.value as typeof sort)}>
          <option value="newest">Newest first</option><option value="oldest">Oldest first</option>
        </select>
      </div>

      {error ? <ErrorPanel message={error} onRetry={load} /> : !data ? <TableSkeleton cols={4} /> : data.items.length === 0 ? (
        <div className="adm-empty">{filtered ? 'No messages match these filters.' : 'No messages yet. They’ll appear here as soon as someone uses the contact form.'}</div>
      ) : (
        <>
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead><tr><th scope="col">Received</th><th scope="col">From</th><th scope="col">Subject</th><th scope="col">Status</th></tr></thead>
              <tbody>
                {data.items.map((i) => (
                  <tr key={i.id} className={`clickable ${selected?.id === i.id ? 'selected' : ''}`} onClick={() => openRow(i)} tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') openRow(i); }}>
                    <td style={{ whiteSpace: 'nowrap' }}>{formatReceived(i.createdAt)}<br /><span className="hint">{i.reference}</span></td>
                    <td><strong>{i.name}</strong><br /><span className="hint" style={{ wordBreak: 'break-all' }}>{i.email}</span></td>
                    <td><span style={{ display: 'block', maxWidth: 360 }}>{i.subject}</span><span className="hint">{i.message.slice(0, 80)}{i.message.length > 80 ? '…' : ''}</span></td>
                    <td><span className={`pill pill-${i.status}`}>{i.status}</span></td>
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

      {selected && (
        <Drawer
          title={selected.name}
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
              <a className="adm-btn" href={replyHref}>Reply by email</a>
            </>
          }
        >
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <span className={`pill pill-${selected.status}`}>{selected.status}</span>
            <span className="hint">{selected.reference} · {new Date(selected.createdAt).toLocaleString()}</span>
          </div>
          <dl className="adm-dl">
            <dt className="hint">Subject</dt><dd>{selected.subject}</dd>
            <dt className="hint">Email</dt><dd><a href={`mailto:${selected.email}`}>{selected.email}</a></dd>
          </dl>
          <div className="adm-card">
            <p style={{ fontWeight: 600, fontSize: 13, marginBottom: 8 }}>Message</p>
            <p style={{ fontSize: 15, lineHeight: 1.6, whiteSpace: 'pre-line' }}>{selected.message}</p>
          </div>
          <div>
            <p style={{ fontWeight: 600, fontSize: 13, marginBottom: 8 }}>Status</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }} role="group" aria-label="Set status">
              {STATUSES.map((s) => (
                <button key={s.value} type="button" className={`adm-btn sm ${selected.status === s.value ? '' : 'ghost'}`} aria-pressed={selected.status === s.value} disabled={busy || selected.status === s.value} onClick={() => update({ status: s.value }, `Marked as ${s.label.toLowerCase()}.`)}>{s.label}</button>
              ))}
            </div>
          </div>
          <div className="field">
            <label htmlFor="m-notes">Internal notes</label>
            <textarea id="m-notes" className="input" rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} />
            <div><button type="button" className="adm-btn ghost sm" disabled={busy || notes === (selected.adminNotes ?? '')} onClick={() => update({ adminNotes: notes }, 'Notes saved.')}>Save notes</button></div>
          </div>
        </Drawer>
      )}
      {toast.node}
    </>
  );
}

export default function MessagesPage() {
  return <Suspense fallback={<TableSkeleton cols={4} />}><MessagesInner /></Suspense>;
}
