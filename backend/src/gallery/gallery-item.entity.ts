import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export const GALLERY_CATEGORIES = ['Seafood & Dishes', 'Restaurant Interiors', 'Food Preparation', 'Dining Moments'] as const;
export { TINTS } from '../menu/menu-category.entity';
export type GalleryCategory = (typeof GALLERY_CATEGORIES)[number];

@Entity('gallery_items')
export class GalleryItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'varchar' })
  category: GalleryCategory;

  /** Null = not yet photographed; the site shows a clearly labelled placeholder panel. */
  @Column({ type: 'varchar', nullable: true })
  imageUrl: string | null;

  @Column({ default: '' })
  alt: string;

  /** Masonry tile size on desktop. */
  @Column({ type: 'integer', default: 2 })
  rows: number;

  @Column({ type: 'integer', default: 1 })
  cols: number;

  /** Placeholder panel tint while no photo exists. */
  @Column({ type: 'varchar', default: 'plain' })
  tint: string;

  /** Shown in the homepage gallery collage (first five by order). */
  @Column({ default: false })
  featuredOnHome: boolean;

  @Column({ type: 'integer', default: 0 })
  sortOrder: number;

  @Column({ default: true })
  published: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
