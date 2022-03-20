export interface LocationType {
  locationID: number;
  locationtionName: string;
  placeImage: string;
  ramp: boolean;
  toilet: boolean;
  elevator: boolean;
  door: boolean;
  parking: boolean;
  distance: number | null;
}

export interface RestaurantType extends LocationType {
  locationID: number;
  locationtionName: string;
  restaurantID: number | null;
  restaurantName: string | null;
  placeImage: string;
  ramp: boolean;
  toilet: boolean;
  elevator: boolean;
  door: boolean;
  parking: boolean;
  distance: number | null;
}
