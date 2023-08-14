import { Request, Response } from "express";
import multer, { MulterError } from "multer";

import Publication from "../models/Publication";
import User from "../models/User";
import Comment from "../models/Comment";

import { multerConfigPost } from "../../config/multer";
const upload = multer(multerConfigPost).single("file");

class PublicationController {
  async store(req: Request, res: Response) {
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

        const publication = await Publication.create({
          user_id: req.userId,
          title: req.body.title,
          content: req.body.content,
          image: filename,
        });

        if (!publication) {
          res.status(400).json({
            errors: ["Publication not created"],
          });
        }
        res.json(publication);
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

  async index(req: Request, res: Response) {
    try {
      const publications = await Publication.findAll({
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "url", "name", "image"],
          },
          {
            model: Comment,
            as: "comments",
            include: [
              {
                model: User,
                as: "user",
                attributes: ["id", "url", "name", "image"],
              },
            ],
          },
        ],
      });

      if (publications.length <= 0) {
        return res.status(400).json([{ error: "Publications not found" }]);
      }

      res.json(publications);
    } catch (e: any) {
      if (e.errors && Array.isArray(e.errors)) {
        const errorResponse = e.errors.map(
          (err: { message: string; path: string }) => ({
            title: err.path,
            message: err.message,
          })
        );

        return res.status(400).json({
          errors: errorResponse,
        });
      }

      return res.status(500).json({
        errors: ["An unexpected error occurred"],
      });
    }
  }

  async update(req: Request, res: Response) {
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

        // Create an empty object to hold the attributes for update
        const updateAttributes: any = {
          title: req.body.title,
          content: req.body.content,
        };

        // Include the 'image' field only if 'filename' is defined
        if (filename) {
          updateAttributes.image = filename;
        }

        const publication = await Publication.update(updateAttributes, {
          where: {
            id: req.params.id,
          },
        });

        if (!publication) {
          return res.status(400).json({
            errors: ["Publication not updated"],
          });
        }

        res.json(publication);
      } catch (e: any) {
        if (e.errors && Array.isArray(e.errors)) {
          const errorResponse = e.errors.map(
            (err: { message: string; path: string }) => ({
              title: err.path,
              message: err.message,
            })
          );

          return res.status(400).json({
            errors: errorResponse,
          });
        }

        return res.status(500).json({
          errors: ["An unexpected error occurred"],
        });
      }
    });
  }

  async show(req: Request, res: Response) {
    try {
      const publication = await Publication.findByPk(req.params.id);

      if (!publication) {
        return res.status(400).json({
          errors: ["Publication not found"],
        });
      }

      res.json(publication);
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

export default new PublicationController();
