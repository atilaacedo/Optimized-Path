import { Module } from '@nestjs/common';
import { TripsController } from './trips.controller';
import { TripsService } from './trips.service';
import { GeocodingService } from './geocoding.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [TripsController],
  providers: [
    TripsService, 
    GeocodingService, 
    PrismaService 
  ],
})
export class TripsModule {}