import { Request, Response } from "express";
import Publication from "../models/Publication";
import User from "../models/User";
import Comment from "../models/Comment";

class PublicationController {
  async store(req: Request, res: Response) {
    try {
      const publication = await Publication.create({
        user_id: req.userId,
        title: req.body.title,
        content: req.body.content,
      });
      if (!publication) {
        res.status(400).json({
          errors: ["Publication not created"],
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
  }

  async index(req: Request, res: Response) {
    try {
      const publications = await Publication.findAll({
        include: [
          { model: User, as: "user", attributes: ["id", "url", "name"] },
          { model: Comment, as: "comments" },
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
}

export default new PublicationController();
