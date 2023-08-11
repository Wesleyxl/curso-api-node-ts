import { Router } from "express";

// Import the necessary controller and middleware
import UserController from "../app/controllers/UserController";
import AuthController from "../app/controllers/AuthController";

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
routes.post("/users", UserController.store);
routes.put("/users", Auth, UserController.update);
routes.put("/users/image", Auth, UserController.updateImage);
export default routes;
