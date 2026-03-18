import { HttpException, Injectable } from '@nestjs/common';

@Injectable()
export class GeocodingService {
    async getCoordinates(city: string) {
        try{
            const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city + ', Bahia, Brazil')}`;
        
            const response = await fetch(url, {
                headers: {
                'User-Agent': 'BahiaRouteOptimizer/1.0',
                },
            });

            const data = await response.json();

            if(data && data.length > 0) {
                return {
                    lat: parseFloat(data[0].lat),
                    lng: parseFloat(data[0].lon),
                }
            }

            throw new Error('No coordinates found for the specified city');
        }catch(error){
            throw new HttpException('Error occurred while fetching coordinates', 404);
        }
    }
}