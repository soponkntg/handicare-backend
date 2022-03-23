import { Request, Response } from "express";
import { Sequelize } from "sequelize";
import {
  LocationComment,
  Location,
  User,
  LocationRestaurant,
  RestaurantComment,
} from "../models";
import { CommentType } from "../interface";

const postLocationComment = async (req: Request, res: Response) => {
  const { userId, locationId, message, rating } = req.body as unknown as {
    userId: string;
    locationId: string;
    message: string;
    rating: number;
  };
  const timestamp = new Date();
  if (!userId || !locationId || !message) {
    return res.send("unsuccessful: invalid input");
  }

  const user = await User.findOne({ where: { id: userId } });
  if (user == null) return res.send("invalid user id");

  const location = await Location.findOne({ where: { id: locationId } });
  if (location == null) return res.send("invalid location id");

  const inp = {
    userId: userId,
    locationId: locationId,
    message: message,
    timestamp: timestamp,
    rating: rating,
  };

  const cmt = await LocationComment.create(inp);
  console.log(cmt.toJSON());

  if (rating) {
    const rateAverage = await LocationComment.findOne({
        attributes: [[Sequelize.fn('avg', Sequelize.col('rating')), 'rateAverage']],
        where: { locationId: locationId },
        raw: true,
      });

    if (rateAverage) {
      await location.update(rateAverage);
    }
  }

  res.send("success");
};

const postRestaurantComment = async (req: Request, res: Response) => {
  const { userId, locationId, restaurantId, message, rating } =
    req.body as unknown as {
      userId: string;
      locationId: string;
      restaurantId: string;
      message: string;
      rating: number;
    };
  const timestamp = new Date();
  if (!userId || !restaurantId || !message || !locationId) {
    return res.send("unsuccessful: invalid input");
  }

  console.log(userId, locationId, restaurantId, message, rating);

  const user = await User.findOne({ where: { id: userId } });
  if (user == null) return res.send("invalid user id");

  const locationRestaurant = await LocationRestaurant.findOne({
    where: { restaurantId: restaurantId, locationId: locationId },
  });
  if (locationRestaurant == null) return res.send("invalid location restaurant");

  const id = locationRestaurant.toJSON().id
  const inp = {
    userId: userId,
    locationRestaurantId: id,
    message: message,
    timestamp: timestamp,
    rating: rating,
  };

  const cmt = await RestaurantComment.create(inp);
  console.log(cmt.toJSON());

  if (rating) {

    const rateAverage = await RestaurantComment.findOne({
      attributes: [[Sequelize.fn('avg', Sequelize.col('rating')), 'rateAverage']],
      where: { locationRestaurantId: id },
      raw: true,
    });

    if (rateAverage) {
      await locationRestaurant.update(rateAverage);
    }
  }

  res.send("success");
};

const getMoreLocationComment = async (req: Request, res: Response) => {
  const { locationId, offset } = req.query as unknown as {
    locationId: number;
    offset: number;
  };
  if (!locationId) {
    res.send("invalid input: location id");
  }
  if (!offset) {
    res.send("invalid input: offset");
  }

  const ret: CommentType[] = [];
  const comments = await LocationComment.findAll({
    where: { locationId: locationId },
    order: [Sequelize.literal("timestamp DESC")],
    offset: offset,
    limit: 12,
  });

  comments.forEach((c) => getCommentData(c.toJSON(), ret));
  res.send(JSON.stringify(ret, null, 2));
};

const getMoreRestaurantComment = async (req: Request, res: Response) => {
  const { restaurantId, locationId, offset } = req.query as unknown as {
    restaurantId: number;
    locationId: number;
    offset: number;
  };
  if (!locationId) {
    res.send("invalid input: location id");
  }
  if (!restaurantId) {
    res.send("invalid ipnut: restaurant id")
  }
  if (!offset) {
    res.send("invalid input: offset");
  }

  const ret: CommentType[] = [];

  const comments = await RestaurantComment.findAll({
    where: { locationId: locationId, restaurantId: restaurantId },
    order: [Sequelize.literal("timestamp DESC")],
    offset: offset,
    limit: 12,
  });

  comments.forEach((c) => getCommentData(c.toJSON(), ret));
  res.send(JSON.stringify(ret, null, 2));
};

const getCommentData = async (data: any, ret: CommentType[]) => {
  const user = await User.findOne({ where: { userId: data.userId } });

  let usr = { username: "", profileImageUrl: "" };
  if (user) {
    usr = user.toJSON();
  }

  const temp: CommentType = {
    userId: data.userId,
    userName: usr.username,
    profileImageURL: usr.profileImageUrl,
    message: data.message,
    timestamp: data.timestamp,
  };
  ret.push(temp);
};

const createUser = async (req: Request, res: Response) => {
  const { id, username, profileImageURL, email } = req.body as unknown as {
    id: string;
    username: string;
    profileImageURL: string;
    email: string;
  };
  if (!id || !username || !profileImageURL || !email) {
    return res.send("invalid input")
  }
  console.log(id, username, profileImageURL, email)
  await User.create({
    id: id,
    username: username,
    profileImageURL: profileImageURL,
    email: email,
  });
  res.send("success");
};

export default {
  postLocationComment,
  postRestaurantComment,
  getMoreLocationComment,
  getMoreRestaurantComment,
  createUser,
};
