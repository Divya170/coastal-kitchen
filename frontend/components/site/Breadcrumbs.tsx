import Link from 'next/link';

/** Breadcrumb on the photo heroes (light text). */
export function Breadcrumbs({ current }: { current: string }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="crumbs">
        <li><Link href="/">Home</Link></li>
        <li aria-hidden="true" style={{ color: '#E98270', display: 'flex', alignItems: 'center' }}>/</li>
        <li aria-current="page" style={{ display: 'flex', alignItems: 'center', color: '#F4C5BA' }}>{current}</li>
      </ol>
    </nav>
  );
}
