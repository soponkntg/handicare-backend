import { Sequelize, Op } from "sequelize";
import { Request, Response, NextFunction } from "express";

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
  LocationDetail,
  CommentType,
  LocationRestaurantDetail,
} from "../interface";

const getRecommendLocation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
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
  } catch (e) {
    console.log(e);
    next(e);
  }
};

const getRecommendRestaurant = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
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
  } catch (e) {
    console.log(e);
    next(e);
  }
};
const getAllLocation = async (req: Request, res: Response) => {
  const responds: LocationType[] = [];
  const { lat, lng } = req.query as unknown as {
    lat: number;
    lng: number;
  };
  const existLatLng = lat && lng ? true : false;
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
    const distance = existLatLng
      ? calculateDistance(lat, lng, data.lat, data.lng)
      : null;

    const ret: LocationType = {
      locationID: data.id,
      locationtionName: data.name,
      placeImage: data.imageURL,
      ramp: data.ramps.length > 0,
      toilet: data.toilets.length > 0,
      elevator: data.elevators.length > 0,
      door: data.doors.length > 0,
      parking: data.parkings.length > 0,
      distance: distance,
    };
    responds.push(ret);
  });

  if (existLatLng) {
    responds.sort((a, b) => {
      if (a.distance && b.distance) return a.distance - b.distance;
      else return 0;
    });
  }

  const response = JSON.stringify(responds, null, 2);
  console.log(response);
  res.send(response);
};

const postLocation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
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
        //     Open,
        //     {
        //       model: Door,
        //       attributes: { exclude: ["createdAt", "updatedAt"] },
        //     },
        //     {
        //       model: Elevator,
        //       attributes: { exclude: ["createdAt", "updatedAt"] },
        //     },
        //     {
        //       model: Parking,
        //       attributes: { exclude: ["createdAt", "updatedAt"] },
        //     },
        //     {
        //       model: Ramp,
        //       attributes: { exclude: ["createdAt", "updatedAt"] },
        //     },
        //     {
        //       model: Toilet,
        //       attributes: { exclude: ["createdAt", "updatedAt"] },
        //     },
        //     {
        //       model: LocationImage,
        //       attributes: ["imageURL"],
        //     },
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

    const ops = await Open.findAll({
      where: {
        locationId: locationId,
      },
    });
    const ds = await Door.findAll({
      where: {
        locationId: locationId,
      },
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });
    const es = await Elevator.findAll({
      where: {
        locationId: locationId,
      },
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });
    const ps = await Parking.findAll({
      where: {
        locationId: locationId,
      },
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });
    const rs = await Ramp.findAll({
      where: {
        locationId: locationId,
      },
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });
    const ts = await Toilet.findAll({
      where: {
        locationId: locationId,
      },
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });
    const lms = await LocationImage.findAll({
      where: {
        locationId: locationId,
      },
      attributes: ["imageURL"],
    });

    const location = l?.toJSON();
    const opens = ops.map((op) => op.toJSON());
    const doors = ds.map((d) => d.toJSON());
    const elevators = es.map((e) => e.toJSON());
    const parkings = ps.map((p) => p.toJSON());
    const ramps = rs.map((r) => r.toJSON());
    const toilets = ts.map((t) => t.toJSON());
    const location_images = lms.map((lm) => lm.toJSON());
    //query location comment
    const locationComments = await LocationComment.findAll({
      attributes: { exclude: ["id"] },
      where: { locationId: locationId },
      limit: 12,
      order: [Sequelize.literal("timestamp DESC")],
    });
    const comments: CommentType[] = await createCommentFormat(locationComments);

    //map respond
    const respond: LocationDetail = {
      locationId: location.id,
      locationName: location.name,
      category: location.category,
      located: location.locationDetail,
      googleMap: location.googleMap,
      contact: location.contact,
      distance:
        lat && lng
          ? calculateDistance(lat, lng, location.lat, location.lng)
          : null,
      rating: location.rateAverage,
      images: location_images.map((image: any) => {
        return image.imageURL;
      }),
      openTime: creatOpentimeFormat(opens),
      ramps: ramps,
      toilets: toilets,
      doors: doors,
      elevators: elevators,
      parkings: parkings,
      restaurants: location.restaurants,
      comments: comments,
    };

    //upadate count
    await l?.increment("count", { by: 1 });

    res.send(respond);
  } catch (e) {
    console.log(e);
    next(e);
  }
};

const postLocationRestaurant = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
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
    console.log(location);
    //query locationrestaurant comment
    const locationRestuarantComments = await LocationRestaurantComment.findAll({
      attributes: { exclude: ["id"] },
      where: { locationRestaurantId: locationRestaurant.id },
      limit: 12,
      order: [Sequelize.literal("timestamp DESC")],
    });
    const comments = await createCommentFormat(locationRestuarantComments);

    //map respond
    const respond: LocationRestaurantDetail = {
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      logoURL: restaurant.logoURL,
      floor: locationRestaurant.floor,
      contact: locationRestaurant.contact,
      locationId: location.id,
      locationName: location.name,
      category: restaurant.category,
      located: location.locationDetail,
      googleMap: location.googleMap,
      restaurantLocated: locationRestaurant.located,
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
  } catch (e) {
    console.log(e);
    next(e);
  }
};

const getSearch = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { searchQuery } = req.query as { searchQuery: string };
    // let searchRestaurants: {
    //   id: number;
    //   name: string;
    //   locations: {
    //     id: number;
    //     name: string;
    //   }[];
    // }[] = [];
    // let searchLocations: {
    //   id: number;
    //   name: string;
    // }[] = [];
    const responds: {
      locationId: number;
      locationName: string;
      restaurantId: number | null;
      restaurantName: string | null;
      imageURL: string;
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
        attributes: ["id", "name", "logoURL"],
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
        attributes: ["id", "name", "imageURL"],
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
        imageURL: searchLocationRestaurant.logoURL,
      });
    }
    for (let lr of sls) {
      const searchLocation = lr.toJSON();
      responds.push({
        locationId: searchLocation.id,
        locationName: searchLocation.name,
        restaurantId: null,
        restaurantName: null,
        imageURL: searchLocation.imageURL,
      });
    }
    res.send(responds);
  } catch (e) {
    console.log(e);
    next(e);
  }
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
      ...locationRestaurantComment,
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

const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
) => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1); // deg2rad below
  const dLon = deg2rad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
};

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

export default {
  getRecommendLocation,
  getRecommendRestaurant,
  getAllLocation,
  postLocation,
  postLocationRestaurant,
  getSearch,
};
