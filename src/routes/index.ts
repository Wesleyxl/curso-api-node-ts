import { Router } from "express";

// Import the necessary controller and middleware
import UserController from "../app/controllers/UserController";
import AuthMiddleware from "../app/middleware/Auth"; // Import the middleware
import AuthController from "../app/controllers/AuthController";

const routes = Router();

routes.get("/test", (req, res) => {
  return res.json({
    errors: false,
    data: "ok",
  });
});

// Use the AuthMiddleware function as middleware for authentication
routes.post("/auth/login", AuthController.login);

routes.get("/users", AuthMiddleware, UserController.index);
routes.post("/users", UserController.store);

export default routes;
