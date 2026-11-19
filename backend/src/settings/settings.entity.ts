import { Column, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

import { DayHours } from './days';

export { DAYS, DayHours } from './days';

export interface SocialLink {
  label: string;
  url: string;
}

/** Singleton (id = 1): restaurant identity, contact details, hours and every feature flag from the design comp. */
@Entity('settings')
export class Settings {
  @PrimaryColumn({ default: 1 })
  id: number;

  @Column({ default: 'Coastal Kitchen' })
  businessName: string;

  @Column({ default: 'Seafood · Santa Rosa' })
  tagline: string;

  @Column({ default: '8945 Forest Road' })
  addressLine1: string;

  @Column({ default: 'Santa Rosa' })
  city: string;

  @Column({ default: 'CA' })
  region: string;

  @Column({ default: '95401' })
  postalCode: string;

  @Column({ default: 'USA' })
  country: string;

  @Column({ type: 'varchar', nullable: true })
  phone: string | null;

  /** The supplied number needs client confirmation; a "Verify" note shows until this is on. */
  @Column({ default: false })
  phoneVerified: boolean;

  @Column({ type: 'varchar', nullable: true })
  email: string | null;

  /** Google Maps embed for the Contact page. Seeded with an address-search embed (no invented coordinates). */
  @Column({ type: 'varchar', nullable: true })
  mapEmbedUrl: string | null;

  @Column({ default: true })
  heroAutoplay: boolean;

  @Column({ type: 'integer', default: 7 })
  heroIntervalSeconds: number;

  /** Largest party accepted through the online reservation inquiry form (the design uses 1–20). */
  @Column({ type: 'integer', default: 20 })
  maxGuests: number;

  /** Slow pan on the Our Experience hero photo (always still for reduced-motion visitors). */
  @Column({ default: true })
  experiencePan: boolean;

  @Column({ type: 'simple-json', default: '[]' })
  hours: DayHours[];

  /** Hours are shown (and open-now is computed) only once the shop confirms them. Until then the site says “Opening hours to be confirmed. Please call before visiting.”, and reservation times are not checked against them. */
  @Column({ default: false })
  hoursVerified: boolean;

  /** Official social profiles only. */
  @Column({ type: 'simple-json', default: '[]' })
  socialLinks: SocialLink[];

  @Column({ default: 'A seafood restaurant in Santa Rosa, California, serving coastal-inspired dishes in a relaxed, welcoming dining room.' })
  footerNote: string;

  @UpdateDateColumn()
  updatedAt: Date;
}
