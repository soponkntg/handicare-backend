import { Request, Response } from "express";
import { Sequelize } from "sequelize";
import { LocationComment, Location, User } from "../models";
import { CommentType } from "../interface";
import { AnyFunction } from "sequelize/types/utils";

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
    const comments = await LocationComment.findAll({
      where: { locationId: locationId },
    });

    let ratings = 0;
    let count = 0;

    comments.forEach((c) => {
      const data = c.toJSON();
      if (data.rating) {
        ratings += parseInt(data.rating);
        count += 1;
      }
    });

    if (count == 0) {
      await location.update({ rateAverage: 0 });
    } else {
      await location.update({
        rateAverage: ratings / count,
      });
    }
  }

  res.send("success");
};

const postRestaurantComment = async (req: Request, res: Response) => {};

const getAllComment = async (req: Request, res: Response) => {
  const { locationId } = req.query as unknown as { locationId: number };
  if (!locationId) {
    res.send("invalid input: location id");
  }

  const ret: CommentType[] = [];
  const comments = await LocationComment.findAll({
    where: { locationId: locationId },
    order: [Sequelize.literal("timestamp DESC")],
  });
  comments.forEach((c) => {
    getCommentData(c.toJSON(), ret)
  });
  res.send(JSON.stringify(ret, null, 2));
};

const getMoreComment = async (req: Request, res: Response) => {
  const { locationId, offset } = req.query as unknown as { locationId: number, offset: number};
  if (!locationId) {
    res.send("invalid input: location id");
  }
  if (!offset) {
      res.send("invalid input: offset")
  }

  const ret: CommentType[] = [];
//   const comments = await Comment.findAll({
//     where: { locationId: locationId },
//     order: [Sequelize.literal("timestamp DESC")],
//     offset: offset,
//     limit: 12,
//   });

//   comments.forEach( c => getCommentData(c.toJSON(), ret));
  res.send(JSON.stringify(ret, null, 2));
};

const getMoreLocationComment = async (req: Request, res: Response) => {
  res.send("success");
};

const getMoreRestaurantComment = async (req: Request, res: Response) => {
  res.send("success");
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
  console.log(req.body);
  res.send("success");
};

export default {
  postLocationComment,
  postRestaurantComment,
  getAllComment,
  createUser,
  getMoreLocationComment,
  getMoreRestaurantComment,
};
