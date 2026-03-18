import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TripsModule } from './trips/trips.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    TripsModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
