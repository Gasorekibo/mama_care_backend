import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HealthcareFacility } from 'src/dist/healthcare_facilities.entity/healthcare_facilities.entity';
import { TransportMode } from 'src/enums/transportMeans.enum';
import { NearbyHospitalSearchDto } from './dto/nearByHospital.dto';

const TRAVEL_SPEEDS = {
  [TransportMode.WALKING]: 5,
  [TransportMode.BICYCLE]: 15,
  [TransportMode.CAR]: 50,
};

@Injectable()
export class NearbyHospitalService {
  constructor(
    @InjectRepository(HealthcareFacility)
    private healthFacilityRepository: Repository<HealthcareFacility>,
  ) {}

  private calculateTravelTimes(distanceKm: number): {
    [key in TransportMode]: {
      time: number;
      timeUnit: string;
    };
  } {
    const travelTimes = {} as {
      [key in TransportMode]: {
        time: number;
        timeUnit: string;
      };
    };
    (Object.keys(TRAVEL_SPEEDS) as TransportMode[]).forEach((mode) => {
      const speed = TRAVEL_SPEEDS[mode];
      const timeHours = distanceKm / speed;

      let formattedTime: number;
      let timeUnit: string;
      if (timeHours < 1) {
        formattedTime = Math.round(timeHours * 60);
        timeUnit = 'minutes';
      } else {
        formattedTime = Number(timeHours.toFixed(1));
        timeUnit = 'hours';
      }

      travelTimes[mode] = {
        time: formattedTime,
        timeUnit,
      };
    });

    return travelTimes;
  }

  async findNearbyHospitals(searchParams: NearbyHospitalSearchDto) {
    try {
      const { latitude, longitude, maxDistance } = searchParams;
      const currentTime = new Date().toTimeString().slice(0, 5);

      let query = this.healthFacilityRepository
        .createQueryBuilder('facility')
        .leftJoinAndSelect('facility.location', 'location')
        .leftJoinAndSelect('facility.emergencyAlerts', 'emergencyAlerts');
      if (latitude && longitude && maxDistance) {
        const maxDistanceInMeters = maxDistance * 1000;
        query = query
          .select([
            'facility',
            'location',
            'emergencyAlerts',
            `(6371 * acos(
              cos(radians(${latitude})) * 
              cos(radians(location.latitude)) * 
              cos(radians(location.longitude) - radians(${longitude})) + 
              sin(radians(${latitude})) * 
              sin(radians(location.latitude))
            )) AS distance`,
            `CASE 
              WHEN 
                TIME '${currentTime}' BETWEEN facility.openingTime AND facility.closingTime 
              THEN true 
              ELSE false 
            END AS is_open`,
          ])
          .where(
            `(6371 * acos(
              cos(radians(${latitude})) * 
              cos(radians(location.latitude)) * 
              cos(radians(location.longitude) - radians(${longitude})) + 
              sin(radians(${latitude})) * 
              sin(radians(location.latitude))
            )) <= :maxDistance`,
            { maxDistance: maxDistanceInMeters },
          )
          .orderBy('is_open', 'DESC')
          .addOrderBy('distance', 'ASC');
      } else {
        query = query.select([
          'facility',
          'location',
          'emergencyAlerts',
          `CASE 
              WHEN 
                TIME '${currentTime}' BETWEEN facility.openingTime AND facility.closingTime 
              THEN true 
              ELSE false 
            END AS is_open`,
        ]);
        if (latitude && longitude) {
          query = query
            .addSelect(
              `(6371 * acos(
              cos(radians(${latitude})) * 
              cos(radians(location.latitude)) * 
              cos(radians(location.longitude) - radians(${longitude})) + 
              sin(radians(${latitude})) * 
              sin(radians(location.latitude))
            )) AS distance`,
            )
            .orderBy('is_open', 'DESC')
            .addOrderBy('distance', 'ASC');
        }
      }
      const nearbyHospitalsQuery = await query.getMany();

      const hospitalsWithDetails = nearbyHospitalsQuery.map((hospital) => {
        let distance: number | undefined;
        if (latitude && longitude) {
          distance =
            6371 *
            Math.acos(
              Math.cos(this.degToRad(latitude)) *
                Math.cos(this.degToRad(hospital.location.latitude)) *
                Math.cos(
                  this.degToRad(hospital.location.longitude) -
                    this.degToRad(longitude),
                ) +
                Math.sin(this.degToRad(latitude)) *
                  Math.sin(this.degToRad(hospital.location.latitude)),
            );
        }

        return {
          ...hospital,
          distance: distance ? Number(distance.toFixed(2)) : null,
          travelTimes: distance ? this.calculateTravelTimes(distance) : null,
          isCurrentlyOpen: this.isHospitalCurrentlyOpen(
            hospital.openingTime,
            hospital.closingTime,
          ),
        };
      });

      return {
        total: hospitalsWithDetails.length,
        hospitals: hospitalsWithDetails,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Nearby hospitals search failed: ${error.message}`,
      );
    }
  }

  private isHospitalCurrentlyOpen(
    openingTime: string,
    closingTime: string,
  ): boolean {
    const now = new Date();
    const current = now.getHours() * 60 + now.getMinutes();

    const [openHours, openMinutes] = openingTime.split(':').map(Number);
    const [closeHours, closeMinutes] = closingTime.split(':').map(Number);

    const openTime = openHours * 60 + openMinutes;
    const closeTime = closeHours * 60 + closeMinutes;

    return current >= openTime && current <= closeTime;
  }

  private degToRad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}
