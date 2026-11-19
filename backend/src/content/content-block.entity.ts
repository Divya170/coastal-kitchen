import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export const CONTENT_TYPES = ['page_copy', 'hero_slide', 'experience_point', 'philosophy_item', 'prep_step', 'atmosphere_item', 'occasion', 'highlight'] as const;
export type ContentType = (typeof CONTENT_TYPES)[number];

/**
 * One polymorphic entity for every simple CMS collection (fields.imageUrl = its uploaded photo, if any).
 * - page_copy: keyed blocks of page text (key = 'home_hero', 'menu_hero', …). title may contain *emphasis*;
 *   fields.eyebrow / cta / body2 / extra / quote / alt / alt2 are optional extras some sections use.
 * - hero_slide: homepage cross-fading photos (title = photo description, fields.tint)
 * - experience_point: the four homepage "dining experience" points (fields.icon)
 * - philosophy_item: the five About "What we care about" blocks
 * - prep_step: the three About kitchen photos (title = caption, body = photo description)
 * - atmosphere_item: the four Our Experience atmosphere photos (fields.icon)
 * - occasion: the four Our Experience occasions (fields.icon, fields.cta)
 * - highlight: the three Our Experience highlights (fields.emphasis, fields.cta, fields.href)
 * fields.clientNote, when set, renders as a dashed "Client to supply" note on the site.
 */
@Entity('content_blocks')
@Index(['type', 'key'])
export class ContentBlock {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  type: ContentType;

  @Column({ type: 'varchar', nullable: true })
  key: string | null;

  @Column({ default: '' })
  title: string;

  @Column({ type: 'text', nullable: true })
  body: string | null;

  @Column({ type: 'simple-json', default: '{}' })
  fields: Record<string, string | null>;

  @Column({ type: 'integer', default: 0 })
  sortOrder: number;

  @Column({ default: true })
  published: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
