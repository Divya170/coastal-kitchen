import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { MenuItem } from './menu-item.entity';

/** Placeholder tints, matching the design's photo panels (plain = the default sea-blue panel). */
export const TINTS = ['plain', 'deep', 'sand', 'coral', 'glass', 'char'] as const;
export type Tint = (typeof TINTS)[number];

/** How the section is laid out on the Menu page (the design varies it so sections don't repeat). */
export const LAYOUTS = ['left', 'right', 'two', 'plain'] as const;
export type Layout = (typeof LAYOUTS)[number];

@Entity('menu_categories')
export class MenuCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  /** Anchor on the Menu page (/menu#<slug>); fixed after creation so shared links keep working. */
  @Column({ unique: true })
  slug: string;

  /** One line on the homepage "Six ways to begin" list. */
  @Column({ type: 'text', default: '' })
  blurb: string;

  /** Intro line beside the section heading on the Menu page. */
  @Column({ type: 'text', default: '' })
  intro: string;

  @Column({ type: 'varchar', default: 'left' })
  layout: Layout;

  /** Homepage category preview photo. */
  @Column({ type: 'varchar', nullable: true })
  imageUrl: string | null;

  @Column({ default: '' })
  imageAlt: string;

  @Column({ type: 'varchar', default: 'plain' })
  tint: Tint;

  @Column({ type: 'integer', default: 0 })
  sortOrder: number;

  @Column({ default: true })
  published: boolean;

  @OneToMany(() => MenuItem, (i) => i.category)
  items: MenuItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
