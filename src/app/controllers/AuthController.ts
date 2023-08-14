import { Request, Response } from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";
import jwtConfig from "../../config/jwt";

class AuthController {
  /**
   * Asynchronously handles the login request.
   *
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   * @return {Promise<void>} Returns a promise that resolves to void.
   */
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
        { email: user.email, id: user.id },
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

  /**
   * Registers a user with the provided information.
   *
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   * @return {Promise<void>} The response containing the user information or an error message.
   */
  async register(req: Request, res: Response) {
    try {
      const { name = "", email = "", password = "" } = req.body;

      if (!name || !email || !password) {
        return res.status(401).json({
          errors: ["Name, email and password are required"],
        });
      }

      const user = await User.create({
        name,
        email,
        password,
        image: "",
        url: "",
      });

      if (!user) {
        return res.status(400).json({
          errors: ["User not created"],
        });
      }

      return res.json(user);
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

  async me(req: Request, res: Response) {
    try {
      const user = await User.findOne({
        where: { email: req.userEmail },
        attributes: {
          exclude: ["password_hash", "createdAt", "updatedAt", "image"],
        },
      });

      if (!user) {
        return res.status(400).json({
          errors: ["User not found"],
        });
      }

      return res.json(user);
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
