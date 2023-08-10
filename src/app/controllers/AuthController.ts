import { Request, Response } from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";
import jwtConfig from "../../config/jwt";

class AuthController {
  async login(req: Request, res: Response) {
    try {
      const { email = "", password = "" } = req.body;

      if (!email || !password) {
        return res.status(401).json({
          errors: ["Email and password are required"],
        });
      }

      const user = await User.findOne({
        where: {
          email,
        },
      });

      if (!user) {
        return res.status(400).json({
          errors: ["Invalid email or password"],
        });
      }

      if (!(await user.passwordIsValid(password))) {
        return res.status(401).json({
          errors: ["Invalid email or password"],
        });
      }

      const token = jwt.sign(
        { email },
        process.env.JWT_SECRET || jwtConfig.jwt_secret,
        {
          expiresIn: process.env.JWT_EXPIRE_IN || jwtConfig.jwt_expire_in,
        }
      );

      res.json({ access_token: token });
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
  }
}

export default new AuthController();
