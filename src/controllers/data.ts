import { Sequelize } from "sequelize";
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
import sequelize from "../database";

const getRecommendLocation = async (req: Request, res: Response) => {
  console.log("Latitude:", req.query.lat);
  console.log("Longitude:", req.query.lng);
  //calculate distance

  //query top5 location
  const locations = await Location.findAll();
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
  const locations = await Location.findAll({
    attributes: ["id", "name", "imageURL"],
    include: [Ramp, Elevator, Parking, Toilet, Door],
    order: ["name"],
  });

  const response = JSON.stringify(locations, null, 2);
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
