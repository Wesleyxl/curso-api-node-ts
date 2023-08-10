import { Request, Response } from "express";

import User from "../models/User";

class UserController {
  /**
   * Retrieves a list of users from the database.
   *
   * @param {Request} req - The HTTP request object.
   * @param {Response} res - The HTTP response object.
   * @return {Promise<void>} - The response with the list of users or an error message.
   */
  async index(req: Request, res: Response) {
    try {
      const users = await User.findAll({
        attributes: ["id", "name", "email"],
      });

      if (users.length <= 0) {
        return res.json([{ error: "Users not found" }]);
      }

      return res.json(users);
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
   * Store the request body in the User collection.
   *
   * @param {Request} req - the request object
   * @param {Response} res - the response object
   * @return {Promise<void>} - returns nothing
   */
  async store(req: Request, res: Response) {
    try {
      const user = await User.create(req.body);

      if (!user) {
        res.status(400).json({ errors: [{ message: "User not created" }] });
      }

      res.json(user);
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

export default new UserController();
