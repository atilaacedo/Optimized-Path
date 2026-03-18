import { Body, Controller, Param, Post } from "@nestjs/common";
import { TripsService } from "./trips.service";

@Controller('trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Post()
  async create(@Body() body: { name: string; cities: string[] }) {
    return this.tripsService.createTrip(body.name, body.cities);
  }

  @Post(':id/optimize')
  async optimize(@Param('id') id: string) {
    return this.tripsService.runOptimization(id);
  }
}