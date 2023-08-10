import { Router } from "express";

// Import the necessary controller and middleware
import UserController from "../app/controllers/UserController";
import AuthController from "../app/controllers/AuthController";

//middleware
import AuthMiddleware from "../app/middleware/Auth";

const routes = Router();

routes.get("/test", (req, res) => {
  return res.json({
    errors: false,
    data: "ok",
  });
});

routes.post("/auth/login", AuthController.login);
routes.post("/auth/register", AuthController.register);
routes.get("/auth/me", AuthMiddleware, AuthController.me);

routes.get("/users", AuthMiddleware, UserController.index);
routes.post("/users", UserController.store);

export default routes;
