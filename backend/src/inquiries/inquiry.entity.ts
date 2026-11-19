import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export const INQUIRY_STATUSES = ['new', 'responded', 'archived'] as const;
export type InquiryStatus = (typeof INQUIRY_STATUSES)[number];

/** A message from the Contact page form (Name, Email, Subject, Message). Reservation requests live in `reservations`. */
@Entity('inquiries')
export class Inquiry {
  @PrimaryGeneratedColumn()
  id: number;

  /** Internal reference (CM-yymmdd-XXXX). */
  @Index({ unique: true })
  @Column()
  reference: string;

  @Column()
  name: string;

  @Index()
  @Column()
  email: string;

  @Column()
  subject: string;

  @Column({ type: 'text' })
  message: string;

  @Index()
  @Column({ type: 'varchar', default: 'new' })
  status: InquiryStatus;

  @Column({ type: 'text', nullable: true })
  adminNotes: string | null;

  /** SHA-256 of the content, used to refuse an identical resubmission within 10 minutes. */
  @Index()
  @Column({ type: 'varchar', default: '' })
  fingerprint: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
