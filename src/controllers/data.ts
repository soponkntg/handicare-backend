import { Sequelize, Op } from "sequelize";
import { Request, Response } from "express";
import {
  Location,
  Open,
  Ramp,
  Toilet,
  Elevator,
  Parking,
  Door,
  LocationImage,
  Restaurant,
  LocationRestaurant,
  LocationComment,
  User,
  LocationRestaurantComment,
} from "../models";
import {
  LocationType,
  RestaurantType,
  LocationDeatail,
  CommentType,
  LocationRestaurantDeatail,
} from "../interface";
import sequelize from "../database";

const getRecommendLocation = async (req: Request, res: Response) => {
  const responds: LocationType[] = [];
  const { lat, lng } = req.query as unknown as { lat: number; lng: number };
  let distance = null;

  //query top5 location
  const locations = await Location.findAll({
    attributes: ["id", "name", "count", "imageURL", "lat", "lng"],
    where: {
      category: {
        [Op.not]: "restaurant",
      },
    },
    limit: 5,
    include: [Ramp, Elevator, Parking, Toilet, Door],
    order: [Sequelize.literal("count DESC")],
  });
  for (let location of locations) {
    const l = location.toJSON();
    if (lat && lng) {
      distance = calculateDistance(lat, lng, l.lat, l.lng);
    }
    responds.push({
      locationID: l.id,
      locationtionName: l.name,
      placeImage: l.imageURL,
      ramp: l.ramps.length > 0,
      toilet: l.toilets.length > 0,
      elevator: l.elevators.length > 0,
      door: l.doors.length > 0,
      parking: l.parkings.length > 0,
      distance: distance,
    });
  }
  res.send(responds);
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
        restaurantID: null,
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
  let responds: LocationType[] = [];

  const { lat, lng } = req.query as unknown as {
    lat: number;
    lng: number;
  };

  console.log(lat && lng);
  let locations;
  if (lat && lng) {
    locations = await Location.findAll({
      attributes: [
        "id",
        "name",
        "imageURL",
        "lat",
        "lng",
        [
          Sequelize.literal(
            `sqrt(power(lat-${lat}, 2) + power(lng-${lng}, 2))`
          ),
          "distance",
        ],
      ],
      where: {
        category: {
          [Op.not]: "restaurant",
        },
      },
      include: [Ramp, Elevator, Parking, Toilet, Door],
      order: [Sequelize.literal("distance"), "name"],
    });
  } else {
    locations = await Location.findAll({
      attributes: ["id", "name", "imageURL", "lat", "lng"],
      where: {
        category: {
          [Op.not]: "restaurant",
        },
      },
      include: [Ramp, Elevator, Parking, Toilet, Door],
      order: ["name"],
    });
  }

  locations.forEach((location) => {
    const data = location.toJSON();

    const ret: LocationType = {
      locationID: data.id,
      locationtionName: data.name,
      placeImage: data.imageURL,
      ramp: data.ramps.length > 0,
      toilet: data.toilets.length > 0,
      elevator: data.elevators.length > 0,
      door: data.doors.length > 0,
      parking: data.parkings.length > 0,
      distance: data.distance ? data.distance : null,
    };
    console.log(ret);
    responds.push(ret);
  });

  const response = JSON.stringify(responds, null, 2);
  res.send(response);
};

