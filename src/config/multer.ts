import { Request } from "express";
import { extname, resolve } from "path";
import multer, { FileFilterCallback, MulterError } from "multer";

const randomNumber = () => Math.floor(Math.random() * 10000 + 10000);

interface MulterConfig {
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    callback: FileFilterCallback
  ) => void;
  storage: multer.StorageEngine;
}

const multerConfigUser: MulterConfig = {
  fileFilter: (req, file, callback) => {
    if (
      file.mimetype !== "image/png" &&
      file.mimetype !== "image/jpeg" &&
      file.mimetype !== "image/jpg"
    ) {
      const error = new MulterError("LIMIT_UNEXPECTED_FILE");
      error.message = "File must be an image";
      callback(error);
    } else {
      callback(null, true);
    }
  },

  storage: multer.diskStorage({
    destination: (req, file, callback) => {
      callback(
        null,
        resolve(__dirname, "..", "..", "uploads", "images", "users")
      );
    },
    filename: (req, file, callback) => {
      callback(
        null,
        `${Date.now()}_${randomNumber()}${extname(file.originalname)}`
      );
    },
  }),
};

const multerConfigPost: MulterConfig = {
  fileFilter: (req, file, callback) => {
    if (
      file.mimetype !== "image/png" &&
      file.mimetype !== "image/jpeg" &&
      file.mimetype !== "image/jpg"
    ) {
      const error = new MulterError("LIMIT_UNEXPECTED_FILE");
      error.message = "File must be an image";
      callback(error);
    } else {
      callback(null, true);
    }
  },

  storage: multer.diskStorage({
    destination: (req, file, callback) => {
      callback(
        null,
        resolve(__dirname, "..", "..", "uploads", "images", "publications")
      );
    },
    filename: (req, file, callback) => {
      callback(
        null,
        `${Date.now()}_${randomNumber()}${extname(file.originalname)}`
      );
    },
  }),
};

export { multerConfigUser, multerConfigPost };
