import { Sequelize, Op } from "sequelize";
import { Request, Response } from "express";
import {
  Door,
  Elevator,
  Location,
  LocationRestaurant,
  Parking,
  Ramp,
  Restaurant,
  Toilet,
} from "../models";
import { LocationType, RestaurantType } from "../interface";

const getRecommendLocation = async (req: Request, res: Response) => {
  const responds: LocationType[] = [];
  console.log("Latitude:", req.query.lat);
  console.log("Longitude:", req.query.lng);

  //query top5 location
  const locations = await Location.findAll();
  console.log(locations.map((location) => location.toJSON()));
  console.log(locations.every((location) => location instanceof Location));
  console.log("locations", JSON.stringify(locations, null, 2));
  res.send("locations");
};
const getRecommendRestaurant = async (req: Request, res: Response) => {
  const responds: RestaurantType[] = [];
  const { lat, lng } = req.query as unknown as { lat: number; lng: number };
  let distance = null;

  //query top5 locationRestaurants
  const lr_5 = await LocationRestaurant.findAll({
    attributes: ["locationId", "restaurantId", "count"],
    limit: 5,
    order: [Sequelize.literal("count DESC")],
  });

  //query top5 restaurants
  const l_5 = await Location.findAll({
    attributes: ["id", "name", "count", "imageURL", "lat", "lng"],
    where: { category: "restaurant" },
    limit: 5,
    include: [Ramp, Elevator, Parking, Toilet, Door],
    order: [Sequelize.literal("count DESC")],
  });

  //mearge respond then select only top5
  const tempSort = [...lr_5, ...l_5]
    .sort((a: any, b: any) => {
      return b.count - a.count;
    })
    .slice(0, 5);
  for (let temp of tempSort) {
    const r = temp.toJSON();
    if (!r.id) {
      //restaurant in location
      const locationResult = await Location.findOne({
        where: { id: r.locationId },
        attributes: ["name", "lat", "lng"],
        include: [Ramp, Elevator, Parking, Toilet, Door],
      });
      const restaurantResult = await Restaurant.findOne({
        where: { id: r.restaurantId },
        attributes: ["name", "logoURL"],
      });
      const location = locationResult?.toJSON();
      const restaurant = restaurantResult?.toJSON();

      if (lat && lng) {
        distance = calculateDistance(lat, lng, location.lat, location.lng);
      }

      responds.push({
        locationID: r.locationId,
        locationtionName: location.name,
        restaurantID: r.restaurantId,
        restaurantName: restaurant.name,
        placeImage: restaurant.logoURL,
        ramp: location.ramps.length > 0,
        toilet: location.toilets.length > 0,
        elevator: location.elevators.length > 0,
        door: location.doors.length > 0,
        parking: location.parkings.length > 0,
        distance: distance,
      });
    } else {
      //independent restaurant
      if (lat && lng) {
        distance = calculateDistance(lat, lng, r.lat, r.lng);
      }
      responds.push({
        locationID: r.id,
        locationtionName: r.name,
        restaurantID: r.null,
        restaurantName: null,
        placeImage: r.imageURL,
        ramp: r.ramps.length > 0,
        toilet: r.toilets.length > 0,
        elevator: r.elevators.length > 0,
        door: r.doors.length > 0,
        parking: r.parkings.length > 0,
        distance: distance,
      });
    }
  }
  res.send(responds);
};
const getAllLocation = async (req: Request, res: Response) => {

  let responds: {
    locationID: string;
    locationtionName: string;
    placeImage: string;
    ramp: boolean;
    toilet: boolean;
    lift: boolean;
    door: boolean;
    parking: boolean;
    distance: number;
  }[] = [];

  const { lat, lng } = req.query as unknown as {
    lat: number;
    lng: number;
  };
  const locations = await Location.findAll({
    attributes: ["id", "name", "imageURL", "lat", "lng"],
    where: {
      category: {
        [Op.not]: "restaurant",
      },
    },
    include: [Ramp, Elevator, Parking, Toilet, Door],
    order: ["name"],
  });

  locations.forEach((location) => {
    const data = location.toJSON();
    const distance = calculateDistance(lat, data.Lat, lng, data.Lng);

    const ret: {
      locationID: string;
      locationtionName: string;
      placeImage: string;
      ramp: boolean;
      toilet: boolean;
      lift: boolean;
      door: boolean;
      parking: boolean;
      distance: number;
    } = {
      locationID: data.id,
      locationtionName: data.name,
      placeImage: data.imageURL,
      ramp: data.ramps.length > 0,
      toilet: data.toilets.length > 0,
      lift: data.elevators.length > 0,
      door: data.doors.length > 0,
      parking: data.parkings.length > 0,
      distance: distance,
    };
    responds.push(ret);
  });

  if (lat && lng) {
    responds.sort((a,b) => {
      return a.distance - b.distance;
    });
  }
  
  const response = JSON.stringify(responds, null, 2);
    console.log(response);
    res.send(response);
};

const postPlace = async (req: Request, res: Response) => {};

const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
) => {
  return Math.sqrt((lat1 - lat2) ** 2 + (lng1 - lng2) ** 2);
};

export default {
  getRecommendLocation,
  getRecommendRestaurant,
  getAllLocation,
  postPlace,
};
