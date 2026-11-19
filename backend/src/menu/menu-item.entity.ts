import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { MenuCategory, Tint } from './menu-category.entity';

/** Dietary markers. Shown beside a dish only when the kitchen has confirmed them. */
export const DIETARY = ['GF', 'V', 'VG', 'DF'] as const;
/** Optional label, set only when Coastal Kitchen confirms it (the brief: "only when confirmed"). */
export const BADGES = ['popular', 'chef', 'seasonal', 'new'] as const;

/**
 * A dish. Price is nullable on purpose: until Coastal Kitchen supplies it the site says "Price to be supplied".
 * Nothing about availability is stored or implied; the menu is informational and dishes are not ordered online.
 */
@Entity('menu_items')
export class MenuItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ type: 'integer' })
  categoryId: number;

  @ManyToOne(() => MenuCategory, (c) => c.items, { onDelete: 'RESTRICT' })
  category: MenuCategory;

  @Column()
  name: string;

  @Column({ type: 'text', default: '' })
  description: string;

  /** Price in cents (e.g. 2850 = $28.50). Null = not supplied yet. */
  @Column({ type: 'integer', nullable: true })
  priceCents: number | null;

  /** Used instead of a number when the restaurant supplies one, e.g. "Market price". */
  @Column({ type: 'varchar', nullable: true })
  priceNote: string | null;

  @Column({ type: 'simple-json', default: '[]' })
  dietary: string[];

  @Column({ type: 'varchar', nullable: true })
  badge: string | null;

  @Column({ type: 'varchar', nullable: true })
  imageUrl: string | null;

  @Column({ default: '' })
  imageAlt: string;

  @Column({ type: 'varchar', nullable: true })
  tint: Tint | null;

  /** Shown in the homepage "From our kitchen" section (the first one is the large feature). */
  @Column({ default: false })
  featured: boolean;

  /** Shown as an image-led card at the top of its Menu page section. */
  @Column({ default: false })
  highlight: boolean;

  /** Seeded design samples carry a visible "Sample" tag until replaced with real dishes. */
  @Column({ default: false })
  isSample: boolean;

  @Column({ type: 'integer', default: 0 })
  sortOrder: number;

  @Column({ default: true })
  published: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
