import { Body, Controller, Delete, Get, Header, Ip, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { CreateReservationDto, ListReservationsQuery, UpdateReservationDto } from './dto/reservation.dto';
import { ReservationsService } from './reservations.service';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservations: ReservationsService) {}

  /** Creates a reservation INQUIRY (201 → "received, awaiting confirmation"). It never books a table by itself. */
  @Post()
  create(@Body() dto: CreateReservationDto, @Ip() ip: string) {
    return this.reservations.create(dto, ip);
  }
}

@Controller('admin/reservations')
@UseGuards(JwtAuthGuard)
export class ReservationsAdminController {
  constructor(private readonly reservations: ReservationsService) {}

  @Get() list(@Query() q: ListReservationsQuery) { return this.reservations.list(q); }
  @Get('stats') stats() { return this.reservations.stats(); }

  @Get('export.csv')
  @Header('Content-Type', 'text/csv; charset=utf-8')
  @Header('Content-Disposition', 'attachment; filename="coastal-kitchen-reservations.csv"')
  export(@Query() q: ListReservationsQuery) { return this.reservations.exportCsv(q); }

  @Get(':id') get(@Param('id', ParseIntPipe) id: number) { return this.reservations.findOne(id); }
  @Patch(':id') update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateReservationDto) { return this.reservations.update(id, dto); }
  @Delete(':id') remove(@Param('id', ParseIntPipe) id: number) { return this.reservations.remove(id); }
}
