import { Sequelize } from "sequelize";
import { query, Request, Response } from "express";
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
import sequelize from "../database";

const getRecommendLocation = async (req: Request, res: Response) => {
  console.log("Latitude:", req.query.lat);
  console.log("Longitude:", req.query.lng);
  //calculate distance

  //query top5 location
  const locations = await Location.findAll();
  console.log(locations.map((location) => location.toJSON()));
  console.log(locations.every((location) => location instanceof Location));
  console.log("locations", JSON.stringify(locations, null, 2));
  res.send("locations");
};
const getRecommendRestaurant = async (req: Request, res: Response) => {
  const responds: {
    locationID: string;
    locationtionName: string;
    restaurantID: string | null;
    restaurantName: string | null;
    placeImage: string;
    ramp: boolean;
    toilet: boolean;
    elevator: boolean;
    door: boolean;
    parking: boolean;
    distance: number;
  }[] = [];
  const { lat, lng } = req.query as unknown as { lat: number; lng: number };
  //calculate distance

  //query top5 locationRestaurant or restaurant

  //query top5 locationRestaurabt
  const lr_5 = await LocationRestaurant.findAll({
    attributes: ["locationId", "restaurantId", "count"],
    limit: 5,
    order: [Sequelize.literal("count DESC")],
  });
  console.log(lr_5);

  const l_5 = await Location.findAll({
    attributes: ["id", "name", "count", "imageURL"],
    where: { category: "restaurant" },
    limit: 5,
    include: [Ramp, Elevator, Parking, Toilet, Door],
    order: [Sequelize.literal("count DESC")],
  });
  console.log(l_5);
  res.send(lr_5);
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

  console.log(req.query.lat)

  const { lat, lng } = req.query as unknown as { lat: number; lng: number }
  console.log(lat, lng)


  const locations = await Location.findAll({
    attributes: ["id", "name", "imageURL", "Lat", "Lng"],
    include: [Ramp, Elevator, Parking, Toilet, Door],
    order: ["name"],
  });

  locations.forEach((location) => {
    const data = location.toJSON();
    console.log(data)
    const distance = Math.sqrt(Math.pow(data.Lat - lat, 2) + Math.pow(data.Lng - lng,2));
    console.log(lat, lng, data.Lat, data.Lng, distance);

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

  responds.sort((a,b) => {
    return a.distance - b.distance;
  });
  
  const response = JSON.stringify(responds, null, 2);
    console.log(response);
    res.send(response);
};

const postPlace = async (req: Request, res: Response) => {};
export default {
  getRecommendLocation,
  getRecommendRestaurant,
  getAllLocation,
  postPlace,
};