const postLocation = async (req: Request, res: Response) => {
  const { lat, lng, locationId } = req.body as {
    lat: number;
    lng: number;
    locationId: number;
  };

  //query location detail
  const l = await Location.findOne({
    where: {
      id: locationId,
    },
    include: [
      Open,
      {
        model: Door,
        attributes: { exclude: ["createdAt", "updatedAt"] },
      },
      {
        model: Elevator,
        attributes: { exclude: ["createdAt", "updatedAt"] },
      },
      {
        model: Parking,
        attributes: { exclude: ["createdAt", "updatedAt"] },
      },
      {
        model: Ramp,
        attributes: { exclude: ["createdAt", "updatedAt"] },
      },
      {
        model: Toilet,
        attributes: { exclude: ["createdAt", "updatedAt"] },
      },
      LocationImage,
      {
        model: Restaurant,
        attributes: [["id", "restaurantId"], "name", "logoURL"],
        through: {
          attributes: [],
        },
        order: ["name"],
      },
    ],
  });
  const location = l?.toJSON();

  //query location comment
  const locationComments = await LocationComment.findAll({
    where: { locationId: locationId },
    limit: 12,
    order: [Sequelize.literal("timestamp DESC")],
  });
  const comments: CommentType[] = await createCommentFormat(locationComments);

  //map respond
  const respond: LocationDeatail = {
    locationId: location.id,
    locationName: location.name,
    category: location.category,
    located: location.locationDetail,
    lat: location.lat,
    lng: location.lng,
    distance:
      lat && lng
        ? calculateDistance(lat, lng, location.lat, location.lng)
        : null,
    rating: location.rateAverage,
    images: location.location_images.map((image: any) => {
      return image.imageURL;
    }),
    openTime: creatOpentimeFormat(location.opens),
    ramps: location.ramps,
    toilets: location.toilets,
    doors: location.doors,
    elevators: location.elevators,
    parkings: location.parkings,
    restaurants: location.restaurants,
    comments: comments,
  };

  //upadate count
  await l?.increment("count", { by: 1 });

  res.send(respond);
};

