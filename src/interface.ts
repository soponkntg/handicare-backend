import { Interface } from "readline";
import { StringMappingType } from "typescript";

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
  restaurantID: number | null;
  restaurantName: string | null;
}

export interface CommentType {
  userId: number;
  userName: string;
  profileImageURL: string;
  message: string;
  rating: number;
  timestamp: Date;
}

export interface LocationDetail {
  locationId: number;
  locationName: string;
  category: string;
  located: string;
  contact: string;
  distance: number | null;
  rating: number;
  images: string[];
  openTime: OpenResponse[];
  ramps: Ramp[];
  toilets: Toilet[];
  doors: Door[];
  elevators: Elevator[];
  parkings: Parking[];
  restaurants: {
    restaurantId: number;
    name: string;
    logoURL: string;
  }[];
  comments: CommentType[];
}

export interface LocationRestaurantDetail extends LocationDetail {
  restaurantId: number;
  restaurantName: string;
  restaurantLocated: string;
  logoURL: string;
  floor: string;
  entrance: string;
  doorType: string;
}

export interface OpenResponse {
  day: string;
  time: string;
}

export interface Accessibility {
  id: number;
  located: string;
  remark: string;
}

export interface Ramp extends Accessibility {
  slope: string;
  level: number;
  handrail: boolean;
  floor: string;
}

export interface Toilet extends Accessibility {
  type: string;
  doorType: string;
  handrail: boolean;
  floor: string;
}

export interface Door extends Accessibility {
  doorType: string;
  passable: boolean;
  floor: string;
}

export interface Elevator extends Accessibility {
  switch: boolean;
  passable: boolean;
}

export interface Parking extends Accessibility {
  enoughSpace: boolean;
  nearEntry: boolean;
  floor: string;
}
