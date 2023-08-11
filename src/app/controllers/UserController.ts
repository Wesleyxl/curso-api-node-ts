import { Request, Response, NextFunction } from "express";
import multer, { MulterError } from "multer";
import multerConfig from "../../config/multer";

import User from "../models/User";

const upload = multer(multerConfig).single("file");

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

  /**
   * Updates a user based on the provided request data.
   *
   * @param {Request} req - The request object containing the data to update the user.
   * @param {Response} res - The response object to send back the updated user or error message.
   * @return {Promise<void>} - A promise that resolves when the user is successfully updated or rejects with an error.
   */
  async update(req: Request, res: Response) {
    try {
      const user = await User.update(req.body, {
        where: {
          email: req.userEmail,
        },
      });

      if (!user) {
        return res.status(400).json({
          errors: [{ message: "User not updated" }],
        });
      }

      return res.json({ message: "User updated" });
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
   * Update an image.
   *
   * @param {Request} req - the request object
   * @param {Response} res - the response object
   * @param {NextFunction} next - the next function
   * @return {Promise<void>} - a promise that resolves to void
   */
  async updateImage(req: Request, res: Response, next: NextFunction) {
    upload(req, res, async (error: any) => {
      try {
        if (error) {
          if (error instanceof MulterError) {
            return res.status(400).json({
              errors: [error.message],
            });
          } else {
            return res.status(500).json({
              errors: ["An unexpected error occurred"],
            });
          }
        }

        // Access the filename through the metadata property
        const filename = req.file?.filename;

        if (!filename) {
          return res.status(400).json({
            errors: ["Filename not available"],
          });
        }

        const user = await User.update(
          { image: filename },
          { where: { email: req.userEmail } }
        );

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
    });
  }
}

export default new UserController();
