import { Request, Response } from "express";
import { userInfo } from "os";
import { Location } from "../models";

const getRecommendLocation = async (req: Request, res: Response) => {
  console.log('Latitude:', req.query.Latitude)
  console.log('Longitude:', req.query.Longitude)
  const locations = await Location.findAll();
  console.log(locations.every(location => location instanceof Location));
  console.log("locations", JSON.stringify(locations, null, 2))
  res.send('locations')

};
const getRecommendRestaurant = async (req: Request, res: Response) => {

}
;
const getAllLocation = async (req: Request, res: Response) => {
  const locations = await Location.findAll(
    {attributes: [
      'id', 'name','imageURL'
    ]
  });

  const response = JSON.stringify(locations, null, 2)
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
