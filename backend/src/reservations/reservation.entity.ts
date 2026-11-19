import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

/**
 * new = received, awaiting the team · confirmed = the team confirmed it with the guest (by phone/email)
 * declined = couldn't be accommodated · archived = done / no longer relevant.
 * The website never shows a request as confirmed: guests are told it is awaiting confirmation.
 */
export const RESERVATION_STATUSES = ['new', 'confirmed', 'declined', 'archived'] as const;
export type ReservationStatus = (typeof RESERVATION_STATUSES)[number];

@Entity('reservations')
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  /** Internal reference (CK-yymmdd-XXXX). */
  @Index({ unique: true })
  @Column()
  reference: string;

  @Column({ type: 'integer' })
  guests: number;

  /** Preferred date, YYYY-MM-DD (restaurant's local calendar). */
  @Index()
  @Column()
  date: string;

  /** Preferred time, HH:MM 24-hour. */
  @Column()
  time: string;

  @Column()
  name: string;

  @Index()
  @Column()
  email: string;

  @Column()
  phone: string;

  @Column({ type: 'text', nullable: true })
  requests: string | null;

  @Index()
  @Column({ type: 'varchar', default: 'new' })
  status: ReservationStatus;

  @Column({ type: 'text', nullable: true })
  adminNotes: string | null;

  @Index()
  @Column({ type: 'varchar', default: '' })
  fingerprint: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
