import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../model/user.schema";

const protect = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      try {
        token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(
          token,
          `${process.env.JWT_SECRET}`
        ) as JwtPayload;
        const { id } = decoded;
        //If token is undefined or no user with the id
        const user = await User.findByPk(id);
        if (!user) throw new Error("Not Authorized");
        //If token is valid and user exists
        //Attach user to request object
        //@ts-ignore
        req["user"] = user;
      } catch (error) {
        res.status(401);
        throw new Error("Not Authorized");
      }
    }
    if (!token) {
      res.status(401);
      throw new Error("Login or Sign up to continue");
    }
    next();
  }
);

export default protect;
