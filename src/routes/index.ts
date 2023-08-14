import { Router } from "express";

// Import the necessary controller and middleware
import UserController from "../app/controllers/UserController";
import AuthController from "../app/controllers/AuthController";
import PublicationController from "../app/controllers/PublicationController";
import CommentController from "../app/controllers/CommentController";

//middleware
import Auth from "../app/middleware/Auth";

const routes = Router();

routes.get("/test", (req, res) => {
  return res.json({
    errors: false,
    data: "ok",
  });
});

routes.post("/auth/login", AuthController.login);
routes.post("/auth/register", AuthController.register);
routes.get("/auth/me", Auth, AuthController.me);

routes.get("/users", Auth, UserController.index);
routes.post("/users", Auth, UserController.store);
routes.put("/users", Auth, UserController.update);
routes.put("/users/image", Auth, UserController.updateImage);

routes.post("/publications", Auth, PublicationController.store);
routes.get("/publications", Auth, PublicationController.index);
routes.get("/publications/:id", Auth, PublicationController.show);
routes.put("/publications/:id", Auth, PublicationController.update);

routes.get("/comments", Auth, CommentController.index);
routes.post("/comments", Auth, CommentController.store);
routes.get("/comments/:id", Auth, CommentController.show);
routes.put("/comments/:id", Auth, CommentController.update);

export default routes;
