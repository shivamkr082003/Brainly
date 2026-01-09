import jwt, { Secret } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

declare global {
  namespace Express {
    export interface Request {
      userId: string;
      username: string;
    }
  }
}

export const userMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers["authorization"];

    if (token) {
      const decodedId = jwt.verify(
        token as string,
        process.env.JWT_SECRET as Secret
      ) as jwt.JwtPayload;

      req.userId = decodedId.id;
      req.username = decodedId.username;
      next();
    } else {
      res.status(401).json({
        message: "Please SignIn first to add your Brain",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Something went Wrong",
      error
    });
  }
};
