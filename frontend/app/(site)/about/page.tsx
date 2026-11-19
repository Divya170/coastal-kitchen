import type { Metadata } from 'next';
import Link from 'next/link';
import { ClientNote } from '@/components/site/ClientNote';
import { Em } from '@/components/site/Em';
import { Icon } from '@/components/site/Icons';
import { PageHero } from '@/components/site/PageHero';
import { Photo } from '@/components/site/Photo';
import { copy, getContent, getPageCopy, getSettings } from '@/lib/api';
import type { ContentBlock } from '@/lib/types';

export const metadata: Metadata = { title: 'About', description: 'The story behind Coastal Kitchen, a seafood restaurant on Forest Road in Santa Rosa, California.' };

/** The design's five-block bento, cycled by position: wide with photo, coral, photo-top, sea-glass, photo-top. */
function Bento({ p, i }: { p: ContentBlock; i: number }) {
  const v = i % 5;
  const num = <p className="bt-num">{String(i + 1).padStart(2, '0')}</p>;
  const copyBlock = <div className="bt-copy">{num}<h3 className="h3">{p.title}</h3>{p.body && <p className="bt-body">{p.body}</p>}</div>;
  const photo = (style: React.CSSProperties) => <Photo src={p.fields.imageUrl} alt={p.fields.alt || p.title} label={p.fields.alt || p.title} tint={v === 0 ? 'char' : v === 2 ? 'glass' : 'deep'} style={style} />;
  if (v === 0) return <article className="bt bt-1">{copyBlock}{photo({ minHeight: 240 })}</article>;
  if (v === 1 || v === 3) return (
    <article className={`bt bt-${v + 1}`}>{copyBlock}<div style={{ marginTop: 'auto', padding: '0 clamp(22px, 2.6vw, 34px) 28px', color: '#0F3340' }}><Icon name={p.fields.icon || 'wave'} size={44} sw={1.2} /></div></article>
  );
  return <article className={`bt bt-${v + 1}`}>{photo({ aspectRatio: '16 / 9' })}{copyBlock}</article>;
}

export default async function AboutPage() {
  const [pc, principles, prep, settings] = await Promise.all([getPageCopy(), getContent('philosophy_item'), getContent('prep_step'), getSettings()]);
  const hero = copy(pc, 'about_hero');
  const story = copy(pc, 'about_story');
  const phil = copy(pc, 'about_philosophy');
  const kitchen = copy(pc, 'about_prep');
  const cta = copy(pc, 'about_cta');
  const prepRatios = ['5 / 6', '3 / 4.4', '4 / 4.2'];

  return (
    <main id="main">
      <PageHero crumb="About" image={hero.imageUrl} alt={hero.alt} tint="deep" minHeight="clamp(600px, 58vw, 840px)" padBottom="clamp(56px, 7vw, 100px)">
        <h1 id="page-h" className="disp reveal" style={{ marginTop: 'clamp(32px, 6vw, 90px)', fontSize: 'clamp(54px, 7.6vw, 128px)', maxWidth: '13ch' }}><Em text={hero.title} /></h1>
      </PageHero>

      <section aria-labelledby="story-h" className="section">
        <div className="wrap story">
          <div className="story-photo">
            <Photo src={story.imageUrl} alt={story.alt} tint="sand" style={{ aspectRatio: '4 / 5', borderRadius: 8 }} />
            <p className="hint" style={{ marginTop: 14, fontSize: 13 }}>{settings.addressLine1}, {settings.city}, California</p>
          </div>
          <div className="story-text">
            {story.eyebrow && <p className="eyebrow">{story.eyebrow}</p>}
            <h2 id="story-h" className="h2" style={{ fontSize: 'clamp(38px, 4vw, 62px)' }}><Em text={story.title} /></h2>
            <span className="wave-rule" style={{ margin: '28px 0 30px' }} />
            {story.body && <p className="lead drop prose-copy">{story.body}</p>}
            {story.fields.body2 && <p className="lead prose-copy">{story.fields.body2}</p>}
            {story.fields.extra && <p className="lead prose-copy">{story.fields.extra}</p>}
            {story.fields.quote && (
              <blockquote className="pull"><p>“{story.fields.quote}”</p>{story.fields.quoteNote && <p className="label" style={{ marginTop: 12, fontStyle: 'normal', fontFamily: 'var(--sans)', fontSize: 11.5 }}>{story.fields.quoteNote}</p>}</blockquote>
            )}
            <ClientNote note={story.clientNote} style={{ marginTop: 30 }} />
          </div>
        </div>
      </section>

      {principles.length > 0 && (
        <section aria-labelledby="phil-h" className="section sand tide">
          <div className="wrap">
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: 28 }}>
              <div>{phil.eyebrow && <p className="eyebrow">{phil.eyebrow}</p>}<h2 id="phil-h" className="h2"><Em text={phil.title} /></h2></div>
              <ClientNote note={phil.clientNote} tag="Client to confirm" style={{ maxWidth: 440 }} />
            </div>
            <div className="bento">{principles.map((p, i) => <Bento key={p.id} p={p} i={i} />)}</div>
          </div>
        </section>
      )}

      {prep.length > 0 && (
        <section aria-labelledby="prep-h" className="section on-abyss">
          <div className="wrap">
            <div className="g12" style={{ alignItems: 'end', marginBottom: 'clamp(40px, 5vw, 64px)' }}>
              <div style={{ gridColumn: 'span 6' }}>{kitchen.eyebrow && <p className="eyebrow">{kitchen.eyebrow}</p>}<h2 id="prep-h" className="h2" style={{ color: '#FAF9F5' }}><Em text={kitchen.title} onDark /></h2></div>
              {kitchen.body && <p className="lead" style={{ gridColumn: '8 / span 5' }}>{kitchen.body}</p>}
            </div>
            <div className="prep">
              {prep.slice(0, 3).map((s, i) => (
                <figure key={s.id}>
                  <Photo src={s.fields.imageUrl} alt={s.body || s.title} label={s.body || s.title} tint={s.fields.tint} style={{ aspectRatio: prepRatios[i], borderRadius: 8 }} />
                  <figcaption><span>{String(i + 1).padStart(2, '0')}</span>{s.title}</figcaption>
                </figure>
              ))}
            </div>
            <ClientNote note={kitchen.clientNote} style={{ marginTop: 36 }} />
          </div>
        </section>
      )}

      <section aria-labelledby="cta-h" className="section">
        <div className="wrap split">
          <div>{cta.eyebrow && <p className="eyebrow">{cta.eyebrow}</p>}<h2 id="cta-h" className="h2"><Em text={cta.title} /></h2></div>
          <div>
            {cta.body && <p className="lead">{cta.body}</p>}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 28 }}>
              <Link className="btn" href="/experience">Discover Our Experience <span className="arr" aria-hidden="true">→</span></Link>
              <Link className="btn btn-coral" href="/reservations">Reserve Your Table</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
