import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

const errorHandlerMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //Set message and status code
  let message = err.message;
  let statusCode = res.statusCode || 500;
  if (statusCode === 200) statusCode = 400;

  if (err instanceof ZodError) {
    message = err.flatten();
  }

  res.status(statusCode).json({ message });
};

export default errorHandlerMiddleware;
