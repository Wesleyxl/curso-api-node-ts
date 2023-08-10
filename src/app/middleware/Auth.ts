import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import jwtConfig from "../../config/jwt";
import User from "../models/User";

declare module "express" {
  interface Request {
    userEmail?: string;
  }
}

export default async (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({
      errors: ["Token not found"],
    });
  }

  const [, token] = authorization.split(" ");

  try {
    const data = jwt.verify(
      token,
      process.env.JWT_SECRET || jwtConfig.jwt_secret
    ) as JwtPayload; // Type cast 'data' to JwtPayload

    const { email } = data;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({
        errors: ["Token is invalid"],
      });
    }

    req.userEmail = email;

    return next();
  } catch (e: any) {
    if (e.errors && Array.isArray(e.errors)) {
      return res.status(400).json({
        errors: e.errors.map((err: { message: string }) => err.message),
      });
    }

    return res.status(500).json({
      errors: ["An unexpected error occurred"],
    });
  }
};
