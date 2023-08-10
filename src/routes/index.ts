import { Router } from "express";

const routes = Router();

routes.get("/test", (req, res) => {
  return res.json({
    errors: false,
    data: "ok",
  });
});

export default routes;
