import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettingsModule } from '../settings/settings.module';
import { Reservation } from './reservation.entity';
import { ReservationsAdminController, ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';

@Module({
  imports: [TypeOrmModule.forFeature([Reservation]), SettingsModule],
  controllers: [ReservationsController, ReservationsAdminController],
  providers: [ReservationsService],
})
export class ReservationsModule {}
