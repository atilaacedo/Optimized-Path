import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { GeocodingService } from "./geocoding.service";

@Injectable()
export class TripsService {
    constructor(private prisma: PrismaService,
        private geocodingService: GeocodingService
    ){}

    async createTrip(name: string, cityNames: string[]){
        const stopsData = await Promise.all(
            cityNames.map(async (name) => {
                const coords = await this.geocodingService.getCoordinates(name);
                return {
                    cityName: name,
                    latitude: coords.lat,
                    longitude: coords.lng,
                    serviceDuration: 30
                }
            })
        );

        return this.prisma.trip.create({
            data: {
                name,
                departureDate: new Date(),
                stops: {create: stopsData},
                origin: "Salvador"
            },
            include: {stops: true}
        })
    }

    async runOptimization(tripId: string) {
        const trip = await this.prisma.trip.findUnique({
        where: { id: tripId },
        include: { stops: true },
        });

        // Chamada para o microserviço em RUST
        // const response = await fetch('http://localhost:3001/optimize', {
        // method: 'POST',
        // headers: { 'Content-Type': 'application/json' },
        // body: JSON.stringify({
        //     tripId: trip.id,
        //     stops: trip.stops.map(s => ({ id: s.id, lat: s.latitude, lng: s.longitude }))
        // }),
        // });

        // const data = await response.json();
        // const orderedIds: string[] = data.orderedIds;

        // // Atualização em lote (Transaction) no Prisma
        // await this.prisma.$transaction(
        // orderedIds.map((id, index) =>
        //     this.prisma.stop.update({
        //     where: { id },
        //     data: { orderIndex: index },
        //     }),
        // ),
        // );

        // return this.prisma.trip.findUnique({
        // where: { id: tripId },
        // include: { stops: { orderBy: { orderIndex: 'asc' } } },
        // });
    }
}