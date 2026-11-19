import { Allow, IsIn, IsOptional, IsString, MaxLength } from 'class-validator';
import { RESERVATION_STATUSES, ReservationStatus } from '../reservation.entity';

/** Presence only — the rules live in reservation-rules.ts so messages match the site exactly. */
export class CreateReservationDto {
  @Allow() guests?: string | number;
  @Allow() date?: string;
  @Allow() time?: string;
  @Allow() name?: string;
  @Allow() email?: string;
  @Allow() phone?: string;
  @Allow() requests?: string | null;
  /** Honeypot. */
  @Allow() website?: string;
}

export class UpdateReservationDto {
  @IsOptional() @IsIn(RESERVATION_STATUSES as unknown as string[], { message: 'Choose New, Confirmed, Declined or Archived.' }) status?: ReservationStatus;
  @IsOptional() @IsString() @MaxLength(4000) adminNotes?: string | null;
}

export class ListReservationsQuery {
  @IsOptional() @IsString() search?: string;
  @IsOptional() @IsIn([...RESERVATION_STATUSES, 'all']) status?: ReservationStatus | 'all';
  /** upcoming = preferred date today or later; past = before today. */
  @IsOptional() @IsIn(['all', 'upcoming', 'past', 'today']) when?: 'all' | 'upcoming' | 'past' | 'today';
  @IsOptional() @IsString() from?: string;
  @IsOptional() @IsString() to?: string;
  @IsOptional() @IsString() page?: string;
  @IsOptional() @IsString() pageSize?: string;
  @IsOptional() @IsIn(['newest', 'oldest', 'date']) sort?: 'newest' | 'oldest' | 'date';
}
