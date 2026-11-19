/**
 * Checks that the browser-side form rules (frontend/lib/validation.ts) and the API rules
 * (backend/src/reservations/reservation-rules.ts, backend/src/inquiries/inquiry-rules.ts)
 * return the same errors for 50,000 generated inputs. Run: npm run test:rules
 */
import * as F from '../frontend/lib/validation';
import { validateReservation as BR } from '../backend/src/reservations/reservation-rules';
import { validateInquiry as BI } from '../backend/src/inquiries/inquiry-rules';

let seed = 42; const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2 ** 31) / 2 ** 31);
const pick = <T,>(a: T[]) => a[Math.floor(rnd() * a.length)];
const long = (n: number) => 'x'.repeat(n);
const today = '2026-11-19';
const G = ['', ' ', '0', '1', '2', ' 4 ', '20', '21', '50', '2.5', 'abc', '-1', '1e1', '12'];
const D = ['', '2026-11-18', '2026-11-19', '2026-11-20', ' 2026-12-01 ', '2026-13-01', '2026-02-31', '2027-01-01', '11/20/2026', '2026-1-1'];
const T = ['', '19:30', '19:30:00', '24:00', '23:59', '7:30', '00:00', ' 18:00 ', 'ab:cd', '12:60'];
const N = ['', 'A', 'Al', ' A ', 'Ana Lima', long(120), long(121), '  ' + long(119) + '  '];
const E = ['', 'a@b', 'a@b.c', 'a@b.co', 'name@example.com', ' x@y.org ', 'no spaces@x.com', 'a@@b.com', long(150) + '@example.com', 'x@' + long(3) + '.io'];
const P = ['', '   ', '123', '707 555 0101', '+1 (707) 555-0101', long(0) + '1'.repeat(15), '1'.repeat(16), '(856) 382-1942', 'abc'];
const R = ['', 'Window table please', long(600), long(601), ' ' + long(600) + ' '];
const S = ['', 'Q', 'Hi', 'Private dining', long(140), long(141)];
const M = ['', 'short', 'Ten chars!', long(1500), long(1501), '  ' + long(9) + '  '];

const same = (a: Record<string, string | undefined>, b: Record<string, string>) => {
  const ka = Object.keys(a).filter((k) => a[k]).sort(), kb = Object.keys(b).sort();
  return JSON.stringify(ka.map((k) => [k, a[k]])) === JSON.stringify(kb.map((k) => [k, b[k]]));
};

let n = 0, bad = 0;
for (let i = 0; i < 20000; i++) {
  const f = { guests: pick(G), date: pick(D), time: pick(T), name: pick(N), email: pick(E), phone: pick(P), requests: pick(R), website: '' };
  for (const maxGuests of [20, 50]) {
    n++;
    const a = F.validateReservation(f, { today, maxGuests }), b = BR(f, { today, maxGuests }).errors;
    if (!same(a, b)) { if (bad++ < 5) console.log('RES MISMATCH', JSON.stringify(f).slice(0, 200), a, b); }
  }
}
for (let i = 0; i < 10000; i++) {
  const f = { name: pick(N), email: pick(E), subject: pick(S), message: pick(M), website: '' };
  n++;
  const a = F.validateContact(f), b = BI(f).errors;
  if (!same(a, b)) { if (bad++ < 10) console.log('CONTACT MISMATCH', JSON.stringify(f).slice(0, 200), a, b); }
}
console.log(`${n} cases compared, ${bad} mismatches`);
process.exit(bad ? 1 : 0);