const postLocationRestaurant = async (req: Request, res: Response) => {
  const { lat, lng, locationId, restaurantId } = req.body as {
    lat: number;
    lng: number;
    locationId: number;
    restaurantId: number;
  };

  //query locationrestaurant detail
  const r = await Restaurant.findOne({
    where: {
      id: restaurantId,
    },
    include: [
      {
        model: Location,
        where: { id: locationId },
        include: [
          Open,
          {
            model: Door,
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
          {
            model: Elevator,
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
          {
            model: Parking,
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
          {
            model: Ramp,
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
          {
            model: Toilet,
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
        ],
      },
    ],
  });
  const restaurant = r?.toJSON();
  const location = restaurant.locations[0];
  const locationRestaurant = location.location_restaurant;

  //query locationrestaurant comment
  const locationRestuarantComments = await LocationRestaurantComment.findAll({
    where: { locationRestaurantId: locationRestaurant.id },
    limit: 12,
    order: [Sequelize.literal("timestamp DESC")],
  });
  const comments = await createCommentFormat(locationRestuarantComments);

  //map respond
  const respond: LocationRestaurantDeatail = {
    restaurantId: restaurant.id,
    restaurantName: restaurant.name,
    logoURL: restaurant.logoURL,
    floor: locationRestaurant.floor,
    locationId: location.id,
    locationName: location.name,
    category: restaurant.category,
    located: locationRestaurant.located,
    lat: location.lat,
    lng: location.lng,
    distance:
      lat && lng
        ? calculateDistance(lat, lng, location.lat, location.lng)
        : null,
    rating: locationRestaurant.rateAverage,
    images: locationRestaurant.imagesURL.split("\\"),
    entrance: locationRestaurant.level,
    doorType: locationRestaurant.doorType,
    openTime: creatOpentimeFormat(location.opens),
    ramps: location.ramps,
    toilets: location.toilets,
    doors: location.doors,
    elevators: location.elevators,
    parkings: location.parkings,
    restaurants: [],
    comments: comments,
  };

  //update count
  await LocationRestaurant.increment("count", {
    by: 1,
    where: { restaurantId: restaurant.id, locationId: location.id },
  });

  res.send(respond);
};

const getMoreComment = async (req: Request, res: Response) => {};

const getSearch = async (req: Request, res: Response) => {
  const { searchQuery } = req.query as { searchQuery: string };
  let searchRestaurants: {
    id: number;
    name: string;
    locations: {
      id: number;
      name: string;
    }[];
  }[] = [];
  let searchLocations: {
    id: number;
    name: string;
  }[] = [];
  const responds: {
    locationId: number;
    locationName: string;
    restaurantId: number | null;
    restaurantName: string | null;
  }[] = [];

  let srs = await Restaurant.findAll({
    attributes: ["id", "name"],
    where: {
      [Op.or]: [
        { name: { [Op.substring]: `${searchQuery}` } },
        { category: { [Op.substring]: `${searchQuery}` } },
      ],
    },
    include: [
      {
        model: Location,
        attributes: ["id", "name"],
        through: {
          attributes: [],
        },
      },
    ],
  });
  let sls = await Location.findAll({
    attributes: ["id", "name"],
    where: {
      [Op.or]: [
        { name: { [Op.substring]: `${searchQuery}` } },
        { category: { [Op.substring]: `${searchQuery}` } },
        { locationDetail: { [Op.substring]: `${searchQuery}` } },
      ],
    },
  });
  if (srs.length === 0 && sls.length === 0) {
    const searchQueries = searchQuery.split(" ");
    srs = await Restaurant.findAll({
      attributes: ["id", "name"],
      where: {
        [Op.or]: createSearchOption(["name", "category"], searchQueries),
      },
      include: [
        {
          model: Location,
          attributes: ["id", "name"],
          through: {
            attributes: [],
          },
        },
      ],
    });

    sls = await Location.findAll({
      attributes: ["id", "name"],
      where: {
        [Op.or]: createSearchOption(
          ["name", "category", "locationDetail"],
          searchQueries
        ),
      },
    });
  }
  for (let sr of srs) {
    const searchLocationRestaurant = sr.toJSON();
    responds.push({
      locationId: searchLocationRestaurant.locations[0].id,
      locationName: searchLocationRestaurant.locations[0].name,
      restaurantId: searchLocationRestaurant.id,
      restaurantName: searchLocationRestaurant.name,
    });
  }
  for (let lr of sls) {
    const searchLocation = lr.toJSON();
    responds.push({
      locationId: searchLocation.id,
      locationName: searchLocation.name,
      restaurantId: null,
      restaurantName: null,
    });
  }
  res.send(responds);
};

const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
) => {
  return Math.sqrt(Math.pow(lat1 - lat2, 2) + Math.pow(lng1 - lng2, 2));
};

const creatOpentimeFormat = (opens: any) => {
  return opens.map((open: any) => {
    if (open.open) {
      const openTime = open.openTime.split(":");
      const closeTime = open.closeTime.split(":");
      return {
        day: open.day,
        time: `${openTime[0]}:${openTime[1]}-${closeTime[0]}:${closeTime[1]}`,
      };
    } else {
      return {
        day: open.day,
        time: "Close",
      };
    }
  });
};

const createCommentFormat = async (cs: any) => {
  const comments: CommentType[] = [];
  for (let c of cs) {
    const locationRestaurantComment = c.toJSON();
    const u = await User.findOne({
      where: { id: locationRestaurantComment.userId },
      attributes: ["id", "username", "profileImageURL"],
    });
    const user = u?.toJSON();
    comments.push({
      userId: user.id,
      userName: user.userName,
      profileImageURL: user.profileImageURL,
      message: locationRestaurantComment.message,
      timestamp: locationRestaurantComment.timestamp,
    });
  }
  return comments;
};

const createSearchOption = (columns: string[], searchQueries: string[]) => {
  const queries: any = [];
  for (let column of columns) {
    for (let searchQuery of searchQueries) {
      queries.push({
        [column]: { [Op.substring]: `${searchQuery}` },
      });
    }
  }
  return queries;
};

export default {
  getRecommendLocation,
  getRecommendRestaurant,
  getAllLocation,
  postLocation,
  postLocationRestaurant,
  getMoreComment,
  getSearch,
};
