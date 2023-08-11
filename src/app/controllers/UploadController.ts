import { Request, Response, NextFunction } from "express";
import multer, { FileFilterCallback, MulterError } from "multer";
import multerConfig from "../../config/multer";
import User from "../models/User";

const upload = multer(multerConfig).single("file");

class UploadController {
  async store(req: Request, res: Response, next: NextFunction) {
    upload(req, res, async (error: any) => {
      try {
        if (error) {
          if (error instanceof MulterError) {
            return res.status(400).json({
              errors: [error.code],
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

export default new UploadController();
