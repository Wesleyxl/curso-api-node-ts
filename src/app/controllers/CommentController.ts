import { Request, Response } from "express";
import Comment from "../models/Comment";

class CommentController {
  async store(req: Request, res: Response) {
    try {
      const comment = await Comment.create({
        user_id: req.userId,
        publication_id: req.body.publication_id,
        content: req.body.content,
      });

      if (!comment) {
        return res.status(400).json({
          errors: ["Comment not created"],
        });
      }

      return res.json(comment);
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
      const comments = await Comment.findAll();

      if (!comments) {
        return res.status(400).json({
          errors: ["Comments not found"],
        });
      }

      return res.json(comments);
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

  async show(req: Request, res: Response) {
    try {
      const comment = await Comment.findByPk(req.params.id);

      if (!comment) {
        return res.status(400).json({
          errors: ["Comment not found"],
        });
      }

      res.json(comment);
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
    try {
      const comment = await Comment.update(req.body, {
        where: {
          id: req.params.id,
        },
      });

      if (!comment) {
        return res.status(400).json({
          errors: ["Comment not updated"],
        });
      }

      res.json(comment);
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

export default new CommentController();
