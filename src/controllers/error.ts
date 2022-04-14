import { Request, Response, NextFunction } from "express";
import StatusCodes from "http-status-codes";
const { BAD_REQUEST } = StatusCodes;

const errorController = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("ERROR");
  return res.status(BAD_REQUEST).json({
    error: err.message,
  });
};
export default errorController;
